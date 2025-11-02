import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Relatorio } from '../../../../../shared/models/relatorio.model';

@Component({
  selector: 'app-contabil',
  templateUrl: './contabil.component.html',
  styleUrl: './contabil.component.css',
})
export class ContabilComponent {
  @Input() relatorios: Relatorio[] = [];
  @Output() deleteRelatorio = new EventEmitter<Relatorio>();

  visualizarRelatorio(relatorio: Relatorio) {
    window.open(relatorio.file_url, '_blank');
  }

  deletarRelatorio(relatorio: Relatorio) {
    this.deleteRelatorio.emit(relatorio);
  }
}

