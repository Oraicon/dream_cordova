import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertServicesService {

  constructor(private alertCtrl: AlertController) { }

  alert_nama_kosong() {
    this.alertCtrl.create({
      header: 'Terjadi kesalahan !',
      message: 'Nama tidak boleh kosong !.',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_sandi_kosong() {
    this.alertCtrl.create({
      header: 'Terjadi kesalahan !',
      message: 'Sandi tidak boleh kosong !.',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_gagal_login2(){
    this.alertCtrl.create({
      header: 'Login gagal !',
      message: 'Password tidak sesuai !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_gagal_login3(){
    this.alertCtrl.create({
      header: 'Login gagal !',
      message: 'Pengguna tidak aktif !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_gagal_login0(){
    this.alertCtrl.create({
      header: 'Login gagal !',
      message: 'Pengguna tidak ditemukan !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_login1(){
    this.alertCtrl.create({
      header: 'Terjadi kesalahan !',
      message: 'Code Error 1 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_login2(){
    this.alertCtrl.create({
      header: 'Login gagal !',
      message: 'Code Error 2 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

}
