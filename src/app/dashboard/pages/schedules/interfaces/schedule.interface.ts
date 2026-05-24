// GET /api/doctors/all
export interface DoctorResponse {
  id: string;
  fullName: string;
  specialties: { id: string; name: string }[];
}

// Dropdown-ready (DoctorResponse + label calculado)
export type DoctorOption = DoctorResponse & { label: string };

// GET /api/schedules/doctor/{doctorId}
export interface ScheduleResponse {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// PUT /api/schedules/doctor/{doctorId} — bulk save semanal
export interface ScheduleSaveRequest {
  slotDurationMinutes: number;
  days: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    active: boolean;
  }[];
}

// UI-only — sin API aún
export interface BlockedDate {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
}
