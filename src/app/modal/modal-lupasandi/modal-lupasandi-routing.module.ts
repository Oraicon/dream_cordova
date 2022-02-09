import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalLupasandiPage } from './modal-lupasandi.page';

const routes: Routes = [
  {
    path: '',
    component: ModalLupasandiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalLupasandiPageRoutingModule {}
