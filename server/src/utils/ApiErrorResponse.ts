export class ApiErrorResponse extends Error {
  constructor(
    public statusCode: number,
    public message: string = "Something went wrong!",
    public errors: string[] = [],
    public success: false = false
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}
