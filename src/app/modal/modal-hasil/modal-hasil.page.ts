import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';

@Component({
  selector: 'app-modal-hasil',
  templateUrl: './modal-hasil.page.html',
  styleUrls: ['./modal-hasil.page.scss'],
})
export class ModalHasilPage implements OnInit {

  constructor(    
    private modalCtrl: ModalController,
    private setget: SetGetServiceService) 
  { }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.setget.set_tab_page(3);
  }

  ionViewWillLeave(){
    this.setget.set_tab_page(1);
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
