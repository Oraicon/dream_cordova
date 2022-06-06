import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListnotifPageRoutingModule } from './listnotif-routing.module';

import { ListnotifPage } from './listnotif.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListnotifPageRoutingModule
  ],
  declarations: [ListnotifPage]
})
export class ListnotifPageModule {}
