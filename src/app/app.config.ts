import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ThemeService } from './shared/services/theme.service';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

const BluePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#e6f2fa',
      100: '#cce5f5',
      200: '#99cbeb',
      300: '#4da6d6',
      400: '#0077bc',
      500: '#005b94',
      600: '#004a7a',
      700: '#003a60',
      800: '#002a47',
      900: '#001a2e',
      950: '#000d17',
    },
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: BluePreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideAppInitializer(() => inject(ThemeService).init()),
    MessageService,
  ]
};
