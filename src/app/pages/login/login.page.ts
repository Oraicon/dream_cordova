import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalLupasandiPage } from 'src/app/modal/modal-lupasandi/modal-lupasandi.page';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { Storage } from '@ionic/storage-angular';
import { AlertServicesService } from '../../services/alert-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
  private router:Router,
  private storage:Storage,
  private apiService:ApiServicesService,
  private alertService:AlertServicesService, 
  private modalCtrl: ModalController) { 
    this.ngOnInit();
  }

  //variable frontend
  data_nama_f;
  data_sandi_f;
  showPassword = false;
  passwordToggleIcon = 'eye-outline';

  ngOnInit() {
    this.storage.create();
    this.storage.set('auth', false);
  }

  login(){
    let var_nama = "";
    let var_sandi = "";

    if (this.data_nama_f == null) {
      this.alertService.alert_nama_kosong();
    } else {
      var_nama = this.data_nama_f;
      if (this.data_sandi_f == null) {
        this.alertService.alert_sandi_kosong();
      } else {
        var_sandi = this.data_sandi_f;
        
        this.apiService.panggil_api_awal(var_nama, var_sandi)
        .then(res => {
          const data_json = JSON.parse(res.data);
          const data_status = data_json.status;
    
          if (data_status == 1) {
            this.storage.set('auth', true);
            this.storage.set('nama', var_nama);
            this.storage.set('sandi', var_sandi);

            this.router.navigateByUrl("/tabs/tab1");
            
          } else if (data_status == 2) {
            this.alertService.alert_gagal_login2();

          } else if (data_status == 3) {
            this.alertService.alert_gagal_login3();

          } else {
            this.alertService.alert_error_login1();

          }
    
    
    
        })
        .catch(err => {
          const err_json = JSON.parse(err.error);
          const err_error = err_json.status;

          if (err_error == 0) {
            this.alertService.alert_gagal_login0();
            
          }else {
            this.alertService.alert_error_login2();
          }

        });
      }
    }


  }

  async lupasandi(){
    const modal = await this.modalCtrl.create({
      component: ModalLupasandiPage,
      cssClass: 'small-modal'
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

}
