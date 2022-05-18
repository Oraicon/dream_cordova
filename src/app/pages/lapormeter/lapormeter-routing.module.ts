import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LapormeterPage } from './lapormeter.page';

const routes: Routes = [
  {
    path: '',
    component: LapormeterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapormeterPageRoutingModule {}
