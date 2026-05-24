import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AppointmentFilterRequest,
  AppointmentsPage,
  DoctorOption,
} from '../interfaces/appointment.interface';

@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api`;

  getAppointments(filter: AppointmentFilterRequest): Observable<AppointmentsPage> {
    const params = Object.entries(filter)
      .filter(([, v]) => v != null && v !== '')
      .reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());
    return this.http.get<AppointmentsPage>(`${this.baseUrl}/appointments`, { params });
  }

  getDoctorOptions(): Observable<DoctorOption[]> {
    return this.http.get<DoctorOption[]>(`${this.baseUrl}/doctors/all`);
  }
}
