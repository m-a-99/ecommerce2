export enum STATUS_CODES {
  OK = 200,
  BAD_REQUEST = 400,
  UN_AUTHORISED = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  REQUEST_TIMEOUT = 408,
  PAYMENT_REQUIRED = 402,
}

export class AppError extends Error {
  constructor(name: string, description: string, public statusCode: STATUS_CODES, public isOperational:boolean) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

export class MSGQError extends AppError {
  constructor(name: string, description: string = "Internal Server MSGQ Error", statusCode: number = STATUS_CODES.INTERNAL_ERROR, isOperational:boolean = true) {
    super(name, description, statusCode, isOperational);
  }
}
export class APIError extends AppError {
  constructor(name:string, description:string = "Internal Server Error", statusCode:number = STATUS_CODES.INTERNAL_ERROR, isOperational:boolean = true) {
    super(name, description, statusCode, isOperational);
  }
}

export class BadRequestError extends AppError {
  constructor(description:string = "Bad request") {
    super("Bad Request", description, STATUS_CODES.BAD_REQUEST, true);
  }
}

export class ValidationError extends AppError {
  constructor(description:string = "Validation Error") {
    super("Validation Error", description, STATUS_CODES.BAD_REQUEST, true);
  }
}

export class UnauthorizedError extends AppError {
  constructor(description = "Unauthorized Error") {
    super("Unauthorized Error", description, STATUS_CODES.UN_AUTHORISED, true);
  }
}

export class RequestTimeoutError extends AppError {
  constructor(description = "RequestTimeout Error") {
    super("RequestTimeout Error", description, STATUS_CODES.REQUEST_TIMEOUT, true);
  }
}
export class PaymentRequiredError extends AppError {
  constructor(description = "PaymentRequired Error") {
    super("PaymentRequired Error", description, STATUS_CODES.UN_AUTHORISED, true);
  }
}

export class NotFoundError extends AppError{
    constructor(description = 'Not Found') {
        super('Not Found', description, STATUS_CODES.NOT_FOUND, true);
    }
}






