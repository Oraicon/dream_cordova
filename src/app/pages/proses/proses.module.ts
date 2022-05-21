import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProsesPageRoutingModule } from './proses-routing.module';

import { ProsesPage } from './proses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2SearchPipeModule,
    IonicModule,
    ProsesPageRoutingModule
  ],
  declarations: [ProsesPage]
})
export class ProsesPageModule {}
