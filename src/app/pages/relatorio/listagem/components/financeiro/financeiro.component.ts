import { Component, Input } from '@angular/core';
import { Relatorio } from '../../../../../shared/models/relatorio.model';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.css',
})
export class FinanceiroComponent {
  @Input() relatorios: Relatorio[] = [];

  visualizarRelatorio(relatorio: Relatorio) {
    // Lógica para visualizar o relatório financeiro
    window.open(relatorio.url, '_blank');
  }
}

