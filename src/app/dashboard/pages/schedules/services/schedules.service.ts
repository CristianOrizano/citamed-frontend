import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DoctorResponse, ScheduleResponse, ScheduleSaveRequest } from '../interfaces/schedule.interface';

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`;

  getDoctorOptions(): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>(`${this.baseUrl}/doctors/all`);
  }

  getSchedulesByDoctor(doctorId: string): Observable<ScheduleResponse[]> {
    return this.http.get<ScheduleResponse[]>(`${this.baseUrl}/schedules/doctor/${doctorId}`);
  }

  saveSchedules(doctorId: string, payload: ScheduleSaveRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/schedules/doctor/${doctorId}`, payload);
  }
}
