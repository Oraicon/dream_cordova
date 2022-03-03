import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async Toast_tampil() {
    const toast = await this.toastController.create({
      message: 'Sedang memproses !',
      duration: 2000
    });
    toast.present();
  }
}
