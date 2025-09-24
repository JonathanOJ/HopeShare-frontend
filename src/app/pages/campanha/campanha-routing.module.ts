import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampanhaComponent } from './listagem/campanha.component';
import { CampanhaCreateComponent } from './cadastro/campanha-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listagem',
    pathMatch: 'full',
  },
  {
    path: 'listagem',
    component: CampanhaComponent,
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

