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
  logika_loading = 0;
  logika_loading_lenght = 0;
  timeout = 0;
  data_swal;

  data_rap;
  jumlah_data_kegiatan_rap;

  constructor(
    private swalService: SwalServiceService,
    private setget: SetGetServiceService,
    private loadingCtrl: LoadingServiceService, 
    private momentService: MomentService,
    private storage:Storage, 
    private router: Router, 
    private apiService:ApiServicesService) {
    
    //pengecekan koneksi
    this.setget.set_koneksi(1);
    //pengecekan root page
    this.setget.set_tab_page(0);
    this.setget.set_swal(0);
    //manggil data
    // this.tampilkan_data();
    this.menampilkan_data_rap();
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }

  //refresh page
  doRefresh(event){
    event.target.complete();
    //membuat variable kosong
    this.data_header_id = [];
    this.data_masih_proses = {};
    this.data_sudah_komplit = {};
    this.data_header = [];
    this.tanggal_deadline = {};
    this.logika_loading = 0;
    this.logika_loading_lenght = 0;
    this.data_beranda_loading_tidak_ada = false;
    // this.tampilkan_data();
    this.menampilkan_data_rap();
  }

  //pindah aktiviti
  kegiatan(e, f){
    console.log(e);
    this.setget.setDatakegiatan(e, f);
    this.setget.set_tab_page(1);
    this.router.navigate(["/kegiatan"], { replaceUrl: true });
  }

  // //menampilkan data & mengolah data dari 1 sampai 3
  // async tampilkan_data(){

  //   const a = this.setget.getData();
  //   if (a == 1) {
  //     this.loadingCtrl.tutup_loading();
  //   }

  //   this.loadingCtrl.tampil_loading("Memuat data . . .");

  //   const data_l_nama = await this.storage.get('nama');

  //   await this.interval_counter();
    
  //   this.apiService.panggil_api_progres_header(data_l_nama)
  //   .then(res => {

  //     console.log(res);

  //     const data_json = JSON.parse(res.data);
  //     const status_data = data_json.status;
  //     if (status_data == 1) {
  //       const arr_data_status_data = data_json.data;
  //       this.tampilkan_data1(arr_data_status_data);
  //       return;
  //     } else {
  //       this.data_beranda = false;
  //       this.data_beranda_loading_tidak_ada = true;
  //       this.loadingCtrl.tutup_loading();
  //     }

  //   })
  //   .catch(err => {
  //     console.log(err);
      
  //     this.loadingCtrl.tutup_loading();
  //     this.timeout++;
      
  //     if (this.timeout >= 3) {
  //       this.keluar_aplikasi();
  //     } else {
  //       if (err.status == -4) {
  //         this.tidak_ada_respon();
  //       } else {
  //         this.swalService.swal_code_error("Terjadi kesalahan !", "code error 15 !, kembali ke login !");
  //       }
  //     }
  //   });
  // }

  // //olah data jadi array
  // async tampilkan_data1(arr){
  //   for (let index = 0; index < arr.length; index++) {
  //     this.data_header.push(arr[index]);
  //     if (index == arr.length-1) {
  //       this.tampilkan_data2(this.data_header);
  //     }
  //   }
  // }

  // //olah isi data array
  // async tampilkan_data2(arr){

  //   if (arr != null) {
  //   this.logika_loading_lenght = arr.length;
  //   }

  //   for (let index = 0; index < arr.length; index++) {
  //     let element = arr[index].id;
      
  //     this.tanggal_deadline[element] = this.momentService.ubah_format_tanggal(arr[index].due_date);
  //     this.apiService.panggil_api_get_progres_detail(element)
  //     .then(data => {
  //       const data_json = JSON.parse(data.data);
  //       const arr_data_progres = data_json.data;
  //       this.tampilkan_data3(arr_data_progres, element);
  //       return;
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       this.loadingCtrl.tutup_loading();
  //       this.data_swal = this.setget.get_swal();

  //       if (this.data_swal == 0) {
  //         this.setget.set_swal(1);
  //         this.timeout++;
  //         if (this.timeout == 3) {
  //             this.keluar_aplikasi();
  //         } else {
  //           if (error.status == -4) {
  //             this.tidak_ada_respon();
  //           } else {
  //             this.swalService.swal_code_error("Terjadi kesalahan !", "code error 16 !, kembali ke login !");
  //           }
  //         }
  //       }
  //     });
  //   }
  // }

  // //olah isi array length dan memisahkan progres dan komplit
  // async tampilkan_data3(arr, id){

  //   if(arr == null){
      
  //     this.data_masih_proses[id] = [];
  //     this.data_sudah_komplit[id] = [];

  //   } else {
      
  //     let a = [];
  //     let b = [];
  
  //     for (let i = 0; i < arr.length; i++) {
  
  //       if (arr[i].status_pengerjaan == "IN PROGRESS") {
  //         a.push(arr[i]);
  //       }else{
  //         b.push(arr[i]);
  //       }
  //     }
      
  //     this.data_masih_proses[id] = a.length;
  //     this.data_sudah_komplit[id] = b.length;
  //     a = [];
  //     b = [];      
  //   }

  //   this.logika_loading++;

  //   if(this.logika_loading == this.logika_loading_lenght){
  //     this.logika_loading = 0;
  //     this.logika_loading_lenght = 0;
  //     this.data_beranda = true;
  //     this.data_beranda_loading_tidak_ada = true;
  //     this.timeout = 0;
  //     this.loadingCtrl.tutup_loading();
  //   }
  // }

  async menampilkan_data_rap(){

    // this.loadingCtrl.tampil_loading("Memuat data . . .");
    const data_l_nama = await this.storage.get('nama');
    await this.interval_counter();

    this.apiService.dapatkan_data_proyek_rap_master(data_l_nama)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {

        this.data_rap = data_json.data;
        console.log(this.data_rap);

        this.menampilkan_seluruh_kegiatan(this.data_rap[0].id);
        this.data_beranda = true;
        this.data_beranda_loading_tidak_ada = true;
        // this.loadingCtrl.tutup_loading();
      } else {
        this.data_beranda = false;
        this.data_beranda_loading_tidak_ada = true;
        // this.loadingCtrl.tutup_loading();
      }
  
    })
    .catch(error => {
  
      console.log(error.error); // error message as string
  
    })

  }

  async menampilkan_seluruh_kegiatan(id_rap_master){

    this.apiService.dapatkan_data_proyek_rap_detail(id_rap_master)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {

        this.jumlah_data_kegiatan_rap = data_json.data.length;
        // this.loadingCtrl.tutup_loading();
      } else {
        // this.loadingCtrl.tutup_loading();
      }

  
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
    });

  }
  
  async tidak_ada_respon(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }

    this.data_header_id = [];
    this.data_masih_proses = {};
    this.data_sudah_komplit = {};
    this.data_header = [];
    this.tanggal_deadline = {};
    this.logika_loading = 0;
    this.logika_loading_lenght = 0;
    this.data_beranda_loading_tidak_ada = false;
    
    this.loadingCtrl.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Tidak ada respon, coba lagi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutup_loading();
        this.setget.set_swal(0);
        // this.tampilkan_data();
      }
    });
  }

  async keluar_aplikasi(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }

    this.loadingCtrl.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Keluar dari aplikasi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutup_loading();
        navigator['app'].exitApp();
      }
    });
  }

  //logout
  async keluar(){
    this.loadingCtrl.tampil_loading("");
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
        this.loadingCtrl.tutup_loading();
        this.router.navigate(["/login"], { replaceUrl: true });
      }else {
        this.loadingCtrl.tutup_loading();
      }
    });
  }
}
