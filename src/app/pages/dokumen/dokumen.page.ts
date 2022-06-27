import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { Router } from '@angular/router';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toast.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ModalRiwayatlaporanPage } from 'src/app/modal/modal-riwayatlaporan/modal-riwayatlaporan.page';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-dokumen',
  templateUrl: './dokumen.page.html',
  styleUrls: ['./dokumen.page.scss'],
})
export class DokumenPage implements OnInit {

    //variable
    judul_proyek;
    
    //variable tricky
    loading = true; 
    timeout = 0;
    id_cheklist_dokumen;
    arr_cheklist_dokumen_detail = [];
    data_mentah = [];
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    searchTerm: string;

  constructor(    
    private toast: ToastService,
    private swal: SwalServiceService,
    private modalCtrl: ModalController,
    private router: Router, 
    private setget: SetGetServiceService,
    private apiService: ApiServicesService,
    private loadingService: LoadingServiceService) { }

  //ionic lifecycle
  ngOnInit() {
  }

  //awal masuk page
  ionViewWillEnter(){
    this.setget.setButton(0);
    this.menampilkan_detail_dokumen();
  }

  ionViewDidLeave(){
    this.loading = true;
    this.setget.setButton(0);
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }  

  //delay loading
  interval_counter_loading() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }  

  //menampilkan cheklist dokumen
  async menampilkan_detail_dokumen(){
    this.loadingService.tampil_loading("Memuat data . . . ");

    let a = this.setget.getDokumen();

    this.id_cheklist_dokumen = a[0];
    this.judul_proyek = a[1];

    this.apiService.dapatkan_data_cheklist_dokumen_detail(this.id_cheklist_dokumen)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        this.data_mentah = data_json.data;
        this.looping_data(this.data_mentah);
        // this.arr_cheklist_dokumen_detail = data_json.data;
        // console.log(this.arr_cheklist_dokumen_detail);

        // this.loading = false;
        // this.delay_dulu();
      } else {
        // this.swal.swal_code_error("Terjadi kesalahan !", "Data Kosong !")
        this.loadingService.tutup_loading();
        this.toast.Toast("Terjadi kesalahan !, Data kosong !")
        this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
      }
    })
    .catch(error => {
      console.log(error);

  
      this.loadingService.tutup_loading();

      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 33 !, kembali ke login !");
        }
      }
    });
  }

  //menambahkan kedalam variable
  async looping_data(arr){

    if (arr.length < 9) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        this.arr_cheklist_dokumen_detail.push(element);
  
        if (index == arr.length-1) {
          this.loading = false;
          this.delay_dulu();
        }
        
      }
    } else {
      for (let index = 0; index < 10; index++) {
        const element = arr[index];
        this.arr_cheklist_dokumen_detail.push(element);
  
        if (index == 9) {
          this.loading = false;
          this.delay_dulu();
        }
        
      }
    }
  }

  //memuat banyak data
  async loadData(event) {

    if (this.arr_cheklist_dokumen_detail.length < this.data_mentah.length && this.arr_cheklist_dokumen_detail.length > 9) {
      
      await this.interval_counter_loading();
      this.infiniteScroll.complete();

      this.tambah_data(this.arr_cheklist_dokumen_detail, this.data_mentah);

    } else {
      if(this.arr_cheklist_dokumen_detail.length > 9){
        this.toast.Toast("Seluruh data sudah dimuat !");
      }
      this.infiniteScroll.disabled = true;
    }
    
    // await this.interval_counter_loading();
    // event.target.complete();
    // this.looping_data(this.data_array);

  }

  //persiapan logika penambahan data
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

  //menambahkan data pada variable
  async tambahkan(length_arr_hasil, limit_looping, arr_mentah){
    for (let index = length_arr_hasil; index < limit_looping; index++) {
      let element = arr_mentah[index];

      
      this.arr_cheklist_dokumen_detail.push(element);
    }
    console.log(this.data_mentah);
    console.log(this.arr_cheklist_dokumen_detail);
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

  //delay
  async delay_dulu(){
    await this.interval_counter_loading();
    this.loadingService.tutup_loading();
    return;
  }

  //memuat ulang
  relog(){
    this.judul_proyek;
    this.loading = true; 
    this.timeout = 0;
  
    this.id_cheklist_dokumen;
    this.arr_cheklist_dokumen_detail = [];

    this.ionViewWillEnter();
  }

  //jika tidak ada respon
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

  //jika terjadi kesalahan / error
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

  //pindah ke lapor dokumen
  async lapordokumen(id, uraian, pic){

    console.log(id, uraian, pic);
    this.setget.setDokumen_detail(id, uraian, pic, null, null);

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);
      this.router.navigate(["/lapordokumen"], { replaceUrl: true });
    } else {
      this.toast.Toast_tampil();
    }
  }

  //pindah ke riwayat laporan
  async riwayatlaporan(id,uraian, pic, keterangan, upload_dokumen){
    this.setget.setDokumen_detail(id, uraian, pic, keterangan, upload_dokumen);

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);
      this.router.navigate(["/listdokumen"], { replaceUrl: true });
    } else {
      this.toast.Toast_tampil();
    }
  }

}
