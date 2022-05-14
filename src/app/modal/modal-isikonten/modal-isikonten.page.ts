import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';

@Component({
  selector: 'app-modal-isikonten',
  templateUrl: './modal-isikonten.page.html',
  styleUrls: ['./modal-isikonten.page.scss'],
})
export class ModalIsikontenPage implements OnInit {

  imgURL:any = 'assets/loading.gif';
  namaImg;

  constructor(
    private modalCtrl: ModalController,
    private setget: SetGetServiceService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.setget.set_tab_page(3);
  }

  ionViewWillLeave(){
    this.setget.set_tab_page(1);
  }

  ionViewDidEnter(){
    let data = this.setget.getdatalist();
    this.imgURL = data[0];
    this.namaImg = data[1];
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
