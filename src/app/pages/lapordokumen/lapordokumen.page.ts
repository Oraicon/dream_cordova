import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { DatePipe } from '@angular/common';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { Chooser, ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { SizecountServiceService } from 'src/app/services/sizecount-service.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import Swal from 'sweetalert2';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { ToastService } from 'src/app/services/toast.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { ModalHasilPage } from 'src/app/modal/modal-hasil/modal-hasil.page';


@Component({
  selector: 'app-lapordokumen',
  templateUrl: './lapordokumen.page.html',
  styleUrls: ['./lapordokumen.page.scss'],
})
export class LapordokumenPage implements OnInit {

  id_dokumen_detail;
  uraian_dokumen_detail;
  pic_dokumen_detail;
  keterangan;  
  lat;
  long;
  data_id_list

  penghitung_index = 0;
  button_pilih_gambar = true;
  isSubmitted = false;

  myGroup: FormGroup;

  arr_looping_mengirim_path = [];
  arr_looping_pengecekan = [];
  hasil_file_dikirim = [];
  arr_data_img_pdf = [];
  sedang_mengirim = false;
  data_progres_bar = 0;
  data_path_terkirim = [];

  URL="https://dream-beta.technosolusitama.in/api/uploadImage";
  cek_koneksi = true;
  imgURL:any = 'assets/ss_.png';
  format_img:string="JPEG";
  name_img:string="";


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
    private loadingService: LoadingServiceService,
    // private geolocation: Geolocation,
    private apiService: ApiServicesService,
    private formBuilder: FormBuilder,
    private storage:Storage, 
    private transfer: FileTransfer, 
    private toastService: ToastService,
    private swal: SwalServiceService,
    private actionSheetController: ActionSheetController, 
    private network: Network,
    private chooser: Chooser,
    private datepipe: DatePipe, 
    private camera: Camera, 
    private router:Router,
    private setget: SetGetServiceService,
    private sizeService: SizecountServiceService,
    private modalCtrl: ModalController
  ) { 
    this.myGroup = this.formBuilder.group({
      data_keterangan: ['', [Validators.required]]
    });

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

  ngOnInit() {
  }

  ionViewWillEnter(){
    let a = this.setget.getDokumen_detail();

    this.tampilkan_data(a);
  }

  async tampilkan_data(arr_data_mentah){

    this.id_dokumen_detail = arr_data_mentah[0];
    this.uraian_dokumen_detail = arr_data_mentah[1];
    this.pic_dokumen_detail = arr_data_mentah[2];
  }

  //delay filetranfer 30 detik
  delay() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 120000);});
  }

  async delayed(){
    await this.delay();
    return 1;
  }

  delay_pengecekan() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }

  delay_tunggu_internet() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 5000);});
  }

  //saat mengetik
  onKey(e){
    this.keterangan = this.myGroup.value.data_keterangan;

    if (this.keterangan != "") {
      // this.setget.set_lapor(this.item,this.volume,this.keterangan,this.imgURL);
    }

    if (this.keterangan == "") {
      this.keterangan = null
    }
  }

  kembali(){
    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);
      if (this.keterangan != null || this.arr_data_img_pdf.length != 0) {
        this.loadingService.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Peringatan !',
          text: 'Formulir dokumen anda yang sudah diisi akan hilan, anda yakin ?',
          backdrop: false,
          showDenyButton: true,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Ya',
          denyButtonText: `Tidak`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingService.tutup_loading();
            this.router.navigate(["/dokumen"], { replaceUrl: true });
          }else {
            this.loadingService.tutup_loading();
          }
        });
      } else {
        // this.navCtrl.back();
        this.router.navigate(["/dokumen"], { replaceUrl: true });
      }
    } else {
      this.toastService.Toast_tampil();
    }
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  //jika gambar rusak
  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  //modal mendapatkan gambar
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
      },{
        text: 'PDF/DOCX/XLSX/PPTX/RAR/ZIP',
        icon: 'document-outline',
        handler: () => {
          this.dapatkan_dokumen();
        }
      },{
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  //dapatkan gambar dari kamera
  kamera(){
    this.loadingService.tampil_loading("Memuat gambar . . .");
    this.camera.getPicture(this.cameraOptions).then(res=>{
      // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;
      if (int_size >= 10485760 ) {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
        return;
      } else {
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
        this.imgURL = 'data:image/jpeg;base64,' + res;
        let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + this.format_img;
        this.name_img = nama_file.toString();
        this.array_img();
      }
    }, (err) => {
      // Handle error
      this.loadingService.tutup_loading();
    });
  }

  //dapatkan gambar dari galeri
  galeri(){
    this.loadingService.tampil_loading("Memuat gambar . . .");
    this.camera.getPicture(this.galeriOptions).then(res=>{
      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;
      if (int_size >= 10485760 ) {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
        return;
      } else {
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
        this.imgURL = 'data:image/jpeg;base64,' + res;
        let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + this.format_img;
        this.name_img = nama_file.toString();
        this.array_img();
      }
    }, (err) => {
      // Handle error
      this.loadingService.tutup_loading();
    });
  }

  //array gambar supaya bisa lebih dari 1
  array_img(){

    this.button_pilih_gambar = false;

    let img = this.imgURL;
    let nama = this.name_img;

    let obj_image = {
      path : img,
      nama : nama,
      tipe : "JPEG"
    }

    this.arr_data_img_pdf.push(obj_image);

    if (this.arr_data_img_pdf.length >= 5) {
      this.button_pilih_gambar = false;
    } else {
      this.button_pilih_gambar = true;
    }

    this.loadingService.tutup_loading();
  }

  //logik menghapus array gammbar
  deleteImage(e){
    this.arr_data_img_pdf.splice(e, 1);


    if (this.arr_data_img_pdf.length == 0) {
      this.arr_data_img_pdf = [];
    }

    if (this.arr_data_img_pdf.length >= 5) {
      this.button_pilih_gambar = false;
    }else{
      this.button_pilih_gambar = true;
    }

  }

  async dapatkan_dokumen(){
    this.loadingService.tampil_loading("Sedang Memuat");
    await this.delay_pengecekan();

    let tipe_data;

    this.chooser.getFile().then((data:ChooserResult)=>{

      console.log(data);

      if (data == undefined) {
      this.loadingService.tutup_loading();
      }

      let type_data = data.mediaType;
      if (type_data == "application/pdf") {
        tipe_data = "pdf";
      }

      if(type_data == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        tipe_data = "docx";
      }
      
      if (type_data == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        tipe_data = "xlsx";
      }

      if (type_data == "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
        tipe_data = "pptx";
      }

      if (type_data == "application/rar") {
        tipe_data = "rar";
      }

      if (type_data == "application/zip") {
        tipe_data = "zip";
      }

      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe_data;
      let str_name_file = nama_file.toString(); 
      let path_uri_data = data.dataURI;
      let size_data = data.data.byteLength;
      let int_size_data = +size_data;

      if (type_data == "application/pdf" || type_data == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type_data == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type_data == "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      type_data == "application/rar" || type_data == "application/zip") 
      {
        if (int_size_data >= 10485760) {
          this.loadingService.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
          return;
        } else {
          let obj_dokumen = {
            path : path_uri_data,
            nama : str_name_file,
            tipe : tipe_data}
          this.arr_data_img_pdf.push(obj_dokumen);
          this.loadingService.tutup_loading();
          
          if (this.arr_data_img_pdf.length >= 5) {
            this.button_pilih_gambar = false;
          } else {
            this.button_pilih_gambar = true;
          }
          // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
        }
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
      } else {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Tipe file tidak sesuai !");
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "assets/ss_.png");
      }

    },(err)=>{
      this.loadingService.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "Code error 34 !");
    })
  }

  //validasi
  async onSubmit(){

    console.log(this.arr_data_img_pdf);

    this.isSubmitted = true;

    let data_button = this.setget.getButton();

    if (!this.myGroup.valid) {
      return false;
    } else {
      if (data_button == 0) {
        this.setget.setButton(1);
        this.data_progres_bar = 0;
        if(this.arr_data_img_pdf.length != 0){
          this.keterangan = this.myGroup.value.data_keterangan;
          
          this.loadingService.tampil_loading("");
          Swal.fire({
            title: 'Perhatian !',
            text: "Pastikan anda sudah mengisi data dengan benar !",
            icon: 'info',
            backdrop: false,
            showDenyButton: true,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim !',
            denyButtonText: `Batal`,
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutup_loading();
              if (this.cek_koneksi == true) {
                this.loadingService.tampil_loading("Mengirim data . . .");
                this.sedang_mengirim = true;
                this.data_progres_bar = 0.1;
                // this.get_geo();
                this.test_koneksi_api(this.keterangan);
              } else {
                this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
              }
            }else{
              this.loadingService.tutup_loading();
            }
          })

          }else{
            this.swal.swal_aksi_gagal("Terjadi kesalahan", "Lampiran file harus diisi !");
            this.setget.setButton(0);
          }
      } else {
        this.toastService.Toast_tampil();
      }

    }
  }

  //test koneksi
  test_koneksi_api(keterangan){
    this.apiService.cek_koneksi()
    .then(data => {

      // this.mengirim_data_api(keterangan);
      this.pengecekan_pd_master(keterangan);
      this.data_progres_bar = 0.3;

    })
    .catch(error => {
      console.log(error);

      this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
      this.data_progres_bar = 0.2;
    });
  }

  //pengecekan querry ada ?
  async pengecekan_pd_master(keterangan){
    this.apiService.pengecekan_data_cheklist_dokumen_master(keterangan)    
    .then(data => {
      console.log(data);
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.mengirim_data_api(keterangan);
      } else {
        this.loooping_mengirim_informasi_data(this.id_dokumen_detail);
      }
  
    })
    .catch(error => {
      if(error.status == -4){
        // return 4;
        this.toastService.Toast("Mengirim gagal, mencoba mengirim kembali . . . ");
        this.pengecekan_pd_master(keterangan);
      }
  
      if(error.status == -3){
        this.loadingService.tutup_loading();
        this.loadingService.tampil_loading("");
          Swal.fire({
            title: 'Terjadi kesalahan !',
            text: "Restart data seluler, lalu tekan 'kirim ulang' untuk mengirim kembali !",
            icon: 'error',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim ulang !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutup_loading();
              this.loadingService.tampil_loading("Mengirim data . . .");
              this.delay_tunggu_internet();
              this.pengecekan_pd_master(keterangan);
            }
          })
      }

      if (error.status != 4 && error.status != 3) {
        this.swal.swal_code_error("0", "0");
      }

    });
  }

  // mengirim data cheklist dokumen detail
  async mengirim_data_api(keterangan){

    const pengirim = await this.storage.get('nama');

    this.apiService.update_data_cheklist_dokumen_detail(this.id_dokumen_detail, pengirim, keterangan, 2)
    .then(data => {

      console.log(data);
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.data_progres_bar = 0.4;
        this.loooping_mengirim_informasi_data(this.id_dokumen_detail);
      } else {
        console.log(data);
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 35 !");
      }

    })
    .catch(error => {
      console.log(error);
      this.loadingService.tutup_loading();
      if (error.status == -4) {
        // this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
        // this.mengirim_data_api(keterangan);
        // this.data_progres_bar = 0.2;
        // this.sedang_mengirim = false;
        // this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Coba beberapa saat lagi !");
        this.toastService.Toast("Mengirim gagal, mencoba mengirim kembali . . .");
        this.pengecekan_pd_master(keterangan);
      } else if (error.status == -3) {
        this.loadingService.tutup_loading();
        this.loadingService.tampil_loading("");
          Swal.fire({
            title: 'Terjadi kesalahan !',
            text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
            icon: 'error',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim ulang !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutup_loading();
              this.loadingService.tampil_loading("Mengirim data . . .");
              this.delay_tunggu_internet();
              this.pengecekan_pd_master(keterangan);
            }
          })
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 36 !, kembali ke login !");
      }
    });
  }

  //looping 1.0
  async loooping_mengirim_informasi_data(id){
    this.data_progres_bar = 0.5;
    this.data_id_list = id;

    this.looping_do_while(id);

    // for (let index = 0; index < this.arr_data_img_pdf.length; index++) {
    //   let element = this.arr_data_img_pdf[index];
      
    //   this.mengirim_informasi_data(id, element.nama, index);
    // }
  }

  //mengirim data cheklist dokumen evidence pathnya
  async mengirim_informasi_data(id, nama, index){

    this.data_progres_bar = 0.5;

    this.apiService.menyimpan_path_file_cheklist_dokumen(id, nama)
    .then(data => {
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.penghitung_index++;
        this.data_path_terkirim.push(1);
        this.arr_looping_mengirim_path.push(1);

        // if (index == this.arr_data_img_pdf.length - 1 || this.arr_data_img_pdf.length == 1) {
        //   // this.looping_file();
        //   this.pengecekan_informasi_data(id);


        //   this.data_progres_bar = 0.6;
        // }
        this.data_looping_index_arr = 1;
        
      } else {
        // this.swal.swal_code_error("Terjadi kesalahan", "code error 31 !");
        // return;
        this.penghitung_index++;
        this.arr_looping_mengirim_path.push(2);

        this.data_looping_index_arr = 0;

        // if(index == this.arr_data_img_pdf.length - 1 || this.arr_data_img_pdf.length == 1){
        //   this.pengecekan_informasi_data(id);
        //   // this.looping_file();
        //   this.data_progres_bar = 0.6;
        // }
      }

    })
    .catch(error => {
      console.log(error);
      this.penghitung_index++;
      this.arr_looping_mengirim_path.push(2);

      if (error.status == -4) {
        this.data_looping_index_arr = 4;
      } else if (error.status == -3) {
        this.data_looping_index_arr = 3;
      } else {
        this.data_looping_index_arr = 123;
      }

      // if(index == this.arr_data_img_pdf.length - 1 || this.arr_data_img_pdf.length == 1){
      //   this.pengecekan_informasi_data(id);
      //   // this.looping_file();
      //   this.data_progres_bar = 0.6;
      // }
    // this.loadingService.tutup_loading();
    //   if (error.status == -4) {
    //     this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
    //     this.mengirim_informasi_data(id, nama, index);
    //     this.data_progres_bar = 0.5;
    //   } else {
    //   this.swal.swal_code_error("Terjadi kesalahan", "code error 29 !, kembali ke login !");
    //   return;
    //   }
    });
  }

  async pengecekan_informasi_data(id){
    console.log(this.penghitung_index);
    console.log(this.arr_data_img_pdf.length);

    if (this.penghitung_index == this.arr_data_img_pdf.length) {
      let pengecekan_arr_looping = this.arr_looping_mengirim_path;

      const isBelowThreshold = (currentValue) => currentValue == 1;

      const a = pengecekan_arr_looping.every(isBelowThreshold);

      if (this.data_path_terkirim.length == 0) {
        this.arr_looping_mengirim_path = [];
        this.data_path_terkirim = [];
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Ganguan Koneksi !", "Restart data seluler handphone !");
        this.loadingService.tampil_loading("Mengirim data . . .");
        await this.delay_tunggu_internet();
        this.loooping_mengirim_informasi_data(id);
      } else {
        if (a == true) {
          this.looping_file();
        } else {
          this.toastService.Toast("Gagal menyimpan salah satu data !");
          this.looping_file();
        }
      }
      // this.looping_file();
      // this.data_progres_bar = 0.6;
    } else {
      await this.delay_pengecekan();
      this.pengecekan_informasi_data(id);
    }
  }

  looping_file(){
    this.data_progres_bar = 0.7;
    this.toastService.Toast("Sedang mengirim file, tunggu sampai proses selesai !");

    this.looping_do_while_file_transfer(this.arr_data_img_pdf);
    // for (let index = 0; index < this.arr_data_img_pdf.length; index++) {
    //   let element = this.arr_data_img_pdf[index];
    //   let path_file = element.path;
    //   let nama_file = element.nama;
    //   let get_ext = element.tipe;

    //   this.mengirim_file(nama_file, path_file, index, get_ext)
    // }
  }

  async mengirim_file(nama_file, path_file, index, get_ext){
    // console.log(this.arr_data_img_pdf);
    // console.log(this.hasil_file_dikirim)

    this.data_progres_bar = 0.7;
    let tipe_mime;

    if (get_ext = "JPEG") {
      tipe_mime = "image/JPEG"
    } 
    
    if (get_ext = "pdf") {
      tipe_mime = "application/pdf"
    }

    if (get_ext = "docx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    if (get_ext = "xlsx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }

    if (get_ext = "pptx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    }

    if (get_ext = "rar") {
      tipe_mime = "application/rar"
    }

    if (get_ext = "zip") {
      tipe_mime = "application/zip"
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama_file,
      chunkedMode: false,
      mimeType: tipe_mime,
      headers: {}
    }

    fileTransfer.upload(path_file, this.URL, options)
    .then(data => {
      console.log(data);
      
      const data_json = JSON.parse(data.response);
      const data_status = data_json.status;

      if (data_status == 0) {

        // if(index == this.arr_data_img_pdf.length-1){
        //   this.data_progres_bar = 0.7;
        //   // this.loadingService.tutup_loading();
        //   this.toastService.Toast("Berhasil menyimpan "+nama_file);

          let obj_hasil_akhir = {
            namna_file: nama_file,
            hasil: "Berhasil !"
          }
          this.hasil_file_dikirim.push(obj_hasil_akhir);
        //   this.arr_looping_pengecekan.push(1);

        //   this.pengecekan();

        // }else{
        //   this.toastService.Toast("Berhasil menyimpan "+nama_file);

        //   let obj_hasil_akhir = {
        //     namna_file: nama_file,
        //     hasil: "Berhasil !"
        //   }
        //   this.hasil_file_dikirim.push(obj_hasil_akhir);

        //   if(index == this.arr_data_img_pdf.length-1){
        //     this.data_progres_bar = 0.7;
  
        //     let obj_hasil_akhir = {
        //       namna_file: nama_file,
        //       hasil: "Berhasil !"
        //     }
        //     this.hasil_file_dikirim.push(obj_hasil_akhir);

        //   }
        // }
        this.data_looping_index_filetransfer = 1;

      } else {    
        // this.toastService.Toast("Gagal menyimpan "+nama_file);
    
        let obj_hasil_akhir = {
          namna_file: nama_file,
          hasil: "Gagal !"
        }
        this.hasil_file_dikirim.push(obj_hasil_akhir);

        // if(index == this.arr_data_img_pdf.length-1){
        //   this.data_progres_bar = 0.7;
        //   this.arr_looping_pengecekan.push(2);
        //   this.pengecekan();

        // }
        this.data_looping_index_filetransfer = 0;
      }

    })
    .catch(error => {
      console.log(error)

      let obj_hasil_akhir = {
        namna_file: nama_file,
        hasil: "Gagal !"
      }
      this.hasil_file_dikirim.push(obj_hasil_akhir);

      if (error.status == 4) {
        this.data_looping_index_filetransfer = 4;
      } else if (error.status == 3) {
        this.data_looping_index_filetransfer = 3;
      } else {
        this.data_looping_index_filetransfer = 123;
      }

      // this.toastService.Toast("Gagal menyimpan "+nama_file);


      // if(index == this.arr_data_img_pdf.length-1){
      //   this.arr_looping_pengecekan.push(2);
      //   this.pengecekan();
      // }

      // let status = error.code;
      // this.loadingService.tutup_loading();
      
      // if (status == 4) {
      //   this.toastService.Toast("Tidak ada respon, menyimpan "+nama_file);
      //   let obj_hasil_akhir = {
      //     namna_file: nama_file,
      //     hasil: "Gagal !"
      //   }
      //   this.hasil_file_dikirim.push(obj_hasil_akhir);

      //   if(index == this.arr_data_img_pdf.length-1){
      //     this.loadingService.tutup_loading();
      //     this.toastService.Toast("Terjadi kesalahan !, menyimpan "+nama_file);
      //     let obj_hasil_akhir = {
      //       namna_file: nama_file,
      //       hasil: "Gagal !"
      //     }
      //     this.hasil_file_dikirim.push(obj_hasil_akhir);

      //     this.pengecekan(2);
      //   }
      // }
      
      // if(index == this.arr_data_img_pdf.length-1){
      //   this.loadingService.tutup_loading();
      //   // this.swal.swal_code_error();
      //   this.pengecekan(2);
      //   return;
      // }

      // if(status != 4 && index != this.arr_data_img_pdf.length-1){
      //   this.loadingService.tutup_loading();
      //   this.swal.swal_code_error("Terjadi kesalahan", "Code error 30 !");
      // }
      // this.sedang_mengirim = false;
      // this.loadingService.tutup_loading();
      // if (status == 4) {
      //   this.swal.swal_aksi_gagal("Terjadi kesalahan", "Cek file kembali di riwayat lampiran !");
      // }else{
      //   this.swal.swal_code_error("Terjadi kesalahan", "Code error 37 !");
      // }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

  async pengecekan(){

    // if (this.hasil_file_dikirim.length == this.arr_data_img_pdf.length || this.hasil_file_dikirim.length == 1 && this.arr_data_img_pdf.length == 1) {
      this.setget.set_hasil_akhir(this.hasil_file_dikirim);
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();

      let pengecekan_arr_looping = this.arr_looping_pengecekan;

      const isBelowThreshold = (currentValue) => currentValue == 1;

      const a = pengecekan_arr_looping.every(isBelowThreshold);
      
      if (a == true) {
        this.loadingService.tampil_loading(null);
        Swal.fire({
          icon: 'success',
          title: 'Sukses !' ,
          text: 'Berhasil menyimpan data !',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'OK !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingService.tutup_loading();
          }
        });
        this.hasil_kirim();
      } else {
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Kirim lampiran kembali di riwayat lampiran !");
        this.hasil_kirim();
        return;
      }
    // } else {
    //   await this.delay_pengecekan();
    //   this.pengecekan();
    //   console.log("di cek ulang");
    // }
  }

  async hasil_kirim(){
    this.myGroup.value.data_keterangan = null;
  
    this.hasil_file_dikirim = [];
  
    this.arr_data_img_pdf = [];
    this.sedang_mengirim = false;
    this.data_progres_bar = 0;
  
    this.name_img="";
    this.format_img="JPEG";

    const modal = await this.modalCtrl.create({
      component: ModalHasilPage,
      cssClass: 'konten-modal',
      backdropDismiss:false
    });
    modal.onDidDismiss().then(data => {
      // this.navCtrl.back();
      if (this.data_id_list != null) {
      this.setget.setDokumen_detail(this.data_id_list, null, null, null, null);
      this.router.navigate(["/listdokumen"], { replaceUrl: true });
      } else {
      this.router.navigate(["/dokumen"], { replaceUrl: true });
      }
      // this.router.navigate(["/dokumen"], { replaceUrl: true });
    }).catch(err => {
    });
    await modal.present().then(data => {
    }).catch(err => {
    });
  }

  data_looping_index_arr;
  data_index_arr_dilooping = 0;

  //looping 2.0
  async looping_do_while(id){
    let i = 0;
    let element = this.arr_data_img_pdf[this.data_index_arr_dilooping];
    this.mengirim_informasi_data(id, element.nama, null)
    do {
      console.log("sedang do while");
      await this.delay_pengecekan();
      if (this.data_looping_index_arr != null) {
        //mengolah data jika sukses
        if (this.data_looping_index_arr == 1) {
          console.log("sedang do while 1");
          console.log(this.hasil_file_dikirim);
          console.log(this.arr_data_img_pdf.length);

          if(this.data_index_arr_dilooping == this.arr_data_img_pdf.length-1){
            // this.pengecekan_informasi_data(id);
            // console.log("Logika Sukses !!!");
            this.data_looping_index_arr = 7;
            this.looping_file();
            return;
          }else{
            ++this.data_index_arr_dilooping;
            this.data_looping_index_arr = 7;
            this.looping_do_while(id);
            return;
          }
        }

        //mengolah data jika gagal
        if (this.data_looping_index_arr == 0) {
          console.log("sedang do while 0");
          this.data_looping_index_arr = 7;
          this.swal.swal_code_error("123","123");
          return;
        }

        //mengolah data jika code error status 4 RTO
        if (this.data_looping_index_arr == 4) {
          console.log("sedang do while 4");
          this.toastService.Toast("Mengirim gagal, mencoba mengirim kembali . . . ");
          this.data_looping_index_arr = 7;
          // this.looping_do_while(id);
          this.pengecekan_pd_evidence(id, element.nama);
          return;
        }

        //mengolah data jika code error status 3 unable to resolve url
        if (this.data_looping_index_arr == 3) {
          console.log("sedang do while 3");
          this.loadingService.tutup_loading();
          this.loadingService.tampil_loading("");
          Swal.fire({
            title: 'Terjadi kesalahan !',
            text: "Restart data seluler, lalu tekan 'kirim ulang' untuk mengirim kembali !",
            icon: 'error',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim ulang !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutup_loading();
              this.loadingService.tampil_loading("Mengirim data . . .");
              this.delay_tunggu_internet();
              this.data_looping_index_arr = 7;
              this.pengecekan_pd_evidence(id, element.nama);
              return;
            }
          })
        }

        if (this.data_looping_index_arr == 123) {
          console.log("sedang do while 123");
          this.data_looping_index_arr = 7;
          this.swal.swal_code_error("123","123");
          return;
        }
      }
      i++
    }
    while (i < 120);
  }

  //pengecekan path data evidence
  async pengecekan_pd_evidence(id, nama_file){
    this.apiService.pengecekan_data_cheklist_dokumen_evidence(nama_file)    
    .then(data => {
      console.log(data);
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        // mengirim ulang data jika tidak ada
        this.looping_do_while(id);
      } else {
        // jika ada maka langsung ke index berikutnya
        ++this.data_index_arr_dilooping;
        this.looping_do_while(id);
      }
  
    })
    .catch(error => {
      // jika error status 4 / RTO
      if(error.status == -4){
        // return 4;
        this.toastService.Toast("Mengirim gagal !, mencoba mengirim kembali . . . ");
        this.pengecekan_pd_evidence(id, nama_file)
      }
  
      //jika error status 3 / unable to resolve url
      if(error.status == -3){
        this.loadingService.tutup_loading();
        this.loadingService.tampil_loading("");
          Swal.fire({
            title: 'Terjadi kesalahan !',
            text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
            icon: 'error',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim ulang !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutup_loading();
              this.loadingService.tampil_loading("Mengirim data . . .");
              this.delay_tunggu_internet();
              this.pengecekan_pd_evidence(id, nama_file);
            }
          })
      }

      if (error.status != 4 && error.status != 3) {
        this.swal.swal_code_error("0", "0");
      }

    });
  }

  data_looping_index_filetransfer;
  data_index_filetransfer_dilooping = 0;

  //looping filetransfer 2.0
  async looping_do_while_file_transfer(arr){
    let i = 0;
    let element = arr[this.data_index_filetransfer_dilooping];
    this.mengirim_file(element.nama, element.path, null, element.tipe);
    do {
      console.log("sedang do while");
      await this.delay_pengecekan();
      if (this.data_looping_index_filetransfer != null) {
        //mengolah data jika sukses
        if (this.data_looping_index_filetransfer == 1) {
          console.log("sedang do while 1");
          console.log(this.data_index_arr_dilooping);
          console.log(this.arr_data_img_pdf.length);

          if(this.data_index_filetransfer_dilooping == this.arr_data_img_pdf.length-1){
            // this.pengecekan_informasi_data(id);
            // console.log("Logika Sukses !!!");
            // this.loadingService.tutup_loading();
            // this.setget.setDokumen_detail(this.data_id_list, null, null, null, null);
            // this.router.navigate(["/listdokumen"], { replaceUrl: true });
            this.data_looping_index_filetransfer = 7;
            this.pengecekan();
            return;
          }else{
            ++this.data_index_filetransfer_dilooping;
            this.data_looping_index_filetransfer = 7;
            this.looping_do_while_file_transfer(arr);
            return;
          }
        }

        //mengolah data jika gagal
        if (this.data_looping_index_filetransfer == 0) {
          console.log("sedang do while 0");
          this.data_looping_index_filetransfer = 7;

          this.swal.swal_code_error("123","123");
          return;
        }

        //mengolah data jika code error status 4 RTO
        if (this.data_looping_index_filetransfer == 4) {
          console.log("sedang do while 4");
          this.data_looping_index_filetransfer = 7;
          this.toastService.Toast("Mengirim gagal, mencoba mengirim kembali . . . ");
          this.looping_do_while_file_transfer(arr);
          return;
        }

        //mengolah data jika code error status 3 unable to resolve url
        if (this.data_looping_index_filetransfer == 3) {
          console.log("sedang do while 3");
          this.data_looping_index_filetransfer = 7;
          this.loadingService.tutup_loading();
          this.loadingService.tampil_loading("");
          Swal.fire({
            title: 'Terjadi kesalahan !',
            text: "Restart data seluler, lalu tekan 'kirim ulang' untuk mengirim kembali !",
            icon: 'error',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Kirim ulang !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutup_loading();
              this.loadingService.tampil_loading("Mengirim data . . .");
              this.delay_tunggu_internet();
              this.looping_do_while_file_transfer(arr);
              return;
            }
          })
        }

        if (this.data_looping_index_filetransfer == 123) {
          console.log("sedang do while 123");
          this.data_looping_index_filetransfer = 7;
          this.swal.swal_code_error("123","123");
          return;
        }
      }
      i++
    }
    while (i < 240);
  }


}
