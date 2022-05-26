import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
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
  
  button_pilih_gambar = true;
  isSubmitted = false;

  myGroup: FormGroup;

  arr_data_img_pdf = [];
  sedang_mengirim = false;
  data_progres_bar = 0;

  URL="https://dream-beta.technosolusitama.in/api/uploadImage";
  cek_koneksi = true;
  imgURL:any = 'assets/ss_.png';
  format_img:string="JPEG";
  name_img:string="";


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
    private loadingService: LoadingServiceService,
    // private geolocation: Geolocation,
    private apiService: ApiServicesService,
    private formBuilder: FormBuilder,
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
    private sizeService: SizecountServiceService
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
    return new Promise(resolve => { setTimeout(() => resolve(""), 40000);});
  }

  async delayed(){
    await this.delay();
    return 1;
  }

  delay_pengecekan() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }

  //saat mengetik
  onKey(e){
    this.keterangan = this.myGroup.value.data_keterangan;

    if (this.keterangan != "") {
      // this.setget.set_lapor(this.item,this.volume,this.keterangan,this.imgURL);
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
          text: 'Formulir dokumen anda yang sudah diisi akan terhapus, anda yakin ?',
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
        text: 'PDF/DOCX',
        icon: 'document-outline',
        handler: () => {
          this.dapatkan_dokumen();
        }
      }, {
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
      if (int_size >= 5242880 ) {
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
      if (int_size >= 5242880 ) {
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
    this.loadingService.tutup_loading();
  }

  //logik menghapus array gammbar
  deleteImage(e){
    this.arr_data_img_pdf.splice(e, 1);

    this.button_pilih_gambar = true;

    this.arr_data_img_pdf = [];
  }

  async dapatkan_dokumen(){
    this.loadingService.tampil_loading("Sedang Memuat");
    await this.delay_pengecekan();

    let tipe_data;

    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{

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

      if (type_data == "application/msword") {
        tipe_data = "doc";
      }
      
      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + tipe_data;
      let str_name_file = nama_file.toString(); 
      let path_uri_data = data.dataURI;
      let size_data = data.data.byteLength;
      let int_size_data = +size_data;

      console.log(data.data.byteLength);

      if (type_data == "application/pdf" || type_data == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type_data == "application/msword") {
          
        if (int_size_data >= 5242880) {
          this.loadingService.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 5MB atau lebih !");
          return;
        } else {
          let obj_dokumen = {
            path : path_uri_data,
            nama : str_name_file,
            tipe : tipe_data}
          this.arr_data_img_pdf.push(obj_dokumen);
          this.loadingService.tutup_loading();
          this.button_pilih_gambar = false;
          // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
        }
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
      } else {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe PDF/WORD !");
        // this.setget.set_lapor(this.item, this.volume, this.keterangan, "assets/ss_.png");
      }

    },(err)=>{
      this.loadingService.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "Code error 34 !");
    })
  }

  //validasi
  async onSubmit(){
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
          
          let nama_file = this.arr_data_img_pdf[0].nama;

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
                this.test_koneksi_api(this.keterangan, nama_file);
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

  // get_geo(){
  //   this.geolocation.getCurrentPosition({
  //     timeout: 10000,
  //     enableHighAccuracy: true })
  //     .then((res) => {
  //       this.lat = res.coords.latitude;
  //       this.long = res.coords.longitude;
  //       this.data_progres_bar = 0.2;
  //       this.test_koneksi_api(this.item, this.volume, this.keterangan, this.lat, this.long);
  //     }).catch((e) =>{
  //       let error_code = e.code
  //       this.sedang_mengirim = false;
  //       this.loadingService.tutup_loading();
  
  //       if (error_code == 3) {
  //         this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Aktifkan GPS !");
  //         return;
  //       }
  //   })
  // }

  test_koneksi_api(keterangan, nama_file){
    this.apiService.cek_koneksi()
    .then(data => {

      this.mengirim_data_api(keterangan, nama_file);
      this.data_progres_bar = 0.3;

    })
    .catch(error => {
      this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
      this.data_progres_bar = 0.2;
    });
  }

  async mengirim_data_api(keterangan, nama_file){

    this.apiService.update_data_cheklist_dokumen_detail(this.id_dokumen_detail, keterangan, nama_file)
    .then(data => {

      console.log(data);
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        // this.mengirim_informasi_data(data_id_evidence);
        this.data_progres_bar = 0.4;
        this.mengirim_file();
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
        this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
        this.mengirim_data_api(keterangan, nama_file);
        this.data_progres_bar = 0.2;
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 36 !, kembali ke login !");
      }
    });
  }

  async mengirim_file(){

    this.data_progres_bar = 0.7;

    let path_data = this.arr_data_img_pdf[0].path;
    let nama = this.arr_data_img_pdf[0].nama;
    let tipe = this.arr_data_img_pdf[0].tipe;
    let tipe_mime;

    console.log(nama, this.arr_data_img_pdf);

    
    if (tipe = "JPEG") {
      tipe_mime = "image/JPEG"
    } 
    
    if (tipe = "pdf") {
      tipe_mime = "application/pdf"
    }

    if (tipe = "doc") {
      tipe_mime = "application/msword"
    }

    if (tipe = "docx") {
      tipe_mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama,
      chunkedMode: false,
      mimeType: tipe_mime,
      headers: {}
    }

    fileTransfer.upload(path_data, this.URL, options)
    .then(data => {

      console.log(data);
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();
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
          this.router.navigate(["/dokumen"], { replaceUrl: true });
        }
      });
    })
    .catch(error => {

      let status = error.code;

      console.log(error);
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();
      if (status == 4) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Cek file kembali di riwayat lampiran !");
      }else{
        this.swal.swal_code_error("Terjadi kesalahan", "Code error 37 !");
      }
    });

    let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

}
