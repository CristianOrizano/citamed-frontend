import { Component, effect, input, model, output } from '@angular/core';
import { DialogMode, Usuario } from '../../interfaces/usuario.interface';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';

@Component({
  selector: 'app-user-form-dialog',
  imports: [PRIMENG_OVERLAY, PRIMENG_FORMS, PRIMENG_UI],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.css',
})
export class UserFormDialogComponent {
  visible = model(false);
  mode = input<DialogMode>('create');
  userData = input<Partial<Usuario> | null>(null);

  saved = output<Partial<Usuario>>();

  form: Partial<Usuario> = {};

  readonly perfiles = ['ADMINISTRADOR', 'SUPERVISOR', 'ASESOR'];

  constructor() {
    effect(() => {
      const user = this.userData();
      this.form = user ? { ...user } : this.emptyForm();
    });
  }

  private emptyForm(): Partial<Usuario> {
    return {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      dni: '',
      email: '',
      perfil: '',
      permisos: '',
      area: '',
      territorio: '',
      region: '',
    };
  }

  get dialogTitle(): string {
    return { create: 'Nuevo Usuario', edit: 'Editar Usuario', view: 'Detalle de Usuario' }[this.mode()];
  }

  get isReadonly(): boolean {
    return this.mode() === 'view';
  }

  cancel(): void {
    this.visible.set(false);
  }

  save(): void {
    this.saved.emit({ ...this.form });
    this.visible.set(false);
  }
}
