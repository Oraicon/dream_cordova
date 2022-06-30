import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { ToastService } from 'src/app/services/toast.service';
import { Chooser, ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ModalHasilPage } from 'src/app/modal/modal-hasil/modal-hasil.page';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SizecountServiceService } from 'src/app/services/sizecount-service.service';

@Component({
  selector: 'app-lapormeter',
  templateUrl: './lapormeter.page.html',
  styleUrls: ['./lapormeter.page.scss'],
})
export class LapormeterPage implements OnInit {

  isSubmitted = false;
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";
  
  //variable
  imgURL:any = 'assets/ss_.png';
  nama_kegiatan:any = "Nama Kegiatan";
  lapor_id;
  lapor_namakegiatan;
  data_id_list;

  tipe_laporan;
  total_meter = 0;
  progress_meter = 0;
  penghitung_index = 0;

  cek_koneksi = true;
  keterangan;
  item;
  volume;
  lat;
  long;

  arr_looping_mengirim_path = [];
  arr_looping_pengecekan = [];
  hasil_file_dikirim = [];
  arr_data_img_pdf = [];
  sedang_mengirim = false;
  data_progres_bar = 0;
  data_path_terkirim = [];

  name_img:string="";
  format_img:string="JPEG";

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

  myGroup: FormGroup;

