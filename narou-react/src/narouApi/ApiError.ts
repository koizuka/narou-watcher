
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
  toString(): string {
    return `${this.name} ${this.status} ${this.message}`;
  }
}
