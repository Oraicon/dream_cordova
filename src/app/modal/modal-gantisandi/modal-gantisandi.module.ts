import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalGantisandiPageRoutingModule } from './modal-gantisandi-routing.module';

import { ModalGantisandiPage } from './modal-gantisandi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalGantisandiPageRoutingModule
  ],
  declarations: [ModalGantisandiPage]
})
export class ModalGantisandiPageModule {}
