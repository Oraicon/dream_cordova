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
  data_arr_progressmilsetone = [];
  persen_tertinggi;
  tanggal_pm = {};
  data_gambar_rusak = {};
  tanggal_detail;
  tipe_page = true;
  hidedetail = false;
  riwayat_laporan = false;
  riwayat_loading = false;
  data_swal;
  imgURL;

  data_list_evidance_img = {};

  data_detail_kegiatan = {};

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";

  constructor(private momentService: MomentService,
    private swal: SwalServiceService,
    private apiService: ApiServicesService, 
    private loadingService: LoadingServiceService, 
    private navCtrl: NavController, 
    private setget: SetGetServiceService,) { 
      
  }

  ngOnInit() {
  }

  //ionic lifecycle
  async ionViewWillEnter(){
    this.setget.set_swal(0);
    // this.tampilkan_data();
    this.dapatkan_kegiatan_detail_kegiatan_rap();
  }

  ionViewDidLeave(){
    this.riwayat_laporan = false;
    this.riwayat_loading = true;
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }

  //delay file transfer 30 detik
  delay() {
    console.log("masuk dealy");
    return new Promise(resolve => { setTimeout(() => resolve(""), 30000);});
  }

  async delayed(){
    await this.delay();
    return 1;
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
    this.loadingService.tutup_loading();
    this.back_with_success();
  }

  //gambar rusak
  errorHandler(event, a) {
    event.target.src = "assets/bi.png";
    this.data_gambar_rusak[a] = "rusak";
  }

  //minimize detail informasi
  hide_detail(){
    if (this.hidedetail == true) {
      this.hidedetail = false;
    } else {
      this.hidedetail = true;
    }
  }

  //logika compare isi ada persen
  compare( a, b ) {
    return a.date_created - b.date_created;
  }

  //berhasil mengirim data
  async back_with_success(){
    await this.setget.getAlert();
    
    if (this.setget.getAlert() == 1) {
      this.swal.swal_aksi_berhasil_timer2d("Berhasil !", "Data laporan telah terkirim !");
      this.setget.setAlert(0);
    }
  }

  //pindah aktiviti laporan
  formulir(){
    let a = this.persen_tertinggi;
    
    if(a == undefined){
      a = 0;
    }else{
      a = this.persen_tertinggi;
    }

    this.setget.setLog(this.data_detail_kegiatan, this.data_judul_kegiatan);
    this.setget.set_persen(a);

    this.navCtrl.navigateForward(['/lapor']);
  }

  // pindah aktiviti detail riwayat
  lihat_list(arr_data_list, kode_barang){
    console.log(kode_barang);
    let arr_list_data = arr_data_list.split(",");
    console.log(arr_list_data);
    this.setget.set_list_path(arr_list_data, kode_barang);

    this.navCtrl.navigateForward(['/list']);
  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    this.navCtrl.back();
  }

  //menampilkan data progres detail
  async tampilkan_data(){
    this.data_gambar_rusak = {};
    this.riwayat_laporan = false;
    this.riwayat_loading = true;
    this.loadingService.tampil_loading("Memuat data . . .");
    const a = this.setget.getProses();
    const b = this.setget.get_Page();

    this.data_id_header = a[0];
    this.data_id_kegiatan = a[1];

    console.log(this.data_id_kegiatan);

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
      this.loadingService.tutup_loading();
      // console.log(error);
      if (this.timeout >= 3) {
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
    
    let arr = [];

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
        this.loadingService.tutup_loading();
      }
    })
    .catch(error => {
      // console.log(error);
      this.loadingService.tutup_loading();

      this.data_swal = this.setget.get_swal();

      if(this.data_swal == 0){
        this.setget.set_swal(1);
        if (this.timeout >= 3) {
          this.keluar_aplikasi();
        } else {
          if (error.status == -4) {
            this.tidak_ada_respon();
          } else {
            this.swal.swal_code_error("Terjadi kesalahan !", "code error 20 !, kembali ke login !");
          }
        }
      }
    });

  }


  async tidak_ada_respon(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingService.tutup_loading();
    }

    this.data_type_page;
    this.data_id_header;
    this.data_id_kegiatan;
    this.data_judul_kegiatan;
    this.data_obj_kegiatan = {};
    this.data_obj_kegiatan_tanggal = {};
    this.status_pengerjaan;
    this.data_arr_progressmilsetone;
    this.persen_tertinggi;
    this.tanggal_pm = {};
    this.tanggal_detail;
    this.tipe_page = true;
    this.riwayat_laporan = false;
    this.riwayat_loading = true;

    this.loadingService.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Server tidak merespon, coba lagi ?!',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutup_loading();
        this.setget.set_swal(0);
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

  async dapatkan_kegiatan_detail_kegiatan_rap(){
    const a = this.setget.getProses();

    this.data_id_kegiatan = a[1];

    console.log(this.data_id_kegiatan);

    this.data_id_kegiatan = a[1];

    this.tipe_page = false;

    this.apiService.dapatkan_data_detail_kegiatan(this.data_id_kegiatan)
    .then(data => {


      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      console.log(data_json);
      if (status_data == 1) {
        
        this.data_detail_kegiatan = data_json.data[0];

        console.log(this.data_detail_kegiatan);

        this.dapatkan_file_detail_kegiatan();

      }
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
    });
  }

  async dapatkan_file_detail_kegiatan(){
    this.apiService.menampilkan_data_harian(this.data_id_kegiatan)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      console.log(data_json);
      if (status_data == 1) {
        
        let arr_detail_harian = data_json.data;
        arr_detail_harian.sort(this.compare);
        arr_detail_harian.reverse();
        this.data_arr_progressmilsetone = arr_detail_harian;

        console.log(this.data_arr_progressmilsetone);

        this.riwayat_laporan = true;

      }
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
    });
  }

}
