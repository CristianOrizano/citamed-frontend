import { Component, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe, NgClass } from '@angular/common';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_TABLE } from '../../../../../shared/primeNG/primeng-table';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { TableSkeletonRowComponent } from '../../../../../shared/components/table-skeleton-row/table-skeleton-row.component';
import { DoctorFormDialogComponent } from '../../components/medico-form-dialog/doctor-form-dialog.component';
import { DoctorsService } from '../../services/doctors.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { DialogMode, Doctor, DoctorFilterRequest, SpecialtyOption } from '../../interfaces/doctor.interface';

@Component({
  selector: 'app-list-medicos',
  imports: [
    PRIMENG_UI,
    PRIMENG_OVERLAY,
    PRIMENG_TABLE,
    PRIMENG_FORMS,
    DecimalPipe,
    NgClass,
    StatusBadgeComponent,
    DoctorFormDialogComponent,
    TableSkeletonRowComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './list-doctors.component.html',
  styleUrl: './list-doctors.component.css',
})
export class ListMedicosComponent {
  @ViewChild('dt') dt!: Table;

  private readonly doctorsService = inject(DoctorsService);
  private readonly confirmation   = inject(ConfirmationService);
  private readonly toast          = inject(ToastService);

  doctors      = signal<Doctor[]>([]);
  totalRecords = signal(0);
  loading      = signal(false);

  readonly tableColumns = 6;
  readonly tableRows    = 10;
  readonly skeletonRows = Array(this.tableRows).fill({});

  dialogVisible          = signal(false);
  dialogMode: DialogMode = 'create';
  selectedDoctor: Partial<Doctor> | null = null;

  filter: DoctorFilterRequest = {
    page: 1,
    size: this.tableRows,
    sortBy: 'createdAt',
    sortDir: 'desc',
  };

  readonly specialtyOptions = toSignal(
    this.doctorsService.getSpecialtyOptions(),
    { initialValue: [] as SpecialtyOption[] }
  );

  readonly activeOptions = [
    { label: 'Activo',   value: true  },
    { label: 'Inactivo', value: false },
  ];

  private readonly avatarColors = [
    'bg-blue-500', 'bg-violet-500', 'bg-teal-500',
    'bg-orange-400', 'bg-rose-500', 'bg-emerald-500', 'bg-indigo-500',
  ];

  loadDoctors(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows  = event.rows  ?? this.tableRows;

    this.filter = { ...this.filter, page: Math.floor(first / rows) + 1, size: rows };

    this.loading.set(true);
    this.doctorsService.getDoctors(this.filter).subscribe({
      next: ({ content, totalElements }) => {
        this.doctors.set(content);
        this.totalRecords.set(totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('No se pudo cargar los médicos.');
      },
    });
  }

  search(): void {
    this.filter = {
      ...this.filter,
      name:          this.filter.name?.trim(),
      licenseNumber: this.filter.licenseNumber?.trim(),
    };
    this.dt.reset();
  }

  clearFilters(): void {
    this.filter = { page: 1, size: this.tableRows, sortBy: 'createdAt', sortDir: 'desc' };
    this.dt.reset();
  }

  getInitials(d: Doctor): string {
    return `${d.firstName.charAt(0)}${d.lastName.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(id: string): string {
    return this.avatarColors[id.charCodeAt(0) % this.avatarColors.length];
  }

  openCreate(): void {
    this.selectedDoctor = null;
    this.dialogMode     = 'create';
    this.dialogVisible.set(true);
  }

  openEdit(d: Doctor): void {
    this.selectedDoctor = { ...d };
    this.dialogMode     = 'edit';
    this.dialogVisible.set(true);
  }

  openView(d: Doctor): void {
    this.selectedDoctor = { ...d };
    this.dialogMode     = 'view';
    this.dialogVisible.set(true);
  }

  onSaved(): void {
    this.dt.reset();
  }

  confirmToggle(d: Doctor): void {
    const action = d.active ? 'desactivar' : 'activar';
    const name   = `${d.firstName} ${d.lastName}`;
    this.confirmation.confirm({
      message:                `¿Deseas ${action} al Dr. <strong>${name}</strong>?`,
      header:                 `Confirmar ${action}`,
      icon:                   d.active ? 'pi pi-ban' : 'pi pi-check-circle',
      acceptLabel:            `Sí, ${action}`,
      rejectLabel:            'Cancelar',
      acceptButtonStyleClass: d.active ? 'p-button-danger' : 'p-button-success',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.doctorsService.deleteDoctor(d.id).subscribe({
          next: () => {
            this.toast.success(`Dr. ${name} ${d.active ? 'desactivado' : 'activado'} correctamente.`);
            this.dt.reset();
          },
          error: () => this.toast.error(`No se pudo ${action} al médico.`),
        });
      },
    });
  }
}
