import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_expires';
const USERNAME_KEY = 'auth_username';

@Injectable({ providedIn: 'root' })
export class TokenService {

  save(token: string, expiresOn: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_KEY, expiresOn);
  }

  saveUsername(username: string): void {
    localStorage.setItem(USERNAME_KEY, username);
  }

  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  }

  remove(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }

  isValid(): boolean {
    const token = this.get();
    if (!token) return false;

    const expires = localStorage.getItem(EXPIRES_KEY);
    if (!expires) return true;

    return new Date(expires) > new Date();
  }
}
