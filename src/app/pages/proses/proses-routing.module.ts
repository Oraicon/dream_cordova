import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProsesPage } from './proses.page';

const routes: Routes = [
  {
    path: '',
    component: ProsesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProsesPageRoutingModule {}
