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


@Component({
  selector: 'app-lapor',
  templateUrl: './lapor.page.html',
  styleUrls: ['./lapor.page.scss'],
})
export class LaporPage implements OnInit {

  pilih_gambar = true;
  gambar_kosong = true;
  isSubmitted = false;
  
  //variable
  imgURL:any = 'assets/ss_.png';
  nama_kegiatan:any = "Nama Kegiatan";
  data_gambar = true;
  data_keterangan_f;
  img_default;
  lapor_id;
  lapor_namakegiatan;
  datapersen;
  array_persen = [];
  place;
  cek_koneksi = true;

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

  customAlertOptions: any = {
    header: 'Persen Pengerjaan',
    mode: 'ios',
    translucent: true
  };

  myGroup: FormGroup;

  constructor(private setget: SetGetServiceService, 
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
  
  ngOnInit() {
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 1000);});
  }

  ionViewWillEnter(){
    this.tampilkan_data();
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

  //dapatkan gambar dari kamera
  kamera(){
    this.camera.getPicture(this.cameraOptions).then(res=>{
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
      this.data_gambar = false;
      this.base64_img = this.imgURL;
      this.pilih_gambar = false;
      this.gambar_kosong = false;
    });
  }

  validasi(keterangan, persen){
    let a;
    
    if (this.place == 100){
      a = 2
    } else {
      a = 1
    }
    
    const fileTransfer: FileTransferObject = this.transfer.create();

    let URL="https://oraicon.000webhostapp.com/upload.php";
    this.name_img = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + this.format_img;
    let nama_file = this.name_img.toString();

    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: nama_file,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    this.interval_counter();
    
    fileTransfer.upload(this.base64_img, URL, options)
    .then(data => {

      const responecode = data.responseCode;

      if (responecode == 200) {
        this.interval_counter();

        this.apiService.kirim_api_progres(this.lapor_id, "https://oraicon.000webhostapp.com/upload/" + this.name_img, keterangan, persen)
        .then(data => {
          
          const data_json = JSON.parse(data.data);
          const data_status = data_json.status;

          if (data_status == 0) {
            this.setget.setLog(this.lapor_id, this.nama_kegiatan);
            this.setget.set_Page(a);
        
            this.setget.setAlert(1);
            this.loadingService.tutuploading();
        
            this.navCtrl.back();
          } else {
            this.loadingService.tutuploading();
            this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 9 !");
          }
      
        })
        .catch(error => {
      
          // console.log(error);
          this.loadingService.tutuploading();
          if (error.status == -4) {
            this.swal.swal_aksi_gagal("Terjadi kesalahan", "Server tidak merespon !");
          } else {
            this.swal.swal_code_error("Terjadi kesalahan", "code error 10 !");
          }

      
        });
      } else {
        // console.log("error");

        this.loadingService.tutuploading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 11 !");
        
      }


    })
    .catch(error => {
  
      // console.log(error);

      this.loadingService.tutuploading();
      this.swal.swal_code_error("Terjadi kesalahan", "code error 12 !");
  
    });
  }

  kembali(){
    this.navCtrl.back();
  }

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

  batal_laporan(){
    this.place = null;
    this.nama_kegiatan = "Nama Kegiatan";
  }

  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  batal_gambar(){
    this.imgURL = 'assets/ss_.png';
    this.pilih_gambar = true;
    this.gambar_kosong = true;
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  onSubmit(){
    this.isSubmitted = true;
    if (!this.myGroup.valid) {
      return false;
    } else {
      if(this.imgURL != 'assets/ss_.png'){
        const keterangan = this.myGroup.value.data_keterangan;
        const persen = this.myGroup.value.data_persen;

        if (this.cek_koneksi == true) {
          this.loadingService.tampil_loading_login();
          this.test_koneksi(keterangan, persen);
        } else {
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
        }

      }else{
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Gambar tidak boleh kosong !");
      }
    }
  }

  test_koneksi(keterangan, persen){
    this.apiService.cek_koneksi()
    .then(data => {

      this.validasi(keterangan, persen);

    })
    .catch(error => {
      this.loadingService.tutuploading();
      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Server tidak merespon !");
    });
  }

}
