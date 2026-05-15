import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PRIMENG_UI } from '../../../shared/primeNG/primeng-ui';
import { PRIMENG_FORMS } from '../../../shared/primeNG/primeng-forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login',
  imports: [PRIMENG_UI, PRIMENG_FORMS],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly year = new Date().getFullYear();

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log('>>>Login attempt with:');
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login(this.loginForm.getRawValue() as LoginRequest)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err: Error) => this.errorMessage.set(err.message ?? 'Credenciales incorrectas'),
      });
  }

  get email() { return this.loginForm.get('email')!; }
  get password() { return this.loginForm.get('password')!; }
}
