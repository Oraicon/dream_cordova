import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListdokumenPageRoutingModule } from './listdokumen-routing.module';

import { ListdokumenPage } from './listdokumen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListdokumenPageRoutingModule
  ],
  declarations: [ListdokumenPage]
})
export class ListdokumenPageModule {}
