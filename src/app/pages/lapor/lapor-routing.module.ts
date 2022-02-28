import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaporPage } from './lapor.page';

const routes: Routes = [
  {
    path: '',
    component: LaporPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaporPageRoutingModule {}
