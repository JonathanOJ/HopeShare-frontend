import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitacoesDepositoComponent } from './solicitacoes-deposito.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitacoesDepositoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitacoesDepositoRoutingModule {}
