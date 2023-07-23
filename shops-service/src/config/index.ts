import dotenv from "dotenv";
if (process.env.ENV_MODE == "dev") {
  dotenv.config({ path: `./.env.${process.env.ENV_MODE}` });
} else {
  dotenv.config();
}

export const PORT = process.env.PORT || 3002;
export const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/ShopsServiceDB";
export const MSG_QUEUE_URL = process.env.MSG_QUEUE_URL || "amqp://localhost";
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME || "ONLINE_STORE";
export const SERVICE_NAME = "SHOPS_SERVICE";
