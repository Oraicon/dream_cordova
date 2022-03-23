import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { MomentService } from '../services/moment.service';
import { SetGetServiceService } from '../services/set-get-service.service';
import { SwalServiceService } from '../services/swal-service.service';
import Swal from 'sweetalert2';

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
  data_beranda_loading_tidak_ada = false;
  timeout = 0;

  constructor(
    private swalService: SwalServiceService,
    private setget: SetGetServiceService,
    private loadingCtrl: LoadingServiceService, 
    private momentService: MomentService,
    private storage:Storage, 
    private router: Router, 
    private apiService:ApiServicesService) {
    
    this.tampilkan_data();
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 1000);});
  }

  //menampilkan data
  async tampilkan_data(){

    this.loadingCtrl.tampil_loading_login();
    this.setget.set(0);
    await this.interval_counter();
    
    const data_l_nama = await this.storage.get('nama');
    
    this.apiService.panggil_api_progres_header(data_l_nama)
    .then(res => {

      const data_json = JSON.parse(res.data);
      const status_data = data_json.status;
      if (status_data == 1) {
        const arr_data_status_data = data_json.data;
        this.tampilkan_data1(arr_data_status_data);
  
      } else {
        this.data_beranda = false;
        this.data_beranda_loading_tidak_ada = true;
        this.loadingCtrl.tutuploading();
      }

    })
    .catch(err => {
      this.loadingCtrl.tutuploading();
      this.timeout++;

      if (this.timeout == 2) {
          this.keluar_aplikasi();
      } else {
        if (err.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 15 !, kembali ke login !");
        }
      }

    });
  }

  //olah data jadi array
  tampilkan_data1(arr){
    for (let index = 0; index < arr.length; index++) {
      this.data_header.push(arr[index]);
      if (index == arr.length-1) {
        this.tampilkan_data2(this.data_header);
      }
    }
  }

  //olah isi data array
  async tampilkan_data2(arr){
    
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index].id;
      
      this.tanggal_deadline[element] = this.momentService.ubah_format_tanggal(arr[index].due_date);
      this.apiService.panggil_api_get_progres_detail(element)
      .then(data => {
        const data_json = JSON.parse(data.data);
        const arr_data_progres = data_json.data;
        this.tampilkan_data3(arr_data_progres, element);
        return;
    
      })
      .catch(error => {
        this.loadingCtrl.tutuploading();
        this.timeout++;
        
        if (this.timeout == 2) {
          this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 16 !");
        }
      }

      });
    }
  }

  //olah isi array length dan memisahkan progres dan komplit
  async tampilkan_data3(arr, id){

    if(arr == null){
      
      this.data_masih_proses[id] = [];
      this.data_sudah_komplit[id] = [];

    } else {
      
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
    }

    this.data_beranda = true;
    this.data_beranda_loading_tidak_ada = true;
    this.timeout = 0;
    if(this.setget.getData() != 0){
      this.loadingCtrl.tutuploading();
    }   

  }

  //refresh page
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
  

  //logout
  keluar(){
    this.loadingCtrl.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Keluar akun ?',
      text: 'Kembali ke login, anda yakin ?',
      backdrop: false,
      showDenyButton: true,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Ya',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutuploading();
        this.router.navigate(["/login"], { replaceUrl: true });
      }else {
        this.loadingCtrl.tutuploading();
      }
    });
  }

  //pindah aktiviti
  kegiatan(e, f){
    this.setget.setDatakegiatan(e, f);
    this.setget.set(1);
    this.router.navigate(["/kegiatan"], { replaceUrl: true });
  }

  async tidak_ada_respon(){
    this.loadingCtrl.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Server tidak merespon, tekan iya untuk mencoba lagi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutuploading();
        this.tampilkan_data();
      }
    });
  }

  async keluar_aplikasi(){
    this.loadingCtrl.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Keluar dari aplikasi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutuploading();
        navigator['app'].exitApp();
      }
    });
  }

}
