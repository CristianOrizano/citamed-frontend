export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

export interface MeResponse {
  userId: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}
