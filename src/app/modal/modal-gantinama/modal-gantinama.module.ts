import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { ModalGantinamaPageRoutingModule } from './modal-gantinama-routing.module';

import { ModalGantinamaPage } from './modal-gantinama.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ModalGantinamaPageRoutingModule
  ],
  declarations: [ModalGantinamaPage]
})
export class ModalGantinamaPageModule {}
