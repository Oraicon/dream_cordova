import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { IonicModule } from '@ionic/angular';

import { KegiatanPageRoutingModule } from './kegiatan-routing.module';

import { KegiatanPage } from './kegiatan.page';

@NgModule({
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    FormsModule,
    IonicModule,
    KegiatanPageRoutingModule
  ],
  declarations: [KegiatanPage]
})
export class KegiatanPageModule {}
