import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./pages/doctors/views/list/list-doctors.component').then(
            (m) => m.ListMedicosComponent,
          ),
      },
      {
        path: 'specialties',
        loadComponent: () =>
          import('./pages/specialties/views/list/list-specialties.component').then(
            (m) => m.ListSpecialtiesComponent,
          ),
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./pages/appointments/views/list/list-appointments.component').then(
            (m) => m.ListAppointmentsComponent,
          ),
      },
      {
        path: 'schedules',
        loadComponent: () =>
          import('./pages/schedules/views/list/list-schedules.component').then(
            (m) => m.ListSchedulesComponent,
          ),
      },
      {
        path: 'metrics',
        loadComponent: () =>
          import('./pages/metrics/views/list/list-metricas.component').then(
            (m) => m.ListMetricasComponent,
          ),
      },
    ],
  },
];
