import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalKegiatanPage } from '../modal/modal-kegiatan/modal-kegiatan.page';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DatePipe } from '@angular/common';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ApiServicesService } from '../services/api-services.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  imgURL:any = 'assets/ss.png';
  nama_kegiatan:any = "Nama Kegiatan";
  data_keterangan_f;

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

  data_text;

  cameraOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  galeriOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(private apiService : ApiServicesService, private modalCtrl: ModalController, private http: HTTP, private transfer: FileTransfer, private camera: Camera, private datepipe: DatePipe) {
  }


  kamera(){
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      console.log(this.imgURL);
      this.base64_img = this.imgURL;
      this.modalCtrl.dismiss();
    });
  }

  galeri(){
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      console.log(this.imgURL);
      this.base64_img = this.imgURL;
      this.modalCtrl.dismiss();
    });
  }

  kirim(){
    const fileTransfer: FileTransferObject = this.transfer.create();

    let URL="https://oraicon.000webhostapp.com/upload.php";
    this.name_img = this.datepipe.transform((new Date), 'MMddyyyyhmmss.')+ this.format_img;
    let nama_file = this.name_img.toString();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama_file,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    fileTransfer.upload(this.base64_img, URL, options)
    .then((res) => {
      // success
      const get_respon_code = res.responseCode;
      const url_path = "https://oraicon.000webhostapp.com/upload/"+this.name_img;

      if (get_respon_code == 200) {
        this.apiService.panggil_api_upload_teknisi(this.data_keterangan_f, url_path)
        .then(data => {

          const data_json = JSON.parse(data.data);
          const data_status = data_json.status;

          if (data_status == 1) {
            
            this.imgURL = 'assets/icon/favicon.png';
            
            console.log("berhasil upload");
          } else {
            this.imgURL = 'assets/icon/favicon.png';
          }

        })
        .catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);


          this.imgURL = 'assets/icon/favicon.png';
        });
      } else {
        console.log(res);
      }

    }, (err) => {
      // error
      console.log(err)
    });
  }

  async  pilihkegiatan(){
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
    console.log("yow");

  }

  batal_laporan(){
    console.log("eyy");
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
