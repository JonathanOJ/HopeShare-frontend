import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracaoComponent } from './configuracao.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { TipoUsuario } from '../../shared/models/auth';

const routes: Routes = [
  { path: '', component: ConfiguracaoComponent, canActivate: [AuthGuard] },

  {
    path: 'recebimento',
    component: ConfiguracaoComponent,
    canActivate: [AuthGuard],
    data: { role: TipoUsuario.EMPRESA },
  },
  {
    path: 'documentos',
    component: ConfiguracaoComponent,
    canActivate: [AuthGuard],
    data: { role: TipoUsuario.EMPRESA },
  },

  { path: 'historico', component: ConfiguracaoComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracaoRoutingModule {}

