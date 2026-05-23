import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../../../shared/interfaces/pagination.interface';

export type DialogMode = 'create' | 'edit' | 'view';

export interface SpecialtyOption {
  id: string;
  name: string;
}

export interface DoctorRequest {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  bio: string;
  consultationFee: number;
  avatarUrl: string;
  specialtyIds: string[];
}

export interface DoctorFilterRequest extends PaginatedRequest {
  name?: string;
  licenseNumber?: string;
  specialtyId?: string;
  active?: boolean | null;
}

export interface Doctor {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  bio: string;
  consultationFee: number;
  avatarUrl: string;
  active: boolean;
  specialties: SpecialtyOption[];
  createdAt: string;
  updatedAt: string;
}

export type DoctorsPage = PaginatedResponse<Doctor>;
