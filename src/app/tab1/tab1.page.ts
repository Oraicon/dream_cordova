import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertServicesService } from '../services/alert-services.service';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //variabel
  data_pengguna = true;
  data_nama;

  constructor(private loadingCtrl:LoadingServiceService, private alertService: AlertServicesService,private alertCtrl: AlertController, private storage:Storage, private router: Router, private apiService:ApiServicesService) {
    this.tampilkan_data();
  }

  async tampilkan_data(){
    this.loadingCtrl.tampil_loading_login();

    const data_l_nama = await this.storage.get('nama');
    const data_l_sandi = await this.storage.get('sandi');

    
    this.apiService.panggil_api_data_karyawan(data_l_nama, data_l_sandi)
    .then(res => {
      
      const data_json = JSON.parse(res.data);
      const data_status_data = data_json.data[0];
      
      this.data_pengguna = false;
      this.data_nama = data_status_data.nama;

      this.loadingCtrl.tutuploading();      
    })
    .catch(err => {
      this.loadingCtrl.tutuploading();
      
      this.alertCtrl.create({
        header: 'Terjadi kesalahan !',
        message: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
        cssClass:'my-custom-class',
        backdropDismiss: false,
        mode: "ios",
        buttons: [{
          text: 'OK !',
          handler: () => {
            this.tampilkan_data();
          }
        }]
      }).then(res => {
  
        res.present();
  
      });
    });
  }

  keluar(){
    this.alertCtrl.create({
      header: 'Kembali ke login ?',
      message: 'Anda akan kembali ke halaman login anda yakin ?',
      cssClass:'my-custom-class',
      mode: "ios",
      buttons: [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          handler: () =>{
            this.storage.set('nama', null);
            this.storage.set('sandi', null);
            this.router.navigate(["/login"], { replaceUrl: true });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
