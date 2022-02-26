import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelesaiPageRoutingModule } from './selesai-routing.module';

import { SelesaiPage } from './selesai.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelesaiPageRoutingModule
  ],
  declarations: [SelesaiPage]
})
export class SelesaiPageModule {}
