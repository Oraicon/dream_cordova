import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalGambarPageRoutingModule } from './modal-gambar-routing.module';

import { ModalGambarPage } from './modal-gambar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalGambarPageRoutingModule
  ],
  declarations: [ModalGambarPage]
})
export class ModalGambarPageModule {}
