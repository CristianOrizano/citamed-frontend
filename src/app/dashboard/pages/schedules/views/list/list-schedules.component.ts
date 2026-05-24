import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { PRIMENG_UI } from '../../../../../shared/primeNG/primeng-ui';
import { PRIMENG_OVERLAY } from '../../../../../shared/primeNG/primeng-overlay';
import { PRIMENG_FORMS } from '../../../../../shared/primeNG/primeng-forms';
import { SchedulesService } from '../../services/schedules.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { BlockedDate, DoctorOption, ScheduleSaveRequest } from '../../interfaces/schedule.interface';

interface DayState {
  startTime: string;
  endTime: string;
  active: boolean;
}

const WEEK_DAYS = [
  { number: 1, name: 'Lunes',     short: 'LUN' },
  { number: 2, name: 'Martes',    short: 'MAR' },
  { number: 3, name: 'Miércoles', short: 'MIÉ' },
  { number: 4, name: 'Jueves',    short: 'JUE' },
  { number: 5, name: 'Viernes',   short: 'VIE' },
  { number: 6, name: 'Sábado',    short: 'SÁB' },
  { number: 7, name: 'Domingo',   short: 'DOM' },
];

@Component({
  selector: 'app-list-schedules',
  imports: [PRIMENG_UI, PRIMENG_OVERLAY, PRIMENG_FORMS, NgClass],
  templateUrl: './list-schedules.component.html',
  styleUrl: './list-schedules.component.css',
})
export class ListSchedulesComponent {
  private readonly service = inject(SchedulesService);
  private readonly toast   = inject(ToastService);
  private readonly fb      = inject(FormBuilder);

  readonly WEEK_DAYS   = WEEK_DAYS;
  readonly slotOptions = [15, 30, 45, 60];

  selectedDoctorId = signal<string | null>(null);
  saving           = signal(false);
  dayStates        = signal<DayState[]>(
    WEEK_DAYS.map(() => ({ startTime: '', endTime: '', active: false })),
  );
  slotDuration = signal(30);
  blockedDates = signal<BlockedDate[]>([]);

  readonly doctorOptions = toSignal(
    this.service.getDoctorOptions().pipe(
      map((docs): DoctorOption[] =>
        docs.map((d) => ({
          ...d,
          label: `Dr. ${d.fullName}${d.specialties[0] ? ' — ' + d.specialties[0].name : ''}`,
        })),
      ),
    ),
    { initialValue: [] as DoctorOption[] },
  );

  readonly selectedDoctor = computed(
    () => this.doctorOptions().find((d) => d.id === this.selectedDoctorId()) ?? null,
  );

  readonly selectedDoctorInitials = computed(() => {
    const d = this.selectedDoctor();
    if (!d) return '';
    const parts = d.fullName.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  });

  readonly slotCounts = computed(() =>
    this.dayStates().map((d) => {
      if (!d.startTime || !d.endTime) return null;
      const [sh, sm] = d.startTime.split(':').map(Number);
      const [eh, em] = d.endTime.split(':').map(Number);
      const total = eh * 60 + em - (sh * 60 + sm);
      if (total <= 0) return null;
      return Math.floor(total / this.slotDuration());
    }),
  );

  blockedForm = this.fb.nonNullable.group({
    fromDate: ['', Validators.required],
    toDate:   ['', Validators.required],
    reason:   ['', Validators.required],
  });

  onDoctorChange(id: string | null): void {
    this.selectedDoctorId.set(id);
    if (!id) {
      this.resetState();
      return;
    }

    this.service.getSchedulesByDoctor(id).subscribe((schedules) => {
      this.slotDuration.set(schedules[0]?.slotDurationMinutes ?? 30);
      this.dayStates.set(
        WEEK_DAYS.map((d) => {
          const s = schedules.find((sch) => sch.dayOfWeek === d.number);
          return {
            startTime: s?.startTime ?? '',
            endTime:   s?.endTime   ?? '',
            active:    s?.active    ?? false,
          };
        }),
      );
    });
  }

  private resetState(): void {
    this.dayStates.set(WEEK_DAYS.map(() => ({ startTime: '', endTime: '', active: false })));
    this.slotDuration.set(30);
    this.blockedDates.set([]);
  }

  updateDay(index: number, field: keyof DayState, value: string | boolean): void {
    this.dayStates.update((states) =>
      states.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  }

  saveChanges(): void {
    const doctorId = this.selectedDoctorId();
    if (!doctorId) return;

    const states = this.dayStates();
    const hasInvalidActive = states.some((s) => s.active && (!s.startTime || !s.endTime));
    if (hasInvalidActive) {
      this.toast.error('Los días activos deben tener horario de inicio y fin.');
      return;
    }

    const payload: ScheduleSaveRequest = {
      slotDurationMinutes: this.slotDuration(),
      days: WEEK_DAYS
        .map((d, i) => ({ dayOfWeek: d.number, ...states[i] }))
        .filter((d) => d.startTime && d.endTime)
        .map(({ dayOfWeek, startTime, endTime, active }) => ({
          dayOfWeek,
          startTime,
          endTime,
          active,
        })),
    };

    this.saving.set(true);
    this.service.saveSchedules(doctorId, payload).subscribe({
      next: () => {
        this.toast.success('Horario guardado correctamente.');
        this.saving.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error(err.error?.message ?? 'Error al guardar el horario.');
        this.saving.set(false);
      },
    });
  }

  addBlockedDate(): void {
    if (this.blockedForm.invalid) {
      this.blockedForm.markAllAsTouched();
      return;
    }
    const { fromDate, toDate, reason } = this.blockedForm.getRawValue();
    this.blockedDates.update((list) => [
      ...list,
      { id: `bd-${Date.now()}`, fromDate, toDate, reason },
    ]);
    this.blockedForm.reset();
    this.toast.success('Bloqueo agregado.');
  }

  removeBlockedDate(id: string): void {
    this.blockedDates.update((list) => list.filter((b) => b.id !== id));
  }

  formatBlockedDate(from: string, to: string): string {
    const d1 = new Date(from + 'T00:00:00');
    const d2 = new Date(to + 'T00:00:00');
    if (from === to)
      return d1.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
    const fromStr = d1.toLocaleDateString('es-PE', { day: 'numeric', month: 'long' });
    const toStr   = d2.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${fromStr} — ${toStr}`;
  }

  calcDays(from: string, to: string): number {
    const d1 = new Date(from + 'T00:00:00');
    const d2 = new Date(to + 'T00:00:00');
    return Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1;
  }

  getDayBadgeClass(number: number): string {
    const map: Record<number, string> = {
      0: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
      1: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
      2: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
      3: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
      4: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
      5: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
      6: 'bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400',
    };
    return map[number] ?? '';
  }
}
