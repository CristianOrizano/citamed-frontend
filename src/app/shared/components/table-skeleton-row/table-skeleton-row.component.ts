import { Component, computed, input } from '@angular/core';
import { PRIMENG_UI } from '../../primeNG/primeng-ui';

@Component({
  selector: 'tr[appTableSkeletonRow]',
  imports: [PRIMENG_UI],
  template: `
    @for (col of cols(); track $index) {
      <td><p-skeleton height="0.8rem" styleClass="w-full" /></td>
    }
  `,
})
export class TableSkeletonRowComponent {
  columns = input(5);
  cols = computed(() => Array(this.columns()).fill(null));
}
