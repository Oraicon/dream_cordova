import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertServicesService } from '../services/alert-services.service';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //variabel
  data_pengguna;
  data_nama;

  constructor(private loadingCtrl:LoadingServiceService, private alertService: AlertServicesService,private alertCtrl: AlertController, private storage:Storage, private router: Router, private apiService:ApiServicesService) {
    this.data_pengguna = true;
    this.tampilkan_data();
    this.loadingCtrl.tampil_loading_login();
  }

  async tampilkan_data(){

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
      
      this.alertService.alert_error_tampilkan_data_tab1();
    });
  }

  keluar(){
    this.alertCtrl.create({
      header: 'Kembali ke login ?',
      message: 'Anda akan kembali ke halaman login anda yakin ?',
      buttons: [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          handler: () =>{
            this.storage.clear();
            this.router.navigate(["/login"], { replaceUrl: true });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

}
