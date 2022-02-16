import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet,{static:true}) routerOutlet: IonRouterOutlet;
  constructor(private platform: Platform, private location: Location, private alertCtrl : AlertController, private storage:Storage, private router: Router) {

    this.platform.ready().then(()=>{
      this.hardbackbutton();
    });
  }
  
  a = 0;

  hardbackbutton(){
    this.platform.backButton.subscribeWithPriority(11, ()=>{
      console.log("priority15")
      this.a++;

      setTimeout( () => {
        // somecode
        console.log("ey");
        this.a = 0;
      }, 500);

      if (this.a == 2) { // logic for double tap
        this.validasi();
        this.a = 0;
      }
    });
  }

  validasi(){
    if(!this.routerOutlet.canGoBack()){
      this.alertkeluar();
    }else{
      this.location.back();
    }
  }

  async alertkeluar(){
    const alert = await this.alertCtrl.create({
      header: 'Keluar dari aplikasi ?',
      message: 'Anda yakin keluar dari aplikasi ?',
      buttons: [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          handler: () =>{
            this.storage.clear();
            navigator['app'].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  
}
