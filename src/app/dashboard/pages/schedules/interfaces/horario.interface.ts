export type DialogMode = 'create' | 'edit';

export interface DoctorOption {
  id: string;
  firstName: string;
  lastName: string;
  specialty?: string;
}

export interface Schedule {
  id: string;
  doctorId: string;
  dayOfWeek: number;  // 0 = Lunes … 6 = Domingo  (BD: 0–6)
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  active: boolean;
}

export interface ScheduleRequest {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
}

export interface BlockedDate {
  id: string;
  fromDate: string;  // "yyyy-MM-dd"
  toDate: string;    // "yyyy-MM-dd"
  reason: string;
}
