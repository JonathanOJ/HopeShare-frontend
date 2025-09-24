import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css'],
})
export class HistoricoComponent {
  @Input() userIsCompany: boolean = false;

  depositos = [
    {
      id: 1,
      nomeCampanha: 'Campanha Solidária',
      valor: 2500,
      status: 'Concluído',
      data: new Date(),
      observacaoAdmin: 'Verificar documentação pendente',
    },
    {
      id: 2,
      nomeCampanha: 'Doe Agora',
      valor: 1200,
      status: 'Em Análise',
      data: new Date(),
    },
  ];

  doacoes = [
    {
      id: 1,
      valor: 200,
      nomeCampanha: 'Campanha Solidária',
      tipoPagamento: 'Cartão de Crédito',
      status: 'Recusado',
      data: new Date(),
    },
    {
      id: 2,
      valor: 500,
      nomeCampanha: 'Doe Agora',
      tipoPagamento: 'Pix',
      status: 'Pendente',
      data: new Date(),
    },
  ];
}

