import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KegiatanPageRoutingModule } from './kegiatan-routing.module';

import { KegiatanPage } from './kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KegiatanPageRoutingModule
  ],
  declarations: [KegiatanPage]
})
export class KegiatanPageModule {}
