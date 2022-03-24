import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SetGetServiceService } from './services/set-get-service.service';
import { ToastService } from './services/toast.service';
import { LoadingServiceService } from './services/loading-service.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import Swal from 'sweetalert2';
import { SwalServiceService } from './services/swal-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  cek_koneksi = true;

  @ViewChild(IonRouterOutlet,{static:true}) routerOutlet: IonRouterOutlet;
  constructor(private platform: Platform, 
    private location: Location, 
    private swalService: SwalServiceService,
    private network: Network,
    private loadingService: LoadingServiceService,
    private router: Router, 
    private setget: SetGetServiceService, 
    private toastService: ToastService) {

    this.platform.ready().then(()=>{
      this.hardbackbutton();
    });

    //pengecekan koneksi
    this.network.onDisconnect().subscribe(() => {
      this.cek_koneksi = false;

      let a = this.setget.get_koneksi();

      if (a == 1) {
        this.loadingService.tutuploading();
        this.swalService.swal_code_error("Tidak ada internet", "Kembali ke login !");
      }
    });
  
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.cek_koneksi = true;
      }, );
    });
  }
  
  async hardbackbutton(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      let a = this.setget.getData();
      let b = this.setget.get_tab_page();
      
      if (a == 1) {
        this.toastService.Toast_tampil();
      } else {
        if (!this.routerOutlet.canGoBack()) {
          if (b == 1) {
            this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
          }else{
            this.exitapp();
          }
        }else{
          this.location.back();
        }
      }
    });
  }

  async exitapp() {
    this.loadingService.tampil_loading_login();
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
        this.loadingService.tutuploading();
        navigator['app'].exitApp();
      }else {
        this.loadingService.tutuploading();
      }
    });
  }
  
}
