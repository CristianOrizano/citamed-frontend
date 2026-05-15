import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PRIMENG_UI } from '../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../shared/primeNG/primeng-overlay';
import { TokenService } from '../../../core/services/token.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [PRIMENG_UI, PRIMENG_OVERLAY, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Input() mobileOpen = false;
  @Output() collapseToggle = new EventEmitter<void>();
  @Output() mobileClose = new EventEmitter<void>();

  private readonly tokenService = inject(TokenService);

  get displayName(): string {
    const email = this.tokenService.getUser()?.email ?? '';
    const name = email.split('@')[0] ?? 'Usuario';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  get displayRole(): string {
    const role = this.tokenService.getUser()?.role;
    const map: Record<string, string> = { ADMIN: 'Administrador', DOCTOR: 'Médico', PATIENT: 'Paciente' };
    return map[role ?? ''] ?? 'Usuario';
  }

  get initials(): string {
    return this.displayName.slice(0, 2).toUpperCase();
  }

  topItems: NavItem[] = [];

  navSections: NavSection[] = [
    {
      title: 'INICIO',
      items: [
        { label: 'Dashboard', icon: 'pi pi-objects-column', route: '/dashboard/inicio' },
      ],
    },
    {
      title: 'GESTIÓN',
      items: [
        { label: 'Médicos',        icon: 'pi pi-user-plus', route: '/dashboard/medicos' },
        { label: 'Especialidades', icon: 'pi pi-star',      route: '/dashboard/especialidades' },
        { label: 'Usuarios',       icon: 'pi pi-users',     route: '/dashboard/usuarios' },
      ],
    },
    {
      title: 'OPERACIONES',
      items: [
        { label: 'Citas',     icon: 'pi pi-calendar', route: '/dashboard/citas' },
        { label: 'Horarios',  icon: 'pi pi-clock',    route: '/dashboard/horarios' },
      ],
    },
    {
      title: 'REPORTES',
      items: [
        { label: 'Métricas', icon: 'pi pi-chart-bar', route: '/dashboard/metricas' },
      ],
    },
  ];
}
