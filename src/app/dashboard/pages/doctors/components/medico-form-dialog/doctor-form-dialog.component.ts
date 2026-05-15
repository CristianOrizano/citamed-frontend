import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { DialogMode, Doctor } from '../../interfaces/doctor.interface';

@Component({
  selector: 'app-doctor-form-dialog',
  imports: [PRIMENG_OVERLAY, PRIMENG_FORMS, PRIMENG_UI],
  templateUrl: './doctor-form-dialog.component.html',
  styleUrl: './doctor-form-dialog.component.css',
})
export class DoctorFormDialogComponent {
  private fb = inject(FormBuilder);

  visible    = model(false);
  mode       = input<DialogMode>('create');
  doctorData = input<Partial<Doctor> | null>(null);

  saved = output<Partial<Doctor>>();

  readonly specialtyOptions = [
    'Cardiología', 'Dermatología', 'Ginecología', 'Neurología',
    'Neonatología', 'Obstetricia', 'Ortopedia', 'Pediatría', 'Traumatología',
  ];

  form = this.fb.nonNullable.group({
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(6)]],
    firstName:       ['', Validators.required],
    lastName:        ['', Validators.required],
    licenseNumber:   ['', Validators.required],
    phone:           [''],
    consultationFee: [0, [Validators.required, Validators.min(0)]],
    bio:             [''],
    specialties:     [[] as string[]],
  });

  constructor() {
    effect(() => {
      const data = this.doctorData();
      const mode = this.mode();

      if (data) {
        this.form.patchValue({
          firstName:       data.firstName       ?? '',
          lastName:        data.lastName        ?? '',
          licenseNumber:   data.licenseNumber   ?? '',
          phone:           data.phone           ?? '',
          consultationFee: data.consultationFee ?? 0,
          bio:             data.bio             ?? '',
          specialties:     data.specialties     ?? [],
          email:           '',
          password:        '',
        });
      } else {
        this.form.reset({ consultationFee: 0, specialties: [] });
      }

      if (mode === 'view') {
        this.form.disable();
      } else {
        this.form.enable();
        if (mode === 'edit') {
          this.form.get('email')?.disable();
          this.form.get('password')?.disable();
        }
      }
    });
  }

  get isCreate()  { return this.mode() === 'create'; }
  get isReadonly() { return this.mode() === 'view'; }

  get dialogTitle(): string {
    return { create: 'Nuevo Médico', edit: 'Editar Médico', view: 'Detalle del Médico' }[this.mode()];
  }

  get dialogIcon(): string {
    return { create: 'pi pi-user-plus', edit: 'pi pi-pencil', view: 'pi pi-user' }[this.mode()];
  }

  cancel(): void { this.visible.set(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saved.emit(this.form.getRawValue() as Partial<Doctor>);
    this.visible.set(false);
  }
}
