import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { DatePipe } from '@angular/common';
import { PasswordServiceService } from '../services/password-service.service';
import { AlertServicesService } from '../services/alert-services.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  //persiapan variable
  imgURL:any = 'assets/pp.jpg';

  //variable frontend
  lihatsandi = false;

  username_pengguna;
  sandi_pengguna;
  sandi_pengguna_tidak_terlihat;
  nama_pengguna;
  email_pengguna;
  nohp_pengguna;
  tempatlahir_pengguna;
  tanggallahir_pengguna;
  kelamin_pengguna;
  alamat_pengguna;
  jabatan_pengguna;
  posisi_pengguna;
  tanggalbergabung_pengguna;
  departemen_pengguna;
  bank_pengguna;
  rekening_pengguna;

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

  type_update_akun = "update_data_akun";
  type_update_gambar = "update_image_akun";

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


  constructor(private alertService: AlertServicesService, private passwordService: PasswordServiceService, private datepipe: DatePipe, private transfer: FileTransfer, private camera: Camera,private modalCtrl: ModalController,private loadingCtrl:LoadingServiceService, private alertCtrl: AlertController, private storage:Storage, private router: Router, private apiService:ApiServicesService) {
    this.tampilkandata();
  }

  async tampilkandata(){
    this.loadingCtrl.tampil_loading_login();
    const data_l_nama = await this.storage.get('nama');
    const data_l_sandi = await this.storage.get('sandi');

  
    this.apiService.panggil_api_data_karyawan(data_l_nama, data_l_sandi)
    .then(res => {
      
      const data_json = JSON.parse(res.data);
      const data_status_data = data_json.data[0];
      
      this.username_pengguna = data_l_nama;
      this.sandi_pengguna = data_l_sandi;
      this.sandi_pengguna_tidak_terlihat = this.passwordService.disable_password(this.sandi_pengguna);
      this.nama_pengguna = data_status_data.nama;
      this.email_pengguna = data_status_data.email;
      this.nohp_pengguna = data_status_data.no_hp;
      this.tempatlahir_pengguna = data_status_data.tempat_lahir;
      this.tanggallahir_pengguna = data_status_data.tgl_lahir;
      this.kelamin_pengguna = data_status_data.jenis_kelamin;
      this.alamat_pengguna = data_status_data.alamat;
      this.jabatan_pengguna = data_status_data.nama_jabatan;
      this.posisi_pengguna = data_status_data.nama_posisi;
      this.tanggalbergabung_pengguna = data_status_data.tgl_bergabung;
      this.departemen_pengguna = data_status_data.nama_departemen;
      this.bank_pengguna = data_status_data.nama_bank;
      this.rekening_pengguna = data_status_data.no_rek;

      this.imgURL = data_status_data.image;

      this.loadingCtrl.tutuploading();
    })
    .catch(err => {
      this.loadingCtrl.tutuploading();

      this.alertCtrl.create({
        header: 'Terjadi kesalahan !',
        message: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
        cssClass:'my-custom-class',
        backdropDismiss: false,
        mode: "ios",
        buttons: [{
          text: 'OK !',
          handler: () => {
            this.tampilkandata();
          }
        }]
      }).then(res => {
  
        res.present();
  
      });
    });
  }

  async ubahusername(){

    const l_storage_data_nama = await this.storage.get('nama');

    this.alertCtrl.create({
      header: 'Perubahan nama pengguna',
      message: 'Silahkan untuk mengisi nama pengguna baru anda',
      cssClass:'my-custom-class',
      mode: "ios",
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

              //persiapan variable
              const nama_data = alertData.username;
              
              //proses update
              this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, l_storage_data_nama, nama_data, "", "")
              .then(res => {
                //mendapatkan data
                const data_json = JSON.parse(res.data);
                const data_status = data_json.status;

                //validasi data
                if (data_status == 1) {
                  this.storage.set('nama', nama_data);
                  this.username_pengguna = nama_data;
                  this.loadingCtrl.tutuploading();

                  this.alertService.alert_berhasil_mengubah("nama pengguna", nama_data);
                
                } else {
                  //jika status != 1
                  this.loadingCtrl.tutuploading();
                  this.alertService.alert_gagal_mengubah("nama pengguna");
                }
                
              })
              .catch(err => {
                //error
                this.alertService.alert_error_update_tab3("nama", "9");
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
      cssClass:'my-custom-class',
      mode: "ios",
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
            //persiapan variable
            const sandi_data = alertData.password;
            
            //proses update
            this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, l_storage_data_nama, "", sandi_data, "")
            .then(res => {
              const data_json = JSON.parse(res.data);
              const data_status = data_json.status;

              //validasi data
              if (data_status == 1) {
                //mendapatkan data
                this.storage.set('sandi', sandi_data);
                this.sandi_pengguna = sandi_data;
                this.loadingCtrl.tutuploading();
                this.alertService.alert_berhasil_mengubah("sandi pengguna", sandi_data);
              
              } else {
                //jika status != 1
                this.loadingCtrl.tutuploading();
                this.alertService.alert_gagal_mengubah("sandi pengguna");
              }
              
            })
            .catch(err => {
              //error
              this.loadingCtrl.tutuploading();
              this.alertService.alert_error_update_tab3("sandi", "10");
            });
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  lihat_password(){

    if (this.lihatsandi == false) {
      this.lihatsandi = true;
    }else{
      this.lihatsandi = false;
    }

  }

  kamera(){
    this.modalCtrl.dismiss();
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.loadingCtrl.tampil_loading_login();

      let data_img_base64 = 'data:image/jpeg;base64,' + res;
      this.base64_img = data_img_base64;
      this.upload();
    });
  }

  galeri(){
    this.modalCtrl.dismiss();
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.loadingCtrl.tampil_loading_login();

      let data_img_base64 = 'data:image/jpeg;base64,' + res;
      this.base64_img = data_img_base64;
      this.upload();
    });
  }

  async upload(){
    //perisapan mengirim
    const fileTransfer: FileTransferObject = this.transfer.create();
    const l_storage_data_nama = await this.storage.get('nama');

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
        this.apiService.panggil_api_update_data_karyawan(this.type_update_gambar, l_storage_data_nama, "", "", url_path)
        .then(res => {

          this.imgURL = this.base64_img;
          this.loadingCtrl.tutuploading();
          this.alertService.alert_berhasil_mengubah_foto();

        })
        .catch(error => {

          //error upload ke database data profil
          this.loadingCtrl.tutuploading();
          this.alertService.alert_gagal_mengubah_foto();

        });
      } else {
        console.log(res);
        //error response upload foto
        this.loadingCtrl.tutuploading();
        this.alertService.alert_error_upload_gambar3_tab2();
      }

    }, (err) => {
      // error
      console.log(err)
      this.loadingCtrl.tutuploading();

    });
  }

  tutup(){
    this.modalCtrl.dismiss();
  }
}
