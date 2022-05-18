import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LapormeterPageRoutingModule } from './lapormeter-routing.module';

import { LapormeterPage } from './lapormeter.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    LapormeterPageRoutingModule
  ],
  declarations: [LapormeterPage]
})
export class LapormeterPageModule {}
