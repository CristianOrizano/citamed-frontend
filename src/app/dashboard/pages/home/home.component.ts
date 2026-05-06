import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PRIMENG_UI } from '../../../shared/primeNG/primeng-ui';

interface KpiCard {
  label: string;
  value: number | string;
  icon: string;
  iconColor: string;
  badge: string;
  badgeClass: string;
  badgeIcon: string;
  gradient: string;
}

interface Activity {
  title: string;
  subtitle: string;
  time: string;
  dotColor: string;
}

interface QuickAccess {
  label: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  route: string;
}

@Component({
  selector: 'app-home',
  imports: [PRIMENG_UI, NgClass, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  kpiCards: KpiCard[] = [
    {
      label: 'PLANES DE CAPACITACIÓN',
      value: 3,
      icon: 'pi pi-copy',
      iconColor: 'text-blue-500',
      badge: 'Activos',
      badgeClass: 'text-green-600 bg-green-50',
      badgeIcon: 'pi-arrow-up-right',
      gradient: 'linear-gradient(to right, #3b82f6, #a855f7)',
    },
    {
      label: 'CURSOS',
      value: 17,
      icon: 'pi pi-list',
      iconColor: 'text-purple-500',
      badge: 'Publicados',
      badgeClass: 'text-blue-600 bg-blue-50',
      badgeIcon: 'pi-arrow-up-right',
      gradient: 'linear-gradient(to right, #a855f7, #818cf8)',
    },
    {
      label: 'USUARIOS',
      value: 104,
      icon: 'pi pi-users',
      iconColor: 'text-teal-500',
      badge: 'Sin cambios',
      badgeClass: 'text-slate-500 bg-slate-100',
      badgeIcon: 'pi-minus',
      gradient: 'linear-gradient(to right, #2dd4bf, #22d3ee)',
    },
    {
      label: 'ARCHIVOS SUBIDOS',
      value: 89,
      icon: 'pi pi-upload',
      iconColor: 'text-green-500',
      badge: 'Este mes',
      badgeClass: 'text-blue-600 bg-blue-50',
      badgeIcon: 'pi-arrow-up-right',
      gradient: 'linear-gradient(to right, #4ade80, #10b981)',
    },
  ];

  activities: Activity[] = [
    { title: 'Nuevo Curso',                    subtitle: 'Microfinanzas 3',                                    time: '2 h atrás',   dotColor: 'bg-blue-500'   },
    { title: 'Archivos subidos',               subtitle: '4 MP4 videos — curso de microfinanzas',              time: '5 h atrás',   dotColor: 'bg-blue-400'   },
    { title: 'Plan de capacitación editado',   subtitle: 'Q1 2025 Capacitación Asesores Comerciales',          time: '1 día atrás', dotColor: 'bg-orange-400' },
    { title: 'Curso editado',                  subtitle: 'Atención al cliente',                                time: '2 días atrás',dotColor: 'bg-green-500'  },
    { title: 'Nuevo módulo agregado',          subtitle: 'Campaña AFP en plazo fijo',                          time: '3 días atrás',dotColor: 'bg-teal-400'   },
  ];

  quickAccess: QuickAccess[] = [
    { label: 'Planes de Capacitación',  icon: 'pi pi-copy',    iconColor: 'text-blue-500',   iconBg: 'bg-blue-50 dark:bg-blue-950',    route: '/dashboard/planes'      },
    { label: 'Mantenedor de Cursos',    icon: 'pi pi-list',    iconColor: 'text-purple-500', iconBg: 'bg-purple-50 dark:bg-purple-950',route: '/dashboard/cursos'      },
    { label: 'Mantenedor de Usuarios',  icon: 'pi pi-users',   iconColor: 'text-teal-500',   iconBg: 'bg-teal-50 dark:bg-teal-950',    route: '/dashboard/usuarios'    },
    { label: 'Parámetros',              icon: 'pi pi-cog',     iconColor: 'text-slate-500',  iconBg: 'bg-slate-100 dark:bg-slate-700', route: '/dashboard/parametros'  },
  ];
}
