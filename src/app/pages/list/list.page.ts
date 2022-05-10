import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalIsikontenPage } from 'src/app/modal/modal-isikonten/modal-isikonten.page';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  data_list_img = [];
  data_nama = [];
  get_ext;

  constructor(
    private navCtrl: NavController,
    private setget: SetGetServiceService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.data_list_img =  this.setget.get_list_path();

    for (let index = 0; index < this.data_list_img.length; index++) {
      const element = this.data_list_img[index];

      let nama = element.substring(14);

      this.data_nama.push(nama);
    }

    let get_data_index_0 = this.data_list_img[0];
    this.get_ext = get_data_index_0.split('.').pop(); 
    console.log(this.get_ext);
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
      // if (data.data.data == null) {
      //   this.loadingService.tutup_loading();
      //   return;
      // } else {
      //   this.data_api_lupa_sandi_nama = data.data.data;

      //   if (this.cek_koneksi == true) {
      //     this.test_koneksi(this.data_api_lupa_sandi_nama);
      //   }else{
      //     this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
      //   }
      // }
    }).catch(err => {
      // console.log(err);
    });
    await modal.present();
  }

}
