import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListdokumenPage } from './listdokumen.page';

const routes: Routes = [
  {
    path: '',
    component: ListdokumenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListdokumenPageRoutingModule {}
