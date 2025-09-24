import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DenunciasComponent } from './denuncias.component';

const routes: Routes = [
  {
    path: '',
    component: DenunciasComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DenunciasRoutingModule {}

