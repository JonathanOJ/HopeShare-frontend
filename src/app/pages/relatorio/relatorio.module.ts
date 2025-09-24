import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatorioRoutingModule } from './relatorio-routing.module';
import { FinanceiroComponent } from './listagem/components/financeiro/financeiro.component';
import { SharedModule } from '../../shared/shared.module';
import { ListagemComponent } from './listagem/listagem.component';
import { ContabilComponent } from './listagem/components/contabil/contabil.component';
import { SolicitarComponent } from './solicitar/solicitar.component';

@NgModule({
  declarations: [FinanceiroComponent, ContabilComponent, ListagemComponent, SolicitarComponent],
  imports: [CommonModule, RelatorioRoutingModule, SharedModule],
})
export class RelatorioModule {}

