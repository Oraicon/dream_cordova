import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalIsikontenPageRoutingModule } from './modal-isikonten-routing.module';

import { ModalIsikontenPage } from './modal-isikonten.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalIsikontenPageRoutingModule
  ],
  declarations: [ModalIsikontenPage]
})
export class ModalIsikontenPageModule {}
