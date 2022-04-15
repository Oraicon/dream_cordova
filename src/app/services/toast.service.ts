import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async Toast_tampil() {
    const toast = await this.toastController.create({
      message: 'Fitur sedang tidak bisa digunakan !',
      duration: 2000
    });
    toast.present();
  }

  async Toast(text){
    const toast = await this.toastController.create({
      message: ''+text,
      duration: 2000
    });
    toast.present();
  }
}
