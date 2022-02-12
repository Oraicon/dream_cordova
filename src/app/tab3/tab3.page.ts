import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  imgURL:any = 'https://oraicon.000webhostapp.com/upload/0210202260505.JPEG';

  constructor(private alertCtrl: AlertController) {}

  //alert data untuk diubah
  ubahusername(){
    this.alertCtrl.create({
      header: 'Perubahan nama pengguna',
      message: 'Silahkan untuk mengisi nama pengguna baru anda',
      inputs: [
        {
          name: 'username',
          placeholder: 'Nama Pengguna',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Batal',
        },
        {
          text: 'Simpan',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  ubahpassword(){
    this.alertCtrl.create({
      header: 'Perubahan sandi pengguna',
      message: 'Silahkan untuk mengisi sandi pengguna baru anda',
      inputs: [
        {
          name: 'password',
          placeholder: 'Sandi Pengguna',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Batal',
        },
        {
          text: 'Simpan',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  ubahnik(){
    this.alertCtrl.create({
      header: 'Perubahan nik pengguna',
      message: 'Silahkan untuk mengisi nik anda',
      inputs: [
        {
          name: 'nik',
          placeholder: 'Nomor Induk Penduduk',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Batal',
        },
        {
          text: 'Simpan',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  ubahemail(){
    this.alertCtrl.create({
      header: 'Perubahan email',
      message: 'Silahkan untuk mengisi email anda',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Batal',
        },
        {
          text: 'Simpan',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  ubahtanggallahir(){
    this.alertCtrl.create({
      header: 'Perubahan tanggal lahir',
      message: 'Silahkan untuk mengisi tanggal lahir anda',
      inputs: [
        {
          name: 'tgllahir',
          type: 'date'
        },
      ],
      buttons: [
        {
          text: 'Batal',
        },
        {
          text: 'Simpan',
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  ubahkelamin(){
    this.alertCtrl.create({
      header: 'Ubah Jenis Kelamin',
      message: 'Pilih Jenis Kelamin Anda',
      inputs: [
        {
          type: 'radio',
          label: 'Laki-laki',
          value: 'l'
        },
        {
          type: 'radio',
          label: 'Perempuan',
          value: 'p'
        },
      ],
      buttons: [
        {
          text: 'Batal',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Simpan',
          handler: (data: any) => {
            console.log('Selected Information', data);
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
