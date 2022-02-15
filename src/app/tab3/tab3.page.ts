import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  //persiapan variable
  imgURL:any = 'assets/ss.png';

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

  type_update_akun = "update_data_akun";
  type_update_gambar = "update_image_akun";

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


  constructor(private datepipe: DatePipe, private transfer: FileTransfer, private camera: Camera,private modalCtrl: ModalController,private loadingCtrl:LoadingServiceService, private alertCtrl: AlertController, private storage:Storage, private router: Router, private apiService:ApiServicesService) {

  }

  async tampilkandata(){
    const data_l_nama = await this.storage.get('nama');
    const data_l_sandi = await this.storage.get('sandi');

    console.log(data_l_nama);
    console.log(data_l_sandi);

    
    // this.apiService.panggil_api_data_karyawan(data_l_nama, data_l_sandi)
    // .then(res => {
      
    //   const data_json = JSON.parse(res.data);
    //   const data_status_data = data_json.data[0];
      
    //   this.loadingCtrl.tutuploading();
    //   console.log(data_status_data);
  
    // })
    // .catch(err => {
  
    //   console.log(err);
    //   this.loadingCtrl.tutuploading();
  
    // });
  }

  async ubahusername(){

    const l_storage_data_nama = await this.storage.get('nama');

    this.alertCtrl.create({
      header: 'Perubahan nama pengguna',
      message: 'Silahkan untuk mengisi nama pengguna baru anda',
      inputs: [
        {
          name: 'username',
          placeholder: 'Nama Pengguna',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Batal',
        },
        {
          text: 'Simpan',
            handler: (alertData) =>{
              this.loadingCtrl.tampil_loading_login();


              const nama_data = alertData.username;

              console.log(l_storage_data_nama);
              console.log(nama_data);
              console.log(this.type_update_akun);
              
              this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, l_storage_data_nama, nama_data, "", "")
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
                const data_json = JSON.parse(err.error);
                const data_status = data_json.status;
                this.storage.set('nama', nama_data);
                console.log(data_status)
                
                this.loadingCtrl.tutuploading();

              });
            
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  async  ubahpassword(){

    const l_storage_data_nama = await this.storage.get('nama');
    
    this.alertCtrl.create({
      header: 'Perubahan sandi pengguna',
      message: 'Silahkan untuk mengisi sandi pengguna baru anda',
      inputs: [
        {
          name: 'password',
          placeholder: 'Sandi Pengguna',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Batal',
        },
        {
          text: 'Simpan',
          handler: (alertData) =>{
            this.loadingCtrl.tampil_loading_login();

            const sandi_data = alertData.password;

            console.log(l_storage_data_nama);
            console.log(sandi_data);
            console.log(this.type_update_akun);
            
            this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, l_storage_data_nama, "", sandi_data, "")
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
              const data_json = JSON.parse(err.error);
              const data_status = data_json.status;
              this.storage.set('sandi', sandi_data);
              console.log(data_status)
              
              this.loadingCtrl.tutuploading();

            });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
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

  async upload(){
    const fileTransfer: FileTransferObject = this.transfer.create();
    const l_storage_data_nama = await this.storage.get('nama');

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
        this.apiService.panggil_api_update_data_karyawan(this.type_update_gambar, l_storage_data_nama, "", "", url_path)
        .then(res => {
          console.log(res);

        })
        .catch(error => {

          console.log(error); // error message as string

        });
      } else {
        console.log(res);
      }

    }, (err) => {
      // error
      console.log(err)
    });
  }

  tutup(){
    this.modalCtrl.dismiss();
  }
}
