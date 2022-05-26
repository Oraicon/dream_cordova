import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRiwayatlaporanPage } from './modal-riwayatlaporan.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRiwayatlaporanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRiwayatlaporanPageRoutingModule {}
