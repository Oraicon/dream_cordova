import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProsesLogPageRoutingModule } from './proses-log-routing.module';

import { ProsesLogPage } from './proses-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProsesLogPageRoutingModule
  ],
  declarations: [ProsesLogPage]
})
export class ProsesLogPageModule {}
