import { Component, OnInit } from '@angular/core';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { DatePipe } from '@angular/common';
import { Chooser, ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { SizecountServiceService } from 'src/app/services/sizecount-service.service';
import { ModalIsikontenPage } from 'src/app/modal/modal-isikonten/modal-isikonten.page';
import { ToastService } from 'src/app/services/toast.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listdokumen',
  templateUrl: './listdokumen.page.html',
  styleUrls: ['./listdokumen.page.scss'],
})
export class ListdokumenPage implements OnInit {

  id;
  uraian;
  pic;
  keterangan;
  extention_file;

  data_arr_evidance = [];
  loading_skeleton = true;
  timeout = 0;
  data_gambar_rusak = {};
  sedang_mengirim = false;
  data_progres_bar = 0;
  imgURI;
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";

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

  constructor(
    private setget: SetGetServiceService,
    private chooser: Chooser,
    private camera: Camera,
    private file: File,
    private toast: ToastService,
    private fileOpener: FileOpener,
    private datepipe: DatePipe, 
    private actionSheetController: ActionSheetController,
    private transfer: FileTransfer,
    private router:Router,
    private loadingCtrl: LoadingServiceService,
    private sizeService: SizecountServiceService,
    private swal: SwalServiceService,
    private modalCtrl: ModalController,
    private apiService: ApiServicesService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    // this.setget.set_tab_page(3);
    this.tampilkan_data();
  }

  ionViewWillLeave(){
    // this.setget.set_tab_page(1);
  }

  //delay filetranfer 30 detik
  delay() {
    console.log("masuk dealy");
    return new Promise(resolve => { setTimeout(() => resolve(""), 40000);});
  }

  async delayed(){
    await this.delay();
    return 1;
  }

