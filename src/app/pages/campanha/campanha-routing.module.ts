import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampanhaCreateComponent } from './cadastro/campanha-create.component';
import { CampanhaListagemComponent } from './listagem/campanha-listagem.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listagem',
    pathMatch: 'full',
  },
  {
    path: 'listagem',
    component: CampanhaListagemComponent,
  },
  {
    path: 'cadastro',
    component: CampanhaCreateComponent,
  },
  {
    path: 'editar/:id',
    component: CampanhaCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampanhaRoutingModule {}

