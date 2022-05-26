import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LapordokumenPage } from './lapordokumen.page';

const routes: Routes = [
  {
    path: '',
    component: LapordokumenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LapordokumenPageRoutingModule {}
