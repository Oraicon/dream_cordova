import { Component } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ModalKegiatanPage } from '../modal/modal-kegiatan/modal-kegiatan.page';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { AlertServicesService } from '../services/alert-services.service';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  warna_segment = 1;
  //variable frontenddulu
  informasi_proyek = true;
  text_ = true;
  imgURL:any = 'assets/ss_.png';
  nama_kegiatan:any = "Nama Kegiatan";
  pilih_tahapan = true;
  data_gambar = true;
  data_keterangan_f;
  img_default;
  dataArray;
  judul_progress = "Judul Proyek";

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

  constructor(private setget: SetGetServiceService, private navCtrl: NavController, private router: Router, private storage: Storage, private alertService: AlertServicesService, private alertCtrl: AlertController, private loadingService: LoadingServiceService, private apiService : ApiServicesService, private modalCtrl: ModalController, private http: HTTP, private transfer: FileTransfer, private camera: Camera, private datepipe: DatePipe) {
    
    // this.data_statik();
    // this.tampilkan_data();

  }
  
  data_statik(){
    this.informasi_proyek = false;
    this.dataArray = [
        {
            "id": "1",
            "nama_proyek": "PROYEK MERANGKUL INDONESIA TIMUR",
            "lop": "1000",
            "nama_regional": "REGIONAL 6",
            "nama_mandor": "Flor Tiesman",
            "nama_supervisi": "Tracy Chitson",
            "create_date": "2022-02-24",
            "due_date": "2022-05-24"
        },
        {
            "id": "2",
            "nama_proyek": "PROYEK 100 TIANG HSI",
            "lop": "100",
            "nama_regional": "REGIONAL 2",
            "nama_mandor": "Flor Tiesman",
            "nama_supervisi": "Papagena Ginn",
            "create_date": "2022-02-24",
            "due_date": "2022-05-24"
        }
    ];
  }

  async tampilkan_data(){
    this.loadingService.tampil_loading_login();


    const data_l_nama = await this.storage.get('nama');

    
    this.apiService.panggil_api_progres_header(data_l_nama)
    .then(res => {
      
      const data_json = JSON.parse(res.data);
      const data_status = JSON.parse(data_json.status);
      
      if (data_status == 1) {
        this.dataArray = data_json.data;

        if (this.dataArray.length == 0) {
          this.informasi_proyek = true;
        }else{
          this.informasi_proyek = false;
        }

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

  getid_progres(get_id, get_judul){
  this.setget.setTab2(get_id, get_judul);
  this.setget.set_Page(1);

  this.navCtrl.navigateForward(['/proses']);
  
  }

  getid_complete(get_id, get_judul){
    this.setget.setTab2(get_id, get_judul);
    this.setget.set_Page(2);

  this.navCtrl.navigateForward(['/proses']);
  }

  //baru
  segmentChanged(e){
    this.warna_segment = e.detail.value;
  }

  keluar(){
    this.alertCtrl.create({
      header: 'Kembali ke login ?',
      message: 'Anda akan kembali ke halaman login anda yakin ?',
      cssClass:'my-custom-class',
      mode: "ios",
      buttons: [
        {
          text: 'Tidak',
        },
        {
          text: 'Ya',
          handler: () =>{
            this.storage.set('nama', null);
            this.storage.set('sandi', null);
            this.router.navigate(["/login"], { replaceUrl: true });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }
}

//coba pake setter getter
