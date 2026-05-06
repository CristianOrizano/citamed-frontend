import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PRIMENG_UI } from '../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../shared/primeNG/primeng-overlay';

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

  topItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-objects-column',
      route: '/dashboard/inicio',
    },
  ];

  navSections: NavSection[] = [
    {
      title: 'FORMACIÓN',
      items: [
        {
          label: 'Planes de Capacitación',
          icon: 'pi pi-list-check',
          route: '/dashboard/planes',
        },
        {
          label: 'Cursos',
          icon: 'pi pi-graduation-cap',
          route: '/dashboard/cursos',
        },
        {
          label: 'Escenarios',
          icon: 'pi pi-share-alt',
          route: '/dashboard/escenarios',
        },
      ],
    },
    {
      title: 'CONTENIDO',
      items: [
        {
          label: 'Documentos',
          icon: 'pi pi-file',
          route: '/dashboard/documentos',
        },
        {
          label: 'Categorías',
          icon: 'pi pi-tag',
          route: '/dashboard/categorias',
        },
      ],
    },
    {
      title: 'ADMINISTRACIÓN',
      items: [
        { label: 'Usuarios', icon: 'pi pi-users', route: '/dashboard/users' },
        {
          label: 'Perfiles',
          icon: 'pi pi-id-card',
          route: '/dashboard/perfiles',
        },
        {
          label: 'Jerarquía de Regiones',
          icon: 'pi pi-sitemap',
          route: '/dashboard/regiones',
        },
        {
          label: 'Parámetros',
          icon: 'pi pi-sliders-h',
          route: '/dashboard/parametros',
        },
      ],
    },
    {
      title: 'REPORTES',
      items: [
        {
          label: 'Reporte de Avances',
          icon: 'pi pi-chart-bar',
          route: '/dashboard/reportes/avances',
        },
        {
          label: 'Reporte de Usuarios',
          icon: 'pi pi-chart-pie',
          route: '/dashboard/reportes/usuarios',
        },
      ],
    },
  ];
}
