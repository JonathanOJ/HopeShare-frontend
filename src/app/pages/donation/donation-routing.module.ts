import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuccessComponent } from './success/success.component';
import { FailureComponent } from './failure/failure.component';
import { PendingComponent } from './pending/pending.component';

const routes: Routes = [
  {
    path: 'success',
    component: SuccessComponent,
  },
  {
    path: 'failure',
    component: FailureComponent,
  },
  {
    path: 'pending',
    component: PendingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationRoutingModule {}

