import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ModalIsikontenPage } from 'src/app/modal/modal-isikonten/modal-isikonten.page';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { DatePipe } from '@angular/common';
import { MomentService } from 'src/app/services/moment.service';
import { Storage } from '@ionic/storage-angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Chooser, ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { ToastService } from 'src/app/services/toast.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import Swal from 'sweetalert2';
import { SizecountServiceService } from 'src/app/services/sizecount-service.service';
import {NgZone} from '@angular/core';

@Component({
  selector: 'app-notif',
  templateUrl: './notif.page.html',
  styleUrls: ['./notif.page.scss'],
})
export class NotifPage implements OnInit {

  //persiapan variable
  arr_id_rap = []
  arr_obj_data_notif_mentah =[];
  arr_obj_data_notif =[];
  tanggal_notif = {};
  file_path = {};
  file_nama = {};
  imgURI;
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";

  //variable tricky
  loading_skeleton = true;
  sedang_mengirim = false;
  data_progres_bar = 0;
  timeout = 0; 
  data_pc_ada = 1;
  data_pd_ada = 1;
  data_tidak_ada = false;

  //persiapan kamera
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
  

  constructor(
    private ngzone: NgZone,
    private modalCtrl: ModalController,
    private chooser: Chooser,
    private storage:Storage, 
    private swalService:SwalServiceService,
    private camera: Camera,
    private datepipe: DatePipe, 
    private loadingCtrl: LoadingServiceService,
    private file: File,
    private actionSheetController: ActionSheetController,
    private fileOpener: FileOpener,
    private router: Router, 
    private toast: ToastService,
    private transfer: FileTransfer,
    private sizeService: SizecountServiceService,
    private momentService: MomentService,
    private swal: SwalServiceService,
    private setget:SetGetServiceService,
    private apiService:ApiServicesService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    this.loadingCtrl.tampil_loading("Memuat data . . .");
    this.setget.setButton(0);
    this.arr_id_rap = await this.setget.getArrIdRap();
    this.looping_data_pc(this.arr_id_rap);
    console.log(this.arr_id_rap);
  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.router.navigate(["/tabs/tab1"], { replaceUrl: true });

    } else {
      this.toast.Toast_tampil();
    }
  }

  //delay filetranfer 40 detik
  delay(timer) {
    console.log("masuk dealy");
    return new Promise(resolve => { setTimeout(() => resolve(""), timer);});
  }

  // menunggu delay
  async delayed(){
    await this.delay(120000);
    return 1;
  }

  // menungu delay interval counter loading
  async delay_dulu(){
    await this.delay(500);
    this.loadingCtrl.tutup_loading();
    return;
  }

  //looping data notif dari kegiatan
  async looping_data_pc(arr){
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];

      this.notif_pc(element, index);
      
    }
  }

  //hit api notif kegiatan
  async notif_pc(id, index){
  
    const data_l_nama = await this.storage.get('nama');
  
    this.apiService.get_notif_pc(id, data_l_nama)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;
      if (status_data == 1) {

        let data_arr_pc_mentah = data_json.data

        console.log(data_json.data);

        for (let index = 0; index < data_arr_pc_mentah.length; index++) {
          let element = data_arr_pc_mentah[index];
          let obj_data_pc = {
            id: element.id,
            id_pc_pd_evidance: element.id_pc_progress_harian_evidance,
            nama_proyek: element.nama_proyek,
            uraian_kegiatan: element.uraian_kegiatan,
            status_notif: element.status_notif,
            evidence_file: element.evidence_file,
            create_date: element.create_date,
            tipe_data : "pc",
          }
          this.arr_obj_data_notif_mentah.push(obj_data_pc);
        }

        if (index == this.arr_id_rap.length - 1 || index == 0) {
          this.looping_data_pd(this.arr_id_rap);
        }
      }else{
        this.data_pc_ada = 0;
        this.looping_data_pd(this.arr_id_rap);
      }
  
    })
    .catch(error => {
  
      console.log(error)
  
      this.loadingCtrl.tutup_loading();
  
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon2();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 53 !, kembali ke login !");
        }
      }
  
    });
  }

  //looping data notif dari cheklist dokumen
  async looping_data_pd(arr){
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];

      this.notif_pd(element, index);
      
    }
  }

  //hit api notif cheklist_dokumen
  async notif_pd(id, index){

    const data_l_nama = await this.storage.get('nama');

    this.apiService.get_notif_pd(id, data_l_nama)
    .then(data => {
      
      const data_json = JSON.parse(data.data);
      console.log(data_json.data);
      const status_data = data_json.status;

      if (status_data == 1) {

        let data_arr_pd_mentah = data_json.data

        for (let index = 0; index < data_arr_pd_mentah.length; index++) {
          let element = data_arr_pd_mentah[index];
          let obj_data_pd = {
            id: element.id,
            id_pc_pd_evidance: element.id_pd_cheklist_dokumen_evidance,
            nama_proyek: element.nama_proyek,
            uraian_kegiatan: element.uraian_kegiatan,
            status_notif: element.status_notif,
            evidence_file: element.evidence_file,
            create_date: element.create_date,
            tipe_data : "pd",
          }
          this.arr_obj_data_notif_mentah.push(obj_data_pd);
        }

        if (index == this.arr_id_rap.length - 1 || index == 0) {
          this.sorting();
        }
      }else{
        this.data_pd_ada = 0;

        if (this.data_pc_ada == 0 && this.data_pd_ada == 0) {

          this.data_tidak_ada = true;
          this.loading_skeleton = false;
          this.loadingCtrl.tutup_loading();
        }else{
          this.sorting();
        }
      }

    })
    .catch(error => {
  
      console.log(error)
  
      this.loadingCtrl.tutup_loading();
  
      this.timeout++;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon2();
        } else {
          this.swalService.swal_code_error("Terjadi kesalahan !", "Code error 54 !, kembali ke login !");
        }
      }
  
    });
  }

  //logika compare isi ada tanggal
  compare( a, b ) {
    return a.create_date - b.create_date;
  }

  //logika sorting
  async sorting(){
    let sorting_arr = this.arr_obj_data_notif_mentah;
    sorting_arr.sort(this.compare);
    sorting_arr.reverse();
    this.tanggal(sorting_arr);
  }

  // mengubah format tanggal
  async tanggal(arr){
    
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];
      
      let tanggal = this.momentService.ubah_format_tanggal_waktu(element.create_date);
      
      this.tanggal_notif[element.id] = tanggal;

      if (index == this.arr_id_rap.length - 1 || index == 0) {
        this.file_ext(arr);
      }
    }

  }

  // mengubah format tanggal
  async file_ext(arr){
  
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];
      console.log(element);
      
      let evidance_path = element.evidence_file;
      let nama_file = evidance_path.substring(28);
      let ext = nama_file.split('.').pop();
      
      this.file_nama[element.id] = nama_file;
      this.file_nama["ext"+element.id] = ext;

      if (index == this.arr_id_rap.length - 1 || index == 0) {
        this.arr_obj_data_notif = arr;
        this.loading_skeleton = false;
        // this.loadingCtrl.tutup_loading();
        this.delay_dulu();
      }
    }

  }

  //modal ganti gambar
  async presentActionSheet(id, id_pc_pd, path_data, pc_pd) {

    let nama_img = path_data.substring(14);
    console.log(id, id_pc_pd, path_data, pc_pd);

    const actionSheet = await this.actionSheetController.create({
      header: 'Kirim ulang gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Kamera',
        icon: 'camera-outline',
        handler: () => {
          this.kamera(nama_img, id, id_pc_pd, pc_pd);
        }
      }, {
        text: 'Galeri',
        icon: 'image-outline',
        handler: () => {
          this.galeri(nama_img, id, id_pc_pd, pc_pd);
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
  kamera(nama_img, id, id_pc_pd, pc_pd){
    this.loadingCtrl.tampil_loading("Memuat gambar . . .");
    this.camera.getPicture(this.cameraOptions).then(res=>{

      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;
      if (int_size >= 10485760 ) {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
        return;
      } else {
        this.loadingCtrl.tutup_loading();
        this.imgURI = 'data:image/jpeg;base64,' + res;
        this.swal_gambar(this.imgURI, id, id_pc_pd, pc_pd);
      }
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }

  galeri(nama_img, id, id_pc_pd, pc_pd){
    this.loadingCtrl.tampil_loading("Memuat gambar . . .");
    this.camera.getPicture(this.galeriOptions).then(res=>{
      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;
      if (int_size >= 10485760 ) {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
        return;
      } else {
        this.loadingCtrl.tutup_loading();
        this.imgURI = 'data:image/jpeg;base64,' + res;
        this.swal_gambar(this.imgURI, id, id_pc_pd, pc_pd);
      }
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }
  
  //menampilan gambar
  async buka_img(data_gambar, data_nama){

    console.log(data_gambar, data_nama);
    
    this.setget.setdatalist("https://dream-beta.technosolusitama.in/"+data_gambar, data_nama);

    const modal = await this.modalCtrl.create({
      component: ModalIsikontenPage,
      cssClass: 'konten-modal',
      backdropDismiss:false
    });
    modal.onDidDismiss().then(data => {
    }).catch(err => {
    });
    await modal.present();
  }

  progress = 0;
  sedang_download = false;
  //buka pdf
  async buka_pdf(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");
    let nama_pdf = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;

    const trans = this.transfer.create();

    trans.onProgress((progressEvent) => {
    this.progress = 0;
    this.sedang_download = true;
    let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
    this.ngzone.run(() => {
      this.progress = perc / 100;
    });
    });

    trans.download(data_url, this.file.dataDirectory + nama_pdf).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      let hasil =  entry.toURL(); 
      this.sedang_download = false;
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      this.sedang_download = false;

      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'Dokumen tidak ditemukan !',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      }
      
      if (code_error == 4) {
        this.swalService.swal_aksi_gagal("Mendownload gagal !", "Waktu terlalu lama, coba beberapa saat lagi !")
      }
      
      if( code_error != 1 && code_error != 4){
        this.swal.swal_code_error("Terjadi kesalahan !", "Code error 78 !, kembali ke login !");
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      trans.abort();
    }
  }

  //buka doc
  async buka_doc(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    let nama_server = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;
    let tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    const trans = this.transfer.create();

    trans.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_download = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
      });
    
    trans.download(data_url, this.file.dataDirectory + nama_server).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.sedang_download = false;
      let hasil =  entry.toURL(); 

      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, tipe_mime)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      this.sedang_download = false;

      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'Dokumen tidak ditemukan !',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
            // this.dapatkan_data20(nama_server, tipe_mime, null, null);
          }else {
            this.loadingCtrl.tutup_loading();
          }
        });
      } 
      
      if (code_error == 4) {
        this.swalService.swal_aksi_gagal("Mendownload gagal !", "Waktu terlalu lama, coba beberapa saat lagi !")
      }
      
      if( code_error != 1 && code_error != 4){
        this.swal.swal_code_error("Terjadi kesalahan !", "Code error 79 !, kembali ke login !");
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      trans.abort();
    }
  }

  //buka xlsx
  async buka_xlsx(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    console.log(path_data);
    let nama_server = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;

    const trans = this.transfer.create();

    trans.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_download = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
      });
    
    trans.download(data_url, this.file.dataDirectory + nama_server).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.sedang_download = false;
      let hasil =  entry.toURL(); 
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      this.sedang_download = false;

      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'File tidak ditemukan !',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      }
      
      if (code_error == 4) {
        this.swalService.swal_aksi_gagal("Mendownload gagal !", "Waktu terlalu lama, coba beberapa saat lagi !")
      }
      
      if( code_error != 1 && code_error != 4){
        this.swal.swal_code_error("Terjadi kesalahan !", "Code error 80 !, kembali ke login !");
      }

    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      trans.abort();
    }
  }

  //buka_pptx
  async buka_pptx(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    console.log(path_data);
    let nama_server = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;

    const trans = this.transfer.create();

    trans.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_download = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
      });
    
    trans.download(data_url, this.file.dataDirectory + nama_server).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.sedang_download = false;
      let hasil =  entry.toURL(); 
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, "application/vnd.openxmlformats-officedocument.presentationml.presentation")
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      this.sedang_download = false;

      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'File tidak ditemukan !',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      }
      
      if (code_error == 4) {
        this.swalService.swal_aksi_gagal("Mendownload gagal !", "Waktu terlalu lama, coba beberapa saat lagi !")
      }
      
      if( code_error != 1 && code_error != 4){
        this.swal.swal_code_error("Terjadi kesalahan !", "Code error 81 !, kembali ke login !");
      }

    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      trans.abort();
    }
  }

  //buka_rar
  async buka_rar(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    console.log(path_data);
    let nama_server = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;

    const trans = this.transfer.create();

    trans.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_download = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
      });
    
    trans.download(data_url, this.file.dataDirectory + nama_server).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.sedang_download = false;
      let hasil =  entry.toURL(); 
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, "application/rar")
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      this.sedang_download = false;

      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'File tidak ditemukan !',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      } 
      
      if (code_error == 4) {
        this.swalService.swal_aksi_gagal("Mendownload gagal !", "Waktu terlalu lama, coba beberapa saat lagi !")
      }
      
      if( code_error != 1 && code_error != 4){
        this.swal.swal_code_error("Terjadi kesalahan !", "Code error 82 !, kembali ke login !");
      }

    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      trans.abort();
    }
  }

  //buka_zip
  async buka_zip(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    console.log(path_data);
    let nama_server = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;

    const trans = this.transfer.create();

    trans.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_download = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
    });
    
    trans.download(data_url, this.file.dataDirectory + nama_server).then((entry) => {
      this.sedang_download = false;
      console.log('download complete: ' + entry.toURL());
      let hasil =  entry.toURL(); 
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, "application/zip")
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      this.sedang_download = false;

      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'File tidak ditemukan !',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Iya !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      }
      
      if (code_error == 4) {
        this.swalService.swal_aksi_gagal("Mendownload gagal !", "Waktu terlalu lama, coba beberapa saat lagi !")
      }
      
      if( code_error != 1 && code_error != 4){
        this.swal.swal_code_error("Terjadi kesalahan !", "Code error 83 !, kembali ke login !");
      }

    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      trans.abort();
    }
  }

  //dapatkan data file
  async dapatkan_data20(id, id_pc_pd, path_data, pc_pd){
    this.loadingCtrl.tampil_loading("Sedang Memuat . . .");
    let tipe_mime;

    let nama_data_serve = path_data.substring(28);
    let ext_awal = nama_data_serve.split('.').pop();

    console.log(nama_data_serve, ext_awal);

    if (ext_awal == "JPEG") {
      tipe_mime = "image/JPEG"
    } 
    
    if (ext_awal == "pdf") {
      tipe_mime = "application/pdf"
    }

    if (ext_awal == "docx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    if (ext_awal == "xlsx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }

    if (ext_awal == "pptx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    }

    if (ext_awal == "rar") {
      tipe_mime = "application/rar"
    }

    if (ext_awal == "zip") {
      tipe_mime = "application/zip"
    }

    console.log(tipe_mime);

    this.chooser.getFile().then((data:ChooserResult)=>{
      console.log(data);

      if (data == undefined) {
      this.loadingCtrl.tutup_loading();
      }

      let type_data = data.mediaType;
      let nama_data = data.name;
      let path_uri_data = data.dataURI;
      let size_data = data.data.byteLength;
      let int_size_data = +size_data;
      let nama_timestamp = path_data.substring(28);
      let get_ext = nama_timestamp.split('.').pop();

      console.log(type_data, get_ext);

      if (type_data == tipe_mime) {
        if (int_size_data >= 10485760) {
          this.loadingCtrl.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
          return;
        } else {
          this.loadingCtrl.tutup_loading();

          this.swal_data_file(path_uri_data, nama_data, id, ext_awal, id_pc_pd, pc_pd);
          
        }
    
      } else {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe "+ ext_awal.toUpperCase() +" !")
      }

    },(err)=>{
      this.loadingCtrl.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "Code error 84 !, kembali ke login !");
    })
  }

  //alert konfirmasi ganti gambar
  swal_gambar(path_uri, id, id_pc_pd, pc_pd){
    this.loadingCtrl.tampil_loading("");
    Swal.fire({
      title: 'Peringatan !!',
      text: 'Pastikan gambar sesuai dengan kegiatan pengerjaan !',
      imageUrl: '' + path_uri,
      imageWidth: 300,
      imageHeight: 200,
      imageAlt: 'Custom image',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Kirim !',
      showDenyButton: true,
      denyButtonText: `Batal `,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutup_loading();
        this.sedang_mengirim = true;
        this.data_progres_bar = 0.3;
        this.loadingCtrl.tampil_loading("Sedang mengirim . . .");
        this.update_cheklist_dokumen_detail(id, path_uri, "JPEG", null, id_pc_pd, pc_pd);

      }else{
        this.loadingCtrl.tutup_loading();
      }
    })
  }

  //alert konfirmasi swal data
  swal_data_file(uri_pdf, nama_dulu, id, ext, id_pc_pd, pc_pd){
    this.loadingCtrl.tampil_loading("");
      Swal.fire({
        icon: 'info',
        title: 'Perhatian !!',
        text: 'Mengirim file dengan nama : '+nama_dulu,
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'Iya !',
        showDenyButton: true,
        denyButtonText: `batal`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingCtrl.tutup_loading();
          this.sedang_mengirim = true;
          this.data_progres_bar = 0.3;
          this.loadingCtrl.tampil_loading("Sedang mengirim . . .");
          
          this.update_cheklist_dokumen_detail(id, uri_pdf, ext, null, id_pc_pd, pc_pd);

        }else {
          this.loadingCtrl.tutup_loading();
        }
      });
  }

  //update data progres harian
  async update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime ,id_pc_pd, pc_pd){
    this.data_progres_bar = 0.3;

    let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe;
    let name_ = nama_file.toString();

    if (pc_pd == "pc") {
      this.apiService.update_progress_harian_evidence(id_pc_pd, name_)
      .then(data => {

        const data_json = JSON.parse(data.data);
        const status_data = data_json.status;

        if (status_data == 0) {
          this.update_log_notifikasi(id, name_, uri, tipe, tipe_mime);
        }else{
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Code error 66 !");
          return;
        }

    
      })
      .catch(error => {
    
        console.log(error);
        this.loadingCtrl.tutup_loading();

        if (error.status == -4) {
          this.toast.Toast("Gagal mengirim, mencoba mengirim kembali !");
          this.update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime ,id_pc_pd, pc_pd)
        } 

        if (error.status == -3) {
          this.loadingCtrl.tampil_loading("");
          Swal.fire({
            title: 'Terjadi kesalahan !',
            text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
            icon: 'error',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim ulang !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingCtrl.tutup_loading();
              this.loadingCtrl.tampil_loading("Mengirim data . . .");
              this.delay(5000);
              this.update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime ,id_pc_pd, pc_pd);
            }
          })
        }
        
        if (error.status !=4 && error.status != 3) {
          this.swal.swal_code_error("Terjadi kesalahan", "Code error 60 !, kembali ke login !");
        }
    
      });
    } else {
      this.apiService.update_status_cheklist_dokumen(id_pc_pd, name_)
      .then(data => {

        const data_json = JSON.parse(data.data);
        console.log(data_json);
        const status_data = data_json.status;

        if (status_data == 0) {
          if (status_data == 0) {
            this.update_log_notifikasi(id, name_, uri, tipe, tipe_mime);
          }else{
            this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Code error 67 !");
            return;
          }
        }
    
      })
      .catch(error => {
    
        console.log(error);
        this.loadingCtrl.tutup_loading();

        if (error.status == -4) {
          this.toast.Toast("Gagal mengirim, mencoba mengirim kembali !");
          this.update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime ,id_pc_pd, pc_pd)
        }
        
        if (error.status == -3) {
          this.loadingCtrl.tampil_loading("");
          Swal.fire({
            title: 'Terjadi kesalahan !',
            text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
            icon: 'error',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim ulang !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingCtrl.tutup_loading();
              this.loadingCtrl.tampil_loading("Mengirim data . . .");
              this.delay(5000);
              this.update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime ,id_pc_pd, pc_pd);
            }
          })
        }

        if (error.status !=4 && error.status != 3) {
          this.swal.swal_code_error("Terjadi kesalahan", "Code error 61 !, kembali ke login !");
        }

      });
    }
  }

  //update data log notifikasi
  async update_log_notifikasi(id, name_, uri, tipe, tipe_mime){
    this.data_progres_bar = 0.6;

    this.apiService.update_notif(id)
    .then(data => {

      console.log(data);

        const data_json = JSON.parse(data.data);
        const status_data = data_json.status;

        if (status_data == 0) {
          if (tipe == "JPEG") {
            this.mengirim_gambar(name_, uri);
          }else{
            this.mengirim_data_file(name_, uri, tipe_mime)
          }
        }else{
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Code error 68 !");
          return;
        }
  
    })
    .catch(error => {
      
      console.log(error);
      this.loadingCtrl.tutup_loading();
      if (error.status == -4) {
        this.toast.Toast("Gagal mengirim, mencoba mengirim kembali !");
        this.update_log_notifikasi(id, name_, uri, tipe, tipe_mime);
      } 
      
      if (error.status == -3) {
        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          title: 'Terjadi kesalahan !',
          text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
          icon: 'error',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Kirim ulang !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
            this.loadingCtrl.tampil_loading("Mengirim data . . .");
            this.delay(5000);
            this.update_log_notifikasi(id, name_, uri, tipe, tipe_mime);
          }
        })
      }
      
      if (error.status !=4 && error.status != 3) {
        this.swal.swal_code_error("Terjadi kesalahan", "Code error 69 !, kembali ke login !");
      }

  
    });
  }

  //mengirim gambar ke server
  async mengirim_gambar(nama, path_uri){
    this.data_progres_bar = 0.8;

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    fileTransfer.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_download = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
    });

    fileTransfer.upload(path_uri, this.URL, options)
    .then(data => {
      
      console.log(data);

      this.sedang_download = false;
      const data_json = JSON.parse(data.response);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.sedang_mengirim = false;
        Swal.fire({
          icon: 'success',
          title: 'Sukses !' ,
          text: 'Berhasil menyimpan file '+ nama,
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.data_progres_bar = 0.9;
            this.sedang_mengirim = false;
            this.loadingCtrl.tutup_loading();
            this.relog();
          }
        });
      } else {
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Code error 46 !");
      }
    })
    .catch(error => {

      console.log(error)
    
      this.sedang_download = false;
      this.loadingCtrl.tutup_loading();

      this.timeout++;
      
      this.sedang_mengirim = false;

      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon("img", nama, path_uri, null);
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "Code error 85 !, kembali ke login !");
        }
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  //mengirim data ke server
  async mengirim_data_file(nama_baru, path_uri, tipe_mime){
    this.data_progres_bar = 0.6;
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama_baru,
      chunkedMode: false,
      mimeType: tipe_mime,
      headers: {}
    }

    fileTransfer.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_download = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
    });

    fileTransfer.upload(path_uri, this.URL, options)
    .then(data => {
      this.sedang_download = false;
      
      const data_json = JSON.parse(data.response);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.sedang_mengirim = false;
        Swal.fire({
          icon: 'success',
          title: 'Sukses !' ,
          text: 'Berhasil menyimpan file '+ nama_baru,
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.data_progres_bar = 0.9;
            this.sedang_mengirim = false;
            this.loadingCtrl.tutup_loading();
            this.relog();
          }
        });
      }else{
        this.sedang_mengirim = false;

        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Code error 40 !");
      }

    })
    .catch(error => {

      console.log(error);
      this.sedang_download = false;
    
      this.loadingCtrl.tutup_loading();

      this.timeout++;

      this.sedang_mengirim = false;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon("else", nama_baru, path_uri, tipe_mime);
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "Code error 86 !, kembali ke login !");
        }
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  //memuat ulang page
  async relog(){
    this.arr_id_rap = []
    this.arr_obj_data_notif_mentah =[];
    this.arr_obj_data_notif =[];
    this.tanggal_notif = {};
    this.file_path = {};
    this.file_nama = {};
  
    this.loading_skeleton = true;
    this.imgURI;
    this.sedang_mengirim = false;
    this.data_progres_bar = 0;
    this.timeout = 0; 
  
    this.data_pc_ada = 1;
    this.data_pd_ada = 1;
    this.data_tidak_ada = false;
    this.ionViewWillEnter();
  }

  //jika tidak ada respon mengirim data
  async tidak_ada_respon(tipe_data, nama, path_uri, tipe_mime){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }

    this.loadingCtrl.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Server tidak merespon, coba beberapa saat lagi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Iya !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCtrl.tutup_loading();
        this.setget.set_swal(0);
        // this.mengirim_gambar(nama, path_uri);
        if (tipe_data == "img") {
          this.mengirim_gambar(nama, path_uri);
        }else{
          this.mengirim_data_file(nama, path_uri, tipe_mime);
        }
      }
    });
  }

  //jika tidak ada respon memuat data
  async tidak_ada_respon2(){
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingCtrl.tutup_loading();
    }
    
    this.loadingCtrl.tampil_loading("");
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Tidak ada respon, coba lagi !',
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

  //keluar jika terjadi kesalahan atau error
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

}
