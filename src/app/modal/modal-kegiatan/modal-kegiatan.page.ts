import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-modal-kegiatan',
  templateUrl: './modal-kegiatan.page.html',
  styleUrls: ['./modal-kegiatan.page.scss'],
})
export class ModalKegiatanPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}