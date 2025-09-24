import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ListagemComponent } from './listagem/listagem.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ListagemComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}

