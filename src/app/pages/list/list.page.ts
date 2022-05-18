import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalIsikontenPage } from 'src/app/modal/modal-isikonten/modal-isikonten.page';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { DocumentViewer, DocumentViewerOptions  } from '@awesome-cordova-plugins/document-viewer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject} from '@awesome-cordova-plugins/file-transfer/ngx';
import { ActionSheetController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import Swal from 'sweetalert2';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { Chooser, ChooserResult } from '@awesome-cordova-plugins/chooser/ngx';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  kode_barang;

  arr_data = [];

  data_list_data = [];
  data_gambar_rusak = {};
  get_ext;
  loading_skeleton = true;
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

  imgURI;
  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";

  constructor(
    private chooser: Chooser,
    private navCtrl: NavController,
    private loadingCtrl: LoadingServiceService,
    private actionSheetController: ActionSheetController,
    private setget: SetGetServiceService,
    private modalCtrl: ModalController,
    private camera: Camera,
    private swal: SwalServiceService, 
    private file: File,
    private document: DocumentViewer,
    private transfer: FileTransfer
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    const data_mentah = this.setget.get_list_path();
    console.log(data_mentah);
    
    this.data_list_data =  data_mentah[0];
    this.kode_barang = data_mentah[1];
    await this.tampilkan_data();
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

  async tampilkan_data(){

    for (let index = 0; index < this.data_list_data.length; index++) {
      let element = this.data_list_data[index];

      let nama = element.substring(14);
      let get_ext = nama.split('.').pop();

      if (get_ext == "JPEG") {
        let obj_data = {
          path : element,
          nama : nama,
          tipe : "JPEG"
        }

        this.arr_data.push(obj_data);
      } else {
        let obj_data = {
          path : element,
          nama : nama,
          tipe : "pdf"
        }

        this.arr_data.push(obj_data);
      }
    }

    this.loading_skeleton = false;

  }

  //kembali ke aktiviti sebelumnya
  kembali(){
    this.navCtrl.back();
  }

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

  tampilakn_pdf(path_pdf){
    console.log(path_pdf);
    let nama_pdf = path_pdf.substring(14);
    let data_url = "https://dream-beta.technosolusitama.in/" + path_pdf;

    const trans = this.transfer.create();
    
    trans.download(data_url, this.file.dataDirectory + nama_pdf).then((entry) => {
      console.log('download complete: ' + entry.toURL());
      let hasil =  entry.toURL(); 
      this.document.viewDocument(hasil, 'application/pdf', {title: nama_pdf});
    }, (error) => {
      // handle error
      const code_error = error.code;

      if (code_error == 1) {

        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'PDF tidak ditemukan, kirim ulang!',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Iya !',
          showDenyButton: true,
          denyButtonText: `Tidak`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
            this.dapatkan_pdf(nama_pdf, data_url);
          }else {
            this.loadingCtrl.tutup_loading();
          }
        });
      } else {
        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'Code Error xxx',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Iya !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      }
    });
  }

  //dapatkan data gambar dari galeri/kamera
  kamera(nama_img){
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.imgURI = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURI;
      this.swal_gambar(nama_img, this.imgURI);
    });
  }

  galeri(nama_img){
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURI = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURI;
      this.swal_gambar(nama_img, this.imgURI);
    });
  }

