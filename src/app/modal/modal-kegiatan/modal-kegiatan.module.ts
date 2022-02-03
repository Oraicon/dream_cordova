import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalKegiatanPageRoutingModule } from './modal-kegiatan-routing.module';

import { ModalKegiatanPage } from './modal-kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalKegiatanPageRoutingModule
  ],
  declarations: [ModalKegiatanPage]
})
export class ModalKegiatanPageModule {}
