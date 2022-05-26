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

@Component({
  selector: 'app-dokumen',
  templateUrl: './dokumen.page.html',
  styleUrls: ['./dokumen.page.scss'],
})
export class DokumenPage implements OnInit {

    //variable
    judul_proyek;
    loading = true; 
    timeout = 0;
  
    id_cheklist_dokumen;
    arr_cheklist_dokumen_detail = [];

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
        this.arr_cheklist_dokumen_detail = data_json.data;
        console.log(this.arr_cheklist_dokumen_detail);

        this.loading = false;
      } else {
        
      }

      this.delay_dulu();
      
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
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

  async tutup_loading(){
    await this.interval_counter_loading();
    this.loadingService.tutup_loading();
    return;
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

  async delay_dulu(){
    await this.interval_counter_loading();
    this.loadingService.tutup_loading();
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
        // this.menampilkan_detail_kegiatan();
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

  lapordokumen(id, uraian, pic){

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

  async riwayatlaporan(id,uraian, pic, keterangan, upload_dokumen){
    this.setget.setDokumen_detail(id, uraian, pic, keterangan, upload_dokumen);

    const modal = await this.modalCtrl.create({
      component: ModalRiwayatlaporanPage,
    });
    return await modal.present();
  }
}
