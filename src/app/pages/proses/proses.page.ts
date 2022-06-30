import { Component, OnInit, ViewChild  } from '@angular/core';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { MomentService } from 'src/app/services/moment.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toast.service';
import { NativeGeocoder, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { IonInfiniteScroll } from '@ionic/angular';


@Component({
  selector: 'app-proses',
  templateUrl: './proses.page.html',
  styleUrls: ['./proses.page.scss'],
})
export class ProsesPage implements OnInit {

  //variable
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  data_hasil = [];
  tanggal_pm = [];
  alamat_pm = [];
  data_arr_progressmilsetone = [];
  data_detail_kegiatan = {};
  data_gambar_rusak = {};
  name_img:string="";
  format_img:string="JPEG";
  searchTerm: string;
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";
  
  //variable tricky
  timeout = 0;
  data_id_kegiatan;
  tipe_page = true;
  hidedetail = false;
  riwayat_laporan = false;
  riwayat_loading = true;
  data_persen;

  constructor(private momentService: MomentService,
    private router:Router,
    private nativeGeocoder: NativeGeocoder,
    private swal: SwalServiceService,
    private apiService: ApiServicesService, 
    private toast: ToastService,
    private loadingService: LoadingServiceService, 
    private setget: SetGetServiceService,) { 
  }

  //ionic lifecycle
  ngOnInit() {
  }

  async ionViewWillEnter(){
    this.setget.setButton(0);
    this.dapatkan_kegiatan_detail_kegiatan_rap();
  }

  async ionViewDidLeave(){
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

  //delay loading
  interval_counter_loading() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }  

  async delayed(){
    await this.delay();
    return 1;
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
  formulir(tipe_satuan, nama_kegiatan, total_meter, progress_meter){
    console.log(tipe_satuan);
    this.setget.setLog(this.data_detail_kegiatan, nama_kegiatan, tipe_satuan);
    this.setget.setMeter(total_meter, progress_meter);

    // setmeter
    // this.navCtrl.navigateForward(['/lapormeter']);
    this.router.navigate(["/lapormeter"], { replaceUrl: true });
  }

  // pindah aktiviti detail riwayat
  lihat_list(id, alamat){
    // let arr_list_data = arr_data_list.split(",");
    this.setget.set_list_path(id, alamat);
    console.log(id, alamat);

    this.router.navigate(["/list"], { replaceUrl: true });
    // this.navCtrl.navigateForward(['/list']);
  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    // this.navCtrl.back();
    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.router.navigate(["/kegiatan"], { replaceUrl: true });

    } else {
      this.toast.Toast_tampil();
    }
  }

  //menampilkan data kegiatan
  async dapatkan_kegiatan_detail_kegiatan_rap(){

    let data_persen = 0;

    this.loadingService.tampil_loading("Memuat data . . .")

    this.data_id_kegiatan = this.setget.getProses();

    this.apiService.dapatkan_data_detail_kegiatan(this.data_id_kegiatan)
    .then(data => {

      
      const data_json = JSON.parse(data.data);
      console.log(data_json);
      const status_data = data_json.status;
      if (status_data == 1) {
        
        this.data_detail_kegiatan = data_json.data[0];

        let kuota_progres = data_json.data[0].volume;
        let total_progres = data_json.data[0].total_volume;

        if (total_progres == 0 || total_progres == null) {
          this.data_persen = "0%";
        } else {
          data_persen = total_progres * 100 / kuota_progres;
          let str_data_persen = data_persen.toString().substring(0, 4);
          
          if (data_persen == Infinity) {
            this.data_persen = "Terjadi kesalahan !";
          } else {
            this.data_persen = str_data_persen+"%";
          }

          console.log("data persen = " + data_persen);
        }

        if (data_persen >= 100 || kuota_progres == 0) {
          this.tipe_page = true;
        } else {
          this.tipe_page = false;
        }

        this.dapatkan_file_detail_kegiatan();

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
          this.swal.swal_code_error("Terjadi kesalahan !", "Code error 19 !, kembali ke login !");
        }
      }
  
    });
  }

  //menampilkan riwayat laporan
  async dapatkan_file_detail_kegiatan(){
    this.apiService.menampilkan_data_harian(this.data_id_kegiatan)
    .then(data => {

      const data_json = JSON.parse(data.data);
      console.log(data_json.data);

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
  
      console.log(error)
  
      this.loadingService.tutup_loading();
  
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "Code error 20 !, kembali ke login !");
        }
      }
  
    });
  }

  //mengubah format tanggal
  async tanggal(){
    const arr_ms_length = this.data_arr_progressmilsetone.length;

    for (let index = 0; index < arr_ms_length; index++) {
      let element = this.data_arr_progressmilsetone[index];

      let tanggal = this.momentService.ubah_format_tanggal_waktu(element.date_created);
      
      this.tanggal_pm["tanggal"+element.id] = tanggal;
    }

    this.alamat();
  }

  //mendapatkan alamat
  async alamat(){
    const arr_ms_length = this.data_arr_progressmilsetone.length;

    for (let index = 0; index < arr_ms_length; index++) {
      let element = this.data_arr_progressmilsetone[index];

      this.latlong_converter(element.lattitude, element.longitude, element.id, index, arr_ms_length);
      
      // this.alamat_pm["alamat"+element.id] = alamat;
    }

    // this.riwayat_laporan = true;
    // this.riwayat_loading = false;
    // this.delay_dulu();
  }

  //ubah latlong ke alamat
  async latlong_converter(lat, long, id, index, arr_ms_length){
    await this.interval_counter();

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lat, long, options)
    .then(data => {
      console.log(data);
      let data_mentah = data[0];

      let alamat = data_mentah.thoroughfare +", "+ data_mentah.subLocality +", "+ data_mentah.locality +", "+ data_mentah.subAdministrativeArea;
      this.alamat_pm["alamat"+id] = alamat;

      if(index == arr_ms_length-1){
        // this.riwayat_laporan = true;
        // this.riwayat_loading = false;
        // this.delay_dulu();
        this.menampilkan_sedikit_data(this.data_arr_progressmilsetone);
      }

    })
    .catch(error => {
  
      console.log(error);
      this.loadingService.tutup_loading();
      this.toast.Toast("Terjadi kesalahan !, Code error 68 !")
      this.router.navigate(["/kegiatan"], { replaceUrl: true });

      // this.swal.swal_code_error("Terjadi kesalahan !", "Code error 68 !");
      // this.swal.swal_aksi_gagal("", "");
  
    });
  }

  //menampilkan 10 data terakhir
  async menampilkan_sedikit_data(arr){
    if (arr.length < 10) {
      for (let index = 0; index < arr.length; index++) {
        let element = arr[index];
        
        this.data_hasil.push(element);
        if(index == arr.length - 1){
          this.riwayat_laporan = true;
          this.riwayat_loading = false;
          this.delay_dulu();
        }
      }
    } else {
      for (let index = 0; index < 10; index++) {
        let element = arr[index];
        
        this.data_hasil.push(element);
        if(index == 9){
          this.riwayat_laporan = true;
          this.riwayat_loading = false;
          this.delay_dulu();
        }
      }
    }
  }
  
  //memuat lebih banyak data
  async loadData(event) {

    if (this.data_hasil.length < this.data_arr_progressmilsetone.length && this.data_hasil.length > 9) {
      
      await this.interval_counter_loading();
      this.infiniteScroll.complete();

      this.tambah_data(this.data_hasil, this.data_arr_progressmilsetone);

    } else {
      if(this.data_hasil.length > 9){
        this.toast.Toast("Seluruh data sudah dimuat !");
      }
      this.infiniteScroll.disabled = true;
    }
    
    // await this.interval_counter_loading();
    // event.target.complete();
    // this.looping_data(this.data_array);

  }

  //logika menambahkan data
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

  //menambahkan data
  async tambahkan(length_arr_hasil, limit_looping, arr_mentah){
    for (let index = length_arr_hasil; index < limit_looping; index++) {
      let element = arr_mentah[index];

      
      this.data_hasil.push(element);
    }
    console.log(this.data_hasil);
    console.log(this.data_arr_progressmilsetone);
  }

  //memuat ulang data
  async relog(){
    this.data_hasil = [];
    this.tanggal_pm = [];
    this.alamat_pm = [];
    this.data_arr_progressmilsetone = [];
    this.data_detail_kegiatan = {};
    this.data_gambar_rusak = {};
    this.name_img ="";
    this.format_img ="JPEG";
    this.searchTerm;
    
    //variable tricky
    this.timeout = 0;
    this.data_id_kegiatan;
    this.tipe_page = true;
    this.hidedetail = false;
    this.riwayat_laporan = false;
    this.riwayat_loading = true;
    this.data_persen;

    this.dapatkan_kegiatan_detail_kegiatan_rap();
  }

  //delay dulu
  async delay_dulu(){
    await this.interval_counter_loading();
    this.loadingService.tutup_loading();
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
      text: 'Server tidak merespon, coba lagi ?!',
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

  //keluar jika ada kesalahan/error
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
