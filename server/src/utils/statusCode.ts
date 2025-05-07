export enum StatusCode {
    OK = 200,                  // Standard success
    CREATED = 201,             // Resource created
    NO_CONTENT = 204,          // No content to return
  
    // Client errors
    BAD_REQUEST = 400,         // Invalid request
    UNAUTHORIZED = 401,        // Missing or invalid auth
    FORBIDDEN = 403,           // Authenticated but not allowed
    NOT_FOUND = 404,           // Resource not found
    CONFLICT = 409,            // Resource conflict (e.g. duplicate)
  
    // Server errors
    INTERNAL_SERVER_ERROR = 500 // Unexpected server error
  }
  