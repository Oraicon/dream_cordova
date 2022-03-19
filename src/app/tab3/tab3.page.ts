import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiServicesService } from '../services/api-services.service';
import { LoadingServiceService } from '../services/loading-service.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { DatePipe } from '@angular/common';
import { PasswordServiceService } from '../services/password-service.service';
import { MomentService } from '../services/moment.service';
import { ModalGantisandiPage } from '../modal/modal-gantisandi/modal-gantisandi.page';
import { ModalGantinamaPage } from '../modal/modal-gantinama/modal-gantinama.page';
import { SwalServiceService } from '../services/swal-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  // varibale loka storage
  nama_ls;
  pasword_ls;
  z = 0;

  //persiapan variable
  imgURL:any = 'assets/pp.jpg';

  //variable frontend
  lihatsandi = false;
  nik_pengguna;
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
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }


  constructor(private momentService: MomentService,
    private swalService: SwalServiceService,
    private actionSheetController: ActionSheetController,
    private router: Router, 
    private passwordService: PasswordServiceService, 
    private datepipe: DatePipe, 
    private transfer: FileTransfer, 
    private camera: Camera,
    private modalCtrl: ModalController,
    private loadingCtrl:LoadingServiceService, 
    private storage:Storage, 
    private apiService:ApiServicesService) {
    
    this.tampilkandata();
    this.get_data_lokal();
  }

  async get_data_lokal(){
    this.nama_ls = await this.storage.get('nama');
  }

  async tampilkandata(){
    this.loadingCtrl.tampil_loading_login();
    const data_l_nama = await this.storage.get('nama');
    const data_l_sandi = await this.storage.get('sandi');

  
    this.apiService.panggil_api_data_karyawan(data_l_nama, data_l_sandi)
    .then(res => {
      
      const data_json = JSON.parse(res.data);
      const data_status_data = data_json.data[0];
      
      this.nik_pengguna = this.pengecekan_var(data_status_data.nik);
      this.username_pengguna = this.pengecekan_var(data_l_nama);
      this.sandi_pengguna = data_l_sandi;
      this.sandi_pengguna_tidak_terlihat = this.passwordService.disable_password(this.sandi_pengguna);
      this.nama_pengguna = this.pengecekan_var(data_status_data.nama);
      this.email_pengguna = this.pengecekan_var(data_status_data.email);
      this.nohp_pengguna = this.pengecekan_var(data_status_data.no_hp);
      this.tempatlahir_pengguna = this.pengecekan_var(data_status_data.tempat_lahir);
      this.kelamin_pengguna = this.pengecekan_var(data_status_data.jenis_kelamin);
      this.alamat_pengguna = this.pengecekan_var(data_status_data.alamat);
      this.jabatan_pengguna = this.pengecekan_var(data_status_data.nama_jabatan);
      this.posisi_pengguna = this.pengecekan_var(data_status_data.nama_posisi);
      this.departemen_pengguna = this.pengecekan_var(data_status_data.nama_departemen);
      this.bank_pengguna = this.pengecekan_var(data_status_data.nama_bank);
      this.rekening_pengguna = this.pengecekan_var(data_status_data.no_rek);
      
      this.tanggalbergabung_pengguna = this.pengecekan_tanggal(data_status_data.tgl_bergabung);
      this.tanggallahir_pengguna = this.pengecekan_tanggal(data_status_data.tgl_lahir);

      this.imgURL = this.pengecekan_gambar(data_status_data.image);

      this.loadingCtrl.tutuploading();
      this.z = 0;
    })
    .catch(err => {
      this.validasi_keluar();
    });
  }

  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  pengecekan_var(data_var){
    let a; 
    if(data_var == "" || data_var == null || data_var == undefined){
      a = "Data tidak ada";
    }else{
      a = data_var;
    }
    return a;
  }

  pengecekan_tanggal(tanggal){
    let a;
    if (tanggal == "" || tanggal == null || tanggal == undefined) {
      a = "Data tidak ada";
    } else {
      a = this.momentService.ubah_format_tanggal(tanggal);
    }
    return a;
  }

  pengecekan_gambar(gambar){
    let a;
    if (gambar == "" || gambar == null || gambar == undefined) {
      a = "assets/bi.png";
    } else {
      a = gambar;
    }
    return a;
  }

  lihat_password(){
    if (this.lihatsandi == false) {
      this.lihatsandi = true;
    }else{
      this.lihatsandi = false;
    }
  }

  kamera(){
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.loadingCtrl.tampil_loading_login();

      let data_img_base64 = 'data:image/jpeg;base64,' + res;
      this.base64_img = data_img_base64;
      this.upload();
    });
  }

  galeri(){
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
          this.swalService.swal_aksi_berhasil("Ubah foto berhasil !", "Foto profil anda berhasil diubah !");

        })
        .catch(error => {

          //error upload ke database data profil
          this.loadingCtrl.tutuploading();
          this.swalService.swal_aksi_gagal("Ubah foto gagal !", "Terjadi kesalahan pada saat mengubah foto !");

        });
      } else {
        console.log(res);
        //error response upload foto
        this.loadingCtrl.tutuploading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 4 !");
      }

    }, (err) => {
      // error
      console.log(err)
      this.loadingCtrl.tutuploading();
      this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 13 !");
    });
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

  async ubahnama(){
    const modal = await this.modalCtrl.create({
      component: ModalGantinamaPage,
      cssClass: 'small-modal-ganti-nama',
      backdropDismiss:false
    });
    modal.onDidDismiss().then(data => {
      if (data.data.data == null) {
        
      } else {
        let nama_baru = data.data.data;

        this.loadingCtrl.tampil_loading_login();

        this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, this.nama_ls, nama_baru, "", "")
        .then(res => {
          const data_json = JSON.parse(res.data);
          const data_status = data_json.status;

          //validasi data
          if (data_status == 1) {
            //mendapatkan data
            this.storage.set('nama', nama_baru);
            this.nama_pengguna = nama_baru;
            this.loadingCtrl.tutuploading();
            this.swalService.swal_aksi_berhasil("Berhasil !", "Nama pengguna anda telah diganti dengan " + nama_baru);
          } else {
            //jika status != 1
            this.loadingCtrl.tutuploading();
            this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 5 !");
          }
          
        })
        .catch(err => {
          //error
          this.loadingCtrl.tutuploading();
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 6 !");
        });
      }
    }).catch(err => {
      // console.log(err);
    });
    await modal.present();
  }

  async ubahpassword(){
    const modal = await this.modalCtrl.create({
      component: ModalGantisandiPage,
      cssClass: 'small-modal-ganti-sandi',
      backdropDismiss:false
    });
    modal.onDidDismiss().then(data => {
      if (data.data.data == null) {
        
      } else {
        let sandi_baru = data.data.data;

        this.loadingCtrl.tampil_loading_login();

        this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, this.nama_ls, "", sandi_baru, "")
        .then(res => {
          const data_json = JSON.parse(res.data);
          const data_status = data_json.status;

          //validasi data
          if (data_status == 1) {
            //mendapatkan data
            this.storage.set('sandi', sandi_baru);
            this.sandi_pengguna = sandi_baru;
            this.loadingCtrl.tutuploading();
            this.swalService.swal_aksi_berhasil("Berhasil !", "Sandi pengguna anda telah diubah !");
          } else {
            //jika status != 1
            this.loadingCtrl.tutuploading();
            this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 7 !");

          }
          
        })
        .catch(err => {
          //error
          this.loadingCtrl.tutuploading();
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 8 !");
        });
      }
    }).catch(err => {
      // console.log(err);
    });
    await modal.present();
  }
  
  async tutuploading_retry(){
    this.loadingCtrl.tutuploading();
    this.loadingCtrl.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'OK !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutuploading();
        this.tampilkandata();
      }
    });
  }

  async keluar(){
    this.loadingCtrl.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Keluar akun ?',
      text: 'Anda akan kembali ke login anda yakin ?',
      backdrop: false,
      showDenyButton: true,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Ya',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.storage.set('nama', null);
        this.storage.set('sandi', null);
        this.loadingCtrl.tutuploading();
        this.router.navigate(["/login"], { replaceUrl: true });
      }else {
        this.loadingCtrl.tutuploading();
      }
    });
  }

  validasi_keluar(){
    this.z++;
    if (this.z == 3) {
      this.loadingCtrl.tampil_loading_login();
      Swal.fire({
        icon: 'warning',
        title: 'Terjadi kesalahan !',
        text: 'Keluar dari aplikasi !',
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'Ya !',
      }).then((result) => {
        if (result.isConfirmed) {
          this.storage.set('nama', null);
          this.storage.set('sandi', null);
          this.loadingCtrl.tutuploading();
          navigator['app'].exitApp();
        }
      });
    } else {
      this.tutuploading_retry();
    }
  }
}
