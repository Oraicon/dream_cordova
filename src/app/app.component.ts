import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SetGetServiceService } from './services/set-get-service.service';
import { ToastService } from './services/toast.service';
import Swal from 'sweetalert2';
import { LoadingServiceService } from './services/loading-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet,{static:true}) routerOutlet: IonRouterOutlet;
  constructor(private platform: Platform, 
    private location: Location, 
    private loadingService: LoadingServiceService,
    private alertCtrl : AlertController, 
    private storage:Storage, 
    private router: Router, 
    private setget: SetGetServiceService, 
    private toastService: ToastService) {

    this.platform.ready().then(()=>{
      this.hardbackbutton();
    });
  }
  
  async hardbackbutton(){
    this.platform.backButton.subscribeWithPriority(10, () => {
      let a = this.setget.getData();
      let b = this.setget.sat();
      
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
          this.storage.set('auth', true);
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
      text: 'Anda akan keluar dari aplikasi anda yakin ?',
      backdrop: false,
      showDenyButton: true,
      confirmButtonColor: '#1B2338',
      confirmButtonText: 'Ya',
      denyButtonText: `Tidak`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.storage.set('nama', null);
        this.storage.set('sandi', null);
        this.loadingService.tutuploading();
        this.router.navigate(["/login"], { replaceUrl: true });
      }else {
        this.loadingService.tutuploading();
      }
    });
  }
  
}
