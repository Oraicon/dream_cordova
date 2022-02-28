import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaporPageRoutingModule } from './lapor-routing.module';

import { LaporPage } from './lapor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaporPageRoutingModule
  ],
  declarations: [LaporPage]
})
export class LaporPageModule {}
