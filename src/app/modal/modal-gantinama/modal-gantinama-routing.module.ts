import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalGantinamaPage } from './modal-gantinama.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGantinamaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalGantinamaPageRoutingModule {}
