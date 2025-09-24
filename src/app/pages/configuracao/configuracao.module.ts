import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracaoRoutingModule } from './configuracao-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfiguracaoComponent } from './configuracao.component';
import { RecebimentoComponent } from './recebimento/recebimento.component';
import { HistoricoComponent } from './historico/historico.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { DepositoComponent } from './historico/components/deposito/deposito.component';
import { DoacaoComponent } from './historico/components/doacao/doacao.component';

@NgModule({
  declarations: [
    ConfiguracaoComponent,
    RecebimentoComponent,
    HistoricoComponent,
    DocumentosComponent,
    DoacaoComponent,
    DepositoComponent,
  ],
  imports: [CommonModule, ConfiguracaoRoutingModule, SharedModule],
})
export class ConfiguracaoModule {}

