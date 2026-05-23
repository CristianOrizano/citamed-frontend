import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Doctor,
  DoctorFilterRequest,
  DoctorRequest,
  DoctorsPage,
  SpecialtyOption,
} from '../interfaces/doctor.interface';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/doctors`;

  getSpecialtyOptions(): Observable<SpecialtyOption[]> {
    return this.http.get<SpecialtyOption[]>(`${environment.apiUrl}/api/specialties/all`);
  }

  getDoctors(filter: DoctorFilterRequest): Observable<DoctorsPage> {
    const params = Object.entries(filter)
      .filter(([, v]) => v != null && v !== '')
      .reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());
    return this.http.get<DoctorsPage>(this.baseUrl, { params });
  }

  createDoctor(payload: DoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(this.baseUrl, payload);
  }

  updateDoctor(id: string, payload: DoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}/${id}`, payload);
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
