import { Component, OnInit } from '@angular/core';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { NavController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { MomentService } from 'src/app/services/moment.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-proses',
  templateUrl: './proses.page.html',
  styleUrls: ['./proses.page.scss'],
})
export class ProsesPage implements OnInit {

  //variable
  timeout = 0;
  data_type_page;
  data_id_header;
  data_id_kegiatan;
  data_judul_kegiatan;
  data_obj_kegiatan = {};
  data_obj_kegiatan_tanggal = {};
  status_pengerjaan;
  data_arr_progressmilsetone;
  persen_tertinggi;
  tanggal_pm = {};
  tanggal_detail;
  tipe_page = true;
  riwayat_laporan = false;
  riwayat_loading = true;

  constructor(private momentService: MomentService,
    private swal: SwalServiceService,
    private apiService: ApiServicesService, 
    private loadingService: LoadingServiceService, 
    private navCtrl: NavController, 
    private setget: SetGetServiceService,) { 
      
  }

  ngOnInit() {
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 1000);});
  }

  //awal masuk page
  async ionViewWillEnter(){
    this.tampilkan_data();
  }

  kembali(){
    this.navCtrl.back();
  }

  ionViewDidLeave(){
    this.riwayat_laporan = false;
    this.riwayat_loading = true;
  }

  //menampilkan data progres detail
  async tampilkan_data(){
    this.loadingService.tampil_loading_login();
    const a = this.setget.getProses();
    const b = this.setget.get_Page();

    this.data_id_header = a[0];
    this.data_id_kegiatan = a[1];

    this.data_type_page = b;

    if (this.data_type_page == 1) {
      this.tipe_page = false;
    } else {
      this.tipe_page = true; 
    }

    this.interval_counter();

    this.apiService.panggil_api_get_progres_detail(this.data_id_header)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const arr = data_json.data;

      if (arr.length == 0) {
        
      } else {
        for (let index = 0; index < arr.length; index++) {
          if (arr[index].id == this.data_id_kegiatan) {
            this.data_obj_kegiatan = arr[index];
            this.data_judul_kegiatan = arr[index].nama_kegiatan;
            if (arr[index].status_pengerjaan == "IN PROGRESS") {
              this.status_pengerjaan = "Sedang diproses"
            } else {
              this.status_pengerjaan = "Sudah selesai"
            }
            if (arr[index].completed_date != null) {
              this.tanggal_detail = this.momentService.ubah_format_tanggal(arr[index].completed_date);
            } else {
              this.tanggal_detail = null;
            }
          }
        }
        this.tampilkan_data2();
      }
      
    })
    .catch(error => {
      this.timeout++;
      this.loadingService.tutuploading();
      // console.log(error);
      if (this.timeout == 2) {
        this.keluar_aplikasi();
    } else {
      if (error.status == -4) {
        this.tidak_ada_respon();
      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 19 !, kembali ke login !");
      }
    }
  
    });
  }

  //menampilkan data progres milestone
  async tampilkan_data2(){
    
    this.interval_counter();

    this.apiService.panggil_api_progres_milestone(this.data_id_kegiatan)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 1) {
        const array_milestone = data_json.data;

        if (array_milestone != 0) {
          array_milestone.sort(this.compare);
          array_milestone.reverse();
          this.data_arr_progressmilsetone = array_milestone;
          this.persen_tertinggi = array_milestone[0].progress_pengerjaan;
    
          this.asynctanggal();
        } else {
          this.data_arr_progressmilsetone = null;
        }
      }
      else{
        this.riwayat_loading = false;
        this.loadingService.tutuploading();
      }
    })
    .catch(error => {
      // console.log(error);
      this.loadingService.tutuploading();

      if (this.timeout == 2) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 20 !, kembali ke login !");
        }
      }
    });

  }

  // mengubah format tanggal
  asynctanggal(){
    const arr_ms =  this.data_arr_progressmilsetone
    const arr_ms_length = this.data_arr_progressmilsetone.length;

    for (let index = 0; index < arr_ms_length; index++) {
      let id_ms = arr_ms[index].id;

      let tanggal = this.momentService.ubah_format_tanggal(arr_ms[index].create_date);

      this.tanggal_pm[id_ms] = tanggal;
    }

    this.riwayat_laporan = true;
    this.riwayat_loading = false;
    this.loadingService.tutuploading();
    this.back_with_success();
  }

  //gambar rusak
  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  //logika compare isi ada persen
  compare( a, b ) {
    return a.progress_pengerjaan - b.progress_pengerjaan;
  }

  //pindah aktiviti
  formulir(){
    let a = this.persen_tertinggi;
    
    if(a == undefined){
      a = 0;
    }else{
      a = this.persen_tertinggi;
    }

    this.setget.setLog(this.data_id_kegiatan, this.data_judul_kegiatan);
    this.setget.set_persen(a);

    this.navCtrl.navigateForward(['/lapor']);
  }

  //berhasil mengirim data
  async back_with_success(){
    await this.setget.getAlert();
    
    if (this.setget.getAlert() == 1) {
      this.swal.swal_aksi_berhasil("Laporan Terkirim !", "Data laporan telah terkirim !");
      this.setget.setAlert(0);
    }
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
