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

@Component({
  selector: 'app-notif',
  templateUrl: './notif.page.html',
  styleUrls: ['./notif.page.scss'],
})
export class NotifPage implements OnInit {

  arr_id_rap = []
  arr_obj_data_notif_mentah =[];
  arr_obj_data_notif =[];
  tanggal_notif = {};
  file_path = {};
  file_nama = {};

  loading_skeleton = true;
  imgURI;
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";
  sedang_mengirim = false;
  data_progres_bar = 0;
  timeout = 0; 

  data_pc_ada = 1;
  data_pd_ada = 1;
  data_tidak_ada = false;

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
  async interval_counter_loading() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }  

  async delay_dulu(){
    await this.interval_counter_loading();
    this.loadingCtrl.tutup_loading();
    return;
  }

  async looping_data_pc(arr){
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];

      this.notif_pc(element, index);
      
    }
  }

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
            kode_rap: element.kode_rap,
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
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 53 !, kembali ke login !");
        }
      }
  
    });
  }

  async looping_data_pd(arr){
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index];

      this.notif_pd(element, index);
      
    }
  }

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
            kode_rap: element.kode_rap,
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
          this.swalService.swal_code_error("Terjadi kesalahan !", "code error 54 !, kembali ke login !");
        }
      }
  
    });
  }

  //logika compare isi ada tanggal
  compare( a, b ) {
    return a.create_date - b.create_date;
  }

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
      let nama_file = evidance_path.substring(14);
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
      if (int_size >= 5242880 ) {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
        return;
      } else {
        this.loadingCtrl.tutup_loading();
        this.imgURI = 'data:image/jpeg;base64,' + res;
        this.swal_gambar(nama_img, this.imgURI, id, id_pc_pd, pc_pd);
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
      if (int_size >= 5242880 ) {
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
        return;
      } else {
        this.loadingCtrl.tutup_loading();
        this.imgURI = 'data:image/jpeg;base64,' + res;
        this.swal_gambar(nama_img, this.imgURI, id, id_pc_pd, pc_pd);
      }
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingCtrl.tutup_loading();
    });
  }
  
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

  //alert konfirmasi ganti gambar
  swal_gambar(nama, path_uri, id, id_pc_pd, pc_pd){
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

        this.update_cheklist_dokumen_detail(id, path_uri, "JPEG", null, id_pc_pd, pc_pd);

      }else{
        this.loadingCtrl.tutup_loading();
      }
    })
  }

  //mengirim gambar ke server
  async mengirim_gambar(nama, path_uri){
    this.loadingCtrl.tampil_loading("Sedang mengirim . . .");

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    this.data_progres_bar = 0.8;

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
            // this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
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

      // console.log(error)
    
      // this.loadingCtrl.tutup_loading();

      // this.timeout++;
      
      // this.sedang_mengirim = false;

      // if (this.timeout >= 3) {
      //   this.keluar_aplikasi();
      // } else {
      //   if (error.status == -4) {
      //     this.tidak_ada_respon("img", nama, path_uri, null);
      //   } else {
      //     this.swal.swal_code_error("Terjadi kesalahan !", "code error 47 !, kembali ke login !");
      //   }
      // }
      this.toast.Toast("Mencoba kembali mengirim file !");
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  buka_doc(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    let nama_ = path_data.substring(14);
    let data_url = "https://dream-beta.technosolusitama.in/"+path_data;
    let ext = nama_.split('.').pop();
    let tipe_mime;

    if (ext = "doc") {
      tipe_mime = "application/msword"
    }

    if (ext = "docx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    const trans = this.transfer.create();
    
    trans.download(data_url, this.file.dataDirectory + nama_).then((entry) => {
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

        this.swalService.swal_aksi_gagal("TErjadi kesalahan", "File tidak ada !");
        // this.loadingCtrl.tampil_loading("");
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Terjadi kesalahan !',
        //   text: 'Dokumen tidak ditemukan, kirim ulang!',
        //   backdrop: false,
        //   confirmButtonColor: '#3880ff',
        //   confirmButtonText: 'Iya !',
        //   showDenyButton: true,
        //   denyButtonText: `Tidak`,
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     this.loadingCtrl.tutup_loading();
        //     // this.dapatkan_docx(nama_pdf, tipe_mime, null, null);
        //   }else {
        //     this.loadingCtrl.tutup_loading();
        //   }
        // });
      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 38 !, kembali ke login !");
      }
    });
  }

  dapatkan_docx(nama, tipe_mime, id, id_pc_pd, path_data, pc_pd){
    this.loadingCtrl.tampil_loading("Sedang Memuat . . .");
    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{

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

          // if (nama != null) {
          //   this.swal_docx(nama, path_uri_data, nama_data, null, null, null);
          // } else {
            let nama_timestamp = path_data.substring(14);
            let get_ext = nama_timestamp.split('.').pop();
            if (get_ext = "doc") {
              tipe_mime = "application/msword"
            }
            if (get_ext = "docx") {
              tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            }
            this.swal_docx(nama_timestamp, path_uri_data, nama_data, id, tipe_mime, get_ext, id_pc_pd, pc_pd);
          // }
          
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
  swal_docx(nama_pdf, uri_pdf, nama_dulu, id, tipe_mime, ext, id_pc_pd, pc_pd){
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

          this.update_cheklist_dokumen_detail(id, uri_pdf, ext, tipe_mime, id_pc_pd, pc_pd);
          
        }else {
          this.loadingCtrl.tutup_loading();
        }
      });
  }

  //mengirim pdf ke server
  async mengirim_docx(nama, path_uri, tipe_mime){

    this.loadingCtrl.tampil_loading("Sedang mengirim . . .");

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
            this.relog();
            // this.router.navigate(["/dokumen"], { replaceUrl: true });
          }
        });
      }else{
        this.sedang_mengirim = false;

        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Code error 40 !");
      }

    })
    .catch(error => {

    //   console.log(error)
    
    //   this.loadingCtrl.tutup_loading();

    //   this.timeout++;

    //   this.sedang_mengirim = false;
      
    //   if (this.timeout >= 3) {
    //     this.keluar_aplikasi();
    //   } else {
    //     if (error.status == -4) {
    //       this.tidak_ada_respon("docx", nama, path_uri, tipe_mime);
    //     } else {
    //       this.swal.swal_code_error("Terjadi kesalahan !", "code error 57 !, kembali ke login !");
    //     }
    //   }
      this.toast.Toast("Mencoba kembali mengirim file !");
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  buka_pdf(path_data){
    this.loadingCtrl.tampil_loading("Sedang memuat . . .");

    let nama_pdf = path_data.substring(14);
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

        this.swalService.swal_aksi_gagal("Terjadi kesalahan !", "File tidak ada !");
        // this.loadingCtrl.tampil_loading("");
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Terjadi kesalahan !',
        //   text: 'Dokumen tidak ditemukan, kirim ulang!',
        //   backdrop: false,
        //   confirmButtonColor: '#3880ff',
        //   confirmButtonText: 'Iya !',
        //   showDenyButton: true,
        //   denyButtonText: `Tidak`,
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     this.loadingCtrl.tutup_loading();
        //     // this.dapatkan_pdf(nama_pdf, null, null);
        //   }else {
        //     this.loadingCtrl.tutup_loading();
        //   }
        // });
      } else {
        this.swal.swal_code_error("Terjadi kesalahan !", "code error 42 !, kembali ke login !");
      }
    });
  }

  dapatkan_pdf(nama, tipe_mime, id, id_pc_pd, path_data, pc_pd){
    this.loadingCtrl.tampil_loading("Sedang Memuat . . .");

    console.log(nama, tipe_mime, id , id_pc_pd, path_data, pc_pd);

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
          } else {
            let nama_timestamp = path_data.substring(14);
            let get_ext = nama_timestamp.split('.').pop();
            this.swal_pdf(nama_timestamp, path_uri_data, nama_data, id, get_ext, id_pc_pd, pc_pd);
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
  swal_pdf(nama_pdf, uri_pdf, nama_dulu, id, ext, id_pc_pd, pc_pd){
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

          this.update_cheklist_dokumen_detail(id, uri_pdf, ext, null, id_pc_pd, pc_pd);

        }else {
          this.loadingCtrl.tutup_loading();
        }
      });
  }

  //mengirim pdf ke server
  async mengirim_pdf(nama, path_uri){

    this.loadingCtrl.tampil_loading("Sedang mengirim . . .");

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

      // console.log(error)
    
      // this.loadingCtrl.tutup_loading();

      // this.timeout++;

      // this.sedang_mengirim = false;
      
      // if (this.timeout >= 3) {
      //   this.keluar_aplikasi();
      // } else {
      //   if (error.status == -4) {
      //     this.tidak_ada_respon("pdf", nama, path_uri, null);
      //   } else {
      //     this.swal.swal_code_error("Terjadi kesalahan !", "code error 45 !, kembali ke login !");
      //   }
      // }
      this.toast.Toast("Mencoba kembali mengirim file !");
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  async update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime ,id_pc_pd, pc_pd){
    this.data_progres_bar = 0.5;

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
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 66 !");
          return;
        }

    
      })
      .catch(error => {
    
        console.log(error);
        this.loadingCtrl.tutup_loading();
        if (error.status == -4) {
          this.toast.Toast("Gagal mengirim, mencoba mengirim kembali !");
          this.update_cheklist_dokumen_detail(id, uri, tipe, tipe_mime ,id_pc_pd, pc_pd)
          this.data_progres_bar = 0.2;
        } else {
          this.swal.swal_code_error("Terjadi kesalahan", "code error 60 !, kembali ke login !");
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
            this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 67 !");
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
          this.data_progres_bar = 0.2;
        } else {
          this.swal.swal_code_error("Terjadi kesalahan", "code error 61 !, kembali ke login !");
        }

      });
    }
  }

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
          }
  
          if (tipe == "docx" || tipe == "doc") {
              this.mengirim_docx(name_, uri, tipe_mime);
          }
  
          if (tipe == "pdf") {
              this.mengirim_pdf(name_, uri);
          }
        }else{
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error asdasdsad !");
          return;
        }
  
    })
    .catch(error => {
      

      console.log(error);

  
    });
  }

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
      }
    });
  }

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
        // this.menampilkan_data_rap();
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

}
