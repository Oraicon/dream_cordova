import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { Router } from '@angular/router';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toast.service';
import { IonInfiniteScroll } from '@ionic/angular';


@Component({
  selector: 'app-kegiatan',
  templateUrl: './kegiatan.page.html',
  styleUrls: ['./kegiatan.page.scss'],
})
export class KegiatanPage implements OnInit {

  //variable
  judul_proyek;
  loading = true; 
  timeout = 0;
  data_array = [];

  detail_kegiatan = [];
  searchTerm: string;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private toast: ToastService,
    private swal: SwalServiceService,
    private router: Router, 
    private setget: SetGetServiceService,
    private apiService: ApiServicesService,
    private loadingService: LoadingServiceService
  ) { 

  }

  async loadData(event) {

    if (this.detail_kegiatan.length < this.data_array.length) {
      
      await this.interval_counter_loading();
      this.infiniteScroll.complete();

      this.tambah_data(this.detail_kegiatan, this.data_array);

    } else {
      this.toast.Toast("Seluruh data sudah dimuat !");
      this.infiniteScroll.disabled = true;
    }
    
    // await this.interval_counter_loading();
    // event.target.complete();
    // this.looping_data(this.data_array);

  }

  async tambah_data(arr_hasil, arr_mentah){
    let length_arr_hasil = arr_hasil.length;
    let lenth_arr_mentah = arr_mentah.length;
    let hasil_pengolahan = length_arr_hasil + 10;
    let limit_looping = 0;

    if (hasil_pengolahan <= lenth_arr_mentah) {
      limit_looping = hasil_pengolahan;
    } else {
      let a = lenth_arr_mentah - length_arr_hasil;
      let b = length_arr_hasil + a;
      limit_looping = b;
    }
    

    console.log(limit_looping);

    this.tambahkan(length_arr_hasil, limit_looping, arr_mentah);
  }

  async tambahkan(length_arr_hasil, limit_looping, arr_mentah){
    for (let index = length_arr_hasil; index < limit_looping; index++) {
      let element = arr_mentah[index];

      let obj_mentah = {
        no: index + 1,
        id: element.id,
        uraian_kegiatan: element.uraian_kegiatan
      }
      
      this.detail_kegiatan.push(obj_mentah);
    }
    console.log(this.detail_kegiatan);
    console.log(this.data_array);
  }

  //ionic lifecycle
  ngOnInit() {
  }

  //awal masuk page
  ionViewWillEnter(){
    this.menampilkan_detail_kegiatan();
    this.setget.setButton(0);
  }

  ionViewDidLeave(){
    this.loading = true;
    this.setget.setButton(0);
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }  

  //delay
  interval_counter_looping() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 50);});
  }  

  //delay loading
  interval_counter_loading() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }  

  //pindah aktiviti
  proyek_kegiatan(id_detail){
    console.log(id_detail);
    this.setget.setProses(id_detail);
    this.setget.set_Page(1);

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.router.navigate(["/proses"], { replaceUrl: true });

    } else {
      this.toast.Toast_tampil();
    }
    // this.navCtrl.navigateForward(['/proses']);
  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.router.navigate(["/tabs/tab1"], { replaceUrl: true });

    } else {
      this.toast.Toast_tampil();
    }
  }

  async menampilkan_detail_kegiatan(){
    this.interval_counter();
    this.loadingService.tampil_loading("Memuat data . . .");

    const a = this.setget.getDatakegiatan();

    const id_master_rap = a[0];
    this.judul_proyek = a[1];

    this.apiService.dapatkan_data_proyek_rap_detail(id_master_rap)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {

        let arr_mentah = data_json.data;
        this.data_array = arr_mentah;

        this.looping_data(arr_mentah);

        // for (let index = 0; index < arr_mentah.length; index++) {
        // for (let index = 0; index < 11; index++) {
        //   let element = arr_mentah[index];

        //   let obj_mentah = {
        //     id: element.id,
        //     uraian_kegiatan: element.uraian_kegiatan
        //   }
          
        //   this.detail_kegiatan.push(obj_mentah);

        //   if (index == 10) {
        //     this.loading = false;

        //     this.delay_dulu();
        //   }
        // }

        // this.detail_kegiatan = data_json.data;

      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "Data Kosong !")
      }
    })
    .catch(error => {
  
      console.log(error)
  
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

  async looping_data(arr){
    for (let index = 0; index < 10; index++) {
      // await this.interval_counter_looping();
      let element = arr[index];
      
      let obj_mentah = {
        no: index + 1,
        id: element.id,
        uraian_kegiatan: element.uraian_kegiatan
      }
      
      this.detail_kegiatan.push(obj_mentah);

      if (index == 9) {
        this.loading = false;

        this.delay_dulu();
        console.log(this.detail_kegiatan);
        console.log(this.data_array);
      }
    }
  }

  async delay_dulu(){
    await this.interval_counter_loading();
    this.loadingService.tutup_loading();
  }

  relog(){
    this.judul_proyek;
    this.loading = true; 
    this.timeout = 0;
    this.detail_kegiatan;
    this.menampilkan_detail_kegiatan();
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
        this.relog();
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
