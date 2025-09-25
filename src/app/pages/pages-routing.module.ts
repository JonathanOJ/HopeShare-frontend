import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../shared/components/notfound/notfound.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { TipoUsuario } from '../shared/models/auth';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'configuracao',
        loadChildren: () => import('./configuracao/configuracao.module').then((m) => m.ConfiguracaoModule),
      },
      {
        path: 'campanha',
        // canActivate: [AuthGuard],
        // data: { role: TipoUsuario.EMPRESA },
        loadChildren: () => import('./campanha/campanha.module').then((m) => m.CampanhaModule),
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        data: { role: TipoUsuario.EMPRESA },
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'relatorio',
        canActivate: [AuthGuard],
        data: { role: TipoUsuario.EMPRESA },
        loadChildren: () => import('./relatorio/relatorio.module').then((m) => m.RelatorioModule),
      },
      {
        path: 'admin/denuncias',
        // canActivate: [AuthGuard],
        // data: { adminOnly: true },
        loadChildren: () => import('./admin/denuncias/denuncias.module').then((m) => m.DenunciasModule),
      },
      {
        path: 'admin/solicitacoes-deposito',
        // canActivate: [AuthGuard],
        // data: { adminOnly: true },
        loadChildren: () =>
          import('./admin/solicitacoes-deposito/solicitacoes-deposito.module').then(
            (m) => m.SolicitacoesDepositoModule
          ),
      },
    ],
  },
  {
    path: 'notfound',
    component: NotfoundComponent,
  },
  {
    path: '**',
    redirectTo: 'notfound',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

