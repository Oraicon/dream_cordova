import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-kegiatan',
  templateUrl: './kegiatan.page.html',
  styleUrls: ['./kegiatan.page.scss'],
})
export class KegiatanPage implements OnInit {

  //variable
  @ViewChild('slides') slides;
  warna_segment = 1;
  id_header;
  judul_proyek;
  data_masih_proses;
  data_sudah_komplit;
  data_kegiatan;
  loading = true; 
  timeout = 0;

  detail_kegiatan;
  searchTerm: string;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    pagination: false
  };

  constructor(
    private navCtrl: NavController, 
    private swal: SwalServiceService,
    private router: Router, 
    private setget: SetGetServiceService,
    private apiService: ApiServicesService,
    private loadingService: LoadingServiceService
  ) { 

  }

  //ionic lifecycle
  ngOnInit() {
  }

  //awal masuk page
  ionViewWillEnter(){
    this.warna_segment = 1;
    // this.tampilkan_data();
    this.menampilkan_detail_kegiatan();
  }

  ionViewDidLeave(){
    this.loading = true;
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }  

  //fungsi ion select dengan ion slides
  segmentChanged(e){
    this.warna_segment = e.detail.value;

    if (this.warna_segment == 1) {
      this.slides.slideTo(0, 400);
    }else{
      this.slides.slideTo(1, 400);
    }
  }

  slideDidChange() {
    this.slides.getActiveIndex().then(index => {
      if (index == 0) {
        this.warna_segment = 1;
      } else {
        this.warna_segment = 2;
      }
    });
  };

  //pindah aktiviti
  proyek_kegiatan(id_detail){
    console.log(id_detail);
    this.setget.setProses(null, id_detail);
    this.setget.set_Page(1);
    this.navCtrl.navigateForward(['/proses']);
  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
  }

  //get data kegiatan
  async tampilkan_data(){
    this.loadingService.tampil_loading("Memuat data . . .");

    const a = this.setget.getDatakegiatan();

    this.id_header = a[0];
    this.judul_proyek = a[1];

    this.interval_counter();
  
    this.apiService.panggil_api_get_progres_detail(this.id_header)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        this.pisahin_progres_komplit(data_json.data);
        
      } else {
        this.data_masih_proses = [];
        this.data_sudah_komplit = [];
        this.loadingService.tutup_loading();
      }
  
    })
    .catch(error => {
      this.loadingService.tutup_loading();
      this.timeout++;
      
      if (this.timeout >= 3) {
          this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 18 !, kembali ke login !");
        }
      }
    });
  }

  async menampilkan_detail_kegiatan(){
    const a = this.setget.getDatakegiatan();
    const id_master_rap = a[0];

    this.apiService.dapatkan_data_proyek_rap_detail(id_master_rap)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {

        this.detail_kegiatan = data_json.data;
        console.log(this.detail_kegiatan);


      }
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
    });

  }

  //olah data kegiatan memisahkan prgores dan komplit
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

    this.loading = false; 
    this.loadingService.tutup_loading();
    this.timeout = 0;
  }

  async tidak_ada_respon(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingService.tutup_loading();
    }

    this.loadingService.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Tidak ada respon, coba lagi ?!',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutup_loading();
        this.tampilkan_data();
      }
    });
  }

  async keluar_aplikasi(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingService.tutup_loading();
    }

    this.loadingService.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Keluar dari aplikasi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutup_loading();
        navigator['app'].exitApp();
      }
    });
  }
}
