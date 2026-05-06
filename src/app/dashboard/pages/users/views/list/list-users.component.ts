import { Component, inject, signal } from '@angular/core';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_TABLE } from '../../../../../shared/primeNG/primeng-table';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { NgClass } from '@angular/common';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogMode, Usuario } from '../../interfaces/usuario.interface';
import { UserFormDialogComponent } from '../../components/user-form-dialog/user-form-dialog.component';
import { UsersService } from '../../services/users.service';
import { TableSkeletonRowComponent } from '../../../../../shared/components/table-skeleton-row/table-skeleton-row.component';

@Component({
  selector: 'app-list-users',
  imports: [
    PRIMENG_UI,
    PRIMENG_OVERLAY,
    PRIMENG_TABLE,
    PRIMENG_FORMS,
    NgClass,
    StatusBadgeComponent,
    UserFormDialogComponent,
    TableSkeletonRowComponent,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css',
})
export class ListUsersComponent {
  private usersService = inject(UsersService);
  private confirmation = inject(ConfirmationService);
  private toast = inject(MessageService);

  usuarios = signal<Usuario[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  readonly tableColumns = 7;
  readonly tableRows = 10;
  readonly skeletonRows = Array(this.tableRows).fill({});

  dialogVisible = false;
  dialogMode: DialogMode = 'create';
  selectedUser: Partial<Usuario> | null = null;

  filterUser = '';
  filterArea = '';
  filterPerfil = '';

  private readonly avatarColors = [
    'bg-blue-500',
    'bg-violet-500',
    'bg-teal-500',
    'bg-orange-400',
    'bg-rose-500',
    'bg-emerald-500',
    'bg-indigo-500',
  ];

  loadUsers(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = Math.floor(first / rows) + 1;

    this.loading.set(true);
    this.usersService.getUsers(page, rows).subscribe({
      next: ({ listInfo, usuarios }) => {
        this.usuarios.set(usuarios);
        this.totalRecords.set(listInfo.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los usuarios.' });
      },
    });
  }

  getInitials(u: Usuario): string {
    return `${u.nombre.charAt(0)}${u.apellidoPaterno.charAt(0)}`.toUpperCase();
  }

  getAvatarColor(username: string): string {
    return this.avatarColors[username.charCodeAt(0) % this.avatarColors.length];
  }

  getPerfilClass(perfil: string): string {
    const map: Record<string, string> = {
      ADMINISTRADOR: 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
      SUPERVISOR: 'bg-violet-50 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
      ASESOR: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300',
    };
    return map[perfil] ?? 'bg-slate-100 text-slate-600';
  }

  clearFilters(): void {
    this.filterUser = '';
    this.filterArea = '';
    this.filterPerfil = '';
  }

  openCreate(): void {
    this.selectedUser = null;
    this.dialogMode = 'create';
    this.dialogVisible = true;
  }

  openEdit(u: Usuario): void {
    this.selectedUser = { ...u };
    this.dialogMode = 'edit';
    this.dialogVisible = true;
  }

  openView(u: Usuario): void {
    this.selectedUser = { ...u };
    this.dialogMode = 'view';
    this.dialogVisible = true;
  }

  onSave(data: Partial<Usuario>): void {
    // TODO: conectar con POST/PUT del servicio
    this.toast.add({ severity: 'info', summary: 'Pendiente', detail: 'Guardado aún no conectado al API.' });
  }

  confirmDelete(u: Usuario): void {
    this.confirmation.confirm({
      message: `¿Deseas eliminar al usuario <strong>${u.username}</strong>? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        // TODO: conectar con DELETE del servicio
        this.toast.add({ severity: 'info', summary: 'Pendiente', detail: 'Eliminación aún no conectada al API.' });
      },
    });
  }
}
