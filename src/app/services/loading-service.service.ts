import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SetGetServiceService } from './set-get-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  constructor(private loadingCtrl: LoadingController, private setget: SetGetServiceService) { }

  async tampil_loading(text){
    const loading = await this.loadingCtrl.create({
      message: ''+text,
    });
    await loading.present().then(() => {
      this.setget.setData(1);
    });
    await loading.onDidDismiss().then(() => {
      this.setget.setData(0);
      this.setget.setButton(0);
    })
  }

  tutup_loading(){
    this.loadingCtrl.dismiss();
  }
}
