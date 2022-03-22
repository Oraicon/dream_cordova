import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-kegiatan',
  templateUrl: './kegiatan.page.html',
  styleUrls: ['./kegiatan.page.scss'],
})
export class KegiatanPage implements OnInit {

  warna_segment = 1;
  id_header;
  judul_proyek;
  data_masih_proses;
  data_sudah_komplit;
  data_kegiatan;
  loading = true; 
  timeout = 0;

  constructor(
    private navCtrl: NavController, 
    private router: Router, 
    private setget: SetGetServiceService,
    private apiService: ApiServicesService,
    private loadingService: LoadingServiceService
  ) { }

  ngOnInit() {
  }

  //masuk_page
  ionViewWillEnter(){
    this.tampilkan_data();
  }

  //get data kegiatan
  async tampilkan_data(){
    this.loadingService.tampil_loading_login();

    const a = this.setget.getDatakegiatan();

    this.id_header = a[0];
    this.judul_proyek = a[1];

  
    this.apiService.panggil_api_get_progres_detail(this.id_header)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        this.pisahin_progres_komplit(data_json.data);
        
      } else {
        this.data_masih_proses = [];
        this.data_sudah_komplit = [];
        this.loadingService.tutuploading();
      }
  
    })
    .catch(error => {
      this.loadingService.tutuploading();
      this.timeout++;
      // console.log(error);
      if (error.status == -4) {
        this.tidak_ada_respon();
      } else if (this.timeout == 2){
        this.keluar_aplikasi();
      } else {
        this.gagal_coba_lagi();
      }
    });
  
  }

  //olah data kegiatan
  async pisahin_progres_komplit(arr){
    let panjang_arr;

    panjang_arr = arr.length;

    let a = [];
    let b = [];

    for (let i = 0; i < panjang_arr; i++) {

      if (arr[i].status_pengerjaan == "IN PROGRESS") {
        a.push(arr[i]);
      }else{
        b.push(arr[i]);
      }
    }
    
    this.data_masih_proses = a;
    this.data_sudah_komplit = b;
    a = [];
    b = [];

    this.tutuploading();
    this.timeout = 0;
  }

  async tutuploading(){
    this.loading = false; 
    this.loadingService.tutuploading();
  }

  segmentChanged(e){
    this.warna_segment = e.detail.value;
  }

  proyek_kegiatan(id_detail, page_type){

    this.setget.setProses(this.id_header, id_detail);
    this.setget.set_Page(page_type);
    this.navCtrl.navigateForward(['/proses']);
  }

  kembali(){
    this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
  }

  async tidak_ada_respon(){
    this.loadingService.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Server tidak merespon, tekan iya untuk mencoba lagi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutuploading();
        this.tampilkan_data();
      }
    });
  }

  async gagal_coba_lagi(){
    this.loadingService.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Tekan iya untuk mencoba lagi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutuploading();
        this.tampilkan_data();
      }
    });
  }

  async keluar_aplikasi(){
    this.loadingService.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Keluar dari aplikasi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutuploading();
        navigator['app'].exitApp();
      }
    });
  }

}
