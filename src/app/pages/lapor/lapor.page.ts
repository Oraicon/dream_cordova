import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { DatePipe } from '@angular/common';
import { NavigationExtras } from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Storage } from '@ionic/storage';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';

@Component({
  selector: 'app-lapor',
  templateUrl: './lapor.page.html',
  styleUrls: ['./lapor.page.scss'],
})
export class LaporPage implements OnInit {

    pilih_gambar = true;
    gambar_kosong = true;
    
    //variable
    imgURL:any = 'assets/ss_.png';
    nama_kegiatan:any = "Nama Kegiatan";
    data_gambar = true;
    data_keterangan_f;
    img_default;
    lapor_id;
    lapor_namakegiatan;
    datapersen;
    array_persen = [];
    place;
  
    base64_img:string="";
    name_img:string="";
    format_img:string="JPEG";
  
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

    customAlertOptions: any = {
      header: 'Persen Pengerjaan',
      mode: 'ios',
      translucent: true
    };

  constructor(private setget: SetGetServiceService, private strg: Storage, private datepipe: DatePipe, private transfer: FileTransfer, private apiService: ApiServicesService, private route: ActivatedRoute, private actionSheetController: ActionSheetController, private navCtrl:NavController, private camera: Camera, private loadingService: LoadingServiceService) {
  }
  
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.tampilkan_data();
  }

  tampilkan_data(){
    // this.route.queryParams.subscribe(params => {
    //   console.log(params);
    //   this.lapor_id = params.data_id;
    //   this.lapor_namakegiatan = params.data_nama_kegiatan;
    //   this.datapersen = params.data_persen;
    // });

    let a = this.setget.getLog();
    let b = this.setget.get_persen();

    this.lapor_id = a[0];
    this.lapor_namakegiatan = a[1];
    this.datapersen = b;
    
    console.log(this.lapor_id);
    console.log(this.datapersen);
    this.logik_array(this.datapersen);
  }

  logik_array(nilai){
    let a = Number(nilai);

    for (let index = 1; index <= 100/10; index++) {
      let j = index * 10;
      if (j > a) {
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
      this.pilih_gambar = false;
      this.gambar_kosong = false;
    });
  }

  //dapatkan gambar dari galeri
  galeri(){
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.data_gambar = false;
      this.base64_img = this.imgURL;
      this.pilih_gambar = false;
      this.gambar_kosong = false;
    });
  }

  validasi(){
    this.loadingService.tampil_loading_login();

    let a;
    
    if (this.place == 100){
      a = 2
    } else {
      a = 1
    }
    
    // asli
    const fileTransfer: FileTransferObject = this.transfer.create();

    let URL="https://oraicon.000webhostapp.com/upload.php";
    this.name_img = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + this.format_img;
    let nama_file = this.name_img.toString();

    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama_file,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    fileTransfer.upload(this.base64_img, URL, options)
    .then(data => {

      const responecode = data.responseCode;

      if (responecode == 200) {
        this.apiService.kirim_api_progres(this.lapor_id, "https://oraicon.000webhostapp.com/upload/" + this.name_img, this.data_keterangan_f, this.place)
        .then(data => {
          
          const data_json = JSON.parse(data.data);
          const data_status = data_json.status;

          if (data_status == 0) {
            this.setget.setLog(this.lapor_id, this.nama_kegiatan);
            this.setget.set_Page(a);
        
            this.setget.setAlert(1);
            this.loadingService.tutuploading();
        
            this.navCtrl.back();
          } else {
            
          }

          console.log(data.status);
          console.log(data.data); // data received by server
          console.log(data.headers);
      
        })
        .catch(error => {
      
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
      
        });
      } else {
        console.log("error");
        
      }


    })
    .catch(error => {
  
      console.log(error);
  
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

  batal_gambar(){
    this.imgURL = 'assets/ss_.png';
    this.pilih_gambar = true;
    this.gambar_kosong = true;
  }

}
