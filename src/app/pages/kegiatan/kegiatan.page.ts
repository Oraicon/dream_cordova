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

  constructor(
    private navCtrl: NavController, 
    private router: Router, 
    private setget: SetGetServiceService,
    private apiService: ApiServicesService,
    private loadingService: LoadingServiceService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.tampilkan_data();
  }

  async tampilkan_data(){
    this.loadingService.tampil_loading_login();

    const a = this.setget.getDatakegiatan();

    this.id_header = a[0];
    this.judul_proyek = a[1];

  
    this.apiService.panggil_api_get_progres_detail(this.id_header)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      console.log(data_json);

      if (status_data == 1) {
        this.pisahin_progres_komplit(data_json.data);
        
      } else {
        this.data_masih_proses = [];
        this.data_sudah_komplit = [];
        this.loadingService.tutuploading();
      }
  
    })
    .catch(error => {
      console.log(error);
      this.tutuploading_retry();
    });
  
  }

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

    console.log(this.data_masih_proses);
    console.log(this.data_sudah_komplit);

    this.tutuploading();
  }

  async tutuploading(){
    this.loading = false; 
    this.loadingService.tutuploading();
  }

  tutuploading_retry(){
    this.loadingService.tutuploading();
    this.loadingService.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
      backdrop: false,
      confirmButtonText: 'OK !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutuploading();
        this.tampilkan_data();
      }
    });
  }

  segmentChanged(e){
    this.warna_segment = e.detail.value;
  }

  proyek_kegiatan(id_detail, page_type){
    console.log(id_detail);
    console.log(page_type);

    this.setget.setProses(this.id_header, id_detail);
    this.setget.set_Page(page_type);
    this.navCtrl.navigateForward(['/proses']);
  }

  kembali(){
    // this.strg.set('auth', true);
    // this.navCtrl.back();
    // this.location.back();
    // this.rtr.navigateByUrl('/tabs/tab2');
    this.router.navigate(["/tabs/tab1"], { replaceUrl: true });

  }

}
