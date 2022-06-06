import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListnotifPage } from './listnotif.page';

const routes: Routes = [
  {
    path: '',
    component: ListnotifPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListnotifPageRoutingModule {}
