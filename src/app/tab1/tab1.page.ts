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

  constructor(private alertCtrl: AlertController, private storage:Storage, private router: Router) {

  }

  keluar(){
    this.alertCtrl.create({
      header: 'Kembali ke login ?',
      message: 'Anda akan kembali ke halaman login anda yakin ?',
      buttons: [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          handler: () =>{
            this.storage.clear();
            this.router.navigate(["/login"], { replaceUrl: true });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
