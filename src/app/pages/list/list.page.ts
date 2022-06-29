import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalIsikontenPage } from 'src/app/modal/modal-isikonten/modal-isikonten.page';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@awesome-cordova-plugins/file-transfer/ngx';
import { ActionSheetController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { DatePipe } from '@angular/common';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import Swal from 'sweetalert2';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { Chooser, ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { SizecountServiceService } from 'src/app/services/sizecount-service.service';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { ApiServicesService } from 'src/app/services/api-services.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  // variable
  id;
  kode_barang;
  alamat;
  arr_data = [];
  data_progres_bar = 0;
  imgURI;
  name_img:string="";
  format_img:string="JPEG";
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";
  
  // variable tricky
  timeout = 0;
  sedang_mengirim = false;
  data_gambar_rusak = {};
  get_ext;
  loading_skeleton = true;

  //persiapan kamera
  cameraOptions: CameraOptions = {
    quality: 80,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  galeriOptions: CameraOptions = {
    quality: 80,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }


  constructor(
    private chooser: Chooser,
    private sizeService: SizecountServiceService,
    private datepipe: DatePipe, 
    private toast: ToastService,
    private apiService: ApiServicesService,
    private loadingCtrl: LoadingServiceService,
    private router:Router,
    private actionSheetController: ActionSheetController,
    private setget: SetGetServiceService,
    private modalCtrl: ModalController,
    private camera: Camera,
    private toastService: ToastService,
    private swal: SwalServiceService, 
    private file: File,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private ngzone: NgZone
  ) { }

  // ionic lifecycle
  ngOnInit() {
  }

  async ionViewWillEnter(){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");
    this.data_progres_bar = 0;
    const data_mentah = this.setget.get_list_path();
    this.id =  data_mentah[0];
    if (data_mentah[1] != null) {
      this.alamat = data_mentah[1];
    } else {
      this.alamat = null;
    }
    console.log(this.id);
    await this.tampilkan_data(this.id);
  }

  //delay filetranfer 30 detik
  delay() {
    console.log("masuk dealy");
    return new Promise(resolve => { setTimeout(() => resolve(""), 120000);});
  }

  async delayed(){
    await this.delay();
    return 1;
  }

  //delay loading
  interval_counter_loading() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }  

  async delay_dulu(){
    await this.interval_counter_loading();
    this.loadingCtrl.tutup_loading();
    return;
  }

  //menampilkan data
  async tampilkan_data(id){

    this.apiService.menampilkan_data_file_sesuai_id(id)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        
        let arr_data_mentah = data_json.data;
        console.log(arr_data_mentah);

        for (let index = 0; index < arr_data_mentah.length; index++) {
          const element = arr_data_mentah[index];
          let nama = element.evidence_file.substring(28);
          let get_ext = nama.split('.').pop();

          let obj_data_evidance = {
            "id": element.id,
            "nama": nama,
            "tipe": get_ext,
            "path": element.evidence_file,
            "status": element.status
          }
          
          this.arr_data.push(obj_data_evidance);
        }

        if(this.arr_data.length == arr_data_mentah.length){
          this.loading_skeleton = false;
          this.delay_dulu();
        }

      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 62 !, kembali ke login !");
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
          this.loadingCtrl.tutup_loading();
          this.arr_data = [];
          this.tidak_ada_respon("td", id, null)
        } else {
          this.loadingCtrl.tutup_loading();

          this.swal.swal_code_error("Terjadi kesalahan !", "code error 63 !, kembali ke login !");
        }
      }
  
    });

  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.router.navigate(["/proses"], { replaceUrl: true });

    } else {
      this.toast.Toast_tampil();
    }
  }

  // memuat seluruh data
  relog(){
    this.kode_barang;
    this.timeout
    this.arr_data = [];
    this.sedang_mengirim = false;
    this.data_progres_bar = 0;
  
    this.imgURI;
    this.name_img="";
    this.format_img="JPEG";
  
    this.id;
    this.data_gambar_rusak = {};
    this.get_ext;
    this.loading_skeleton = true;
    this.URL="https://dream-beta.technosolusitama.in/api/uploadImage";

    this.ionViewWillEnter();
  }

  //tampilkan modal untuk menampilkan gambar
  async tampilkan_konten(data_gambar, data_nama){
    
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
  //menampilkan pdf
  async tampilakn_pdf(path_pdf, id){

    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    let nama_pdf = path_pdf.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/" + path_pdf;

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
      this.sedang_download = false
      let hasil =  entry.toURL(); 
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      this.sedang_download = false;
      // handle error
      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'File tidak ditemukan, kirim ulang!',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Iya !',
          showDenyButton: true,
          denyButtonText: `Tidak`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
            this.dapatkan_pdf(nama_pdf, null, null);
          }else {
            this.loadingCtrl.tutup_loading();
          }
        });
      } 
      
      if (code_error == 4) {
        this.swal.swal_aksi_gagal("Mendownload gagal !", "Waktu terlalu lama, coba beberapa saat lagi !")
      }
      
      if( code_error != 1 && code_error != 4){
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 95 !, kembali ke login !");
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      trans.abort();
    }
  }

  // dapatkan pdf dai lokal
  dapatkan_pdf(nama, id, path){
    this.loadingCtrl.tampil_loading("Sedang Memuat . . .");
    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{
      console.log(data);

      if (data == undefined) {
      this.loadingCtrl.tutup_loading();
      }

      let type_data = data.mediaType;
      let nama_data = data.name;
      let path_uri_data = data.dataURI;
      let size_data = data.data.byteLength;
      let int_size_data = +size_data;

      if (type_data == "application/pdf") {

        if (int_size_data >= 10485760) {
          this.loadingCtrl.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
          return;
        } else {    
          this.loadingCtrl.tutup_loading();
          if (nama != null) {
            this.swal_pdf(nama, path_uri_data, nama_data, null, null);
          } else {
            let nama_timestamp = path.substring(28);
            this.swal_pdf(nama_timestamp, path_uri_data, nama_data, id, null);
          }
        }
    
      } else {
        console.log("ini bukan pdf");
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe PDF !")
      }

    },(err)=>{
      this.loadingCtrl.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "code error 24 !, kembali ke login !");
    })
  }

  //dapatkan data gambar dari galeri/kamera
  kamera(nama_img, id, evidence){
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
        this.swal_gambar(nama_img, this.imgURI, id, evidence);
      }
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }

  galeri(nama_img, id, evidence){
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
        this.swal_gambar(nama_img, this.imgURI, id, evidence);
      }
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }

  //modal ganti gambar
  async presentActionSheet(path_data, id) {

    let nama_img = path_data.substring(28);

    const actionSheet = await this.actionSheetController.create({
      header: 'Kirim ulang gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Kamera',
        icon: 'camera-outline',
        handler: () => {
          this.kamera(nama_img, id, null);
        }
      }, {
        text: 'Galeri',
        icon: 'image-outline',
        handler: () => {
          this.galeri(nama_img, id, null);
        }
      }, {
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }
  
  //gambar rusak
  errorHandler(event, a) {
    event.target.src = "assets/bi.png";
    this.data_gambar_rusak[a] = "rusak";
  }

  //alert konfirmasi ganti gambar
  swal_gambar(nama, path_uri, id, evidence){
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

        if (id != null) {
          if (evidence == 1) {
            this.mengirim_informasi_data(path_uri, id, "JPEG");
          } else {
            this.update_progress_harian_evidance(id, nama, path_uri, "JPEG");
          }
        } else {
          this.mengirim_gambar(nama, path_uri);
        }
      }else{
        this.loadingCtrl.tutup_loading();
      }
    })
  }

  //alert konfirmasi pdf
  swal_pdf(nama_pdf, uri_pdf, nama_dulu, id, evidence){
  this.loadingCtrl.tampil_loading("");
    Swal.fire({
      icon: 'info',
      title: 'Perhatian !!',
      text: 'Mengirim PDF dengan nama : '+nama_dulu,
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

        if (id != null) {
          if (evidence == 1) {
            this.mengirim_informasi_data(uri_pdf, id, "pdf");
          } else {
            this.update_progress_harian_evidance(id, nama_pdf, uri_pdf, "pdf");
          }
        } else {
          this.mengirim_pdf(nama_pdf, uri_pdf);
        }
      }else {
        this.loadingCtrl.tutup_loading();
      }
    });
  }

  //mengirim gambar ke server
  async mengirim_gambar(nama, path_uri){
    this.data_progres_bar = 0.6;
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
            this.loadingCtrl.tutup_loading();
            // this.loading_skeleton = true;
            // this.arr_data = [];
            // this.ionViewWillEnter();
            this.relog();
          }
        });
      } else {
        this.sedang_mengirim = false;
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Code error 25 !");
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
        if (error.status == 4) {
          this.tidak_ada_respon("img", nama, path_uri);
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 26 !, kembali ke login !");
        }
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  //mengirim pdf ke server
  async mengirim_pdf(nama, path_uri){
    this.data_progres_bar = 0.6;

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama,
      chunkedMode: false,
      mimeType: "application/pdf",
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
            this.loadingCtrl.tutup_loading();
            // this.loading_skeleton = true;
            // this.arr_data = [];
            // this.ionViewWillEnter();
            this.relog();
          }
        });
      }else{
        this.sedang_mengirim = false;

        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Code error 27 !");
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
        if (error.status == 4) {
          this.tidak_ada_respon("pdf", nama, path_uri);
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 28 !, kembali ke login !");
        }
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  // update data evidence harian
  async update_progress_harian_evidance(id, nama, uri, tipe){
    this.data_progres_bar = 0.5;

    let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe;
    let name_ = nama_file.toString();

    this.apiService.update_progress_harian_evidence(id, name_)
    .then(data => {

      const data_json = JSON.parse(data.data);
      console.log(data_json);
      const status_data = data_json.status;

      if (status_data == 0) {
        if (tipe == "JPEG") {
          this.mengirim_gambar(name_, uri);
        }

        if (tipe == "pdf") {
            this.mengirim_pdf(name_, uri);
        }
      }else{
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 48 !");
        return;
      }

  
    })
    .catch(error => {
  
      console.log(error);
      this.loadingCtrl.tutup_loading();
      if (error.status == -4) {
        this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
        this.update_progress_harian_evidance(id, nama, uri, tipe);
        this.data_progres_bar = 0.2;
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 49 !, kembali ke login !");
      }
  
    });
  }

  // jika fungsi api tidak ada respon
  async tidak_ada_respon(tipe_data, nama, path_uri){
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
        if (tipe_data == "img") {
          this.mengirim_gambar(nama, path_uri);
        } 
        if(tipe_data == "pdf") {
          this.mengirim_pdf(nama, path_uri);
        }
        if(tipe_data == "td") {
          this.tampilkan_data(nama);
        }
      }
    });
  }

  // keluar aplikasi jika terjadi kesalahan/error
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

  //modal mendapatkan evidence
  async modal_evidence(id) {
    console.log(id)
    const actionSheet = await this.actionSheetController.create({
      header: 'Pilih Gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Kamera',
        icon: 'camera-outline',
        handler: () => {
          this.kamera(null, id, 1);
        }
      }, {
        text: 'Galeri',
        icon: 'image-outline',
        handler: () => {
          this.galeri(null, id, 1);
        }
      },{
        text: 'PDF',
        icon: 'document-outline',
        handler: () => {
          this.dapatkan_dokumen(id);
        }
      }, {
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  //dapatkan data dokumen pdf dari lokal untuk fungsi menambah evidence 
  async dapatkan_dokumen(id){
    this.loadingCtrl.tampil_loading("Sedang Memuat");
    await this.interval_counter_loading();

    let tipe_data;

    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{

      if (data == undefined) {
      this.loadingCtrl.tutup_loading();
      }

      let type_data = data.mediaType;
      let nama_dulu = data.name;
      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe_data;
      let path_uri_data = data.dataURI;
      let size_data = data.data.byteLength;
      let int_size_data = +size_data;

      if (type_data == "application/pdf") {
          
        if (int_size_data >= 10485760) {
          this.loadingCtrl.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
          return;
        } else {
          // this.arr_data_img_pdf.push(obj_dokumen);
          this.swal_pdf(null, path_uri_data, nama_dulu, id, 1);
          this.loadingCtrl.tutup_loading();
          
          // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
        }
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
      } else {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe PDF/WORD !");
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "assets/ss_.png");
      }

    },(err)=>{
      this.loadingCtrl.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "Code error 72 !");
    })
  }

  // mengirim data menambah evidence
  async mengirim_informasi_data(path_uri, id, tipe_data){

    this.data_progres_bar = 0.5;
    
    let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe_data;
    let name_ = nama_file.toString();

    this.apiService.menyimpan_path_file(id, name_)
    .then(data => {
      console.log(data);
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        if (tipe_data == "JPEG") {
          this.mengirim_gambar(name_, path_uri);
        }
        if (tipe_data == "pdf") {
          this.mengirim_pdf(name_, path_uri);
        }
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 73 !");
        return;
      }

    })
    .catch(error => {
    console.log(error);
  
    this.loadingCtrl.tutup_loading();
      if (error.status == -4) {
        this.toast.Toast("Gagal mengirim, mencoba mengirim kembali !");
        this.mengirim_informasi_data(path_uri, id, tipe_data);
        this.data_progres_bar = 0.4;
      } else {
      this.swal.swal_code_error("Terjadi kesalahan", "code error 74 !, kembali ke login !");
      return;
      }
    });
  }

}
