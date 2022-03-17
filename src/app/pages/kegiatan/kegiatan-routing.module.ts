import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KegiatanPage } from './kegiatan.page';

const routes: Routes = [
  {
    path: '',
    component: KegiatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KegiatanPageRoutingModule {}
