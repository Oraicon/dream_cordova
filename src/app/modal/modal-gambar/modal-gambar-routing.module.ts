import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalGambarPage } from './modal-gambar.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGambarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalGambarPageRoutingModule {}
