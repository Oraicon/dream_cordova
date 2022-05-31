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
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { SetGetServiceService } from '../services/set-get-service.service';
import Swal from 'sweetalert2';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  // varibale lokal storage
  nama_ls;
  time_out = 0;

  //persiapan variable
  imgURL:any = 'assets/pp.jpg';
  cek_koneksi = true;
  md5_upload = "assets/images/";
  timeout = 0;
  
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

  //gambar
  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

  //update data
  type_update_akun = "update_data_akun";
  type_update_gambar = "update_image_akun";

  //camera setting
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
    private setget: SetGetServiceService,
    private toastCtrl: ToastService,
    private network: Network,
    private toast: ToastService,
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
    this.setget.setButton(0);
    
    //pengecekan koneksi
    this.network.onDisconnect().subscribe(() => {
      this.cek_koneksi = false;
    });
  
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.cek_koneksi = true;
      }, );
    });
  }

  //delay 
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }

  //delay file transfer 30 detik
  delay() {
    console.log("masuk dealy");
    return new Promise(resolve => { setTimeout(() => resolve(""), 30000);});
  }

  async delayed(){
    await this.delay();
    return 1;
  }

  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  //pengecekan data jika kosong data variable kosong
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
      a = "https://dream-beta.technosolusitama.in/"+ gambar;
    }
    return a;
  }

  //sensor password
  lihat_password(){
    if (this.lihatsandi == false) {
      this.lihatsandi = true;
    }else{
      this.lihatsandi = false;
    }
  }

  //modal ganti gambar
  async presentActionSheet() {

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

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

    } else {
      this.toast.Toast_tampil();
    }

  }

  //dapatkan data gambar dari galeri/kamera
  kamera(){
    this.setget.setButton(0);

    this.loadingCtrl.tampil_loading("Memuat gambar . . .");

    this.camera.getPicture(this.cameraOptions).then(res=>{
      console.log(res);
      let data_img_base64 = 'data:image/jpeg;base64,' + res;
      this.base64_img = data_img_base64;

      this.loadingCtrl.tutup_loading();

      if (this.cek_koneksi == true) {
        this.loadingCtrl.tampil_loading("Menyimpan gambar . . .");
        this.test_koneksi(null, null);
      } else {
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
      }

    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }

  galeri(){
    this.setget.setButton(0);

    this.loadingCtrl.tampil_loading("Memuat gambar . . .");

    this.camera.getPicture(this.galeriOptions).then(res=>{
      console.log(res);
      let data_img_base64 = 'data:image/jpeg;base64,' + res;
      this.base64_img = data_img_base64;

      this.loadingCtrl.tutup_loading();

      if (this.cek_koneksi == true) {
        this.loadingCtrl.tampil_loading("Menyimpan gambar . . .");
        this.test_koneksi(null, null);
      } else {
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
      }
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }

  //mengubah nama pengguna
  async ubahnama(){

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      const modal = await this.modalCtrl.create({
        component: ModalGantinamaPage,
        cssClass: 'small-modal-ganti-nama',
        backdropDismiss:false
      });
      modal.onDidDismiss().then(data => {
        this.setget.setButton(0);

        if (data.data.data == null) {
          return;
        } else {
          if (this.cek_koneksi == true) {
  
            let nama_baru = data.data.data;
            this.test_koneksi(nama_baru, null);
  
          } else {
            this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
          }
          
        }
      }).catch(err => {
        // console.log(err);
      });
      await modal.present();

    } else {
      this.toast.Toast_tampil();
    }

  }

  //mengubah sandi pengguna
  async ubahpassword(){

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      const modal = await this.modalCtrl.create({
        component: ModalGantisandiPage,
        cssClass: 'small-modal-ganti-sandi',
        backdropDismiss:false
      });
      modal.onDidDismiss().then(data => {
        this.setget.setButton(0);

        if (data.data.data == null) {
          return;
        } else {
  
          if (this.cek_koneksi == true) {
  
            let sandi_baru = data.data.data;
  
            this.test_koneksi(null, sandi_baru);
  
          } else {
  
            this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
            
          }
          
        }
      }).catch(err => {
        // console.log(err);
      });
      await modal.present();

    } else {
      this.toast.Toast_tampil();
    }

  }

  async get_data_lokal(){
    this.nama_ls = await this.storage.get('nama');
  }

  async tampilkandata(){
    this.loadingCtrl.tampil_loading("Memuat data . . .");
    const data_l_nama = await this.storage.get('nama');
    const data_l_sandi = await this.storage.get('sandi');
    await this.interval_counter();
  
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

      this.loadingCtrl.tutup_loading();
    })
    .catch(err => {
      this.loadingCtrl.tutup_loading();
      this.time_out++;

      if (this.time_out >= 3) {
        this.keluar_aplikasi();
      } else {
        if (err.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 17, kembali ke login !");
        }
      }
    });
  }

  test_koneksi(nama, sandi){
    this.toastCtrl.Toast("Pengecekan koneksi internet . . .");
    this.apiService.cek_koneksi()
    .then(data => {

      if (nama != null) {
        this.api_ubah_nama(nama);
      } else if (sandi != null){
        this.api_ubah_sandi(sandi);
      }else {
        this.upload();
      }

    })
    .catch(error => {
      this.loadingCtrl.tutup_loading();
      this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
    });
  }

  //upload gambar + update di api
  async upload(){
    //perisapan mengirim
    const fileTransfer: FileTransferObject = this.transfer.create();
    const l_storage_data_nama = await this.storage.get('nama');

    //persiapan url dan nama
    let URL="https://dream-beta.technosolusitama.in/api/uploadImage";
    this.name_img = this.datepipe.transform((new Date), 'MMddyyyyhmmss.')+ this.format_img;
    let nama_file = this.name_img.toString();

    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama_file,
      chunkedMode: false,
      httpMethod: "POST",
      mimeType: "image/JPEG",
      headers: {
        // "Authorization": "Basic ZHJlYW1fMS4wOmRyZWFtXzEuMA=="
      }
    }

    //upload ke server
    fileTransfer.upload(this.base64_img, URL, options)
    .then((res) => {
      // success upload foto
      const data_json = JSON.parse(res.response);
      const data_status = data_json.status;
      
      if (data_status == 0) {
        
        this.upload_data_server(l_storage_data_nama);

      } else {
        console.log(res);
        //error response upload foto
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 4 !");
      }

    }, (err) => {
      console.log(err);
      // error
      let status = err.code;
      if (status == 4) {
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Mengirim gambar terlalu lama");
      } else {
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_code_error("Terjadi kesalahan !", "code error 13 !, kembali ke login !");
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  upload_data_server(nama){
    const url_path = this.md5_upload+"/"+this.name_img;
    this.apiService.panggil_api_update_data_karyawan(this.type_update_gambar, nama, "", "", url_path)
    .then(res => {

      const data_json = JSON.parse(res.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        this.imgURL = this.base64_img;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_berhasil("Berhasil !", "Foto profil anda berhasil diubah !");
      } else {
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Foto profil anda gagal diubah !");
      }
    })
    .catch(error => {

      //error upload ke database data profil
      this.loadingCtrl.tutup_loading();

      console.log(error)
  
      this.loadingCtrl.tutup_loading();
  
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      }else{
        if(error.status == -4){
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
        }else{
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 14 !, kembali ke login !");
        }
      }

    });
  }

  api_ubah_nama(nama_baru){

    this.interval_counter();

    this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, this.nama_ls, nama_baru, "", "")
    .then(res => {
      const data_json = JSON.parse(res.data);
      const data_status = data_json.status;

      //validasi data
      if (data_status == 1) {
        //mendapatkan data
        this.storage.set('nama', nama_baru);
        this.username_pengguna = nama_baru;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_berhasil("Berhasil !", "Nama pengguna anda telah diganti dengan " + nama_baru);
      } else {
        //jika status != 1
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 5 !");
      }
      
    })
    .catch(err => {
      //error
      console.log(err);
      this.loadingCtrl.tutup_loading();

      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      }else{
        if(err.status == -4){
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
          return
        }else{
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 6 !, kembali ke login !");
          return
        }
      }


    });
  }

  api_ubah_sandi(sandi_baru){

    this.interval_counter();

    this.apiService.panggil_api_update_data_karyawan(this.type_update_akun, this.nama_ls, "", sandi_baru, "")
    .then(res => {
      const data_json = JSON.parse(res.data);
      const data_status = data_json.status;

      //validasi data
      if (data_status == 1) {
        //mendapatkan data
        this.storage.set('sandi', sandi_baru);
        this.sandi_pengguna = sandi_baru;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_berhasil("Berhasil !", "Sandi pengguna anda telah diubah !");
      } else {
        //jika status != 1
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "code error 7 !");
      }
      
    })
    .catch(err => {
      //error
      this.loadingCtrl.tutup_loading();

      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      }else{
        if(err.status == -4){
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
        }else{
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 8 !, kembali ke login !");
        }
      }

    });
  }

  async tidak_ada_respon(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }

    this.loadingCtrl.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Server tidak merespon, coba lagi ?!',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutup_loading();
        this.tampilkandata();
      }
    });
  }

  async keluar_aplikasi(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }

    this.loadingCtrl.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Keluar dari aplikasi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutup_loading();
        navigator['app'].exitApp();
      }
    });
  }

  //logout
  async keluar(){

    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.loadingCtrl.tampil_loading("");
      Swal.fire({
        icon: 'warning',
        title: 'Keluar akun ?',
        text: 'Kembali ke login, anda yakin ?',
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'Ya',
        showDenyButton: true,
        denyButtonText: `Tidak`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingCtrl.tutup_loading();
          this.router.navigate(["/login"], { replaceUrl: true });
        }else {
          this.loadingCtrl.tutup_loading();
        }
      });

    } else {
      this.toast.Toast_tampil();
    }
  }
}
