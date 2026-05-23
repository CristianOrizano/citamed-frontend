import { Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import {
  DialogMode,
  Doctor,
  DoctorRequest,
  SpecialtyOption,
} from '../../interfaces/doctor.interface';
import { FieldErrorComponent } from '../../../../../shared/components/field-error/field-error.component';
import { DoctorsService } from '../../services/doctors.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-doctor-form-dialog',
  imports: [PRIMENG_OVERLAY, PRIMENG_FORMS, PRIMENG_UI, FieldErrorComponent],
  templateUrl: './doctor-form-dialog.component.html',
  styleUrl: './doctor-form-dialog.component.css',
})
export class DoctorFormDialogComponent {
  private readonly fb      = inject(FormBuilder);
  private readonly service = inject(DoctorsService);
  private readonly toast   = inject(ToastService);

  visible    = model(false);
  mode       = input<DialogMode>('create');
  doctorData = input<Partial<Doctor> | null>(null);

  saved  = output<void>();
  saving = signal(false);

  specialtyOptions = input<SpecialtyOption[]>([]);

  form = this.fb.nonNullable.group({
    firstName:       ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName:        ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    licenseNumber:   ['', [Validators.required, Validators.pattern(/^\d{1,8}$/)]],
    phone:           ['', [Validators.pattern(/^(9\d{8})?$/)]],
    consultationFee: [0, [Validators.required, Validators.min(1), Validators.max(1000)]],
    bio:             ['', [Validators.maxLength(500)]],
    avatarUrl:       [''],
    specialtyIds:    [[] as string[], Validators.required],
  });

  readonly isCreate    = computed(() => this.mode() === 'create');
  readonly isReadonly  = computed(() => this.mode() === 'view');
  readonly dialogTitle = computed(() => ({ create: 'Nuevo Médico', edit: 'Editar Médico', view: 'Detalle del Médico' })[this.mode()]);
  readonly dialogIcon  = computed(() => ({ create: 'pi pi-user-plus', edit: 'pi pi-pencil', view: 'pi pi-user' })[this.mode()]);

  private readonly syncForm = effect(() => {
    const data = this.doctorData();
    const mode = this.mode();

    if (data) {
      this.form.patchValue({
        ...data,
        specialtyIds: data.specialties?.map(s => s.id) ?? [],
      });
    } else {
      this.form.reset();
    }

    if (mode === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }
  });

  private close(): void {
    this.form.reset();
    this.visible.set(false);
  }

  cancel(): void { this.close(); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload  = this.form.getRawValue() as DoctorRequest;
    const id       = this.doctorData()?.id;
    const request$ = this.isCreate()
      ? this.service.createDoctor(payload)
      : this.service.updateDoctor(id!, payload);

    this.saving.set(true);
    request$.subscribe({
      next: () => {
        this.toast.success(this.isCreate() ? 'Médico registrado.' : 'Médico actualizado.');
        this.saving.set(false);
        this.close();
        this.saved.emit();
      },
      error: () => {
        this.toast.error('No se pudo guardar el médico.');
        this.saving.set(false);
      },
    });
  }
}
