import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalIsikontenPage } from 'src/app/modal/modal-isikonten/modal-isikonten.page';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { DocumentViewer, DocumentViewerOptions  } from '@awesome-cordova-plugins/document-viewer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer} from '@awesome-cordova-plugins/file-transfer/ngx';
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
  data_list_data = [];
  data_list_img = [];
  data_list_pdf = [];
  data_nama = [];
  data_gambar_rusak = {};
  get_ext;
  loading_skeleton = true;
  pdfSrc = "https://dream-beta.technosolusitama.in/assets/images/281-design-construction-of-water-level-1303081126.pdf";

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

  imgURL;
  base64_img:string="";
  name_img:string="";
  format_img:string="JPEG";
  URL="https://dream-beta.technosolusitama.in/api/uploadImage";

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
    let get_data_index_0 = this.data_list_data[0];
    this.get_ext = get_data_index_0.split('.').pop(); 
    await this.tampilkan_data();
  }

  async tampilkan_data(){

    if (this.get_ext == "JPEG") {
      this.data_list_img = this.data_list_data;
      for (let index = 0; index < this.data_list_img.length; index++) {
        const element = this.data_list_img[index];
  
        let nama = element.substring(14);
  
        this.data_nama.push(nama);
      }
    } else {
      this.data_list_pdf = this.data_list_data;
      for (let index = 0; index < this.data_list_pdf.length; index++) {
        const element = this.data_list_pdf[index];
  
        let nama = element.substring(14);
  
        this.data_nama.push(nama);
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
    console.log(data_url);

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
          text: 'PDF tidak ditemukan, kirim ulang !!',
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

  //dapatkan data gambar dari galeri/kamera
  kamera(){
    this.camera.getPicture(this.cameraOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURL;
      this.swal_gambar(this.imgURL);
    });
  }

  galeri(){
    this.camera.getPicture(this.galeriOptions).then(res=>{
      this.imgURL = 'data:image/jpeg;base64,' + res;
      this.base64_img = this.imgURL;
      this.swal_gambar(this.imgURL);
    });
  }

//gambar rusak
  errorHandler(event, a) {
    event.target.src = "assets/bi.png";
    this.data_gambar_rusak[a] = "rusak";
  }

  //modal ganti gambar
  async presentActionSheet(namafile) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Kirim ulang gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Kamera',
        icon: 'camera-outline',
        handler: () => {
          this.kamera();
          const n = namafile.substring(33);
          this.name_img = n;
        }
      }, {
        text: 'Galeri',
        icon: 'image-outline',
        handler: () => {
          this.galeri();
          const n = namafile.substring(33);
          this.name_img = n;
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
    swal_gambar(gambar){
      this.loadingCtrl.tampil_loading("");
      Swal.fire({
        title: 'Peringatan !!',
        text: 'Pastikan gambar sesuai dengan kegiatan pengerjaan !',
        imageUrl: '' + gambar,
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
          // this.loadingCtrl.tampil_loading("Menyimpan gambar . . .");
          // this.mengirim_gambar();
        }else{
          this.loadingCtrl.tutup_loading();
        }
      })
    }

    //swal_pdf
    swal_pdf(nama_pdf){
    this.loadingCtrl.tampil_loading("");
      Swal.fire({
        icon: 'info',
        title: 'Perhatian !!',
        text: 'Mengirim PDF dengan nama : '+nama_pdf,
        backdrop: false,
        confirmButtonColor: '#3880ff',
        confirmButtonText: 'Iya !',
        denyButtonText: `batal`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.loadingCtrl.tutup_loading();
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

  dapatkan_pdf(){
    this.loadingCtrl.tampil_loading("Sedang Memuat");
    this.chooser.getFile("application/pdf").then((data:ChooserResult)=>{
      console.log(data);

      if (data == undefined) {
      this.loadingCtrl.tutup_loading();
      }

      let type_data = data.mediaType;
      let nama_data = data.name;
      let path_uri_data = data.dataURI;

      if (type_data == "application/pdf") {
        this.swal_pdf(nama_data);
    
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

}
