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
  judul_proyek;
  loading = true; 
  timeout = 0;

  detail_kegiatan;
  searchTerm: string;

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
    this.menampilkan_detail_kegiatan();
  }

  ionViewDidLeave(){
    this.loading = true;
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }  

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

  async menampilkan_detail_kegiatan(){
    this.loadingService.tampil_loading("Memuat data . . .");

    const a = this.setget.getDatakegiatan();

    const id_master_rap = a[0];
    this.judul_proyek = a[1];

    this.apiService.dapatkan_data_proyek_rap_detail(id_master_rap)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {

        this.detail_kegiatan = data_json.data;

        this.loading = false;
        this.loadingService.tutup_loading();
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
        this.menampilkan_detail_kegiatan();
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
