import { Component, inject, signal, ViewChild } from '@angular/core';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_TABLE } from '../../../../../shared/primeNG/primeng-table';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { TableSkeletonRowComponent } from '../../../../../shared/components/table-skeleton-row/table-skeleton-row.component';
import { SpecialtyFormDialogComponent } from '../../components/especialidad-form-dialog/specialty-form-dialog.component';
import { SpecialtiesService } from '../../services/specialties.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import {
  DialogMode,
  SpecialtyFilterRequest,
  SpecialtyResponse,
} from '../../interfaces/specialty.interface';

@Component({
  selector: 'app-list-especialidades',
  imports: [
    PRIMENG_UI,
    PRIMENG_OVERLAY,
    PRIMENG_TABLE,
    PRIMENG_FORMS,
    StatusBadgeComponent,
    SpecialtyFormDialogComponent,
    TableSkeletonRowComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './list-specialties.component.html',
  styleUrl: './list-specialties.component.css',
})
export class ListEspecialidadesComponent {
  @ViewChild('dt') dt!: Table;

  private readonly specialtiesService = inject(SpecialtiesService);
  private readonly confirmation        = inject(ConfirmationService);
  private readonly toast               = inject(ToastService);

  specialties  = signal<SpecialtyResponse[]>([]);
  totalRecords = signal(0);
  loading      = signal(false);

  readonly tableColumns = 4;
  readonly tableRows    = 10;
  readonly skeletonRows = Array(this.tableRows).fill({});

  dialogVisible        = signal(false);
  dialogMode: DialogMode = 'create';
  selectedSpecialty: Partial<SpecialtyResponse> | null = null;

  filter: SpecialtyFilterRequest = {
    page: 1,
    size: this.tableRows,
    sortBy: 'createdAt',
    sortDir: 'desc',
  };

  loadSpecialties(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows  = event.rows  ?? this.tableRows;

    this.filter = { ...this.filter, page: Math.floor(first / rows) + 1, size: rows };

    this.loading.set(true);
    this.specialtiesService.getSpecialties(this.filter).subscribe({
      next: ({ content, totalElements }) => {
        this.specialties.set(content);
        this.totalRecords.set(totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('No se pudo cargar las especialidades.');
      },
    });
  }

  search(): void {
    this.filter = { ...this.filter, name: this.filter.name?.trim() };
    this.dt.reset();
  }

  clearFilters(): void {
    this.filter = { page: 1, size: this.tableRows, sortBy: 'createdAt', sortDir: 'desc' };
    this.dt.reset();
  }

  openCreate(): void {
    this.selectedSpecialty = null;
    this.dialogMode = 'create';
    this.dialogVisible.set(true);
  }

  openEdit(e: SpecialtyResponse): void {
    this.specialtiesService.getSpecialtyById(e.id).subscribe({
      next: (data) => {
        this.dialogMode = 'edit';
        this.selectedSpecialty = data;
        this.dialogVisible.set(true);
      },
      error: () => this.toast.error('No se pudo cargar la especialidad.'),
    });
  }

  onSaved(): void {
    this.dt.reset();
  }

  confirmToggle(e: SpecialtyResponse): void {
    const action = e.active ? 'desactivar' : 'activar';
    this.confirmation.confirm({
      message:                `¿Deseas ${action} la especialidad <strong>${e.name}</strong>?`,
      header:                 `Confirmar ${action}`,
      icon:                   e.active ? 'pi pi-ban' : 'pi pi-check-circle',
      acceptLabel:            `Sí, ${action}`,
      rejectLabel:            'Cancelar',
      acceptButtonStyleClass: e.active ? 'p-button-danger' : 'p-button-success',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.specialtiesService.deleteSpecialty(e.id).subscribe({
          next: () => {
            this.toast.success('Estado de la especialidad actualizado.');
            this.dt.reset();
          },
          error: () => this.toast.error(`No se pudo ${action} la especialidad.`),
        });
      },
    });
  }
}
