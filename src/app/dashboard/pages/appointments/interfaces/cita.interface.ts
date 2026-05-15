export type DialogMode = 'view' | 'cancel';

export interface Cita {
  id: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  checkedInAt: string | null;
}
