import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DenunciasRoutingModule } from './denuncias-routing.module';
import { DenunciasComponent } from './denuncias.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [DenunciasComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DenunciasRoutingModule, SharedModule],
})
export class DenunciasModule {}
