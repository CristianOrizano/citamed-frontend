import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, MeResponse } from '../interfaces/auth.interface';
import { TokenService } from '../../core/services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly baseUrl = environment.apiUrl;

  login(credentials: LoginRequest): Observable<MeResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, credentials).pipe(
      switchMap(({ accessToken, expiresIn }) => {
        const expiry = new Date(Date.now() + expiresIn * 1000).toISOString();
        this.tokenService.save(accessToken, expiry);
        return this.http.get<MeResponse>(`${this.baseUrl}/api/auth/me`);
      }),
      tap(user => this.tokenService.saveUser(user)),
      catchError((err: HttpErrorResponse) =>
        throwError(() => new Error(err.error?.message ?? 'Credenciales incorrectas'))
      ),
    );
  }

  logout(): void {
    this.tokenService.remove();
    this.router.navigate(['/auth/login']);
  }
}