//gambar rusak
  errorHandler(event, a) {
    event.target.src = "assets/bi.png";
    this.data_gambar_rusak[a] = "rusak";
  }

  //modal ganti gambar
  async presentActionSheet(path_data) {

    let nama_img = path_data.substring(14);

    const actionSheet = await this.actionSheetController.create({
      header: 'Kirim ulang gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Kamera',
        icon: 'camera-outline',
        handler: () => {
          this.kamera(nama_img);
        }
      }, {
        text: 'Galeri',
        icon: 'image-outline',
        handler: () => {
          this.galeri(nama_img);
        }
      }, {
        text: 'Batal',
        icon: 'close',
        role: 'cancel',
      }]
    });
    await actionSheet.present();
  }

  //alert konfirmasi ganti gambar
  swal_gambar(nama, path_uri){
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
        this.mengirim_gambar(nama, path_uri);
      }else{
        this.loadingCtrl.tutup_loading();
      }
    })
  }

  //swal_pdf
  swal_pdf(nama_pdf, uri_pdf, nama_dulu){
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
        this.mengirim_pdf(nama_pdf, uri_pdf);
      }else {
        this.loadingCtrl.tutup_loading();
      }
    });
  }

  lokal(){
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    
    this.document.viewDocument('https://file-examples.com/wp-content/uploads/2017/10/file-sample_150kB.pdf', 'application/pdf', options);
  }

  dapatkan_pdf(nama, data_url){
    this.loadingCtrl.tampil_loading("Sedang Memuat . . .");
    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{
      console.log(data);

      if (data == undefined) {
      this.loadingCtrl.tutup_loading();
      }

      let type_data = data.mediaType;
      let nama_data = data.name;;
      let path_uri_data = data.dataURI;

      if (type_data == "application/pdf") {
        this.loadingCtrl.tutup_loading();
        this.swal_pdf(nama, path_uri_data, nama_data);
    
      } else {
        console.log("ini bukan pdf");
        this.loadingCtrl.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "File bukan bertipe PDF !")
      }

    },(err)=>{
      console.log("eror");
      this.loadingCtrl.tutup_loading();
    })
  }

  bukan_lokal(){
    const trans = this.transfer.create();

    const url = 'https://dream-beta.technosolusitama.in/assets/images/SNI_06_6989_11_2004_p_H_Meter.pdf';
    trans.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      let hasil =  entry.toURL(); 
      this.document.viewDocument(hasil, 'application/pdf', {});
    }, (error) => {
      // handle error
      console.log(error);

      const code_error = error.code;

      if (code_error == 1) {
        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'PDF tidak ditemukan, kirim ulang.',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Iya !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      } else {
        this.loadingCtrl.tampil_loading("");
        Swal.fire({
          icon: 'warning',
          title: 'Terjadi kesalahan !',
          text: 'Code Error xxx',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Iya !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingCtrl.tutup_loading();
          }
        });
      }
    });
  }

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

  fileTransfer.upload(path_uri, this.URL, options)
  .then(data => {
    
    console.log(data);

    const data_json = JSON.parse(data.response);
    const data_status = data_json.status;

    if (data_status == 0) {
      Swal.fire({
        icon: 'success',
        title: 'Sukses !' ,
        text: 'Berhasil menyimpan file '+ nama,
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'OK !',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingCtrl.tutup_loading();
          this.navCtrl.back();
        }
      });
    } else {
      this.loadingCtrl.tutup_loading();
    }
  })
  .catch(error => {

    console.log(error);

    let status = error.code;

    if (status == 4) {
      this.loadingCtrl.tutup_loading();
    }else{
      this.loadingCtrl.tutup_loading();
    }
  });

  let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

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

  fileTransfer.upload(path_uri, this.URL, options)
  .then(data => {
    
    console.log(data);

    const data_json = JSON.parse(data.response);
    const data_status = data_json.status;

    if (data_status == 0) {
      Swal.fire({
        icon: 'success',
        title: 'Sukses !' ,
        text: 'Berhasil menyimpan file '+ nama,
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'OK !',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingCtrl.tutup_loading();
          this.navCtrl.back();
        }
      });
    }else{
      this.loadingCtrl.tutup_loading();
    }

  })
  .catch(error => {

    console.log(error);

    let status = error.code;

    if (status == 4) {
      this.loadingCtrl.tutup_loading();
    }else{
      this.loadingCtrl.tutup_loading();
    }
  });

  let waktu_habis = await this.delayed();
    if (waktu_habis == 1) {
      fileTransfer.abort();
    }
  }

}
