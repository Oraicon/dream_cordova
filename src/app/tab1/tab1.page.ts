import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private alertCtrl: AlertController, private storage:Storage, private router: Router) {}

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
          handler: () =>{
            this.storage.clear();
            this.router.navigateByUrl("")
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
