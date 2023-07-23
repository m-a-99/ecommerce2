import { createLogger, transports, format, addColors } from "winston";
import { AppError, STATUS_CODES } from "./app-errors";
import { SERVICE_NAME } from "../config";
import express from "express";
const { combine, timestamp, printf, json, colorize, label } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 5,
  print: 6,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
};
export const consleLog = printf(({ level, message, label, timestamp }) => {
  try {
    const err = JSON.parse(message);
    return `${timestamp}\r\n[${label}]:${level}: ${err.name}\r\n${err.name}\r\n${err.stack}`;
  } catch (e:any) {
    return `${timestamp}:${level}: ${message}`;
  }
});

const fileLog = printf(({ level, message, timestamp }) => {
  return `${timestamp}:${level}: ${message}`;
});

addColors(colors);

export const Logger = createLogger({
  levels,
  defaultMeta: { service: SERVICE_NAME },
  transports: [
    new transports.Console({
      level: "print",
      format: combine(label({ label: SERVICE_NAME }), timestamp(), colorize(), consleLog),
    }),
    new transports.File({
      filename: "app_error.log",
      level: "info",
      format: combine(label({ label: SERVICE_NAME }), timestamp(), fileLog, json()),
    }),
  ],
});

export class ErrorLogger {
  constructor() {}
  logError(err: any) {
    console.log("==================== Start Error Logger ===============");
    Logger.log({
      private: true,
      level: "error",
      message: JSON.stringify({ name: err.name, message: err.message, stack: err.stack }),
    });
    console.log("==================== End Error Logger ===============");
    // log error with Logger plugins
    return false;
  }
  isTrustError(error: any) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

export const RpcErrorHandler = async (err: any, next: any) => {
  const errorLogger = new ErrorLogger();
  if (err) {
    errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      await next(JSON.stringify({ ok: false, statusCode: err.statusCode, message: err.message }));
    } else {
      await next(JSON.stringify({ ok: false, statusCode: STATUS_CODES.INTERNAL_ERROR, message: err.message }));
      process.exit(0);
    }
  }
  next();
};

export const ApiErrorHandler = async (err: any, req: any, res: any, next: any) => {
  const errorLogger = new ErrorLogger();
  // console.log(err.description, '-------> DESCRIPTION')
  // console.log(err.message, '-------> MESSAGE')
  // console.log(err.name, '-------> NAME')
  if (res.headersSent) {
    return next(err);
  }
  if (err) {
    errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      // if (err.errorStack) {
      //     const errorDescription = err.errorStack;
      //     return res.status(err.statusCode).json({ 'message': errorDescription })
      // }
      return res.status(err.statusCode).json({ ok: false, name: err.name, message: err.message });
    } else {
      return res.status(STATUS_CODES.INTERNAL_ERROR).json({ ok: false, name: err.name, message: err.message });
      // return process.exit(1)
    }
  }
  next();
};

export const uncaughtException = () => {
  const errorLogger = new ErrorLogger();
  process.on("unhandledRejection", (reason, promise) => {
    console.log(reason, "UNHANDLED");
    throw reason; // need to take care
  });

  process.on("uncaughtException", (error) => {
    errorLogger.logError(error);
    if (!errorLogger.isTrustError(error)) {
      process.exit(1);
      //process exist // need restart
    }
  });
};
