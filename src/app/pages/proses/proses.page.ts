import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { ActionSheetController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { MomentService } from 'src/app/services/moment.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ToastService } from 'src/app/services/toast.service';
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
  data_gambar_rusak = {};
  tanggal_detail;
  tipe_page = true;
  hidedetail = false;
  riwayat_laporan = false;
  riwayat_loading = false;
  data_swal;
  imgURL;

  data_list_evidance_img = {};

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";

  //persiapan kamera
  cameraOptions: CameraOptions = {
    quality: 50,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  galeriOptions: CameraOptions = {
    quality: 50,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(private momentService: MomentService,
    private actionSheetController: ActionSheetController,
    private toastService: ToastService,
    private swal: SwalServiceService,
    private camera: Camera, 
    private transfer: FileTransfer, 
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
    this.tampilkan_data();
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
    return a.upload_date - b.upload_date;
  }

  //berhasil mengirim data
  async back_with_success(){
    await this.setget.getAlert();
    
    if (this.setget.getAlert() == 1) {
      this.swal.swal_aksi_berhasil_timer2d("Berhasil !", "Data laporan telah terkirim !");
      this.setget.setAlert(0);
    }
  }

  //dapatkan data gambar dari galeri/kamera
  kamera(){
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURL;
      this.swal_gambar(this.imgURL);
    });
  }

  galeri(){
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURL;
      this.swal_gambar(this.imgURL);
    });
  }

  //pindah aktiviti laporan
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

  // pindah aktiviti detail riwayat
  lihat_list(arr_data_list, kode_barang){
    console.log(kode_barang);
    let arr_list_data = arr_data_list.split(",");
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

  //modal ganti gambar
  async presentActionSheet(namafile) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Kirim ulang gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Kamera',
        icon: 'camera-outline',
        handler: () => {
          this.kamera();
          const n = namafile.substring(33);
          this.name_img = n;
        }
      }, {
        text: 'Galeri',
        icon: 'image-outline',
        handler: () => {
          this.galeri();
          const n = namafile.substring(33);
          this.name_img = n;
        }
      }, {
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  //alert konfirmasi ganti gambar
  swal_gambar(gambar){
    this.loadingService.tampil_loading("");
    Swal.fire({
      title: 'Peringatan !!',
      text: 'Pastikan gambar sesuai dengan kegiatan pengerjaan !',
      imageUrl: '' + gambar,
      imageWidth: 300,
      imageHeight: 200,
      imageAlt: 'Custom image',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Kirim !',
      showDenyButton: true,
      denyButtonText: `Batal `,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutup_loading();
        this.loadingService.tampil_loading("Menyimpan gambar . . .");
        this.mengirim_gambar();
      }else{
        this.loadingService.tutup_loading();
      }
    })
  }

  async mengirim_gambar(){

    console.log("mengirim gambar");

    const fileTransfer: FileTransferObject = this.transfer.create();
    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: this.name_img,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    fileTransfer.upload(this.base64_img, this.URL, options)
    .then(data => {

      console.log(data);

      const data_json = JSON.parse(data.response);
      const data_status = data_json.status;

      if (data_status == 0) {

        this.loadingService.tutup_loading();
        this.toastService.Toast("Berhasil menyimpan gambar !");
        this.ionViewWillEnter();

      } else {
        // console.log("error");

        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 22 !");
        
      }

    })
    .catch(error => {
  
      console.log(error);

      let status = error.code;

      if (status == 4) {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "TIdak ada respon, coba beberapa saat lagi !");
      }else{
        this.loadingService.tutup_loading();
        this.swal.swal_code_error("Terjadi kesalahan", "code error 21 !, kembali ke login !");
      }

  
    });
    
    let waktu_habis = await this.delayed();
    console.log(waktu_habis);
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }

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


}
