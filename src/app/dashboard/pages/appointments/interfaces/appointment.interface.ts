import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../../../shared/interfaces/pagination.interface';

export type AppointmentStatus =
  | 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN'
  | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface AppointmentResponse {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;       // yyyy-MM-dd
  startTime: string;  // HH:mm
  status: AppointmentStatus;
  reason: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilterRequest extends PaginatedRequest {
  patientId?: string;
  doctorId?: string | null;
  status?: AppointmentStatus | null;
  date?: string;
}

export type AppointmentsPage = PaginatedResponse<AppointmentResponse>;

export interface DoctorOption {
  id: string;
  fullName: string;
  specialties: { id: string; name: string }[];
}
