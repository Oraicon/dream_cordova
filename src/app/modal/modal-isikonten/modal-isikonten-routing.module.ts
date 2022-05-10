import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalIsikontenPage } from './modal-isikonten.page';

const routes: Routes = [
  {
    path: '',
    component: ModalIsikontenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalIsikontenPageRoutingModule {}
