import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalKegiatanPage } from '../modal/modal-kegiatan/modal-kegiatan.page';
import { ModalGambarPage } from '../modal/modal-gambar/modal-gambar.page';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  imgURL:any = 'https://oraicon.000webhostapp.com/upload/0210202260505.JPEG';

  // public url_img = 'https://oraicon.000webhostapp.com/upload/0210202260505.JPEG';
  // url_img = 'https://oraicon.000webhostapp.com/upload/0210202260505.JPEG';

  constructor(private modalCtrl: ModalController, private webview: WebView) {
    // this.imgurl = "assets/tiang.jpg";

    // console.log(this.url_img);
    // console.log(this.imgData_url);
  }

  async  pilihkegiatan(){
    const modal = await this.modalCtrl.create({
      component: ModalKegiatanPage,

    });
    await modal.present();
  }

  async pilihgambar(){
    const modal = await this.modalCtrl.create({
      component: ModalGambarPage,
      initialBreakpoint: 0.2,
      cssClass: 'popup-modal'
    });
    await modal.present();
  }

}
