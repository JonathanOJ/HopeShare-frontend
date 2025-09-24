import { Component, Input } from '@angular/core';
import { getStatusClass } from '../../../../../shared/utils/get-status-class.utils';

@Component({
  selector: 'app-doacao',
  templateUrl: './doacao.component.html',
  styles: ``,
})
export class DoacaoComponent {
  @Input() doacoes: any[] = [];

  getStatusColor(status: string): string {
    return getStatusClass(status);
  }
}

