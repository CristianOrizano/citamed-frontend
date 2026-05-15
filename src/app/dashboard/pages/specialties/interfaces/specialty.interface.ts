import {
  PaginatedRequest,
  PaginatedResponse,
} from '../../../../shared/interfaces/pagination.interface';

export type DialogMode = 'create' | 'edit';

export interface SpecialtyRequest {
  name: string;
  description: string | null;
}

export interface SpecialtyFilterRequest extends PaginatedRequest {
  name?: string;
  active?: boolean;
}

export interface SpecialtyResponse {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SpecialtiesPage = PaginatedResponse<SpecialtyResponse>;
