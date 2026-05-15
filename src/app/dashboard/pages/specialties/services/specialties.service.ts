import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  SpecialtyResponse,
  SpecialtiesPage,
  SpecialtyFilterRequest,
  SpecialtyRequest,
} from '../interfaces/specialty.interface';

@Injectable({ providedIn: 'root' })
export class SpecialtiesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/specialties`;

  getSpecialties(filter: SpecialtyFilterRequest): Observable<SpecialtiesPage> {
    const params = Object.entries(filter)
      .filter(([, v]) => v != null && v !== '') // Limpia null, undefined y ""
      .reduce((p, [k, v]) => p.set(k, String(v)), new HttpParams());

    return this.http.get<SpecialtiesPage>(this.baseUrl, { params });
  }

  getSpecialtyById(id: string): Observable<SpecialtyResponse> {
    return this.http.get<SpecialtyResponse>(`${this.baseUrl}/${id}`);
  }

  createSpecialty(payload: SpecialtyRequest): Observable<SpecialtyResponse> {
    return this.http.post<SpecialtyResponse>(this.baseUrl, payload);
  }

  updateSpecialty(id: string, payload: SpecialtyRequest): Observable<SpecialtyResponse> {
    return this.http.put<SpecialtyResponse>(`${this.baseUrl}/${id}`, payload);
  }

  deleteSpecialty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
