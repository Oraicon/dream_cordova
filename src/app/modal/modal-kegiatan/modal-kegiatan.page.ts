import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-kegiatan',
  templateUrl: './modal-kegiatan.page.html',
  styleUrls: ['./modal-kegiatan.page.scss'],
})
export class ModalKegiatanPage implements OnInit {

  bindingradio;

  constructor(private modalCtrl: ModalController) {
    this.checkValue;
  }

  checkValue(event: any) {
    this.bindingradio = event.detail.value;
  }
  
  pilih(){
    this.modalCtrl.dismiss({data: this.bindingradio});
  }


  ngOnInit() {
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
