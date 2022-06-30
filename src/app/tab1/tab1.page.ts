import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { MomentService } from '../services/moment.service';
import { SetGetServiceService } from '../services/set-get-service.service';
import { SwalServiceService } from '../services/swal-service.service';
import Swal from 'sweetalert2';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //variabel
  //loading
  data_beranda = false;
  data_beranda_loading_tidak_ada = false;

  //variable data 
  data_rap = [];
  obj_data_rap = {};
  jumlah_data_kegiatan_rap = 0;
  obj_jumlah_kegiatan = {};
  obj_jumlah_cheklist_dokumen = {};
  tanggal_moment = {};

  ida_data_rap = [];
  data_notif_ = false;
  notif_ada = [];

  //variable triky
  timeout = 0;
  penghitung_loading = 0;

  constructor(
    private swalService: SwalServiceService,
    private setget: SetGetServiceService,
    private toast: ToastService,
    private loadingCtrl: LoadingServiceService, 
    private momentService: MomentService,
    private storage:Storage, 
    private router: Router, 
    private apiService:ApiServicesService) {
    
    //pengecekan koneksi
    this.setget.set_koneksi(1);
    //pengecekan root page
    this.setget.set_tab_page(0);
    //manggil data
    this.menampilkan_data_rap();
  }

  ionViewWillEnter(){
    this.setget.setButton(0);
  }

  //delay
  interval_counter(timer) {
    return new Promise(resolve => { setTimeout(() => resolve(""), timer);});
  }

  //refresh page
  doRefresh(event){
    event.target.complete();
    //membuat variable kosong
    this.data_beranda = false;
    this.data_beranda_loading_tidak_ada = false;
  
    //variable data 
    this.data_rap = [];
    this.obj_data_rap = {};
    this.jumlah_data_kegiatan_rap = 0;
    this.obj_jumlah_kegiatan = {};
    this.obj_jumlah_cheklist_dokumen = {};
    this.tanggal_moment = {};
  
    this.ida_data_rap = [];
    this.data_notif_ = false;
    this.notif_ada = [];
  
    //variable triky
    this.timeout = 0;
    this.penghitung_loading = 0;
    this.menampilkan_data_rap();
  }

  //pindah aktiviti ke kegiatan
  kegiatan(e, f){
    this.setget.setDatakegiatan(e, f);
    this.setget.set_tab_page(1);

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);
      this.router.navigate(["/kegiatan"], { replaceUrl: true });
    } else {
      this.toast.Toast_tampil();
    }
  }

  //pindah aktiviti ke ceklist dokumen
  cdokumen(e, f){
    this.setget.setDokumen(e, f);

    this.setget.set_tab_page(1);

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);
      this.router.navigate(["/dokumen"], { replaceUrl: true });
    } else {
      this.toast.Toast_tampil();
    }
  }

  //pindah aktiviti ke notifikasi
  notif(){
    this.setget.set_tab_page(1);

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);
      this.router.navigate(["/notif"], { replaceUrl: true });
    } else {
      this.toast.Toast_tampil();
    }
  }

  //memuat ulang
  relog(){
    this.data_beranda = false;
    this.data_beranda_loading_tidak_ada = false;

    this.data_rap = [];
    this.obj_data_rap = {};
    this.jumlah_data_kegiatan_rap = 0;
    this.obj_jumlah_kegiatan = {};
    this.obj_jumlah_cheklist_dokumen = {};
    this.tanggal_moment = {};

    this.ida_data_rap = [];
    this.data_notif_ = false;
    this.notif_ada = [];

    this.timeout = 0;
    this.penghitung_loading = 0;

    this.menampilkan_data_rap();
  }

  //menampilkan data
  //menampilkan data part 1
  async menampilkan_data_rap(){

    this.loadingCtrl.tampil_loading("Memuat data . . .");
    this.penghitung_loading = 0;

    const data_l_nama = await this.storage.get('nama');

    this.apiService.dapatkan_data_proyek_rap_master(data_l_nama)
    .then(data => {

      console.log(data);

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      console.log(data_json);

      if (status_data == 1) {
        this.data_rap = data_json.data;
        this.data_rap.reverse();

        for (let index = 0; index < this.data_rap.length; index++) {
          let rap_status = this.data_rap[index].id_status;

          if (rap_status == 12) {
            let element = this.data_rap[index];
            
            this.obj_data_rap["data_rap1_"+index] = "tidak_kosong";

            this.ida_data_rap.push(element.id);

            this.tanggal_moment["periodeawal"+index] = this.momentService.ubah_format_tanggal(element.periode_awal);
            this.tanggal_moment["periodeakhir"+index] = this.momentService.ubah_format_tanggal(element.periode_akhir);
            
            this.menampilkan_seluruh_kegiatan(this.data_rap[index].id, index, data_l_nama);

          } 
          
          // if (rap_status == 18) {
            
          //   this.obj_data_rap["data_rap1_"+index] = "kosong";
          //   this.obj_data_rap["data_rap3_"+index] = "selesai";

          //   this.ida_data_rap.push(0);

          //   if (index == this.data_rap.length - 1 || index == 0) {
          //     this.data_beranda = true;
          //     this.data_beranda_loading_tidak_ada = true;
          //     this.data_notif();
          //   }
          // } 
          
          if (rap_status != 12 ) {
            this.obj_data_rap["data_rap1_"+index] = "kosong";
            this.obj_data_rap["data_rap2_"+index] = true;
            this.ida_data_rap.push(0);

            if (index == this.data_rap.length - 1 || index == 0) {
              this.data_beranda = true;
              this.data_beranda_loading_tidak_ada = true;
              this.data_notif();
            }
          }
        }

      } else {
        this.data_rap.push(0);

        this.obj_data_rap["data_rap1_"+0] = "kosong";
        this.obj_data_rap["data_rap2_"+0] = true;

        this.data_beranda = false;
        this.data_beranda_loading_tidak_ada = true;

        this.loadingCtrl.tutup_loading();
        // this.data_notif();
      }
  
    })
    .catch(error => {

      console.log(error);

      this.loadingCtrl.tutup_loading();
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 15 !, kembali ke login !");
        }
      }
    });

  }

  //menampilkan data part 2
  async menampilkan_seluruh_kegiatan(id_rap_master, index, nama){

    this.apiService.dapatkan_data_proyek_rap_detail(id_rap_master)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {

        this.jumlah_data_kegiatan_rap = data_json.data.length;

        this.obj_jumlah_kegiatan[index] = this.jumlah_data_kegiatan_rap;

        if (index == this.data_rap.length - 1 || index == 0) {

          this.menampilkan_dokumen_ceklist(id_rap_master, index, nama);
        }

      } else {
        this.obj_jumlah_kegiatan[index] = 0;

        if (index == this.data_rap.length - 1 || index == 0) {

          this.menampilkan_dokumen_ceklist(id_rap_master, index, nama);
  
        }
      }
    })
    .catch(error => {

      console.log(error)
  
      this.loadingCtrl.tutup_loading();
  
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 16 !, kembali ke login !");
        }
      }
  
    });
  }

  //menampilkan data part 3
  async menampilkan_dokumen_ceklist(id_master_rap, index, nama){

    this.apiService.dapatkan_data_cheklist_dokumen(nama, id_master_rap)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {

        let id_cheklist = data_json.data[0].id_checklist_dokumen;
        let banyak_dokumen = data_json.data[0].banyak_data_cheklist_dokumen;

        this.obj_jumlah_cheklist_dokumen["id"+index] = id_cheklist;
        this.obj_jumlah_cheklist_dokumen["banyak"+index] = banyak_dokumen;

        if (index == this.data_rap.length - 1 || index == 0) {
          this.data_beranda = true;
          this.data_notif();
        }

      } else {

        if (index == this.data_rap.length - 1 || index == 0) {
          this.data_beranda = true;
  
          this.obj_jumlah_cheklist_dokumen[index] = 0;
          this.data_notif();
        }
      }
  
    })
    .catch(error => {

      console.log(error)
  
      this.loadingCtrl.tutup_loading();
  
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 70 !, kembali ke login !");
        }
      }
  
    });
  }

  //pengecekan notifikasi
  async data_notif(){
    await this.ida_data_rap;
    this.setget.setArrIdRap(this.ida_data_rap);
    let arr = this.ida_data_rap;

    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];

      this.api_data_notif(element)
    }

  }

  //menampilkan notif sesuai rapnya
  async api_data_notif(id_rap){
    console.log(2);
    const data_l_nama = await this.storage.get('nama');
    this.apiService.get_notif_status(id_rap, data_l_nama)
    .then(data => {
      console.log(data)

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        this.notif_ada.push(1);

        this.penghitung_loading++;
        
        if (this.penghitung_loading == this.data_rap.length - 1 || this.penghitung_loading == 1) {
          this.tutuploading_notif();
        }
      }else{
        this.notif_ada.push(0);

        this.penghitung_loading++;

        if (this.penghitung_loading == this.data_rap.length - 1 || this.penghitung_loading == 1) {
          this.tutuploading_notif();
        }
      }
    })
    .catch(error => {
  
      console.log(error)
  
      this.loadingCtrl.tutup_loading();
  
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 52 !, kembali ke login !");
        }
      }
    });
  }

  //tutup loading
  async tutuploading_notif(){

    let notif = this.notif_ada.find(element => element == 1);

    this.data_beranda_loading_tidak_ada = true;

    if (notif == 1) {
      this.data_notif_ = true;
    } else {
      this.data_notif_ = false;
    }

    this.loadingCtrl.tutup_loading();

  }

  //tidak ada respon
  async tidak_ada_respon(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }
    
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
        this.relog();
      }
    });
  }

  //tidak ada respon keluar / terjadi error
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
}
