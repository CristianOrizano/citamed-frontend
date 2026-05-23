import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BlockedDate, DoctorOption, Schedule } from '../interfaces/horario.interface';

@Injectable({ providedIn: 'root' })
export class HorariosService {
  private readonly mockDoctors: DoctorOption[] = [
    { id: 'doc-001', firstName: 'Carlos', lastName: 'Mendoza', specialty: 'Cardiología'   },
    { id: 'doc-002', firstName: 'Ana',    lastName: 'García',  specialty: 'Pediatría'     },
    { id: 'doc-003', firstName: 'Luis',   lastName: 'Ramírez', specialty: 'Traumatología' },
  ];

  // dayOfWeek: 0 = Lunes, 1 = Martes, …, 6 = Domingo
  private readonly mockSchedules: Record<string, Schedule[]> = {
    'doc-001': [
      { id: 'sch-001', doctorId: 'doc-001', dayOfWeek: 0, startTime: '08:00', endTime: '17:00', slotDurationMinutes: 30, active: true },
      { id: 'sch-002', doctorId: 'doc-001', dayOfWeek: 1, startTime: '08:00', endTime: '17:00', slotDurationMinutes: 30, active: true },
      { id: 'sch-003', doctorId: 'doc-001', dayOfWeek: 2, startTime: '08:00', endTime: '13:00', slotDurationMinutes: 30, active: true },
      { id: 'sch-004', doctorId: 'doc-001', dayOfWeek: 4, startTime: '08:00', endTime: '17:00', slotDurationMinutes: 30, active: true },
    ],
    'doc-002': [
      { id: 'sch-005', doctorId: 'doc-002', dayOfWeek: 1, startTime: '07:00', endTime: '11:00', slotDurationMinutes: 30, active: true },
      { id: 'sch-006', doctorId: 'doc-002', dayOfWeek: 3, startTime: '15:00', endTime: '19:00', slotDurationMinutes: 30, active: true },
      { id: 'sch-007', doctorId: 'doc-002', dayOfWeek: 5, startTime: '08:00', endTime: '12:00', slotDurationMinutes: 60, active: true },
    ],
    'doc-003': [],
  };

  private readonly mockBlockedDates: Record<string, BlockedDate[]> = {
    'doc-001': [
      { id: 'bd-001', fromDate: '2025-05-15', toDate: '2025-05-15', reason: 'Vacaciones'     },
      { id: 'bd-002', fromDate: '2025-05-20', toDate: '2025-05-25', reason: 'Congreso médico' },
      { id: 'bd-003', fromDate: '2025-06-01', toDate: '2025-06-01', reason: 'Día feriado'    },
    ],
    'doc-002': [],
    'doc-003': [],
  };

  getDoctorOptions(): Observable<DoctorOption[]> {
    return of([...this.mockDoctors]);
  }

  getSchedulesByDoctor(doctorId: string): Observable<Schedule[]> {
    return of([...(this.mockSchedules[doctorId] ?? [])]);
  }

  getBlockedDatesByDoctor(doctorId: string): Observable<BlockedDate[]> {
    return of([...(this.mockBlockedDates[doctorId] ?? [])]);
  }
}
