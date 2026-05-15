import { Component, inject, signal } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_TABLE } from '../../../../../shared/primeNG/primeng-table';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { TableSkeletonRowComponent } from '../../../../../shared/components/table-skeleton-row/table-skeleton-row.component';
import { DoctorFormDialogComponent } from '../../components/medico-form-dialog/doctor-form-dialog.component';
import { DoctorsService } from '../../services/doctors.service';
import { DialogMode, Doctor } from '../../interfaces/doctor.interface';

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
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-doctors.component.html',
  styleUrl: './list-doctors.component.css',
})
export class ListMedicosComponent {
  private doctorsService = inject(DoctorsService);
  private confirmation   = inject(ConfirmationService);
  private toast          = inject(MessageService);

  doctors      = signal<Doctor[]>([]);
  totalRecords = signal(0);
  loading      = signal(false);

  readonly tableColumns = 6;
  readonly tableRows    = 10;
  readonly skeletonRows = Array(this.tableRows).fill({});

  dialogVisible          = false;
  dialogMode: DialogMode = 'create';
  selectedDoctor: Partial<Doctor> | null = null;

  filterName      = '';
  filterSpecialty = '';

  private readonly avatarColors = [
    'bg-blue-500', 'bg-violet-500', 'bg-teal-500',
    'bg-orange-400', 'bg-rose-500', 'bg-emerald-500', 'bg-indigo-500',
  ];

  readonly specialtyOptions = [
    'Cardiología', 'Pediatría', 'Neonatología', 'Dermatología',
    'Neurología', 'Ortopedia', 'Traumatología', 'Ginecología', 'Obstetricia',
  ];

  loadDoctors(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows  = event.rows  ?? 10;
    const page  = Math.floor(first / rows) + 1;

    this.loading.set(true);
    this.doctorsService.getDoctors(page, rows).subscribe({
      next: ({ totalElements, doctors }) => {
        this.doctors.set(doctors);
        this.totalRecords.set(totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los médicos.' });
      },
    });
  }

  getInitials(d: Doctor): string {
    return `${d.firstName.charAt(0)}${d.lastName.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(id: string): string {
    return this.avatarColors[id.charCodeAt(0) % this.avatarColors.length];
  }

  clearFilters(): void {
    this.filterName      = '';
    this.filterSpecialty = '';
  }

  openCreate(): void {
    this.selectedDoctor = null;
    this.dialogMode     = 'create';
    this.dialogVisible  = true;
  }

  openEdit(d: Doctor): void {
    this.selectedDoctor = { ...d };
    this.dialogMode     = 'edit';
    this.dialogVisible  = true;
  }

  openView(d: Doctor): void {
    this.selectedDoctor = { ...d };
    this.dialogMode     = 'view';
    this.dialogVisible  = true;
  }

  onSave(data: Partial<Doctor>): void {
    this.toast.add({ severity: 'success', summary: 'Guardado', detail: 'Médico guardado correctamente.' });
  }

  confirmToggle(d: Doctor): void {
    const action = d.isActive ? 'desactivar' : 'activar';
    const name   = `${d.firstName} ${d.lastName}`;
    this.confirmation.confirm({
      message:                `¿Deseas ${action} al Dr. <strong>${name}</strong>?`,
      header:                 `Confirmar ${action}`,
      icon:                   d.isActive ? 'pi pi-ban' : 'pi pi-check-circle',
      acceptLabel:            `Sí, ${action}`,
      rejectLabel:            'Cancelar',
      acceptButtonStyleClass: d.isActive ? 'p-button-danger' : 'p-button-success',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.toast.add({ severity: 'info', summary: 'Pendiente', detail: 'Acción aún no conectada al API.' });
      },
    });
  }
}
