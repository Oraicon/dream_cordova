import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { MomentService } from '../services/moment.service';
import { SetGetServiceService } from '../services/set-get-service.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //variabel
  data_header_id = [];
  data_masih_proses = {};
  data_sudah_komplit = {};
  data_header = [];
  tanggal_deadline = {};
  data_beranda = false;
  data_beranda_loading_tidak_ada = true;

  constructor(
    private setget: SetGetServiceService,
    private loadingCtrl: LoadingServiceService, 
    private momentService: MomentService,
    private alertCtrl: AlertController, 
    private storage:Storage, 
    private router: Router, 
    private apiService:ApiServicesService) {

    // this.tampilkan_data();
  }

  async tampilkan_data(){
    this.loadingCtrl.tampil_loading_login();

    const data_l_nama = await this.storage.get('nama');
    
    this.apiService.panggil_api_progres_header(data_l_nama)
    .then(res => {
      
      const data_json = JSON.parse(res.data);
      const arr_data_status_data = data_json.data;

      this.tampilkan_data1(arr_data_status_data);

    })
    .catch(err => {
      console.log(err);
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

  tampilkan_data1(arr){
    for (let index = 0; index < arr.length; index++) {
      this.data_header.push(arr[index]);
      if (index == arr.length-1) {
        this.tampilkan_data2(this.data_header);
      }
    }
  }

  tampilkan_data2(arr){

    for (let index = 0; index < arr.length; index++) {
      let element = arr[index].id;

      this.tanggal_deadline[element] = this.momentService.ubah_format_tanggal(arr[index].due_date);

      this.apiService.panggil_api_get_progres_detail(element)
      .then(data => {

        const data_json = JSON.parse(data.data);
        const arr_data_progres = data_json.data;

        this.tampilkan_data3(arr_data_progres, element);
    
      })
      .catch(error => {
    
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
    
      });
    }
  }

  tampilkan_data3(arr, id){
    let a = [];
    let b = [];

    for (let i = 0; i < arr.length; i++) {

      if (arr[i].status_pengerjaan == "IN PROGRESS") {
        a.push(arr[i]);
      }else{
        b.push(arr[i]);
      }
    }
    
    this.data_masih_proses[id] = a.length;
    this.data_sudah_komplit[id] = b.length;
    a = [];
    b = [];

    this.data_beranda = true;
    this.data_beranda_loading_tidak_ada = true;
    
    if(this.setget.getData() != 0){
      this.loadingCtrl.tutuploading();
    }
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

  doRefresh(event){
    event.target.complete();
    this.data_header_id = [];
    this.data_masih_proses = {};
    this.data_sudah_komplit = {};
    this.data_header = [];
    this.tanggal_deadline = {};

    this.data_beranda_loading_tidak_ada = false;
    this.tampilkan_data();
  }

}
