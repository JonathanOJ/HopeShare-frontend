import { Component, Input } from '@angular/core';
import { Relatorio } from '../../../../../shared/models/relatorio.model';

@Component({
  selector: 'app-contabil',
  templateUrl: './contabil.component.html',
  styleUrl: './contabil.component.css',
})
export class ContabilComponent {
  @Input() relatorios: Relatorio[] = [];
}

