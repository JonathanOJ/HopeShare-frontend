import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Relatorio } from '../../../../../shared/models/relatorio.model';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.css',
})
export class FinanceiroComponent {
  @Input() relatorios: Relatorio[] = [];
  @Output() deleteRelatorio = new EventEmitter<Relatorio>();

  visualizarRelatorio(relatorio: Relatorio) {
    window.open(relatorio.file_url, '_blank');
  }

  deletarRelatorio(relatorio: Relatorio) {
    this.deleteRelatorio.emit(relatorio);
  }
}

