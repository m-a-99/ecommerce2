const { USER_SERVICE, EXCHANGE_NAME } = require("./src/config");
const { rpcreq, CreateChannel } = require("./src/utils");
const amqp = require('amqplib')
const uuid = require('uuid')

async function old(){
    const con=await amqp.connect();
    const channel =await con.createChannel();
    await channel.assertExchange(EXCHANGE_NAME,"direct",{durable:false})
    for (let i = 0; i < 100000;i++){
        send(channel,USER_SERVICE,"name1",JSON.stringify({data:i}),(msg)=>{
            console.log(msg)
        })
        send(channel, USER_SERVICE, "name2", JSON.stringify({ data: i }), (msg) => {
            console.log(msg)
        })
        send(channel, USER_SERVICE, "name3", JSON.stringify({ data: i }), (msg) => {
            console.log(msg)
        })
        send(channel, USER_SERVICE, "name4", JSON.stringify({ data: i }), (msg) => {
            console.log(msg)
        })
    }
}

async function send(channel,USER_SERVICE, procedure,payload,cb){
    const q = await channel.assertQueue("", { exclusive: true });
    const bindingkey = `${USER_SERVICE}.RPC.${procedure}`
    const correlationId = uuid.v4();
    channel.consume(q.queue, (msg) => {
        if (msg.properties.correlationId === correlationId) {
            cb(JSON.parse(msg.content.toString()));
        }
    })

    channel.publish(EXCHANGE_NAME, bindingkey, Buffer.from(payload), { correlationId, replyTo: q.queue })

} 
async function s() {
    console.log("start")
    const channel=await CreateChannel()
    const req =  await new rpcreq(channel);
    // await req.init()
 
    //req.call(USER_SERVICE, "name1", JSON.stringify(msg), 4000).then(msg => console.log(msg))
    for (let i = 0; i < 100000; i++) {
        const msg = JSON.stringify({
            event: "bbbb",
            data: "aaaaaa",
            index: i
        })
        req.call(USER_SERVICE, "name1", msg, 4000)
        req.call(USER_SERVICE, "name2", msg, 4000)
        req.call(USER_SERVICE, "name3", msg, 4000)
        req.call(USER_SERVICE, "name4", msg, 4000)

    }
}

s()
//old()