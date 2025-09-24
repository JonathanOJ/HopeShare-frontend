import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { MessageService } from 'primeng/api';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/hopeshare',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((module) => module.LoginModule),
  },
  {
    path: 'hopeshare',
    loadChildren: () => import('./pages/pages.module').then((module) => module.PagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }, MessageService],
})
export class AppRoutingModule {}

