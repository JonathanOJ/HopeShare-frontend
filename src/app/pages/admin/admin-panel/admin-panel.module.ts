import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AdminPanelComponent } from './admin-panel.component';
import { SharedModule } from '../../../shared/shared.module';
import { DenunciasComponent } from './components/denuncias/denuncias.component';
import { SolicitacoesDepositoComponent } from './components/solicitacoes-deposito/solicitacoes-deposito.component';
import { ValidacaoUsuarioComponent } from './components/validacao-documentos/validacao-usuario.component';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { ModalDetalhesComponent } from './components/denuncias/components/modal-detalhes/modal-detalhes.component';
import { ModalSuspenderComponent } from './components/denuncias/components/modal-suspender/modal-suspender.component';

@NgModule({
  declarations: [
    AdminPanelComponent,
    DenunciasComponent,
    SolicitacoesDepositoComponent,
    ValidacaoUsuarioComponent,
    ModalSuspenderComponent,
    ModalDetalhesComponent,
  ],
  imports: [SharedModule, CommonModule, FormsModule, ReactiveFormsModule, AdminPanelRoutingModule],
})
export class AdminPanelModule {}

