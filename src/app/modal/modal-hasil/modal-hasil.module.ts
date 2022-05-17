import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalHasilPageRoutingModule } from './modal-hasil-routing.module';

import { ModalHasilPage } from './modal-hasil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalHasilPageRoutingModule
  ],
  declarations: [ModalHasilPage]
})
export class ModalHasilPageModule {}
