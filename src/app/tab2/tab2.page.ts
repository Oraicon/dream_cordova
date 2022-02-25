import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalKegiatanPage } from '../modal/modal-kegiatan/modal-kegiatan.page';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { AlertServicesService } from '../services/alert-services.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  //variable frontend
  informasi_proyek = true;
  formulir_laporan = true;
  text_ = true;

  imgURL:any = 'assets/ss_.png';
  nama_kegiatan:any = "Nama Kegiatan";
  pilih_tahapan = true;
  data_gambar = true;
  data_keterangan_f;
  img_default;
  judul_progress = "Judul Proyek";
  regional_progress = "Regional";
  lop_progress = "LOP";
  supervisi_progress = "Nama Supervisi";
  mandor_progress = "Nama Mandor";

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

  data_text;

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
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(private storage: Storage, private alertService: AlertServicesService, private alertCtrl: AlertController, private loadingService: LoadingServiceService, private apiService : ApiServicesService, private modalCtrl: ModalController, private http: HTTP, private transfer: FileTransfer, private camera: Camera, private datepipe: DatePipe) {
  this.tampilkan_data();
  }

  async tampilkan_data(){
    this.loadingService.tampil_loading_login();


    const data_l_nama = await this.storage.get('nama');

    
    this.apiService.panggil_api_progres_header(data_l_nama)
    .then(res => {
      
      const data_json = JSON.parse(res.data);
      const data_status = JSON.parse(data_json.status);
      
      if (data_status == 1) {
        const data_status_data = data_json.data[0];

        this.informasi_proyek = false;
        this.formulir_laporan = false;

        this.judul_progress = data_status_data.nama_proyek;
        this.regional_progress = data_status_data.nama_regional;
        this.lop_progress = data_status_data.lop;
        this.supervisi_progress = data_status_data.nama_supervisi;
        this.mandor_progress = data_status_data.nama_mandor;

        this.loadingService.tutuploading();
      } else if (data_status == 2) {
        this.judul_progress = "Data Tidak Di Temukan";
        this.text_ = false;
        
        this.loadingService.tutuploading();
      } else if (data_status == 0) {

        this.loadingService.tutuploading();
      }else{

        this.loadingService.tutuploading();
      }
      
      

      this.loadingService.tutuploading();

      // Swal.fire({
      //   icon: 'success',
      //   title: 'Sukses !',
      //   // allowOutsideClick: true,
      //   text: 'Selamat datang !',
      //   // backdrop: false
      // })
      
    })
    .catch(err => {
      this.loadingService.tutuploading();
      
      this.alertCtrl.create({
        header: 'Terjadi kesalahan !',
        message: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
        cssClass:'my-custom-class',
        backdropDismiss: false,
        mode: "ios",
        buttons: [{
          text: 'OK !',
          handler: () => {
            this.tampilkan_data();
          }
        }]
      }).then(res => {
  
        res.present();
  
      });
    });
  }

  //dapatkan gambar dari kamera
  kamera(){
    this.modalCtrl.dismiss();
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.data_gambar = false;
      this.base64_img = this.imgURL;
    });
  }

  //dapatkan gambar dari galeri
  galeri(){
    this.modalCtrl.dismiss();
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.data_gambar = false;
      this.base64_img = this.imgURL;
    });
  }

  kirim(){
    this.loadingService.tampil_loading_login();
    //perisapan mengirim
    const fileTransfer: FileTransferObject = this.transfer.create();

    //persiapan url dan nama
    let URL="https://oraicon.000webhostapp.com/upload.php";
    this.name_img = this.datepipe.transform((new Date), 'MMddyyyyhmmss.')+ this.format_img;
    let nama_file = this.name_img.toString();

    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama_file,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    //upload ke server
    fileTransfer.upload(this.base64_img, URL, options)
    .then((res) => {
      // success upload foto
      const get_respon_code = res.responseCode;
      const url_path = "https://oraicon.000webhostapp.com/upload/"+this.name_img;

      if (get_respon_code == 200) {
        this.apiService.panggil_api_upload_teknisi(this.data_keterangan_f, url_path)
        .then(data => {

          const data_json = JSON.parse(data.data);
          const data_status = data_json.status;

          if (data_status == 1) {
            
            this.data_gambar = true;
            this.imgURL = 'assets/ss.png';
            this.data_keterangan_f = null;
            this.loadingService.tutuploading();
            this.alertService.alert_berhasil_upload();

          } else {

            this.data_gambar = true;
            this.imgURL = 'assets/ss.png';
            this.loadingService.tutuploading();
            this.alertService.alert_gagal_upload();

          }

        })
        .catch(error => {
          //error upload ke database data teknisi 
          this.data_gambar = true;
          this.imgURL = 'assets/ss.png';
          this.loadingService.tutuploading();
          this.alertService.alert_error_upload_gambar3_tab2();

        });
      } else {
        //error response upload foto
        this.data_gambar = true;
        this.imgURL = 'assets/ss.png';
        this.loadingService.tutuploading();
        this.alertService.alert_error_upload_gambar2_tab2();
      }

    }, (err) => {
      // error upload foto
      this.data_gambar = true;
      this.imgURL = 'assets/ss.png';
      this.loadingService.tutuploading();
      this.alertService.alert_error_upload_gambar_tab2();
    });
  }

  validasi(){
    //persiapan variable
    let data_keterangan = this.data_keterangan_f;
    
    // validasi form
    if (this.imgURL == 'assets/ss.png') {
      console.log("gambar masih sama");
      this.alertService.alert_pilih_gambar_tab2();
    } else {
      if(data_keterangan == null || data_keterangan == ""){
        this.alertCtrl.create({
          header: 'Keterangan kosong !',
          mode: 'ios',
          message: 'Anda yakin akan mengirim dengan keterangan kosong ?',
          buttons: [
            {
              text: 'Tidak',
            },
            {
              text: 'Ya',
              handler: () =>{
                this.kirim();
              }
            }
          ]
        }).then(res => {
          res.present();
        });
      }else{
        this.kirim();
      }
    }


  }

  async pilihkegiatan(){
    let modal = await this.modalCtrl.create({
      component: ModalKegiatanPage,
    });
    modal.onDidDismiss().then(data => {
      if (data.data.data == null) {
        
      } else {
        this.nama_kegiatan = data.data.data;
        this.pilih_tahapan = false;
      }
    }).catch(err => {
      // console.log(err);
    });
    return await modal.present();
  }

  batal_gambar(){
    this.imgURL = 'assets/ss.png';
    this.data_gambar = true;
  }

  batal_laporan(){
    this.data_keterangan_f = null;
    this.pilih_tahapan = true;
    this.nama_kegiatan = "Nama Kegiatan";
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
