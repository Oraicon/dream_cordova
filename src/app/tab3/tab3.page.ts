import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  imgURL:any = 'assets/ss.png';

  type_update_akun = "update_data_akun";
  type_update_gambar = "update_image_akun";


  constructor(private loadingCtrl:LoadingServiceService, private alertCtrl: AlertController, private storage:Storage, private router: Router, private apiService:ApiServicesService) {

  }

  //alert data untuk diubah
  async ubahusername(){

    const l_storage_data_nama = await this.storage.get('nama');

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
            handler: (alertData) =>{
              this.loadingCtrl.tampil_loading_login();


              const nama_data = alertData.username;

              console.log(l_storage_data_nama);
              console.log(nama_data);
              console.log(this.type_update_akun);
              
              this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, l_storage_data_nama, nama_data, "", "")
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
                const data_json = JSON.parse(err.error);
                const data_status = data_json.status;
                this.storage.set('nama', nama_data);
                console.log(data_status)
                
                this.loadingCtrl.tutuploading();

              });
            
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async  ubahpassword(){

    const l_storage_data_nama = await this.storage.get('nama');
    
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
          handler: (alertData) =>{
            this.loadingCtrl.tampil_loading_login();

            const sandi_data = alertData.password;

            console.log(l_storage_data_nama);
            console.log(sandi_data);
            console.log(this.type_update_akun);
            
            this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, l_storage_data_nama, "", sandi_data, "")
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
              const data_json = JSON.parse(err.error);
              const data_status = data_json.status;
              this.storage.set('sandi', sandi_data);
              console.log(data_status)
              
              this.loadingCtrl.tutuploading();

            });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
}
