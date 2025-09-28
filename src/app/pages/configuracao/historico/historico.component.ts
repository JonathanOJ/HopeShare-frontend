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

  doacoes: Doacao[] = [
    {
      donation_id: 'don1',
      campanha_id: 'camp1',
      user_id: 'user1',
      value: 100.0,
      status: StatusDoacao.APPROVED,
      created_at: new Date('2025-08-10'),
      payment_method: 'Cartão de Crédito',
    },
    {
      donation_id: 'don2',
      campanha_id: 'camp2',
      user_id: 'user1',
      value: 50.0,
      status: StatusDoacao.PENDING,
      created_at: new Date('2024-02-15'),
      payment_method: 'Pix',
    },
  ];
}

