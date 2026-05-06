import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { PRIMENG_UI } from '../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../shared/primeNG/primeng-overlay';
import { ThemeService } from '../../../shared/services/theme.service';
import { AuthService } from '../../../auth/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-navbar',
  imports: [PRIMENG_UI, PRIMENG_OVERLAY],
  providers: [ConfirmationService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() collapsed = false;
  @Output() hamburgerClick = new EventEmitter<void>();
  @Output() collapseToggle = new EventEmitter<void>();

  readonly theme = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly notifications = 5;

  get username(): string {
    return this.tokenService.getUsername() ?? 'Usuario';
  }

  get initials(): string {
    return this.username.slice(0, 2).toUpperCase();
  }

  logout(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas cerrar sesión?',
      header: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Sí, salir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.authService.logout(),
    });
  }
}
