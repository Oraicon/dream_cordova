import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { SetGetServiceService } from './services/set-get-service.service';
import { ToastService } from './services/toast.service';
import { LoadingServiceService } from './services/loading-service.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { SwalServiceService } from './services/swal-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  cek_koneksi = true;

  @ViewChild(IonRouterOutlet,{static:true}) routerOutlet: IonRouterOutlet;
  constructor(private platform: Platform, 
    private swalService: SwalServiceService,
    private network: Network,
    private navCtrl:NavController, 
    private loadingService: LoadingServiceService,
    private router: Router, 
    private setget: SetGetServiceService, 
    private toastService: ToastService) {

    this.platform.ready().then(()=>{
      this.hardbackbutton();
    });

    this.setget.setButton(0);

    //pengecekan koneksi
    this.pengecekan_koneksi();
  }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 100);});
  }


  async pengecekan_koneksi(){
    this.network.onDisconnect().subscribe(() => {
      this.cek_koneksi = false;
      
      let a = this.setget.get_koneksi();

      if (a == 1) {
        const a = this.setget.getData();
        if (a == 1) {
          this.loadingService.tutup_loading();
        }
        this.kelogin();
      }
    });
  
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.cek_koneksi = true;
      }, );
    });
  }

  async kelogin(){
    await this.interval_counter();

    this.swalService.swal_code_error("Tidak ada internet", "Kembali ke login !");
  }
  
  //backbutton logik
  async hardbackbutton(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      let a = this.setget.getData();
      let b = this.setget.get_tab_page();
      let data_button = this.setget.getButton();

      let item = this.setget.get_lapor()[0];
      let volume = this.setget.get_lapor()[1];
      let keterangan = this.setget.get_lapor()[2];
      let file = this.setget.get_lapor()[2];

      console.log(item, volume, keterangan, file);

      if (a == 1) {
        this.toastService.Toast_tampil();
      } else {
        // if (!this.routerOutlet.canGoBack()) {
        //   if (b == 1) {
        //     this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
        //   }else{
        //     if (b == 3) {
        //       this.toastService.Toast("Tekan X untuk menutup modal . .");
        //     } else {
        //       this.exitapp();
        //     }
        //   }
        // }else{
        //   if (b == 2) {
        //     if (item != undefined || volume != undefined || keterangan != undefined || file != undefined) {
        //       this.loadingService.tampil_loading("");
        //       Swal.fire({
        //         icon: 'warning',
        //         title: 'Peringatan !',
        //         text: 'Formulir laporan anda yang sudah diisi akan terhapus, anda yakin ?',
        //         backdrop: false,
        //         showDenyButton: true,
        //         confirmButtonColor: '#3880ff',
        //         confirmButtonText: 'Ya',
        //         denyButtonText: `Tidak`,
        //       }).then((result) => {
        //         if (result.isConfirmed) {
        //           this.loadingService.tutup_loading();
        //           this.navCtrl.back();
        //         }else {
        //           this.loadingService.tutup_loading();
        //         }
        //       });
        //     }else{
        //       if (data_button == 0){
        //         this.setget.setButton(1);
        //         this.navCtrl.back();
        //       }else{
        //         this.toastService.Toast_tampil();
        //       }
        //     }
        //   }else if (b == 3){
        //       this.toastService.Toast("Tekan X untuk menutup modal . .");
        //   }else{              
        //     if (data_button == 0){
        //       this.setget.setButton(1);
        //       this.navCtrl.back();
        //     }else{
        //       this.toastService.Toast_tampil();
        //     }
        //   }
        // }
        if (b == 3){
            this.toastService.Toast("Tekan X untuk menutup modal . .");
        }else{
          this.toastService.Toast("Tombol tidak bisa digunakan !");
        }
      }
    });
  }

  //keluar aplikasi
  async exitapp() {
    const a = this.setget.getData();
    if (a == 1) {
      this.loadingService.tutup_loading();
    }

    this.loadingService.tampil_loading(null);
    Swal.fire({
      icon: 'warning',
      title: 'Keluar aplikasi ?',
      text: 'Keluar dari aplikasi, anda yakin ?',
      backdrop: false,
      showDenyButton: true,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'Ya',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutup_loading();
        navigator['app'].exitApp();
      }else {
        this.loadingService.tutup_loading();
      }
    });
  }
  
}
