import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AdminPanelComponent } from './admin-panel.component';
import { SharedModule } from '../../../shared/shared.module';
import { DenunciasComponent } from './components/denuncias/denuncias.component';
import { SolicitacoesDepositoComponent } from './components/solicitacoes-deposito/solicitacoes-deposito.component';
import { ValidacaoDocumentosComponent } from './components/validacao-documentos/validacao-documentos.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';

@NgModule({
  declarations: [AdminPanelComponent, DenunciasComponent, SolicitacoesDepositoComponent, ValidacaoDocumentosComponent],
  imports: [SharedModule, CommonModule, FormsModule, ReactiveFormsModule, AdminPanelRoutingModule],
})
export class AdminPanelModule {}

