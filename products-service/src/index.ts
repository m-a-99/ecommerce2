import { DB_URL, EXCHANGE_NAME, MSG_QUEUE_URL, PORT, SERVICE_NAME } from "./config";
import { DBconnect } from "./database";
import express from "express";
import { MSGQ } from "./utils";
import { expressApp } from "./express-app";
async function runServer() {
    const app = express();
    const msgq=new MSGQ();
    await msgq.init(MSG_QUEUE_URL,EXCHANGE_NAME,SERVICE_NAME);
    await DBconnect(DB_URL);
    await expressApp(app, msgq);
    app.listen(PORT, () => {
        console.log("listening on port " + PORT);
    }).on('error', (err) => {
        console.log(err);
        process.exit();

    }).on('close', () => {
        MSGQ.channel.close();
    })
}
runServer()