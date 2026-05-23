import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { DialogMode, Schedule, ScheduleRequest } from '../../interfaces/horario.interface';
import { FieldErrorComponent } from '../../../../../shared/components/field-error/field-error.component';

const SLOT_OPTIONS = [
  { label: '15 minutos', value: 15 },
  { label: '20 minutos', value: 20 },
  { label: '30 minutos', value: 30 },
  { label: '45 minutos', value: 45 },
  { label: '60 minutos', value: 60 },
];

const DAY_NAMES: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
  4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
};

@Component({
  selector: 'app-horario-form-dialog',
  imports: [PRIMENG_OVERLAY, PRIMENG_FORMS, PRIMENG_UI, FieldErrorComponent],
  templateUrl: './horario-form-dialog.component.html',
})
export class HorarioFormDialogComponent {
  private readonly fb = inject(FormBuilder);

  visible      = model(false);
  mode         = input<DialogMode>('create');
  scheduleData = input<Partial<Schedule> | null>(null);

  saved = output<ScheduleRequest>();

  readonly slotOptions = SLOT_OPTIONS;

  form = this.fb.nonNullable.group({
    startTime:           ['', Validators.required],
    endTime:             ['', Validators.required],
    slotDurationMinutes: [30, Validators.required],
  });

  readonly dayName = computed(() => {
    const n = this.scheduleData()?.dayOfWeek;
    return n ? (DAY_NAMES[n] ?? '') : '';
  });

  readonly dialogTitle = computed(() =>
    this.mode() === 'create' ? `Configurar ${this.dayName()}` : `Editar ${this.dayName()}`
  );

  readonly dialogIcon = computed(() =>
    this.mode() === 'create' ? 'pi pi-plus-circle' : 'pi pi-pencil'
  );

  private readonly syncForm = effect(() => {
    const data = this.scheduleData();
    this.form.patchValue({
      startTime:           data?.startTime           ?? '',
      endTime:             data?.endTime             ?? '',
      slotDurationMinutes: data?.slotDurationMinutes ?? 30,
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  });

  cancel(): void {
    this.visible.set(false);
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { startTime, endTime, slotDurationMinutes } = this.form.getRawValue();
    const data = this.scheduleData();
    this.saved.emit({
      doctorId:            data?.doctorId  ?? '',
      dayOfWeek:           data?.dayOfWeek ?? 1,
      startTime,
      endTime,
      slotDurationMinutes,
    });
    this.visible.set(false);
  }
}
