import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalRiwayatlaporanPageRoutingModule } from './modal-riwayatlaporan-routing.module';

import { ModalRiwayatlaporanPage } from './modal-riwayatlaporan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalRiwayatlaporanPageRoutingModule
  ],
  declarations: [ModalRiwayatlaporanPage]
})
export class ModalRiwayatlaporanPageModule {}
