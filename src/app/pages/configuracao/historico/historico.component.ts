import { Component, Input } from '@angular/core';
import { StatusDoacao } from '../../../shared/enums/StatusDoacao.enum';
import { Doacao } from '../../../shared/models/doacao.model';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
})
export class HistoricoComponent {
  @Input() userIsCompany: boolean = false;

  depositos = [];

  doacoes: Doacao[] = [];
}

