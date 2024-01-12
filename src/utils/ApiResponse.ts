class ApiResponse<T> {
  private statusCode: number;
  private message: string;
  private data: T | undefined;
  private success: boolean;
  private timeStamp: number;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
    this.timeStamp = Date.now();
  }
}

export { ApiResponse };
