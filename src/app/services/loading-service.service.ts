import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingServiceService {

  constructor(private loadingCtrl: LoadingController) { }

  tampil_loading_login(){
    this.loadingCtrl.create({
        spinner: "bubbles",
        message: 'Sedang memproses . . .'
    }).then((response) => {
        response.present();
    });
  }

  tutuploading(){
    this.loadingCtrl.dismiss();
  }
}
