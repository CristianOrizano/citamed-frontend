export type DialogMode = 'create' | 'edit' | 'view';

export interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  bio: string;
  consultationFee: number;
  avatarUrl: string;
  isActive: boolean;
  specialties: string[];
}

export interface DoctorsPage {
  totalElements: number;
  doctors: Doctor[];
}
