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

  alert_tidak_ada_koneksi() {
    this.alertCtrl.create({
      header: 'Tidak ada internet !',
      subHeader: 'Anda tidak terhubung dengan internet !.',
      message: 'Coba beberapa saat lagi !.',
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

  alert_error_login3(){
    this.alertCtrl.create({
      header: 'Login gagal !',
      message: 'Code Error 3 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_lupapassword(){
    this.alertCtrl.create({
      header: 'Lupa sandi gagal !',
      message: 'Code Error 4 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_tampilkan_data_tab1(){
    this.alertCtrl.create({
      header: 'Menampilkan data gagal !',
      message: 'Code Error 5 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_upload_gambar_tab2(){
    this.alertCtrl.create({
      header: 'Mengirim gambar gagal !',
      message: 'Code Error 6 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_upload_gambar2_tab2(){
    this.alertCtrl.create({
      header: 'Terjadi kesalahan pada saat mengirim !',
      message: 'Code Error 7 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_upload_gambar3_tab2(){
    this.alertCtrl.create({
      header: 'Terjadi kesalahan pada saat mengirim !',
      message: 'Code Error 8 !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_error_update_tab3(nama, angka){
    this.alertCtrl.create({
      header: 'Terjadi kesalahan pada saat mengubah '+nama+' !',
      message: 'Code Error '+angka+' !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_pilih_gambar_tab2(){
    this.alertCtrl.create({
      header: 'Gambar kosong !',
      message: 'Anda belum memilih gambar',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_berhasil_upload(){
    this.alertCtrl.create({
      header: 'Upload berhasil !',
      message: 'Data sudah terkirim !',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_gagal_upload(){
    this.alertCtrl.create({
      header: 'Upload gagal !',
      message: 'Terjadi kesalahan pada server!',
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_berhasil_lupa_password(alert_email){
    this.alertCtrl.create({
      header: 'Ubah sandi berhasil !',
      message: 'Lihat sandi terbaru anda pada email : '+ alert_email,
      buttons: ['OK']
    }).then(res => {

      res.present();

    });
  }

  alert_gagal_lupa_password(){
    this.alertCtrl.create({
      header: 'Terjadi kesalahan !',
      message: 'Sandi gagal dikirim ke email',
      buttons: ['OK']
    }).then(res => {

      res.present();
    });
  }

  alert_lupa_password_tidak_ditemukan(){
    this.alertCtrl.create({
      header: 'Terjadi kesalahan !',
      message: 'Nama pengguna tidak ditemukan !',
      buttons: ['OK']
    }).then(res => {

      res.present();
    });
  }

  alert_berhasil_mengubah(teks1, teks2){
    this.alertCtrl.create({
      header: 'Ubah '+teks1+' berhasil !',
      message: teks1 + ' anda telah diubah menjadi "' +teks2+'"',
      buttons: ['OK']
    }).then(res => {

      res.present();
    });
  }

  alert_gagal_mengubah(teks1){
    this.alertCtrl.create({
      header: 'Ubah '+teks1+' gagal !',
      message: 'Terjadi kesalahan pada saat mengubah'+teks1,
      buttons: ['OK']
    }).then(res => {

      res.present();
    });
  }

  alert_tidakboleh_kosong(nama){
    this.alertCtrl.create({
      header: 'Terjadi kesalahan !',
      message: nama+' tidak boleh kosong !',
      buttons: ['OK']
    }).then(res => {

      res.present();
    });
  }

  alert_berhasil_mengubah_foto(){
    this.alertCtrl.create({
      header: 'Ubah foto berhasil !',
      message: 'Foto profil anda berhasil diubah !',
      buttons: ['OK']
    }).then(res => {

      res.present();
    });
  }

  alert_gagal_mengubah_foto(){
    this.alertCtrl.create({
      header: 'Ubah foto gagal !',
      message: 'Terjadi kesalahan pada saat mengubah foto',
      buttons: ['OK']
    }).then(res => {

      res.present();
    });
  }
}
