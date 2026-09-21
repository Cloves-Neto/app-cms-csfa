/**
 * Erro base padronizado para falhas de comunicação HTTP e API.
 */
export class HttpError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;
  public readonly raw?: unknown;

  constructor(message: string, status = 500, code?: string, details?: unknown, raw?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.raw = raw;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Sessão expirada ou não autorizada", details?: unknown, raw?: unknown) {
    super(message, 401, "UNAUTHORIZED", details, raw);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Você não possui permissão para executar esta ação", details?: unknown, raw?: unknown) {
    super(message, 403, "FORBIDDEN", details, raw);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Recurso solicitado não foi encontrado", details?: unknown, raw?: unknown) {
    super(message, 404, "NOT_FOUND", details, raw);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends HttpError {
  constructor(message = "Dados inválidos fornecidos", details?: unknown, raw?: unknown) {
    super(message, 422, "VALIDATION_ERROR", details, raw);
    this.name = "ValidationError";
  }
}

export class NetworkError extends HttpError {
  constructor(message = "Falha de conexão com o servidor. Verifique sua internet.", raw?: unknown) {
    super(message, 0, "NETWORK_ERROR", undefined, raw);
    this.name = "NetworkError";
  }
}
