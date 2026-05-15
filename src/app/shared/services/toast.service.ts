import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly ms = inject(MessageService);

  success(detail: string): void { this.ms.add({ severity: 'success', summary: 'Éxito',  detail }); }
  error(detail: string):   void { this.ms.add({ severity: 'error',   summary: 'Error',  detail }); }
  info(detail: string):    void { this.ms.add({ severity: 'info',    summary: 'Info',   detail }); }
  warn(detail: string):    void { this.ms.add({ severity: 'warn',    summary: 'Aviso',  detail }); }
}
