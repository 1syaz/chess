export class ApiResponse<T> {
  public success: boolean;

  constructor(
    public status: number,
    public message: string,
    public data: T,
  ) {
    this.success = status < 400;
  }
}
