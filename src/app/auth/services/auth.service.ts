import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, switchMap, throwError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import { TokenService } from '../../core/services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly baseUrl = environment.apiUrl;

  private readonly TOKEN_DURATION_MS = 60 * 60 * 1000; // 1 hora

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/landingaitutor/login/web/`,
      credentials,
    ).pipe(
      switchMap(response => {
        if (!response.result?.tokenAccess) {
          return throwError(() => new Error(response.responseInfo?.message ?? 'Credenciales incorrectas'));
        }
        const expiry = response.expiresOn ?? new Date(Date.now() + this.TOKEN_DURATION_MS).toISOString();
        this.tokenService.save(response.result.tokenAccess, expiry);
        this.tokenService.saveUsername(credentials.username);
        return of(response);
      })
    );
  }

  logout(): void {
    this.tokenService.remove();
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.isValid();
  }
}
