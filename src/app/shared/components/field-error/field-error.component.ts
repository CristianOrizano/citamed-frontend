import { Component } from '@angular/core';

@Component({
  selector: 'app-field-error',
  standalone: true,
  styles: [':host { display: contents; }'],
  template: `
    <small class="flex items-center gap-1.5 text-red-500 text-[0.76rem] font-medium ">
      <i class="pi pi-exclamation-circle"></i>
      <ng-content />
    </small>
  `,
})
export class FieldErrorComponent {}
