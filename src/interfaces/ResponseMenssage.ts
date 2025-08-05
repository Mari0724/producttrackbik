export interface ResponseMessage {
  message: string;
  detalles?: any; // opcional, para errores o información extra
}

export interface ResponseMessageWithToken extends ResponseMessage {
  token?: string;
}

export interface ResponseMessageWithData<T> extends ResponseMessage {
  data: T;
}