import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationRoutingModule } from './donation-routing.module';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { PendingComponent } from './pending/pending.component';


@NgModule({
  declarations: [
    SuccessComponent,
    FailureComponent,
    PendingComponent
  ],
  imports: [
    CommonModule,
    DonationRoutingModule
  ]
})
export class DonationModule { }