  //delay loading
  interval_counter_loading() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }  

  kembali(){
    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);

      this.router.navigate(["/dokumen"], { replaceUrl: true });

    } else {
      this.toast.Toast_tampil();
    }
  }

  relog(){
    this.id;
    this.uraian;
    this.pic;
    this.keterangan;
    this.extention_file;
  
    this.data_arr_evidance = [];
    this.loading_skeleton = true;
    this.timeout = 0;
    this.data_gambar_rusak = {};
    this.sedang_mengirim = false;
    this.data_progres_bar = 0;
    this.imgURI;
    this.URL="https://dream-beta.technosolusitama.in/api/uploadImage";

    this.ionViewWillEnter();
  }

  errorHandler(event, a) {
    event.target.src = "assets/bi.png";
    this.data_gambar_rusak[a] = "rusak";
  }

  async delay_dulu(){
    await this.interval_counter_loading();
    this.loadingCtrl.tutup_loading();
    return;
  }

  async tampilkan_data(){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");
    let a = this.setget.getDokumen_detail();
    
    console.log(a);

    this.id = a[0];
    this.uraian = a[1];
    this.pic = a[2];
    this.keterangan = a[3];

    this.apiService.menampilkan_path_file_cheklist_dokumen(this.id)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 0) {
        
        let arr_data_mentah = data_json.data;

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
          
          this.data_arr_evidance.push(obj_data_evidance);
        }

        if(this.data_arr_evidance.length == arr_data_mentah.length){
          this.loading_skeleton = false;
          this.delay_dulu();
        }

      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 64 !, kembali ke login !");
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
          this.data_arr_evidance = []
          this.tidak_ada_respon("td", null, null, null);
        } else {
          this.loadingCtrl.tutup_loading();

          this.swal.swal_code_error("Terjadi kesalahan !", "code error 65 !, kembali ke login !");
        }
      }
  
    });

  }

  buka_doc(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    let nama_pdf = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;
    let tipe_mime;

    if (this.extention_file = "doc") {
      tipe_mime = "application/msword"
    }

    if (this.extention_file = "docx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    const trans = this.transfer.create();
    
    trans.download(data_url, this.file.dataDirectory + nama_pdf).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      let hasil =  entry.toURL(); 
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, tipe_mime)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'Dokumen tidak ditemukan, kirim ulang!',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Iya !',
          showDenyButton: true,
          denyButtonText: `Tidak`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
            this.dapatkan_docx(nama_pdf, tipe_mime, null, null);
          }else {
            this.loadingCtrl.tutup_loading();
          }
        });
      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 38 !, kembali ke login !");
      }
    });
  }

  dapatkan_docx(nama, tipe_mime, id ,path){
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

      if (type_data == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type_data == "application/msword") {

        if (int_size_data >= 5242880) {
          this.loadingCtrl.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
          return;
        } else {
          this.loadingCtrl.tutup_loading();

          if (nama != null) {
            this.swal_docx(nama, path_uri_data, nama_data, null, null, null, null);
          } else {
            let nama_timestamp = path.substring(28);
            let get_ext = nama_timestamp.split('.').pop();
            if (get_ext = "doc") {
              tipe_mime = "application/msword"
            }
            if (get_ext = "docx") {
              tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
            this.swal_docx(nama_timestamp, path_uri_data, nama_data, id, tipe_mime, get_ext, null);
          }
          
        }
    
      } else {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe DOCX !")
      }

    },(err)=>{
      this.loadingCtrl.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "code error 39 !, kembali ke login !");
    })
  }

  //alert konfirmasi pdf
  swal_docx(nama_docx, uri_pdf, nama_dulu, id, tipe_mime, ext, evidence){
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
          if (id != null) {
            if (evidence == 1) {
              this.mengirim_informasi_data(uri_pdf, id, ext);
            } else {
              this.update_cheklist_dokumen_detail(id, uri_pdf, ext, tipe_mime);
            }
          } else {
            this.mengirim_docx(nama_docx, uri_pdf, tipe_mime);
          }
        }else {
          this.loadingCtrl.tutup_loading();
        }
      });
  }

  //mengirim pdf ke server
  async mengirim_docx(nama, path_uri, tipe_mime){

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama,
      chunkedMode: false,
      mimeType: tipe_mime,
      headers: {}
    }

    this.data_progres_bar = 0.6;

    fileTransfer.upload(path_uri, this.URL, options)
    .then(data => {
      
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
            // this.router.navigate(["/dokumen"], { replaceUrl: true });
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

      console.log(error)
    
      this.loadingCtrl.tutup_loading();

      this.timeout++;

      this.sedang_mengirim = false;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon("docx", nama, path_uri, tipe_mime);
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 41 !, kembali ke login !");
        }
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  buka_pdf(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");
    console.log(path_data);
    let nama_pdf = path_data.substring(28);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;

    const trans = this.transfer.create();
    
    trans.download(data_url, this.file.dataDirectory + nama_pdf).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      let hasil =  entry.toURL(); 
      this.loadingCtrl.tutup_loading();
      this.fileOpener.open(hasil, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));
    }, (error) => {
      // handle error
      const code_error = error.code;
      this.loadingCtrl.tutup_loading();

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'Dokumen tidak ditemukan, kirim ulang!',
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
      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 42 !, kembali ke login !");
      }
    });
  }

  dapatkan_pdf(nama, id, path){
    this.loadingCtrl.tampil_loading("Sedang Memuat . . .");

    console.log(nama, id, path);

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
        if (int_size_data >= 5242880) {
          this.loadingCtrl.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
          return;
        } else {
          this.loadingCtrl.tutup_loading();
          if (nama != null) {
            this.swal_pdf(nama, path_uri_data, nama_data, null, null, null);
          } else {
            let nama_timestamp = path.substring(28);
            let get_ext = nama_timestamp.split('.').pop();
            this.swal_pdf(nama_timestamp, path_uri_data, nama_data, id, get_ext, null);
          }
        }
    
      } else {
        console.log("ini bukan pdf");
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe PDF !")
      }

    },(err)=>{
      this.loadingCtrl.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "code error 43 !, kembali ke login !");
    })
  }

  //alert konfirmasi pdf
  swal_pdf(nama_pdf, uri_pdf, nama_dulu, id, tipe, evidence){
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
              this.mengirim_informasi_data(uri_pdf, id, tipe);
            } else {
              this.update_cheklist_dokumen_detail(id, uri_pdf, tipe, null);
            }
          } else {
            this.mengirim_pdf(nama_pdf, uri_pdf);
          }
        }else {
          this.loadingCtrl.tutup_loading();
        }
      });
  }

  //mengirim pdf ke server
  async mengirim_pdf(nama, path_uri){

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama,
      chunkedMode: false,
      mimeType: "application/pdf",
      headers: {}
    }

    this.data_progres_bar = 0.6;

    fileTransfer.upload(path_uri, this.URL, options)
    .then(data => {
      
      console.log(data);

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
            // this.router.navigate(["/dokumen"], { replaceUrl: true });
            this.relog();
          }
        });
      }else{
        this.sedang_mengirim = false;

        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Code error 44 !");
      }

    })
    .catch(error => {

      console.log(error)
    
      this.loadingCtrl.tutup_loading();

      this.timeout++;

      this.sedang_mengirim = false;
      
      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon("pdf", nama, path_uri, null);
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 45 !, kembali ke login !");
        }
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  async buka_img(data_gambar, data_nama){
    
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

  //modal ganti gambar
  async presentActionSheet(id, path_data) {

    console.log(id, path_data);

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

  //dapatkan data gambar dari galeri/kamera
  kamera(nama_img, id, evidence){
    this.loadingCtrl.tampil_loading("Memuat gambar . . .");
    this.camera.getPicture(this.cameraOptions).then(res=>{

      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;
      if (int_size >= 5242880 ) {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
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
      if (int_size >= 5242880 ) {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
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
            this.update_cheklist_dokumen_detail(id, path_uri, "JPEG", null);
          }
        } else {
          this.mengirim_gambar(nama, path_uri);
        }

      }else{
        this.loadingCtrl.tutup_loading();
      }
    })
  }

  //mengirim gambar ke server
  async mengirim_gambar(nama, path_uri){

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    this.data_progres_bar = 0.6;

    fileTransfer.upload(path_uri, this.URL, options)
    .then(data => {
      
      console.log(data);

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
            // this.router.navigate(["/dokumen"], { replaceUrl: true });
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
    
      this.loadingCtrl.tutup_loading();

      this.timeout++;
      
      this.sedang_mengirim = false;

      if (this.timeout >= 3) {
        this.keluar_aplikasi();
      } else {
        if (error.status == -4) {
          this.tidak_ada_respon("img", nama, path_uri, null);
        } else {
          this.swal.swal_code_error("Terjadi kesalahan !", "code error 47 !, kembali ke login !");
        }
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }
  
  async update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime){
    this.data_progres_bar = 0.5;

    let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe;
    let name_ = nama_file.toString();

    this.apiService.update_status_cheklist_dokumen(id, name_)
    .then(data => {

      const data_json = JSON.parse(data.data);
      console.log(data_json);
      const status_data = data_json.status;

      if (status_data == 0) {
        if (tipe == "JPEG") {
          this.mengirim_gambar(name_, uri);
        }

        if (tipe == "docx" || tipe == "doc") {
            this.mengirim_docx(name_, uri, tipe_mime);
        }

        if (tipe == "pdf") {
            this.mengirim_pdf(name_, uri);
        }
      }

  
    })
    .catch(error => {
  
      console.log(error);
      this.loadingCtrl.tutup_loading();
      if (error.status == -4) {
        this.toast.Toast("Gagal mengirim, mencoba mengirim kembali !");
        this.update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime);
        this.data_progres_bar = 0.2;
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 51 !, kembali ke login !");
      }

    });

  }

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
        } 
        if(tipe_data == "pdf") {
          this.mengirim_pdf(nama, path_uri);
        }
        if(tipe_data == "docx") {
          this.mengirim_docx(nama, path_uri, tipe_mime);
        }
        if(tipe_data == "td") {
          this.tampilkan_data();
        }
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

  //modal mendapatkan gambar
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
        text: 'PDF/DOCX',
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

  async dapatkan_dokumen(id){
    this.loadingCtrl.tampil_loading("Sedang Memuat");
    await this.interval_counter_loading();

    let tipe_data;

    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{

      if (data == undefined) {
      this.loadingCtrl.tutup_loading();
      }

      let type_data = data.mediaType;
      if (type_data == "application/pdf") {
        tipe_data = "pdf";
      }

      if(type_data == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        tipe_data = "docx";
      }

      if (type_data == "application/msword") {
        tipe_data = "doc";
      }
      
      let nama_dulu = data.name;
      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe_data;
      let str_name_file = nama_file.toString(); 
      let path_uri_data = data.dataURI;
      let size_data = data.data.byteLength;
      let int_size_data = +size_data;

      if (type_data == "application/pdf" || type_data == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type_data == "application/msword") {
          
        if (int_size_data >= 5242880) {
          this.loadingCtrl.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
          return;
        } else {
          // this.arr_data_img_pdf.push(obj_dokumen);
          if (tipe_data == "pdf") {
            this.swal_pdf(null, path_uri_data, nama_dulu, id, tipe_data, 1);
          } else {
            this.swal_docx(null, path_uri_data, nama_dulu, id, null, tipe_data, 1)
          }
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
      this.swal.swal_code_error("Terjadi kesalahan !", "Code error 75 !");
    })
  }

  async mengirim_informasi_data(path_uri, id, tipe_data){

    this.data_progres_bar = 0.5;

    
    let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe_data;
    let name_ = nama_file.toString();

    this.apiService.menyimpan_path_file_cheklist_dokumen(id, name_)
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
        if (tipe_data == "docx" || tipe_data == "doc") {
          let tipe_mime;
          if (tipe_data = "doc") {
            tipe_mime = "application/msword"
          }
          if (tipe_data = "docx") {
            tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          }

          this.mengirim_docx(name_, path_uri, tipe_mime);
        }
        
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 76 !");
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
      this.swal.swal_code_error("Terjadi kesalahan", "code error 77 !, kembali ke login !");
      return;
      }
    });
  }

}
