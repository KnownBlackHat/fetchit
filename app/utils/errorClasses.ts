class BaseError extends Error {
    stausCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.stausCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InternalServerError extends BaseError {
    constructor(message = "Internal Server Error") {
        super(message, 500);
    }
}

export class ParseError extends BaseError {
    constructor(message = "Failed to parse request") {
        super(message, 400);
    }
}

export class CustomError extends BaseError {
    constructor(message = "Error") {
        super(message, 400);
    }
}


export class UnauthorizedError extends BaseError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class DuplicateResourceError extends BaseError {
    constructor(message = "Duplicate Resource") {
        super(message, 409);
    }
}
