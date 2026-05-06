import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Usuario } from '../interfaces/usuario.interface';

interface ApiUser {
  idUser: number;
  username: string;
  givenName: string;
  familyName: string;
  additionalFamilyName: string;
  documentNumber: string;
  email: string;
  isActive: boolean;
  profileName: string;
  profileAssign: boolean;
}

export interface PageInfo {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalElements: number;
}

export interface UsersPage {
  listInfo: PageInfo;
  usuarios: Usuario[];
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/useraitutor`;

  getUsers(page: number, size: number): Observable<UsersPage> {
    return this.http
      .get<{ responseInfo: unknown; result: { listInfo: PageInfo; users: ApiUser[] } }>(
        `${this.baseUrl}/users`,
        { headers: { 'x-page': String(page), 'x-size': String(size) } }
      )
      .pipe(
        map((res) => ({
          listInfo: res.result.listInfo,
          usuarios: res.result.users.map((u) => ({
            id: u.idUser,
            username: u.username,
            nombre: u.givenName,
            apellidoPaterno: u.familyName,
            apellidoMaterno: u.additionalFamilyName,
            dni: u.documentNumber,
            email: u.email,
            perfil: u.profileName,
            permisos: '',
            area: '',
            territorio: '',
            region: '',
            estado: (u.isActive ? 'ACTIVO' : 'INACTIVO') as 'ACTIVO' | 'INACTIVO',
          })),
        }))
      );
  }
}
