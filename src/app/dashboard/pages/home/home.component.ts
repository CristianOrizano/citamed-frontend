import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PRIMENG_UI } from '../../../shared/primeNG/primeng-ui';
import { TokenService } from '../../../core/services/token.service';

export type EstadoCita = 'Confirmada' | 'Programada' | 'Completada' | 'Cancelada';

interface KpiCard {
  label: string;
  value: string | number;
  badge: string;
  badgeUp: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}

interface CitaHoy {
  paciente: string;
  medico: string;
  hora: string;
  estado: EstadoCita;
}

interface MedicoTop {
  initials: string;
  nombre: string;
  especialidad: string;
  citas: number;
  rating: number;
}

@Component({
  selector: 'app-home',
  imports: [PRIMENG_UI, NgClass, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly tokenService = inject(TokenService);

  today = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  get greeting(): string {
    const email = this.tokenService.getUser()?.email ?? '';
    const name = email.split('@')[0] ?? 'Admin';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  kpiCards: KpiCard[] = [
    {
      label: 'Citas hoy',
      value: 24,
      badge: '+12% vs ayer',
      badgeUp: true,
      icon: 'pi pi-calendar',
      iconBg: 'rgba(0, 119, 188, 0.12)',
      iconColor: '#0077bc',
    },
    {
      label: 'Médicos activos',
      value: 8,
      badge: '+2 este mes',
      badgeUp: true,
      icon: 'pi pi-user-plus',
      iconBg: 'rgba(0, 119, 188, 0.12)',
      iconColor: '#0077bc',
    },
    {
      label: 'Pacientes registrados',
      value: 312,
      badge: '+18 este mes',
      badgeUp: true,
      icon: 'pi pi-users',
      iconBg: 'rgba(249, 115, 22, 0.12)',
      iconColor: '#f97316',
    },
    {
      label: 'Tasa cancelación',
      value: '6%',
      badge: '+2% vs mes anterior',
      badgeUp: false,
      icon: 'pi pi-times-circle',
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#ef4444',
    },
  ];

  citasHoy: CitaHoy[] = [
    { paciente: 'Juan Pérez',   medico: 'Dr. García',   hora: '09:00', estado: 'Confirmada' },
    { paciente: 'María López',  medico: 'Dra. Torres',  hora: '09:30', estado: 'Programada' },
    { paciente: 'Carlos Ruiz',  medico: 'Dr. Mendoza',  hora: '10:00', estado: 'Completada' },
    { paciente: 'Ana Flores',   medico: 'Dr. García',   hora: '10:30', estado: 'Cancelada'  },
    { paciente: 'Luis Vargas',  medico: 'Dra. Torres',  hora: '11:00', estado: 'Confirmada' },
  ];

  medicosTop: MedicoTop[] = [
    { initials: 'CG', nombre: 'Dr. Carlos García',    especialidad: 'Cardiología',   citas: 48, rating: 4.9 },
    { initials: 'MT', nombre: 'Dra. María Torres',    especialidad: 'Pediatría',     citas: 41, rating: 4.8 },
    { initials: 'RM', nombre: 'Dr. Roberto Mendoza',  especialidad: 'Neurología',    citas: 37, rating: 4.7 },
    { initials: 'LV', nombre: 'Dra. Laura Vega',      especialidad: 'Dermatología',  citas: 29, rating: 4.6 },
    { initials: 'JP', nombre: 'Dr. Jorge Paredes',    especialidad: 'Traumatología', citas: 25, rating: 4.5 },
  ];

  estadoClass(estado: EstadoCita): string {
    const map: Record<EstadoCita, string> = {
      Confirmada: 'estado-confirmada',
      Programada: 'estado-programada',
      Completada: 'estado-completada',
      Cancelada:  'estado-cancelada',
    };
    return map[estado];
  }
}
