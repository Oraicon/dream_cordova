import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalGantisandiPage } from './modal-gantisandi.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGantisandiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalGantisandiPageRoutingModule {}
