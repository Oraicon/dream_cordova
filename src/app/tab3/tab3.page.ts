import { Component, NgZone } from '@angular/core';
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
import { SizecountServiceService } from '../services/sizecount-service.service';

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
  timeout = 0;
  sedang_mengirim = false;
  data_progres_bar = 0;
  
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
    quality: 100,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  galeriOptions: CameraOptions = {
    quality: 100,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }


  constructor(private momentService: MomentService,
    private setget: SetGetServiceService,
    private toastCtrl: ToastService,
    private sizeService: SizecountServiceService,
    private network: Network,
    private toast: ToastService,
    private swalService: SwalServiceService,
    private actionSheetController: ActionSheetController,
    private router: Router, 
    private ngzone: NgZone,
    private passwordService: PasswordServiceService, 
    private datepipe: DatePipe, 
    private transfer: FileTransfer, 
    private camera: Camera,
    private modalCtrl: ModalController,
    private loadingCtrl:LoadingServiceService, 
    private storage:Storage, 
    private apiService:ApiServicesService) {
    
    this.tampilkandata();
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

  ionViewWillEnter(){
    this.setget.setButton(0);
  }

  //delay 
  interval_counter(timer) {
    return new Promise(resolve => { setTimeout(() => resolve(""), timer);});
  }

  //fungsi menunggu delay
  async delayed(){
    await this.interval_counter(120000);
    return 1;
  }

  //fungsi jika gambar rusak
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

  //dapatkan data gambar dari galeri/kamera
  kamera(){
    this.setget.setButton(0);

    this.loadingCtrl.tampil_loading("Memuat gambar . . .");

    this.camera.getPicture(this.cameraOptions).then(res=>{
      console.log(res);
      let data_img_base64 = 'data:image/jpeg;base64,' + res;
      this.base64_img = data_img_base64;
      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;

      this.loadingCtrl.tutup_loading();

      if (int_size >= 10485760 ) {
        this.swalService.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
        return;
      } else {
        if (this.cek_koneksi == true) {
          this.swal_gambar(this.base64_img);
        } else {
          this.loadingCtrl.tutup_loading();
          this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
        }
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
      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;

      this.loadingCtrl.tutup_loading();

      if (int_size >= 10485760 ) {
        this.swalService.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
        return;
      } else {
        if (this.cek_koneksi == true) {
          this.swal_gambar(this.base64_img);
        } else {
          this.loadingCtrl.tutup_loading();
          this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
        }
      }
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }

    //alert konfirmasi ganti gambar
    swal_gambar(path_uri){
      this.loadingCtrl.tutup_loading();
      this.loadingCtrl.tampil_loading("");
      Swal.fire({
        title: 'Peringatan !!',
        text: 'Ubah profil dengan foto di atas ?!',
        imageUrl: '' + path_uri,
        imageWidth: 300,
        imageHeight: 200,
        imageAlt: 'Custom image',
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'Simpan !',
        showDenyButton: true,
        denyButtonText: `Batal `,
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingCtrl.tutup_loading();
          this.sedang_mengirim = true;
          this.loadingCtrl.tampil_loading("Mengubah profil . . .");
          this.test_koneksi(null, null);
        }else{
          this.loadingCtrl.tutup_loading();
        }
      })
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

            this.sedang_mengirim = true;
            this.data_progres_bar = 0.3;

            this.test_koneksi(nama_baru, null);
  
          } else {
            this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
          }
          
        }
      }).catch(err => {
        console.log(err);
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

            this.sedang_mengirim = true;
            this.data_progres_bar = 0.3;
  
            this.test_koneksi(null, sandi_baru);
  
          } else {
  
            this.swalService.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
            
          }
          
        }
      }).catch(err => {
        console.log(err);
      });
      await modal.present();

    } else {
      this.toast.Toast_tampil();
    }

  }

  //menampilkan data
  async tampilkandata(){
    this.loadingCtrl.tampil_loading("Memuat data . . .");
    const data_l_nama = await this.storage.get('nama');
    const data_l_sandi = await this.storage.get('sandi');
    await this.interval_counter(100);
  
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
      console.log(err);

      this.loadingCtrl.tutup_loading();
      this.time_out++;

      if (this.time_out >= 3) {
        this.keluar_aplikasi();
      } else {
        if (err.status == -4) {
          this.tidak_ada_respon();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 17, kembali ke login !");
        }
      }
    });
  }

  //test koneksi dengan menghit api
  async test_koneksi(nama, sandi){

    this.apiService.cek_koneksi()
    .then(data => {

      this.sedang_mengirim = true;
      this.data_progres_bar = 0.6;

      if (nama != null) {
        this.api_ubah_nama(nama);
      } else if (sandi != null){
        this.api_ubah_sandi(sandi);
      }else {
        this.upload_data_server();
      }

    })
    .catch(error => {
      console.log(error);

      this.loadingCtrl.tutup_loading();
      this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
    });
  }

  //upload gambar + update di api
  progress = 0
  sedang_upload = false;
  async upload(nama_file){
    //perisapan mengirim
    const fileTransfer: FileTransferObject = this.transfer.create();

    //persiapan url dan nama
    let URL="https://dream-beta.technosolusitama.in/api/uploadImage";


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

    fileTransfer.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_upload = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
    });

    //upload ke server
    fileTransfer.upload(this.base64_img, URL, options)
    .then((res) => {
      // success upload foto
      const data_json = JSON.parse(res.response);
      const data_status = data_json.status;
      this.sedang_upload = false;
      
      if (data_status == 0) {
        
        this.imgURL = this.base64_img;
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_berhasil("Berhasil !", "Foto profil anda berhasil diubah !");

      } else {
        console.log(res);
        //error response upload foto
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Code error 4 !");
      }

    }, (err) => {
      console.log(err);
      // error
      let status = err.code;
      this.sedang_upload = false;

      if (status == 4) {
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Mengirim gambar terlalu lama !");
      } else {
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 13 !, kembali ke login !");
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  //update data server
  async upload_data_server(){
    this.name_img = this.datepipe.transform((new Date), 'MMddyyyyhmmss.')+ this.format_img;
    let nama_file = this.name_img.toString();
    let nama_ls = await this.storage.get('nama');
    console.log(nama_ls);

    this.apiService.update_data_poengguna(nama_ls, null, null, nama_file)
    .then(res => {
      console.log(res);

      const data_json = JSON.parse(res.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        this.data_progres_bar = 0.8;

        this.upload(nama_file);
      } else {
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Foto profil anda gagal diubah !");
      }
    })
    .catch(error => {

      //error upload ke database data profil
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;

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

  //update nama
  async api_ubah_nama(nama_baru){

    this.interval_counter(100);

    let nama_ls = await this.storage.get('nama');

    this.apiService.update_data_poengguna(nama_ls, nama_baru, null, null)
    .then(res => {
      console.log(res);
      const data_json = JSON.parse(res.data);
      const data_status = data_json.status;

      //validasi data
      if (data_status == 1) {
        //mendapatkan data
        this.storage.set('nama', nama_baru);
        this.username_pengguna = nama_baru;
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_berhasil("Berhasil !", "Nama pengguna anda telah diganti dengan " + nama_baru);
      } else {
        //jika status != 1
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Code error 5 !");
      }
      
    })
    .catch(err => {
      //error
      console.log(err);
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingCtrl.tutup_loading();

      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      }else{
        if(err.status == -4){
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
          return
        }else{
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 6 !, kembali ke login !");
          return
        }
      }


    });
  }

  //update sandi
  async api_ubah_sandi(sandi_baru){

    this.interval_counter(100);

    let nama_ls = await this.storage.get('nama');

    this.apiService.update_data_poengguna(nama_ls, null, sandi_baru, null)
    .then(res => {
      console.log(res);

      const data_json = JSON.parse(res.data);
      const data_status = data_json.status;

      //validasi data
      if (data_status == 1) {
        //mendapatkan data
        this.storage.set('sandi', sandi_baru);
        this.sandi_pengguna = sandi_baru;
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_berhasil("Berhasil !", "Sandi pengguna anda telah diubah !");
      } else {
        //jika status != 1
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Code error 7 !");
      }
      
    })
    .catch(err => {
      //error
      console.log(err);
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingCtrl.tutup_loading();

      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      }else{
        if(err.status == -4){
          this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
        }else{
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 8 !, kembali ke login !");
        }
      }

    });
  }

  //memuat ulang
  async relog(){
    
    this.nama_ls = "";
    this.time_out = 0;

    this.imgURL = 'assets/pp.jpg';
    this.cek_koneksi = true;
    this.timeout = 0;
    
    //variable frontend
    this.lihatsandi = false;
    this.nik_pengguna;
    this.username_pengguna;
    this.sandi_pengguna;
    this.sandi_pengguna_tidak_terlihat;
    this.nama_pengguna;
    this.email_pengguna;
    this.nohp_pengguna;
    this.tempatlahir_pengguna;
    this.tanggallahir_pengguna;
    this.kelamin_pengguna;
    this.alamat_pengguna;
    this.jabatan_pengguna;
    this.posisi_pengguna;
    this.tanggalbergabung_pengguna;
    this.departemen_pengguna;
    this.bank_pengguna;
    this.rekening_pengguna;

    //gambar
    this.base64_img="";
    this.name_img="";
    this.format_img="JPEG";

    //update data
    this.type_update_akun = "update_data_akun";
    this.type_update_gambar = "update_image_akun";

    this.tampilkandata();
  }

  //jika tidak ada respon
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
        this.relog();
      }
    });
  }

  //keluar aplikasi jika terjadi error
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
          this.storage.set('auth', false);
          this.storage.set('nama', null);
          this.storage.set('sandi', null);
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
