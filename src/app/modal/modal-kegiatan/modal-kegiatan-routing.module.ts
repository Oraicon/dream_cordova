import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalKegiatanPage } from './modal-kegiatan.page';

const routes: Routes = [
  {
    path: '',
    component: ModalKegiatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalKegiatanPageRoutingModule {}
