class ApiError<T> extends Error {
  statusCode: number;
  message: string;
  errors: T[] | null;
  stack: string | undefined;
  success: boolean;
  constructor(
    statusCode: number = 500,
    message: string = "Internal Server Error!!",
    errors: T[] | null = [],
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.success = statusCode < 400;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
