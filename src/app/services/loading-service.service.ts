import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SetGetServiceService } from './set-get-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  constructor(private loadingCtrl: LoadingController, private setget: SetGetServiceService) { }

  async tampil_loading_login(){
    const loading = await this.loadingCtrl.create({
      message: 'Sedang memproses . . .',
    });
    await loading.present().then(() => {
      this.setget.setData(1);
    });
    await loading.onDidDismiss().then(() => {
      this.setget.setData(0);
    })
  }

  tutuploading(){
    let a = this.setget.getData();

    if (a == 1) {
      this.loadingCtrl.dismiss();
    }
  }
}
