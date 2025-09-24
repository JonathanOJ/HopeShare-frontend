import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-global-filter',
  templateUrl: './global-filter.component.html',
  styleUrls: ['./global-filter.component.scss'],
})
export class GlobalFilterComponent {
  @Input() table: Table | undefined;

  onGlobalFilter(event: Event) {
    if (!this.table) {
      return;
    }
    this.table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
