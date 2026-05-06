export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  responseInfo: {
    code: string;
    message: string;
  };
  result: {
    tokenAccess: string;
  };
  expiresOn?: string; // backend aún no lo envía
}
