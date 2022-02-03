import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private alertCtrl: AlertController) {}

  keluar(){
    this.alertCtrl.create({
      header: 'Keluar dari aplikasi',
      message: 'Anda yakin ingin keluar dari aplikasi ?',
      buttons: [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
