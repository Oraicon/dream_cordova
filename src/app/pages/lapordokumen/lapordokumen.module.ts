import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LapordokumenPageRoutingModule } from './lapordokumen-routing.module';

import { LapordokumenPage } from './lapordokumen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LapordokumenPageRoutingModule
  ],
  declarations: [LapordokumenPage]
})
export class LapordokumenPageModule {}
