import amqp from "amqplib";
import { APIError, MSGQError, STATUS_CODES } from "./app-errors";
import { Logger, RpcErrorHandler, ErrorLogger } from "./error-handler";
import { EventEmitter } from "node:events";
import { v4 } from "uuid";
import { APP_SECRET } from "../config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class MSGQ {
  private static MSG_QUEUE_URL: string;
  private static EXCHANGE_NAME: string;
  private static serviceName: string;
  public static channel: amqp.Channel;
  private static replayTo: amqp.Replies.AssertQueue;
  private static callbackEvent: EventEmitter;

  constructor() {}

  //*********************************************************************** */

  async init(MSG_QUEUE_URL: string, EXCHANGE_NAME: string, serviceName: string) {
    try {
      MSGQ.MSG_QUEUE_URL = MSG_QUEUE_URL;
      MSGQ.EXCHANGE_NAME = EXCHANGE_NAME;
      MSGQ.serviceName = serviceName;
      //*********************************************************************** */
      const connection = await amqp.connect(MSGQ.MSG_QUEUE_URL);
      MSGQ.channel = await connection.createChannel();
      await MSGQ.channel.assertExchange(EXCHANGE_NAME, "direct", { durable: false });
      //*********************************************************************** */
      MSGQ.replayTo = await MSGQ.channel.assertQueue("", { exclusive: true });
      MSGQ.callbackEvent = new EventEmitter();
      MSGQ.channel.consume(MSGQ.replayTo.queue, (msg) => {
        if (msg) {
          MSGQ.callbackEvent.emit(msg.properties.correlationId, msg);
          MSGQ.channel.ack(msg);
        }
      });
    } catch (e: any) {
      const errorloger = new ErrorLogger();
      errorloger.logError(new MSGQError("Internal MSGQ init Server Error", e));
      process.exit(1);
    }
  }
  //*********************************************************************** */
  async createListener(routingKey: string) {
    try {
      const listenerCallbackEvent = new EventEmitter();
      const tempQ = await MSGQ.channel.assertQueue(`${MSGQ.serviceName}:LISTENER:${routingKey}`, { durable: false });
      await MSGQ.channel.bindQueue(tempQ.queue, MSGQ.EXCHANGE_NAME, routingKey);
      MSGQ.channel.consume(tempQ.queue, async (msg) => {
        if (msg?.content) {
          MSGQ.channel.ack(msg);
          if (listenerCallbackEvent.listenerCount(msg.properties.correlationId) > 0) {
            Logger.info(`#Rpc -> Received new message ${msg.content.toString()}`);
            // await cb(msg.content.toString());
            listenerCallbackEvent.emit(msg.properties.correlationId, msg);
          }
        }
      });
      return listenerCallbackEvent;
    } catch (e: any) {
      throw new MSGQError("MSGQ Subscribe Error", e.message);
    }
  }

  async emit(message: string, routingKey: string, prodcastChannelKey: string) {
    try {
      MSGQ.channel.publish(MSGQ.EXCHANGE_NAME, prodcastChannelKey, Buffer.from(message), { correlationId: routingKey });
      Logger.info(`#Rpc -> emit ${message} to ${prodcastChannelKey}`);
    } catch (e: any) {
      throw new MSGQError("MSGQ emit Error", e.message);
    }
  }
  //*********************************************************************** */

  // async on(routingKey: string, cb: (msg: string) => Promise<void>) {
  //   try {
  //     const tempQ = await MSGQ.channel.assertQueue(MSGQ.serviceName, { durable: false });
  //     Logger.info(`#Rpc -> Waiting on messages on Queue ${tempQ.queue}`);
  //     await MSGQ.channel.bindQueue(tempQ.queue, MSGQ.EXCHANGE_NAME, routingKey);
  //     MSGQ.channel.consume(tempQ.queue, async (msg) => {
  //       if (msg?.content) {
  //         Logger.info(`#Rpc -> Received new message ${msg.content.toString()}`);
  //         await cb(msg.content.toString());
  //         MSGQ.channel.ack(msg);
  //       }
  //     });
  //   } catch (e: any) {
  //     throw new MSGQError("MSGQ Subscribe Error", e.message);
  //   }
  // }

  async on(listener: EventEmitter, event: string, cb: (msg: string) => Promise<void>) {
    listener.on(event, async (msg: amqp.ConsumeMessage) => {
      await cb(msg.content.toString());
      MSGQ.channel.ack(msg);
    });
  }
  //*********************************************************************** */

  async Call(service: string, procedure: string, payload: any, Maxtimeout = 1000) {
    return new Promise<{ ok: boolean; statusCode: number; data?: any; message?: string }>(async (res, rej) => {
      try {
        const bindingkey = `${service}.RPC.${procedure}`;
        const correlationId = v4();
         //MSGQ.channel.prefetch(1);
        const timeout = setTimeout(() => {
          rej("Error Time Out");
        }, Maxtimeout);
        MSGQ.callbackEvent.on(correlationId, (msg: amqp.ConsumeMessage) => {
          clearTimeout(timeout);
          res(JSON.parse(msg.content.toString()));
        });
        MSGQ.channel.publish(MSGQ.EXCHANGE_NAME, bindingkey, Buffer.from(payload), { correlationId: correlationId, replyTo: MSGQ.replayTo.queue });
      } catch (e:any) {
        rej(e);
      }
    });
  }
  //*********************************************************************** */

  async Rigester(procedure: string, cb: (msg: string) => Promise<any>) {
    try {
      const bindingkey = `${MSGQ.serviceName}.RPC.${procedure}`;
      const RPCQ = await MSGQ.channel.assertQueue(`${MSGQ.serviceName}:RPC:${procedure}`, { durable: false });
      await MSGQ.channel.bindQueue(RPCQ.queue, MSGQ.EXCHANGE_NAME, bindingkey);
      await MSGQ.channel.consume(RPCQ.queue, async (msg) => {
        if (msg?.content) {
          try {
            const data = await cb(msg.content.toString());
            MSGQ.channel.ack(msg);
            const payload = JSON.stringify({ ok: true, statusCode: STATUS_CODES.OK, data });
            MSGQ.channel.sendToQueue(msg.properties.replyTo, Buffer.from(payload), { correlationId: msg.properties.correlationId });
          } catch (e:any) {
            await RpcErrorHandler(e, async (payload: string) => {
              MSGQ.channel.ack(msg);
              MSGQ.channel.sendToQueue(msg.properties.replyTo, Buffer.from(payload), { correlationId: msg.properties.correlationId });
            });
          }
        }
      });
    } catch (e: any) {
      throw new MSGQError("Internal MSGQ RPC Error", e.message);
    }
  }
}

//*********************************************************************** */

export function generateJwtToken(Id: string) {
  try {
    const token = jwt.sign({ Id }, APP_SECRET, { expiresIn: "7d" });
    return token;
  } catch (e: any) {
    throw new APIError("generate Jwt Token  error ", e.message);
  }
}
//*********************************************************************** */

export function verify_token(token: string) {
  try {
    // @ts-ignore
    const data :any= jwt.verify(token, APP_SECRET);
    return data.Id;
  } catch (e: any) {
    throw new APIError("verify token error", e.message);
  }
}
//*********************************************************************** */

export function comparehash(password: string, hashed: string) {
  return bcrypt.compareSync(password, hashed);
}

//*********************************************************************** */

export function hash(password: string) {
  return bcrypt.hashSync(password, 10);
}


export function ArrToObj(arr:any[],key:string){
  const obj:any={}
  arr.forEach(e=>{
    obj[e[key]]=e
  })
  return obj
}