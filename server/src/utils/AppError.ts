export class AppError extends Error {
    public readonly statusCode: number;
    public readonly type?: 'info' | 'error' | 'warning';
  
    constructor(message: string, statusCode: number, type: 'info' | 'error' | 'warning' = 'error') {
      super(message);
      this.statusCode = statusCode;
      this.type = type;
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}