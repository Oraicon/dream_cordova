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

  //variable triky
  timeout = 0;

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

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }

  //refresh page
  doRefresh(event){
    event.target.complete();
    //membuat variable kosong
    this.data_rap = [];
    this.obj_data_rap = {};
    this.jumlah_data_kegiatan_rap = 0;
    this.obj_jumlah_kegiatan = {};
    this.tanggal_moment = {};
    this.timeout = 0;


    this.data_beranda_loading_tidak_ada = false;
    this.menampilkan_data_rap();
  }

  //pindah aktiviti
  kegiatan(e, f){
    console.log(e);
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

  cdokumen(e, f){
    console.log(e, f);

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

  async menampilkan_data_rap(){

    this.loadingCtrl.tampil_loading("Memuat data . . .");
    const data_l_nama = await this.storage.get('nama');
    
    await this.interval_counter();
    this.apiService.dapatkan_data_proyek_rap_master(data_l_nama)
    .then(data => {

      console.log(data.data)

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {

        this.data_rap = data_json.data;

        for (let index = 0; index < this.data_rap.length; index++) {
          let rap_status = this.data_rap[index].id_status;

          if (rap_status == 12) {
            let element = this.data_rap[index];
            
            this.obj_data_rap["data_rap1_"+index] = "tidak_kosong";
            console.log(this.obj_data_rap);

            // this.obj_data_rap[index] = element;

            this.tanggal_moment["periodeawal"+index] = this.momentService.ubah_format_tanggal(element.periode_awal);
            this.tanggal_moment["periodeakhir"+index] = this.momentService.ubah_format_tanggal(element.periode_akhir);
            
            this.menampilkan_seluruh_kegiatan(this.data_rap[index].id, index, data_l_nama);
          } 
          
          if (rap_status == 18) {
            
            this.obj_data_rap["data_rap1_"+index] = "kosong";
            this.obj_data_rap["data_rap3_"+index] = "selesai";

            console.log(this.obj_data_rap);

            if (index == this.data_rap.length - 1 || index == 0) {
              this.data_beranda = true;
              this.data_beranda_loading_tidak_ada = true;
              this.loadingCtrl.tutup_loading();
            }
          } 
          
          if (rap_status != 12 && rap_status != 18) {
            this.obj_data_rap["data_rap1_"+index] = "kosong";
            this.obj_data_rap["data_rap2_"+index] = false;
            if (index == this.data_rap.length - 1 || index == 0) {
              this.data_beranda = true;
              this.data_beranda_loading_tidak_ada = true;
              this.loadingCtrl.tutup_loading();
            }
          }
        }

      } else {

        console.log("data != 1");
        
        this.data_rap = [0];

        this.obj_data_rap["data_rap1"+0] = "kosong";
        this.obj_data_rap["data_rap2"+0] = true;

        console.log(this.obj_data_rap);

        this.data_beranda = false;
        this.data_beranda_loading_tidak_ada = true;
        this.loadingCtrl.tutup_loading();
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
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 15 !, kembali ke login !");
        }
      }
    });

  }

  async menampilkan_seluruh_kegiatan(id_rap_master, index, nama){

    this.apiService.dapatkan_data_proyek_rap_detail(id_rap_master)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {

        this.jumlah_data_kegiatan_rap = data_json.data.length;

        this.obj_jumlah_kegiatan[index] = this.jumlah_data_kegiatan_rap;

        if (index == this.data_rap.length - 1 || index == 0) {
          // this.data_beranda = true;
          // this.data_beranda_loading_tidak_ada = true;
          // this.loadingCtrl.tutup_loading();
          this.menampilkan_dokumen_ceklist(id_rap_master, index, nama);
        }

      } else {
        this.obj_jumlah_kegiatan[index] = 0;

        if (index == this.data_rap.length - 1 || index == 0) {
          // this.loadingCtrl.tutup_loading();
          // this.data_beranda = true;
          // this.data_beranda_loading_tidak_ada = true;
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
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 16 !, kembali ke login !");
        }
      }
  
    });
  }

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
          this.data_beranda_loading_tidak_ada = true;
          this.loadingCtrl.tutup_loading();
        }

      } else {

        if (index == this.data_rap.length - 1 || index == 0) {
          this.loadingCtrl.tutup_loading();
          this.data_beranda = true;
          this.data_beranda_loading_tidak_ada = true;
  
          this.obj_jumlah_cheklist_dokumen[index] = 0;
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
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 16 !, kembali ke login !");
        }
      }
  
    });
  }
  
  async tidak_ada_respon(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }

    this.data_rap = [];
    this.jumlah_data_kegiatan_rap = 0;
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
        this.menampilkan_data_rap();
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

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.loadingCtrl.tampil_loading("");
      Swal.fire({
        icon: 'warning',
        title: 'Keluar akun ?',
        text: 'Kembali ke login, anda yakin ?',
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'Ya',
        showDenyButton: true,
        denyButtonText: `Tidak`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingCtrl.tutup_loading();
          this.router.navigate(["/login"], { replaceUrl: true });
        }else {
          this.loadingCtrl.tutup_loading();
        }
      });

    } else {
      this.toast.Toast_tampil();
    }
  }
}
