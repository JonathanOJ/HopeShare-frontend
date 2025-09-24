import { Component, Input } from '@angular/core';
import { getStatusClass } from '../../../../../shared/utils/get-status-class.utils';

@Component({
  selector: 'app-deposito',
  templateUrl: './deposito.component.html',
  styleUrls: ['./deposito.component.css'],
})
export class DepositoComponent {
  @Input() depositos: any[] = [];

  getStatusColor(status: string): string {
    return getStatusClass(status);
  }
}

