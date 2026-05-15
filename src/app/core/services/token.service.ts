import { Injectable } from '@angular/core';
import { MeResponse } from '../../auth/interfaces/auth.interface';

const TOKEN_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_expires';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class TokenService {

  save(token: string, expiresOn: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_KEY, expiresOn);
  }

  saveUser(user: MeResponse): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): MeResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  remove(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    localStorage.removeItem(USER_KEY);
  }

  isValid(): boolean {
    const token = this.get();
    if (!token) return false;

    const expires = localStorage.getItem(EXPIRES_KEY);
    if (!expires) return true;

    return new Date(expires) > new Date();
  }
}
