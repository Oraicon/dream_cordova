import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SetGetServiceService } from './services/set-get-service.service';
import { ToastService } from './services/toast.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet,{static:true}) routerOutlet: IonRouterOutlet;
  constructor(private platform: Platform, private location: Location, private alertCtrl : AlertController, private storage:Storage, private router: Router, private setget: SetGetServiceService, private toastService: ToastService) {

    this.platform.ready().then(()=>{
      this.hardbackbutton();
    });
  }
  
  async hardbackbutton(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      let a = this.setget.getData();
      
      if (a == 1) {
        this.toastService.Toast_tampil();
      } else {
        if (!this.routerOutlet.canGoBack()) {
          this.exitapp();
        }else{
          this.storage.set('auth', true);
          this.location.back();
        }
      }
    });
  }

  async exitapp() {
      const alert = await this.alertCtrl.create({
        header: 'Keluar dari aplikasi ?',
        message: 'Anda akan keluar dari aplikasi anda yakin ?',
        cssClass:'my-custom-class',
        mode: "ios",
        buttons: [
          {
            text: 'Tidak',
          }, {
            text: 'Ok',
            handler: () => {
              this.storage.set('nama', null);
              this.storage.set('sandi', null);
              navigator['app'].exitApp();
            }
          }
        ]
      });
    
      await alert.present();
    }
  
}
