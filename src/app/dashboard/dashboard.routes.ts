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
        path: 'medicos',
        loadComponent: () =>
          import('./pages/doctors/views/list/list-doctors.component').then(
            (m) => m.ListMedicosComponent,
          ),
      },
      {
        path: 'especialidades',
        loadComponent: () =>
          import('./pages/specialties/views/list/list-specialties.component').then(
            (m) => m.ListEspecialidadesComponent,
          ),
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./pages/appointments/views/list/list-citas.component').then(
            (m) => m.ListCitasComponent,
          ),
      },
      {
        path: 'horarios',
        loadComponent: () =>
          import('./pages/schedules/views/list/list-horarios.component').then(
            (m) => m.ListHorariosComponent,
          ),
      },
      {
        path: 'metricas',
        loadComponent: () =>
          import('./pages/metrics/views/list/list-metricas.component').then(
            (m) => m.ListMetricasComponent,
          ),
      },
    ],
  },
];
