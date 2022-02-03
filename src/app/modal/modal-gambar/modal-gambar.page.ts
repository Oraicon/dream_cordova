import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-gambar',
  templateUrl: './modal-gambar.page.html',
  styleUrls: ['./modal-gambar.page.scss'],
})
export class ModalGambarPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
