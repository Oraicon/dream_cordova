import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lapor',
  templateUrl: './lapor.page.html',
  styleUrls: ['./lapor.page.scss'],
})
export class LaporPage implements OnInit {

    //variable frontend
    informasi_proyek = true;
    formulir_laporan = true;
    imgURL:any = 'assets/ss_.png';
    nama_kegiatan:any = "Nama Kegiatan";
    pilih_tahapan = true;
    data_gambar = true;
    data_keterangan_f;
    img_default;
    dataArray;
    judul_progress = "Judul Proyek";
    dataid;
    datanamakegiatan;
    datapersen;
    array_persen = [];
  
    base64_img:string="";
    name_img:string="";
    format_img:string="JPEG";
  
    data_text;

    place;

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

    customAlertOptions: any = {
      header: 'Persen Pengerjaan',
      mode: 'ios',
      translucent: true
    };

  constructor(private route: ActivatedRoute, private actionSheetController: ActionSheetController, private navCtrl:NavController, private camera: Camera) {
  }
  
  ngOnInit() {
    this.tampilkan_data();
  }

  tampilkan_data(){
    this.route.queryParams.subscribe(params => {

      this.dataid = params.data_id;
      this.datanamakegiatan = params.data_nama_kegiatan;
      this.datapersen = params.data_persen;
      console.log(this.datapersen);

    });
    this.logik_array(this.datapersen);
    
  }

  logik_array(yey){
    let a = Number(yey);
    for (let index = 1; index <= 100/10; index++) {
      let j = index * 10;
      if (j >= a) {
        this.array_persen.push(j);
      }
    }
  }

  //dapatkan gambar dari kamera
  kamera(){
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.data_gambar = false;
      this.base64_img = this.imgURL;
    });
  }

  //dapatkan gambar dari galeri
  galeri(){
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.data_gambar = false;
      this.base64_img = this.imgURL;
    });
  }

  kembali(){
    this.navCtrl.back();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih Gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Kamera',
        icon: 'camera-outline',
        handler: () => {
          this.kamera();
        }
      }, {
        text: 'Galeri',
        icon: 'image-outline',
        handler: () => {
          this.galeri();
        }
      }, {
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  diklik(){
    console.log(this.place);
  }

  batal_laporan(){
    this.place = null;
    this.nama_kegiatan = "Nama Kegiatan";
  }

  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

}
