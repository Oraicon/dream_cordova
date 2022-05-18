import { Component, OnInit } from '@angular/core';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { NavController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { MomentService } from 'src/app/services/moment.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import Swal from 'sweetalert2';
import { element } from 'protractor';


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
  riwayat_loading = true;
  data_swal;

  data_list_evidance_img = {};
  data_detail_kegiatan = {};
  data_persen;

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
  async tanggal(){
    const arr_ms_length = this.data_arr_progressmilsetone.length;

    for (let index = 0; index < arr_ms_length; index++) {
      let element = this.data_arr_progressmilsetone[index];

      let tanggal = this.momentService.ubah_format_tanggal_waktu(element.date_created);
      
      this.tanggal_pm[element.id] = tanggal;
    }

    this.riwayat_laporan = true;
    this.riwayat_loading = false;
    this.loadingService.tutup_loading();
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

  //pindah aktiviti laporan
  formulir(tipe_satuan, nama_kegiatan){
    console.log(tipe_satuan);
    this.setget.setLog(this.data_detail_kegiatan, nama_kegiatan);

    if (tipe_satuan == "Meter") {
      this.navCtrl.navigateForward(['/lapormeter']);
    }else{
      this.navCtrl.navigateForward(['/lapor']);
    }
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
        this.dapatkan_kegiatan_detail_kegiatan_rap();
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

    this.loadingService.tampil_loading("Memuat data . . .")

    const a = this.setget.getProses();

    this.data_id_kegiatan = a[1];

    this.data_id_kegiatan = a[1];


    this.apiService.dapatkan_data_detail_kegiatan(this.data_id_kegiatan)
    .then(data => {

      console.log(data);

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {
        
        this.data_detail_kegiatan = data_json.data[0];

        let kuota_progres = data_json.data[0].volume;
        let total_progres = data_json.data[0].total_volume;

        if (total_progres == 0 || total_progres == null) {
          this.data_persen = "0";
        } else {
          let data_persen = total_progres * 100 / kuota_progres;
          let str_data_persen = data_persen.toString().substring(0, 4);
  
          this.data_persen = str_data_persen;
        }

        if (this.data_persen == "100") {
          this.tipe_page = true;
        } else {
          this.tipe_page = false;
          
        }

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

      console.log(data);


      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {
        
        let arr_detail_harian = data_json.data;
        arr_detail_harian.sort(this.compare);
        arr_detail_harian.reverse();
        this.data_arr_progressmilsetone = arr_detail_harian;

        this.tanggal();
      }else{
        this.riwayat_loading = false;
        this.riwayat_laporan = false;
        this.loadingService.tutup_loading();
      }
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
    });
  }

}
