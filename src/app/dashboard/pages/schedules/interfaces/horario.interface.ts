export type DialogMode = 'create' | 'edit' | 'view';

export interface Horario {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
}
