import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalKegiatanPage } from '../modal/modal-kegiatan/modal-kegiatan.page';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DatePipe } from '@angular/common';
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
  imgURL:any = 'assets/ss.png';
  nama_kegiatan:any = "Nama Kegiatan";
  data_keterangan_f;
  img_default;

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

  data_text;

  //persiapan kamera
  cameraOptions: CameraOptions = {
    quality: 50,
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

  constructor(private alertService: AlertServicesService, private alertCtrl: AlertController, private loadingService: LoadingServiceService, private apiService : ApiServicesService, private modalCtrl: ModalController, private http: HTTP, private transfer: FileTransfer, private camera: Camera, private datepipe: DatePipe) {

  }

  //dapatkan gambar dari kamera
  kamera(){
    this.modalCtrl.dismiss();
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURL;
    });
  }

  //dapatkan gambar dari galeri
  galeri(){
    this.modalCtrl.dismiss();
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
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
            
            this.imgURL = 'assets/ss.png';
            this.loadingService.tutuploading();
            this.alertService.alert_berhasil_upload();

          } else {

            this.imgURL = 'assets/ss.png';
            this.loadingService.tutuploading();
            this.alertService.alert_gagal_upload();

          }

        })
        .catch(error => {
          //error upload ke database data teknisi 
          this.imgURL = 'assets/ss.png';
          this.loadingService.tutuploading();
          this.alertService.alert_error_upload_gambar3_tab2();

        });
      } else {
        //error response upload foto
        this.imgURL = 'assets/ss.png';
        this.loadingService.tutuploading();
        this.alertService.alert_error_upload_gambar2_tab2();
      }

    }, (err) => {
      // error upload foto
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
      console.log(data.data.data);
      this.nama_kegiatan = data.data.data;
    });
    return await modal.present();
  }

  batal_gambar(){
    this.imgURL = 'assets/ss.png';
  }

  batal_laporan(){
    this.data_keterangan_f = null;
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
