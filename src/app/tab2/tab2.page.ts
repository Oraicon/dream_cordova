import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalKegiatanPage } from '../modal/modal-kegiatan/modal-kegiatan.page';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { DatePipe } from '@angular/common';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  imgURL:any = 'assets/ss.png';
  nama_kegiatan:any = "Nama Kegiatan";

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

  constructor(private modalCtrl: ModalController, private http: HTTP, private transfer: FileTransfer, private camera: Camera, private datepipe: DatePipe) {
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
    
  }

  checkValue() {
    console.log("onchange");
  }

  number;

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

  tutup(){
    this.modalCtrl.dismiss();
  }

}