  constructor(
    private setget: SetGetServiceService, 
    private toast: ToastService,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private toastService: ToastService,
    private network: Network,
    private router:Router,
    private swal: SwalServiceService,
    private storage:Storage, 
    private chooser: Chooser,
    private formBuilder: FormBuilder,
    private datepipe: DatePipe, 
    private transfer: FileTransfer, 
    private apiService: ApiServicesService, 
    private actionSheetController: ActionSheetController, 
    private ngzone:NgZone,
    private sizeService: SizecountServiceService, 
    private camera: Camera, 
    private loadingService: LoadingServiceService) {    

    this.myGroup = this.formBuilder.group({
      data_volume: ['', [Validators.required]],
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

 //ionic lifecycle
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.tampilkan_data();
    this.setget.setButton(0);
    this.setget.set_tab_page(2);
    this.setget.set_lapor(undefined,undefined,undefined,"assets/ss_.png");
  }

  ionViewDidLeave(){
    this.setget.set_tab_page(1);
    this.setget.set_lapor(undefined,undefined,undefined,"assets/ss_.png");
  }

  //delay filetranfer 30 detik
  delay() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 120000);});
  }

  async delayed(data){
    await this.delay();
    return data;
  }

  delay_pengecekan() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }

  delay_tunggu_internet() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 5000);});
  }

  tampilkan_data(){

    let a = this.setget.getLog();

    this.lapor_id = a[0];
    this.lapor_namakegiatan = a[1];
    this.tipe_laporan = a[2];

    if (this.tipe_laporan != "Meter") {
      this.myGroup.setValue({data_volume: "1", data_keterangan: null});
    }else{
      let b = this.setget.getMeter();

      this.total_meter = b[0];
      this.progress_meter = b[1];
    }
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
        text: 'PDF',
        icon: 'document-outline',
        handler: () => {
          this.dapatkan_pdf();
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

      let size_data = this.sizeService.size(res);
      let int_size = +size_data.byteLength;

      if (int_size >= 10485760 ) {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
        return
      } else {
        this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
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
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
        return;
      } else {
        this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
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
    if(this.arr_data_img_pdf.length == 0){
      this.setget.set_lapor(undefined,undefined,undefined,"assets/ss_.png");
    }
  }

  //pengecekan koneksi api
  async dapatkan_pdf(){
    this.loadingService.tampil_loading("Sedang Memuat");
    await this.delay_pengecekan();

    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{

      if (data == undefined) {
      this.loadingService.tutup_loading();
      }

      let type_data = data.mediaType;
      // let nama_data = data.name;
      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + "pdf"; 
      let path_uri_data = data.dataURI;
      let size_data = data.data.byteLength;
      let int_size_data = +size_data;

      if (type_data == "application/pdf") {

        if (int_size_data >= 10485760) {
          this.loadingService.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "File berukuran 10MB atau lebih !");
          return;
        } else {
          let obj_image = {
            path : path_uri_data,
            nama : nama_file,
            tipe : "pdf"
          }
          this.arr_data_img_pdf.push(obj_image);
          this.loadingService.tutup_loading();
          this.setget.set_lapor(this.item, this.volume, this.keterangan, "ada");
        }
      } else {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe PDF !");
        this.setget.set_lapor(this.item, this.volume, this.keterangan, "assets/ss_.png");
      }

    },(err)=>{
      this.loadingService.tutup_loading();
      this.swal.swal_code_error("Terjadi kesalahan !", "Code error 32 !");
    })
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  //jika gambar rusak
  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  //saat mengetik
  onKey(e){
    this.volume = this.myGroup.value.data_volume;
    this.keterangan = this.myGroup.value.data_keterangan;

    if (this.volume != "") {
      this.setget.set_lapor(this.item,this.volume,this.keterangan,this.imgURL);
    }
    
    if(this. volume == ""){
      this.volume = null;
    }

    if (this.keterangan != "") {
      this.setget.set_lapor(this.item,this.volume,this.keterangan,this.imgURL);
    }

    if(this. keterangan == ""){
      this.keterangan = null;
    }
  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    let data_button = this.setget.getButton();

    if (data_button == 0) {
      this.setget.setButton(1);
      if (this.item != null || this.volume != null || this.keterangan != null || this.arr_data_img_pdf.length != 0) {
        this.loadingService.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Peringatan !',
          text: 'Formulir laporan anda yang sudah diisi akan terhapus, anda yakin ?',
          backdrop: false,
          showDenyButton: true,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Ya',
          denyButtonText: `Tidak`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingService.tutup_loading();
            // this.navCtrl.back();
            this.router.navigate(["/proses"], { replaceUrl: true });
          }else {
            this.loadingService.tutup_loading();
          }
        });
      } else {
        // this.navCtrl.back();
        this.router.navigate(["/proses"], { replaceUrl: true });
      }
    } else {
      this.toast.Toast_tampil();
    }

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
          this.volume = this.myGroup.value.data_volume;
          this.keterangan = this.myGroup.value.data_keterangan;
          this.hasil_file_dikirim = [];

          let a = +this.volume; 
          let b = +this.progress_meter;
          let c = +this.total_meter;
          let d = a + b; 

          if (d > c && this.total_meter !=0) {
            this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Volume melebihi ketentuan !");
          }else{
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
                  this.test_koneksi_api(this.volume, this.keterangan);
                } else {
                  this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
                }
              }else{
                this.loadingService.tutup_loading();
              }
            })
          }

          }else{
            this.swal.swal_aksi_gagal("Terjadi kesalahan", "Lampiran file harus diisi !");
            this.setget.setButton(0);
          }
      } else {
        this.toastService.Toast_tampil();
      }

    }
  }

  //pengecekan koneksi
  test_koneksi_api(volume, keterangan){
    this.data_progres_bar = 0.2;
    this.apiService.cek_koneksi()
    .then(data => {

      this.get_geo(volume, keterangan);

    })
    .catch(error => {
      console.log(error);

      if (error.status == -4) {
        this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
        this.test_koneksi_api(volume, keterangan);
      }

      if (error.status == -3) {
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
            this.test_koneksi_api(volume, keterangan);
          }
        })
      }

      if (error.status != -4 && error.status != -3) {
        this.loadingService.tutup_loading();
        this.swal.swal_code_error("Terjadi kesalahan", "Code error 97, kembali ke login !");
      }
    });
  }

  //dapatkan geolocation
  get_geo(volume, ketentuan){
    this.data_progres_bar = 0.3;
    this.geolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: true })
      .then((res) => {
        this.lat = res.coords.latitude;
        this.long = res.coords.longitude;
        this.pengecekan_pc_master(volume, ketentuan, this.lat, this.long)
      }).catch((e) =>{
        let error_code = e.code
        this.sedang_mengirim = false;
        this.loadingService.tutup_loading();
  
        if (error_code == 3) {
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Aktifkan GPS !");
          return;
        }
    })
  }

  //pengecekan querry ada ?
  async pengecekan_pc_master(volume, keterangan, lat, long){
    this.data_progres_bar = 0.4;
    this.apiService.pengecekan_data_kegiatan_master(keterangan)    
    .then(data => {
      console.log(data);
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        // this.mengirim_data_api(keterangan);
        console.log("data tidak ada");
        this.mengirim_data_api(volume, keterangan, lat, long)
      } else {
        console.log("data ada");
        // this.loooping_mengirim_informasi_data(this.id_dokumen_detail);
      }
  
    })
    .catch(error => {
      if(error.status == -4){
        // return 4;
        this.toastService.Toast("Mengirim gagal, mencoba mengirim kembali . . . ");
        this.pengecekan_pc_master(volume, keterangan, lat, long);
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
              this.pengecekan_pc_master(volume, keterangan, lat, long);
            }
          })
      }

      if (error.status != 4 && error.status != 3) {
        this.swal.swal_code_error("Terjadi kesalahan", "Code error 98, kembali ke login !");
      }

    });
  }

  // mengirim data kegiatan master
  async mengirim_data_api(volume, keterangan, lat, long){
    this.data_progres_bar = 0.5;
    const pengirim = await this.storage.get('nama');

    this.apiService.kirim_data_laporan(this.lapor_id.id, pengirim, volume, lat, long, keterangan)
    .then(data => {
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;
      const data_id_evidence = data_json.data;

      if (data_status == 0) {
        this.loooping_mengirim_informasi_data(data_id_evidence);
      } else {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Code error 9 !");
      }

    })
    .catch(error => {
      console.log(error);
  
      this.loadingService.tutup_loading();
      if (error.status == -4) {
        this.sedang_mengirim = false;
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Coba beberapa saat lagi !");
      } else if (error.status == -3){
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
              this.mengirim_data_api(volume, keterangan, lat, long);
            }
          });
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 10 !, kembali ke login !");
      }
    });
  }

  // persiapan looping data path kegiatan evidance
  async loooping_mengirim_informasi_data(id){
    this.data_progres_bar = 0.6;
    this.data_id_list = id;

    this.looping_do_while(id);

  }

  data_looping_index_arr;
  data_index_arr_dilooping = 0;

  //logika looping data untuk mengirim sesuai panjang array
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
          this.swal.swal_code_error("Terjadi kesalahan","Code error 99, kembali ke login !");
          return;
        }

        //mengolah data jika code error status 4 RTO
        if (this.data_looping_index_arr == 4) {
          console.log("sedang do while 4");
          this.toastService.Toast("Mengirim gagal, mencoba mengirim kembali . . . ");
          this.data_looping_index_arr = 7;
          // this.looping_do_while(id);
          this.pengecekan_pc_evidence(id, element.nama);
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
              this.pengecekan_pc_evidence(id, element.nama);
              return;
            }
          })
        }

        if (this.data_looping_index_arr == 123) {
          console.log("sedang do while 123");
          this.data_looping_index_arr = 7;
          this.swal.swal_code_error("Terjadi kesalahan !","Code error 100, kembali ke login !");
          return;
        }
      }
      i++
    }
    while (i < 120);
  }

  //pengecekan path data evidence
  async pengecekan_pc_evidence(id, nama_file){
    this.apiService.pengecekan_data_kegiatan_evidence(nama_file)    
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
        this.pengecekan_pc_evidence(id, nama_file)
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
              this.pengecekan_pc_evidence(id, nama_file);
            }
          })
      }

      if (error.status != 4 && error.status != 3) {
        this.swal.swal_code_error("Terjadi kesalahan !", "Code Error 101, kembali ke login !");
      }

    });
  }

  // mengirim data path
  async mengirim_informasi_data(id, nama, index){

    this.apiService.menyimpan_path_file(id, nama)
    .then(data => {
      console.log(data);
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.penghitung_index++;
        this.data_path_terkirim.push(1);
        this.arr_looping_mengirim_path.push(1);
        this.data_looping_index_arr = 1;

      } else {
        this.penghitung_index++;
        this.arr_looping_mengirim_path.push(2);

        this.data_looping_index_arr = 0;
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

    });
  }

  async pengecekan_informasi_data(id){

    if (this.penghitung_index == this.arr_data_img_pdf.length) {
      let pengecekan_arr_looping = this.arr_looping_mengirim_path;

      const isBelowThreshold = (currentValue) => currentValue == 1;

      const a = pengecekan_arr_looping.every(isBelowThreshold);

      if (this.data_path_terkirim.length == 0) {
        this.arr_looping_mengirim_path = [];
        this.data_path_terkirim = [];
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Ganguan Koneksi !", "Restart ulang koneksi data, lalu tekan ok !");
        this.loadingService.tampil_loading("Mengirim data . . .");
        await this.delay_tunggu_internet();
        this.loooping_mengirim_informasi_data(id);
      } else {
        if (a == true) {
          this.looping_file();
        } else {
          this.toast.Toast("Gagal menyimpan salah satu data !");
          this.looping_file();
        }
      }

      // this.looping_file();
    } else {
      await this.delay_pengecekan();
      this.pengecekan_informasi_data(id);
    }
  }

  // persiapan looping data file kegiatan evidance dikirim ke server
  async looping_file(){
    this.data_progres_bar = 0.7;
    this.toastService.Toast("Sedang mengirim file, tunggu sampai proses selesai !");

    this.looping_do_while_file_transfer(this.arr_data_img_pdf);
  }

  data_looping_index_filetransfer;
  data_index_filetransfer_dilooping = 0;

  // mengirim data file 
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

          this.swal.swal_code_error("Terjadi kesalahan","Code error 102, kembali ke login !");
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
          this.swal.swal_code_error("Terjadi kesalahan !","Code error 103, kembali ke login !");
          return;
        }
      }
      i++
    }
    while (i < 240);
  }

  progress = 0
  sedang_upload = false;
  async mengirim_file(namafile, path_file, index, ext){

    let file_ext
    
    if (ext = "JPEG") {
      file_ext = "image/JPEG"
    } else {
      file_ext = "application/pdf"
    }

    const fileTransfer: FileTransferObject = this.transfer.create();
    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: namafile,
      chunkedMode: false,
      mimeType: file_ext,
      headers: {}
    }

    fileTransfer.onProgress((progressEvent) => {
      this.progress = 0;
      this.sedang_upload = true;
      let perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      this.ngzone.run(() => {
        this.progress = perc / 100;
      });
    });

    fileTransfer.upload(path_file, this.URL, options)
    .then(data => {

      console.log(data);
      this.sedang_upload = false;
      
      const data_json = JSON.parse(data.response);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.toastService.Toast("Berhasil menyimpan "+namafile);

        let obj_hasil_akhir = {
          namna_file: namafile,
          hasil: "Berhasil !"
        }
        this.hasil_file_dikirim.push(obj_hasil_akhir);

        this.data_looping_index_filetransfer = 1;
      } else {    
        this.toastService.Toast("Gagal menyimpan "+namafile);
    
        let obj_hasil_akhir = {
          namna_file: namafile,
          hasil: "Gagal !"
        }
        this.hasil_file_dikirim.push(obj_hasil_akhir);

        this.data_looping_index_filetransfer = 0;
      }
    })
    .catch(error => {
      this.sedang_upload = false;

      console.log(error);
      this.toastService.Toast("Gagal menyimpan "+namafile);
      let obj_hasil_akhir = {
        namna_file: namafile,
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
    });

    let waktu_habis = await this.delayed(index);
    if (waktu_habis == index) {
      fileTransfer.abort();
    }
  }

  async pengecekan(){
    console.log(this.hasil_file_dikirim.length);
    console.log(this.arr_data_img_pdf.length);

    // if (this.hasil_file_dikirim.length == this.arr_data_img_pdf.length || this.hasil_file_dikirim.length == 1 && this.arr_data_img_pdf.length == 1) {
    this.data_progres_bar = 0.9;
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
        this.setget.set_hasil_akhir(this.hasil_file_dikirim);
        this.sedang_mengirim = false;
        this.loadingService.tutup_loading();
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
    this.myGroup.value.data_item = null;
    this.myGroup.value.data_volume = null;
  
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
      // this.router.navigate(["/proses"], { replaceUrl: true });
      if (this.data_id_list != null) {
        this.setget.set_list_path(this.data_id_list, null);
        this.router.navigate(["/list"], { replaceUrl: true });
      } else {
        this.router.navigate(["/proses"], { replaceUrl: true });
      }
    }).catch(err => {
    });
    await modal.present().then(data => {
    }).catch(err => {
    });
  }

}
