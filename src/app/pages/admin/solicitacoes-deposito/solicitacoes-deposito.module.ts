import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SolicitacoesDepositoRoutingModule } from './solicitacoes-deposito-routing.module';
import { SolicitacoesDepositoComponent } from './solicitacoes-deposito.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [SolicitacoesDepositoComponent],
  imports: [CommonModule, FormsModule, SolicitacoesDepositoRoutingModule, SharedModule],
})
export class SolicitacoesDepositoModule {}
