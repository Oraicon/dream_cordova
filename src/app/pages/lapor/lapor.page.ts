import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { DatePipe } from '@angular/common';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { ToastService } from 'src/app/services/toast.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lapor',
  templateUrl: './lapor.page.html',
  styleUrls: ['./lapor.page.scss'],
})
export class LaporPage implements OnInit {

  pilih_gambar = true;
  gambar_kosong = true;
  isSubmitted = false;
  md5_upload = "assets/images/";
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";

  
  //variable
  imgURL:any = 'assets/ss_.png';
  nama_kegiatan:any = "Nama Kegiatan";
  data_gambar = true;
  data_keterangan_f;
  data_page = 0;
  img_default;
  lapor_id;
  lapor_namakegiatan;
  datapersen;
  array_persen = [];
  cek_koneksi = true;
  keterangan;
  persen;

  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

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

  customPopoverOptions: any ={
    mode: 'ios'
  }

  myGroup: FormGroup;

  constructor(private setget: SetGetServiceService, 
    private toastService: ToastService,
    private network: Network,
    private swal: SwalServiceService,
    public formBuilder: FormBuilder,
    private datepipe: DatePipe, 
    private transfer: FileTransfer, 
    private apiService: ApiServicesService, 
    private actionSheetController: ActionSheetController, 
    private navCtrl:NavController, 
    private camera: Camera, 
    private loadingService: LoadingServiceService) {

    this.setget.setButton(0);

    this.myGroup = this.formBuilder.group({
      data_keterangan: ['', [Validators.required]],
      data_persen: ['', [Validators.required]]
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
    this.setget.set_tab_page(2);
    this.setget.set_lapor(this.keterangan,this.persen,this.imgURL);
  }

  ionViewDidLeave(){
    this.setget.set_tab_page(1);
    this.setget.set_lapor(undefined,undefined,"'assets/ss_.png'");
  }

  //delay filetranfer 30 detik
  delay() {
    console.log("masuk dealy");
    return new Promise(resolve => { setTimeout(() => resolve(""), 30000);});
  }

  async delayed(){
    await this.delay();
    return 1;
  }

  tampilkan_data(){

    let a = this.setget.getLog();
    let b = this.setget.get_persen();

    this.lapor_id = a[0];
    this.lapor_namakegiatan = a[1];
    this.datapersen = b;
    
    this.logik_array(this.datapersen);
  }

  logik_array(nilai){
    let a = Number(nilai);

    for (let index = 1; index <= 100/10; index++) {
      let j = index * 10;
      if (j > a) {
        this.array_persen.push(j);
      }
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
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.setget.set_lapor(this.keterangan,this.persen,"ada");
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.data_gambar = false;
      this.base64_img = this.imgURL;
      this.pilih_gambar = false;
      this.gambar_kosong = false;
    });
  }

  //dapatkan gambar dari galeri
  galeri(){
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.setget.set_lapor(this.keterangan,this.persen,"ada");
      this.data_gambar = false;
      this.base64_img = this.imgURL;
      this.pilih_gambar = false;
      this.gambar_kosong = false;
    });
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  //jika gambar rusak
  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  batal_gambar(){
    this.data_gambar = true;
    this.imgURL = 'assets/ss_.png';
    this.setget.set_lapor(this.keterangan,this.persen,this.imgURL);
  }

  //saat mengetik keterangan
  onKey(e){
    this.keterangan = this.myGroup.value.data_keterangan;
    this.setget.set_lapor(this.keterangan,this.persen,this.imgURL);
    console.log(this.keterangan);
  }

  onChange(e){
    this.persen = this.myGroup.value.data_persen;
    this.setget.set_lapor(this.keterangan,this.persen,this.imgURL);
    console.log(this.persen);
  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    if (this.keterangan != null || this.persen != null || this.imgURL != 'assets/ss_.png') {
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
          this.navCtrl.back();
        }else {
          this.loadingService.tutup_loading();
        }
      });
    } else {
      this.navCtrl.back();
    }
  }

  //validasi
  onSubmit(){
    this.isSubmitted = true;

    let data_button = this.setget.getButton();

    if (!this.myGroup.valid) {
      return false;
    } else {
      if (data_button == 0) {
        this.setget.setButton(1);
        if(this.imgURL != 'assets/ss_.png'){
          this.keterangan = this.myGroup.value.data_keterangan;
          this.persen = this.myGroup.value.data_persen;
          let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + this.format_img;
          this.name_img = nama_file.toString();
          let a;
      
          if (this.persen == 100){
            a = 2
          } else {
            a = 1
          }
  
          this.data_page = a;

          if(a == 2){
            this.loadingService.tampil_loading("");
            Swal.fire({
              title: 'Perhatian !',
              text: "Dengan persen pengerjaan 100% maka kegiatan selesai, dan pastikan anda sudah mengisi data dengan benar !",
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
                  this.test_koneksi_api(nama_file, this.keterangan, this.persen);
                } else {
                  this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
                }
              }else{
                this.loadingService.tutup_loading();
              }
            })
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
                  this.test_koneksi_api(nama_file, this.keterangan, this.persen);
                } else {
                  this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
                }
              }else{
                this.loadingService.tutup_loading();
              }
            })
          }
  
          
        }else{
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Gambar tidak boleh kosong !");
        }
      } else {
        this.toastService.Toast_tampil();
      }

    }
  }

  test_koneksi_api(nama_file, keterangan, persen){
    this.toastService.Toast("Pengecekan koneksi internet . . .");
    this.apiService.cek_koneksi()
    .then(data => {

      console.log(data);

      this.mengirim_data_api(nama_file, keterangan, persen);

    })
    .catch(error => {
      console.log(error);
      this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
      this.test_koneksi_api(nama_file, keterangan, persen);
    });
  }

  async mengirim_data_api(nama_file, keterangan, persen){

    this.toastService.Toast("Mengirim data");

    this.apiService.kirim_api_progres(this.lapor_id, this.md5_upload+ "/" + nama_file, keterangan, persen)
    .then(data => {
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.mengirim_gambar();
      } else {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 9 !");
      }
  
    })
    .catch(error => {
  
      // console.log(error);
      this.loadingService.tutup_loading();
      if (error.status == -4) {
        console.log(error);
        this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
        this.mengirim_data_api(nama_file, keterangan, persen);
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 10 !, kembali ke login !");
      }
    });
  }

  async mengirim_gambar(){

    this.toastService.Toast("Menyimpan gambar");

    const fileTransfer: FileTransferObject = this.transfer.create();
    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: this.name_img,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    fileTransfer.upload(this.base64_img, this.URL, options)
    .then(data => {
      console.log(data);

      const data_json = JSON.parse(data.response);
      const data_status = data_json.status;

      if (data_status == 0) {
        this.setget.setLog(this.lapor_id, this.nama_kegiatan);
        this.setget.set_Page(this.data_page);
    
        this.setget.setAlert(1);
        this.loadingService.tutup_loading();
    
        this.navCtrl.back();

      } else {
        // console.log("error");

        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 11 !");
        
      }


    })
    .catch(error => {
  
      let status = error.code;

      if (status == 4) {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada respon, kirim gambar kembali di detail kegiatan !");
      }else{
        this.loadingService.tutup_loading();
        this.swal.swal_code_error("Terjadi kesalahan", "code error 12 !, kembali ke login !");
      }

    });

    let waktu_habis = await this.delayed();
    console.log(waktu_habis);
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

}
