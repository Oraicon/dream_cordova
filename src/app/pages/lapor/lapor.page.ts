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
import { Chooser, ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
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
  tipe_lampiran;

  arr_data_img_pdf = [];
  // abort_file_transfer = 0;

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
    private geolocation: Geolocation,
    private storage: Storage,
    private toastService: ToastService,
    private network: Network,
    private swal: SwalServiceService,
    private chooser: Chooser,
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
      data_persen: ['', [Validators.required]],
      data_type: ['', [Validators.required]]
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
    this.storage.set("perulangan_arr", "1");
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

  async delayed(data){
    await this.delay();
    return data;
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
      this.setget.set_lapor(this.keterangan,this.persen,"ada");
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURL;
      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + this.format_img;
      this.name_img = nama_file.toString();
      this.array_img();
      // this.pilih_gambar = false;
      // this.gambar_kosong = false;
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingService.tutup_loading();
    });
  }

  //dapatkan gambar dari galeri
  galeri(){
    this.loadingService.tampil_loading("Memuat gambar . . .");
    this.camera.getPicture(this.galeriOptions).then(res=>{
      console.log(res);
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.setget.set_lapor(this.keterangan,this.persen,"ada");
      this.base64_img = this.imgURL;
      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + this.format_img;
      this.name_img = nama_file.toString();
      this.array_img();

      // this.pilih_gambar = false;
      // this.gambar_kosong = false;
    }, (err) => {
      // Handle error
      console.log("error");
      this.loadingService.tutup_loading();
    });
  }

  //array gambar supaya bisa lebih dari 1
  array_img(){
    let img = this.base64_img;
    let nama = this.name_img;

    let obj_image = {
      img : img,
      nama : nama,
    }

    this.arr_data_img_pdf.push(obj_image);
    this.loadingService.tutup_loading();
    // console.log(this.arr_img);
  }

  //logik menghapus array gammbar
  deleteImage(e){
    console.log(e);
    this.arr_data_img_pdf.splice(e, 1);
  }

  dapatkan_pdf(){
    this.loadingService.tampil_loading("Sedang Memuat");
    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{
      console.log(data);

      if (data == undefined) {
      this.loadingService.tutup_loading();
      }

      let type_data = data.mediaType;
      // let nama_data = data.name;
      let nama_file  = this.datepipe.transform((new Date), 'MMddyyyyhmmss.') + ".pdf"; 
      let path_uri_data = data.dataURI;

      if (type_data == "application/pdf") {
        let obj_image = {
          pdf : path_uri_data,
          nama : nama_file,
        }
    
        this.arr_data_img_pdf.push(obj_image);
        this.loadingService.tutup_loading();
      } else {
        console.log("ini bukan pdf");
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe PDF !")
      }

    },(err)=>{
      console.log("eror");
      this.loadingService.tutup_loading();
    })
  }

  // deletefile(e){
  //   console.log(e);
  //   this.arr_file_pdf.splice(e, 1);
  // }

  get errorControl() {
    return this.myGroup.controls;
  }

  //jika gambar rusak
  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  batal_gambar(){
    this.pilih_gambar = true;
    this.gambar_kosong = true;
    this.imgURL = 'assets/ss_.png';
    this.setget.set_lapor(this.keterangan,this.persen,this.imgURL);
  }

  //saat mengetik keterangan
  onKey(e){
    this.keterangan = this.myGroup.value.data_keterangan;
    this.setget.set_lapor(this.keterangan,this.persen,this.imgURL);
  }

  onChange(e){
    this.persen = this.myGroup.value.data_persen;
    this.setget.set_lapor(this.keterangan,this.persen,this.imgURL);
  }

  // onChangetype(e){
  //   this.tipe_lampiran = this.myGroup.value.data_type;
  //   this.arr_file_pdf = [];
  //   this.arr_img = [];
  //   this.setget.set_lapor(this.keterangan,this.persen,"ada");
  // }

  //kembali ke aktiviti sebelumnya
  kembali(){
    if (this.keterangan != null || this.persen != null || this.imgURL != 'assets/ss_.png' || this.arr_data_img_pdf.length != 0) {
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

    console.log(this.myGroup.value);

    if (!this.myGroup.valid) {
      return false;
    } else {
      if (data_button == 0) {
        this.setget.setButton(1);
        if(this.imgURL != 'assets/ss_.png' || this.arr_data_img_pdf.length != 0){
          this.keterangan = this.myGroup.value.data_keterangan;
          this.persen = this.myGroup.value.data_persen;
          this.tipe_lampiran = this.myGroup.value.data_type;

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
                  this.test_koneksi_api(this.keterangan, this.persen);
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
                  this.test_koneksi_api(this.keterangan, this.persen);
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

  test_koneksi_api(keterangan, persen){
    this.toastService.Toast("Pengecekan koneksi internet . . .");
    this.apiService.cek_koneksi()
    .then(data => {

      console.log(data);

      this.mengirim_data_api(keterangan, persen);

    })
    .catch(error => {
      console.log(error);
      this.toastService.Toast("Gagal mengirim, mencoba mengirim kembali !");
      this.test_koneksi_api(keterangan, persen);
    });
  }

  async mengirim_data_api(keterangan, persen){

    this.toastService.Toast("Mengirim data laporan");

    this.apiService.kirim_api_progres(this.lapor_id, keterangan, persen)
    .then(data => {
      console.log(data);
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;
      const data_id_evidence = data_json.data;

      if (data_status == 0) {
        this.mengirim_informasi_data(data_id_evidence);
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
        this.mengirim_data_api(keterangan, persen);
      } else {
        this.swal.swal_code_error("Terjadi kesalahan", "code error 10 !, kembali ke login !");
      }
    });
  }

  async mengirim_informasi_data(id){

    // if (this.tipe_lampiran == 1) {
      this.toastService.Toast("Mengirim data & menyimpan gambar");

      for (let index = 0; index < this.arr_data_img_pdf.length; index++) {
        let element = this.arr_data_img_pdf[index];

        this.apiService.kirim_api_progres_img(id, element.nama)
        .then(data => {
          console.log(data);
          const data_json = JSON.parse(data.data);
          const data_status = data_json.status;

          if (data_status == 0) {

            if (index == this.arr_data_img_pdf.length - 1) {
              this.looping_file("img");
            }
            
          } else {
            this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error BELUM2 !");
          }

        })
        .catch(error => {
      
        // console.log(error);
        this.loadingService.tutup_loading();
        if (error.status == -4) {
          console.log(error);
          this.swal.swal_code_error("Terjadi kesalahan", "code error belum3 !");
        } else {
          this.swal.swal_code_error("Terjadi kesalahan", "code error BELUM !, kembali ke login !");
        }
        });
      }
    // }else{
    //   this.toastService.Toast("Mengirim data & menyimpan pdf");

    //   for (let index = 0; index < this.arr_file_pdf.length; index++) {
    //     let element = this.arr_file_pdf[index];
        
    //     this.apiService.kirim_api_progres_img(id, element.nama)
    //     .then(data => {
    //       console.log(data);
    //       const data_json = JSON.parse(data.data);
    //       const data_status = data_json.status;

    //       if (data_status == 0) {

    //         if (index == this.arr_file_pdf.length - 1) {
    //           this.looping_file("pdf");
    //         }
            
    //       } else {
    //         this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error BELUM2 !");
    //       }

    //     })
    //     .catch(error => {
      
    //     // console.log(error);
    //     this.loadingService.tutup_loading();
    //     if (error.status == -4) {
    //       console.log(error);
    //       this.swal.swal_code_error("Terjadi kesalahan", "code error belum3 !");
    //     } else {
    //       this.swal.swal_code_error("Terjadi kesalahan", "code error BELUM !, kembali ke login !");
    //     }
    //     });
    //   }
    // }

  }

  looping_file(tipe){
    // if (tipe == "img") {
      for (let index = 0; index < this.arr_data_img_pdf.length; index++) {
        let element = this.arr_data_img_pdf[index];
        this.mengirim_gambar(element.nama, element.img, index)
      }
    // } else {
    //   for (let index = 0; index < this.arr_file_pdf.length; index++) {
    //     let element = this.arr_file_pdf[index];
    //     this.mengirim_pdf(element.pdf, element.nama, index)
    //   }
    // }
  }

  async mengirim_gambar(namafile, base64, index){

    // let base64 = this.arr_img[this.img_counter].img;
    // let namafile = this.arr_img[this.img_counter].nama;

    const fileTransfer: FileTransferObject = this.transfer.create();
    //mengisi data option
    let options: FileUploadOptions = {
      fileKey: 'filekey',
      fileName: namafile,
      chunkedMode: false,
      mimeType: "image/JPEG",
      headers: {}
    }

    fileTransfer.upload(base64, this.URL, options)
    .then(data => {
      console.log(data);

      const data_json = JSON.parse(data.response);
      const data_status = data_json.status;

      if (data_status == 0) {
        // this.setget.setLog(this.lapor_id, this.nama_kegiatan);
        // this.setget.set_Page(this.data_page);
    
        // this.setget.setAlert(1);
        if (index == this.arr_data_img_pdf.length-1) {
          this.loadingService.tutup_loading();
          this.toastService.Toast("Berhasil menyimpan "+namafile)
          this.loadingService.tampil_loading(null);
          Swal.fire({
            icon: 'success',
            title: 'Sukses !' ,
            text: 'Berhasil menyimpan data',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'OK !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutup_loading();
              // this.navCtrl.back();
            }
          });
        }else{
          this.toastService.Toast("Berhasil menyimpan "+namafile);
          // this.img_counter++;
          // this.mengirim_gambar();
        }
    
        // this.navCtrl.back();

      } else {
        // console.log("error");

        // this.loadingService.tutup_loading();
        // this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 11 !");
        this.toastService.Toast("Gagal menyimpan "+namafile)
        
      }
    })
    .catch(error => {
  
      let status = error.code;

      if (status == 4) {
        this.loadingService.tutup_loading();
        this.toastService.Toast("Tidak ada respon, gagal menyimpan "+namafile)
        // this.swal.swal_aksi_gagal("Terjadi kesalahan", " kirim gambar kembali di detail kegiatan !");
      }else{
        this.loadingService.tutup_loading();
        this.toastService.Toast("code error 12, gagal menyimpan "+namafile)
        // this.swal.swal_code_error("Terjadi kesalahan", "code error 12 !, kembali ke login !");
      }
    });

    let waktu_habis = await this.delayed(index);
    if (waktu_habis == index) {
      // if (this.abort_file_transfer == 0) {
        fileTransfer.abort();
      // }
    }
  }

  testgeo(){
    this.geolocation.getCurrentPosition({enableHighAccuracy: true })
    .then((res) => {
      let lat = res.coords.latitude;
      let lng = res.coords.longitude;

      console.log(lat+", "+ lng);
    }).catch((e) =>{
      console.log(e);
    })
  }

  // async mengirim_pdf(path_pdf, namafile, index){
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  //   //mengisi data option
  //   let options: FileUploadOptions = {
  //     fileKey: 'filekey',
  //     fileName: namafile,
  //     chunkedMode: false,
  //     mimeType: "application/pdf",
  //     headers: {}
  //   }

  //   fileTransfer.upload(path_pdf, this.URL, options)
  //   .then(data => {
  //     console.log(data);

  //     const data_json = JSON.parse(data.response);
  //     const data_status = JSON.parse(data_json.status);

  //     console.log(data_status)

  //     if (data_status == 0) {
  //       this.setget.setLog(this.lapor_id, this.nama_kegiatan);
  //       this.setget.set_Page(this.data_page);
    
  //       this.setget.setAlert(1);
  //       if (index == this.arr_file_pdf.length-1) {
  //         this.loadingService.tutup_loading();
  //         this.toastService.Toast("Berhasil menyimpan "+namafile)
  //         this.loadingService.tampil_loading(null);
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Sukses !' ,
  //           text: 'Berhasil menyimpan data',
  //           backdrop: false,
  //           confirmButtonColor: '#3880ff',
  //           confirmButtonText: 'OK !',
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.loadingService.tutup_loading();
  //             // this.navCtrl.back();
  //           }
  //         });
  //       }else{
  //         this.toastService.Toast("Berhasil menyimpan "+namafile)
  //       }
    
  //       // this.navCtrl.back();

  //     } else {
  //       // console.log("error");

  //       // this.loadingService.tutup_loading();
  //       // this.swal.swal_aksi_gagal("Terjadi kesalahan", "code error 11 !");
  //       this.toastService.Toast("Gagal menyimpan "+namafile)
        
  //     }
  //   })
  //   .catch(error => {
  
  //     let status = error.code;

  //     if (status == 4) {
  //       this.loadingService.tutup_loading();
  //       this.toastService.Toast("Tidak ada respon, gagal menyimpan "+namafile)
  //       // this.swal.swal_aksi_gagal("Terjadi kesalahan", " kirim gambar kembali di detail kegiatan !");
  //     }else{
  //       this.loadingService.tutup_loading();
  //       this.toastService.Toast("code error 12, gagal menyimpan "+namafile)
  //       // this.swal.swal_code_error("Terjadi kesalahan", "code error 12 !, kembali ke login !");
  //     }
  //   });

  //   let waktu_habis = await this.delayed(index);
  //   if (waktu_habis == index) {
  //     // if (this.abort_file_transfer == 0) {
  //       fileTransfer.abort();
  //     // }
  //   }
  // }

}
