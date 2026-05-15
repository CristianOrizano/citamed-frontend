import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Doctor, DoctorsPage } from '../interfaces/doctor.interface';

const MOCK: Doctor[] = [
  {
    id: 'a1', userId: 'u1', firstName: 'Carlos', lastName: 'Ramírez',
    licenseNumber: 'CMP-12345', phone: '+51 999 111 222',
    bio: 'Cardiólogo con 15 años de experiencia en enfermedades cardiovasculares.',
    consultationFee: 120, avatarUrl: '', isActive: true,
    specialties: ['Cardiología'],
  },
  {
    id: 'b2', userId: 'u2', firstName: 'María', lastName: 'Torres',
    licenseNumber: 'CMP-67890', phone: '+51 998 222 333',
    bio: 'Especialista en pediatría y neonatología con enfoque preventivo.',
    consultationFee: 90, avatarUrl: '', isActive: true,
    specialties: ['Pediatría', 'Neonatología'],
  },
  {
    id: 'c3', userId: 'u3', firstName: 'Jorge', lastName: 'Mendoza',
    licenseNumber: 'CMP-11223', phone: '+51 997 333 444',
    bio: 'Dermatólogo con enfoque en tratamientos estéticos y médicos.',
    consultationFee: 100, avatarUrl: '', isActive: false,
    specialties: ['Dermatología'],
  },
  {
    id: 'd4', userId: 'u4', firstName: 'Ana', lastName: 'Gutiérrez',
    licenseNumber: 'CMP-44556', phone: '+51 996 444 555',
    bio: 'Neuróloga especializada en enfermedades del sistema nervioso central.',
    consultationFee: 150, avatarUrl: '', isActive: true,
    specialties: ['Neurología'],
  },
  {
    id: 'e5', userId: 'u5', firstName: 'Luis', lastName: 'Vargas',
    licenseNumber: 'CMP-77889', phone: '+51 995 555 666',
    bio: 'Ortopedista y traumatólogo con experiencia en cirugía de columna.',
    consultationFee: 130, avatarUrl: '', isActive: true,
    specialties: ['Ortopedia', 'Traumatología'],
  },
  {
    id: 'f6', userId: 'u6', firstName: 'Rosa', lastName: 'Castillo',
    licenseNumber: 'CMP-99001', phone: '+51 994 666 777',
    bio: 'Ginecóloga obstetra con más de 20 años de trayectoria clínica.',
    consultationFee: 110, avatarUrl: '', isActive: true,
    specialties: ['Ginecología', 'Obstetricia'],
  },
];

@Injectable({ providedIn: 'root' })
export class DoctorsService {

  getDoctors(page: number, size: number): Observable<DoctorsPage> {
    const start = (page - 1) * size;
    return of({
      totalElements: MOCK.length,
      doctors: MOCK.slice(start, start + size),
    });
  }
}
