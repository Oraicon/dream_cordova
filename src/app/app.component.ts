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

  hardbackbutton(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      if(!this.routerOutlet.canGoBack()){
        this.alertkeluar();
      }else{
        this.location.back();
      }
    });
  }

  async alertkeluar(){
    const alert = await this.alertCtrl.create({
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
            this.router.navigateByUrl("")
          }
        }
      ]
    });
    await alert.present();
  }

  
}
