import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalLupasandiPageRoutingModule } from './modal-lupasandi-routing.module';

import { ModalLupasandiPage } from './modal-lupasandi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalLupasandiPageRoutingModule
  ],
  declarations: [ModalLupasandiPage]
})
export class ModalLupasandiPageModule {}
