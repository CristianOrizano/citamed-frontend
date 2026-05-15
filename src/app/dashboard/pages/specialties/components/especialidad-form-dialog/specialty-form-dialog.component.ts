import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { SpecialtiesService } from '../../services/specialties.service';
import { DialogMode, SpecialtyResponse } from '../../interfaces/specialty.interface';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-specialty-form-dialog',
  imports: [PRIMENG_OVERLAY, PRIMENG_FORMS, PRIMENG_UI],
  templateUrl: './specialty-form-dialog.component.html',
  styleUrl: './specialty-form-dialog.component.css',
})
export class SpecialtyFormDialogComponent {
  private readonly fb      = inject(FormBuilder);
  private readonly service = inject(SpecialtiesService);
  private readonly toast   = inject(ToastService);

  visible      = model(false);
  mode         = input<DialogMode>('create');
  specialtyData = input<Partial<SpecialtyResponse> | null>(null);

  saved  = output<void>();
  saving = signal(false);

  form = this.fb.nonNullable.group({
    name:        ['', Validators.required],
    description: this.fb.control<string | null>(null),
  });

  readonly isCreate    = computed(() => this.mode() === 'create');
  readonly dialogTitle = computed(() => this.isCreate() ? 'Nueva Especialidad' : 'Editar Especialidad');
  readonly dialogIcon  = computed(() => this.isCreate() ? 'pi pi-plus-circle' : 'pi pi-pencil');

  private readonly syncForm = effect(() => {
    const data = this.specialtyData();
    if (data) {
      this.form.patchValue(data);
    } else {
      this.form.reset();
    }
  });

  private close(): void {
    this.form.reset();
    this.visible.set(false);
  }

  cancel(): void { this.close(); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload  = this.form.getRawValue();
    const id       = this.specialtyData()?.id;
    const request$ = this.isCreate()
      ? this.service.createSpecialty(payload)
      : this.service.updateSpecialty(id!, payload);

    this.saving.set(true);
    request$.subscribe({
      next: () => {
        this.toast.success(this.isCreate() ? 'Especialidad creada.' : 'Especialidad actualizada.');
        this.saving.set(false);
        this.close();
        this.saved.emit();
      },
      error: () => {
        this.toast.error('No se pudo guardar la especialidad.');
        this.saving.set(false);
      },
    });
  }
}
