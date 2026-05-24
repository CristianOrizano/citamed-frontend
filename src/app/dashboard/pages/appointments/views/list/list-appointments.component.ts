import { Component, inject, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_TABLE } from '../../../../../shared/primeNG/primeng-table';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { TableSkeletonRowComponent } from '../../../../../shared/components/table-skeleton-row/table-skeleton-row.component';
import { AppointmentsService } from '../../services/appointments.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import {
  AppointmentFilterRequest,
  AppointmentResponse,
  AppointmentStatus,
  DoctorOption,
} from '../../interfaces/appointment.interface';

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; badgeClass: string }> = {
  SCHEDULED:   { label: 'Programada',  badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'     },
  CONFIRMED:   { label: 'Confirmada',  badgeClass: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300'   },
  CHECKED_IN:  { label: 'Check-in',   badgeClass: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300'      },
  IN_PROGRESS: { label: 'En curso',   badgeClass: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'},
  COMPLETED:   { label: 'Completada', badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'},
  CANCELLED:   { label: 'Cancelada',  badgeClass: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300'           },
  NO_SHOW:     { label: 'No asistió', badgeClass: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'},
};

@Component({
  selector: 'app-list-appointments',
  imports: [PRIMENG_UI, PRIMENG_OVERLAY, PRIMENG_TABLE, PRIMENG_FORMS, NgClass, TableSkeletonRowComponent],
  templateUrl: './list-appointments.component.html',
  styleUrl: './list-appointments.component.css',
})
export class ListAppointmentsComponent {
  @ViewChild('dt') dt!: Table;

  private readonly service = inject(AppointmentsService);
  private readonly toast   = inject(ToastService);

  appointments = signal<AppointmentResponse[]>([]);
  totalRecords = signal(0);
  loading      = signal(false);

  readonly tableColumns = 6;
  readonly tableRows    = 10;
  readonly skeletonRows = Array(this.tableRows).fill({});

  filter: AppointmentFilterRequest = {
    page:    1,
    size:    this.tableRows,
    sortBy:  'createdAt',
    sortDir: 'desc',
  };

  readonly statusOptions: { label: string; value: AppointmentStatus }[] = [
    { label: 'Programada',  value: 'SCHEDULED'   },
    { label: 'Confirmada',  value: 'CONFIRMED'   },
    { label: 'Check-in',   value: 'CHECKED_IN'  },
    { label: 'En curso',   value: 'IN_PROGRESS' },
    { label: 'Completada', value: 'COMPLETED'   },
    { label: 'Cancelada',  value: 'CANCELLED'   },
    { label: 'No asistió', value: 'NO_SHOW'     },
  ];

  readonly doctorOptions = toSignal(
    this.service.getDoctorOptions().pipe(
      map((docs) => docs.map((d) => ({ ...d, label: `Dr. ${d.fullName}` }))),
      catchError(() => of([] as (DoctorOption & { label: string })[])),
    ),
    { initialValue: [] as (DoctorOption & { label: string })[] },
  );

  loadAppointments(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows  = event.rows ?? this.tableRows;
    this.filter = { ...this.filter, page: Math.floor(first / rows) + 1, size: rows };

    this.loading.set(true);
    this.service.getAppointments(this.filter).subscribe({
      next: ({ content, totalElements }) => {
        this.appointments.set(content);
        this.totalRecords.set(totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('No se pudo cargar las citas.');
      },
    });
  }

  search(): void {
    this.dt.reset();
  }

  clearFilters(): void {
    this.filter = { page: 1, size: this.tableRows, sortBy: 'createdAt', sortDir: 'desc' };
    this.dt.reset();
  }

  getStatusConfig(status: AppointmentStatus) {
    return STATUS_CONFIG[status] ?? { label: status, badgeClass: '' };
  }

  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }

  formatDateTime(date: string, time: string): string {
    const d       = new Date(`${date}T00:00:00`);
    const dateStr = d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${dateStr} · ${time}`;
  }

  private readonly avatarColors = [
    'bg-blue-500', 'bg-violet-500', 'bg-teal-500',
    'bg-orange-400', 'bg-rose-500', 'bg-emerald-500', 'bg-indigo-500',
  ];

  getAvatarColor(id: string): string {
    return this.avatarColors[id.charCodeAt(0) % this.avatarColors.length];
  }
}
