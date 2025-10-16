export enum HttpStatus {
  // ✅ 2xx Success
  OK = 200, // Request succeeded
  CREATED = 201, // Resource created successfully
  ACCEPTED = 202, // Request accepted for processing
  NO_CONTENT = 204, // No response body

  // ⚠️ 3xx Redirection
  MOVED_PERMANENTLY = 301, // Resource moved permanently
  FOUND = 302, // Resource found (temporary redirect)
  SEE_OTHER = 303, // Redirect with GET
  NOT_MODIFIED = 304, // Resource not modified
  TEMPORARY_REDIRECT = 307, // Temporary redirect (method preserved)
  PERMANENT_REDIRECT = 308, // Permanent redirect (method preserved)

  // ❌ 4xx Client Errors
  BAD_REQUEST = 400, // Invalid request format or data
  UNAUTHORIZED = 401, // Authentication required
  PAYMENT_REQUIRED = 402, // Reserved for payment-related issues
  FORBIDDEN = 403, // Authenticated but not authorized
  NOT_FOUND = 404, // Resource not found
  METHOD_NOT_ALLOWED = 405, // HTTP method not supported
  NOT_ACCEPTABLE = 406, // Content type not acceptable
  CONFLICT = 409, // Resource conflict (e.g., duplicate email)
  GONE = 410, // Resource permanently gone
  LENGTH_REQUIRED = 411, // Missing Content-Length header
  PRECONDITION_FAILED = 412, // Preconditions not met
  PAYLOAD_TOO_LARGE = 413, // Request entity too large
  URI_TOO_LONG = 414, // URI too long
  UNSUPPORTED_MEDIA_TYPE = 415, // Unsupported content type
  TOO_MANY_REQUESTS = 429, // Rate limiting (too many requests)

  // 💥 5xx Server Errors
  INTERNAL_SERVER_ERROR = 500, // Generic server error
  NOT_IMPLEMENTED = 501, // Feature not implemented
  BAD_GATEWAY = 502, // Invalid response from upstream server
  SERVICE_UNAVAILABLE = 503, // Server temporarily unavailable
  GATEWAY_TIMEOUT = 504, // Upstream server timeout
  HTTP_VERSION_NOT_SUPPORTED = 505, // Unsupported HTTP version
}
