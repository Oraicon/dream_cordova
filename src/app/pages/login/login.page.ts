import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { ModalLupasandiPage } from 'src/app/modal/modal-lupasandi/modal-lupasandi.page';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { Storage } from '@ionic/storage-angular';
import { AlertServicesService } from '../../services/alert-services.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { ToastService } from 'src/app/services/toast.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private toastService: ToastService,
    private setget: SetGetServiceService,
    private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    private network: Network,
    private router:Router,
    private storage:Storage,
    private loadingService:LoadingServiceService,
    private apiService:ApiServicesService,
    private alertService:AlertServicesService, 
    private modalCtrl: ModalController,
    private swal: SwalServiceService) { 

    this.ngOnInit();
  }

  //variable
  cek_koneksi = true;
  data_nama_f;
  data_sandi_f;
  showPassword = false;
  passwordToggleIcon = 'eye-outline';

  ngOnInit() {
    this.storage.create();
    this.storage.set('auth', false);
    this.storage.set('nama', null);
    this.storage.set('sandi', null);
    
    this.network.onDisconnect().subscribe(() => {
      this.cek_koneksi = false;
    });
  
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.cek_koneksi = true;
      }, 250);
    });

    // this.cek_koneksi = true;

  }

  login(){

    //cek koneksi
    if (this.cek_koneksi == true) {

      //persiapan variable
      let var_nama = "";
      let var_sandi = "";
  
      //logika login
      if (this.data_nama_f == null) {
        this.swal.swal_input_tidak_diisi("Nama", "nama pengguna");
      } else {
        var_nama = this.data_nama_f;
        if (this.data_sandi_f == null) {
          this.swal.swal_input_tidak_diisi("Sandi", "sandi pengguna");

        } else {
          var_sandi = this.data_sandi_f;
          
          this.loadingService.tampil_loading_login();

          this.apiService.panggil_api_data_karyawan(var_nama, var_sandi)
          .then(res => {
            const data_json = JSON.parse(res.data);
            const data_status = data_json.status;
      
            if (data_status == 1) {
              this.storage.set('auth', true);
              this.storage.set('nama', var_nama);
              this.storage.set('sandi', var_sandi);
              
              this.loadingService.tutuploading();
              this.data_nama_f = null;
              this.data_sandi_f = null;

              this.ionViewDidLeave();
              
            } else if (data_status == 2) {
              this.loadingService.tutuploading();
              
              this.alertService.alert_gagal_login2();
              this.data_nama_f = null;
              this.data_sandi_f = null;

            } else if (data_status == 3) {
              this.loadingService.tutuploading();

              this.alertService.alert_gagal_login3();
              this.data_nama_f = null;
              this.data_sandi_f = null;

            } else if (data_status == 0){
              this.loadingService.tutuploading();

              this.alertService.alert_gagal_login0();
              this.data_nama_f = null;
              this.data_sandi_f = null;
            } else {
              this.loadingService.tutuploading();

              this.alertService.alert_error_login1();
              this.data_nama_f = null;
              this.data_sandi_f = null;
            }
      
      
      
          })
          .catch(err => {

            this.loadingService.tutuploading();

            this.alertService.alert_error_login2();
            this.data_nama_f = null;
            this.data_sandi_f = null;

          });
        }
      }
      
    } else if (this.cek_koneksi == false){
      
      this.alertService.alert_tidak_ada_koneksi();

    } else {
      
      this.alertService.alert_error_login3();
    
    }
  }

  async lupasandi(){
    const modal = await this.modalCtrl.create({
      component: ModalLupasandiPage,
      cssClass: 'small-modal',
      backdropDismiss:false
    });
    await modal.present();
  }

  lihat_sandi(){
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye-outline') {
      this.passwordToggleIcon = 'eye-off-outline';
    } else {
      this.passwordToggleIcon = 'eye-outline';
    }
  }

  ionViewDidLeave(){
    this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
  }

  // async hardbutton(){
  //   this.platform.backButton.subscribeWithPriority(10, () => {
  //     let a = this.setget.getData();
      
  //     if (a == 1) {
  //       this.toastService.Toast_tampil();
  //     } else {
  //       if (!this.routerOutlet.canGoBack()) {
  //         this.exitapp();
  //       }else{
  //         this.routerOutlet.canGoBack()
  //       }
  //     }
  //   });
  // }

  // async exitapp() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Keluar dari aplikasi ?',
  //     message: 'Anda akan keluar dari aplikasi anda yakin ?',
  //     cssClass:'my-custom-class',
  //     mode: "ios",
  //     buttons: [
  //       {
  //         text: 'Tidak',
  //       }, {
  //         text: 'Ok',
  //         handler: () => {
  //           this.storage.set('nama', null);
  //           this.storage.set('sandi', null);
  //           navigator['app'].exitApp();
  //         }
  //       }
  //     ]
  //   });
  
  //   await alert.present();
  // }

}
