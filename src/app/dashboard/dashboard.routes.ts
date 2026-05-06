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
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'candidatos',
        loadComponent: () =>
          import('./pages/candidatos/candidatos.component').then(
            (m) => m.CandidatosComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/views/list/list-users.component').then(
            (m) => m.ListUsersComponent,
          ),
      },
    ],
  },
];
