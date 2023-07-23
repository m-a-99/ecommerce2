import { DB_URL, EXCHANGE_NAME, MSG_QUEUE_URL, PORT, SERVICE_NAME } from "./config";
import { DBconnect } from "./database";
import { expressApp } from "./express-app";
import { MSGQ } from "./utils";
import express from "express";

async function RunServer() {
  await DBconnect(DB_URL);
  const msgq = new MSGQ();
  await msgq.init(MSG_QUEUE_URL, EXCHANGE_NAME, SERVICE_NAME);
  const app = express();
  await expressApp(app, msgq);

  app
    .listen(PORT, () => {
      console.log("lestining on port " + PORT);
    })
    .on("error", (e) => {
      console.log(e);
    })
    .on("close", async () => {
      await MSGQ.channel.close();
    });
}

RunServer();
