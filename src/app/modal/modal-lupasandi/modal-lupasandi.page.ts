import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertServicesService } from 'src/app/services/alert-services.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-modal-lupasandi',
  templateUrl: './modal-lupasandi.page.html',
  styleUrls: ['./modal-lupasandi.page.scss'],
})
export class ModalLupasandiPage implements OnInit {

  //variable frontend
  data_nama_f;

  constructor(private alertService: AlertServicesService, private loadingService: LoadingServiceService, private modalCtrl: ModalController, private apiService: ApiServicesService) { }

  ngOnInit() {
  }

  kirim(){
    const var_nama = this.data_nama_f;
    if (var_nama == null || var_nama == "") {
      this.alertService.alert_nama_kosong();
    }else{
      this.loadingService.tampil_loading_login();
      this.modalCtrl.dismiss();
      this.apiService.panggil_api_reset_password(var_nama)
      .then(res => {
        // console.log(res); // data received by server

        const data_json = JSON.parse(res.data);
        const data_status = data_json.status;        
        
        if (data_status == 1) {
          const data_email = data_json.data[0].email;
          this.loadingService.tutuploading();
          this.alertService.alert_berhasil_lupa_password(data_email);
          
        } else if (data_status == 0){
          this.loadingService.tutuploading();
          this.alertService.alert_gagal_lupa_password();

        } else {
          this.loadingService.tutuploading();
          this.alertService.alert_error_lupapassword();
          
        }
        
      })
      .catch(err => {    
        console.log(err); // error message as string
        
        this.loadingService.tutuploading();
        this.alertService.alert_lupa_password_tidak_ditemukan();
      });
    }

  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
