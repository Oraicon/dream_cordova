import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastService } from 'src/app/services/toast.service';
import { Storage } from '@ionic/storage-angular';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';



@Component({
  selector: 'app-modal-gantisandi',
  templateUrl: './modal-gantisandi.page.html',
  styleUrls: ['./modal-gantisandi.page.scss'],
})
export class ModalGantisandiPage implements OnInit {

  showPassword1 = false;
  showPassword2 = false;
  showPassword3 = false;
  passwordToggleIcon1 = 'eye-outline';
  passwordToggleIcon2 = 'eye-outline';
  passwordToggleIcon3 = 'eye-outline';
  pasword_ls;

  myGroup: FormGroup;
  isSubmitted = false;

  constructor(
    private swal: SwalServiceService,
    private setget: SetGetServiceService,
    private loadingService: LoadingServiceService,
    private storage: Storage,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      sandi_lama: ['', [Validators.required, Validators.minLength(8)]],
      sandi_baru: ['', [Validators.required, Validators.minLength(8)]],
      sandi_baru2: ['', [Validators.required, Validators.minLength(8)]]
    })

    this.setget.setButton(0);
    this.get_data_lokal();
  }

  async get_data_lokal(){
    this.pasword_ls = await this.storage.get('sandi');
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

  lihat_sandi1(){
    this.showPassword1 = !this.showPassword1;

    if (this.passwordToggleIcon1 == 'eye-outline') {
      this.passwordToggleIcon1 = 'eye-off-outline';
    } else {
      this.passwordToggleIcon1 = 'eye-outline';
    }
  }

  lihat_sandi2(){
    this.showPassword2 = !this.showPassword2;

    if (this.passwordToggleIcon2 == 'eye-outline') {
      this.passwordToggleIcon2 = 'eye-off-outline';
    } else {
      this.passwordToggleIcon2 = 'eye-outline';
    }
  }

  lihat_sandi3(){
    this.showPassword3 = !this.showPassword3;

    if (this.passwordToggleIcon3 == 'eye-outline') {
      this.passwordToggleIcon3 = 'eye-off-outline';
    } else {
      this.passwordToggleIcon3 = 'eye-outline';
    }
  }

  onSubmit(){
    this.isSubmitted = true;

    let data_button = this.setget.getButton();

    if (!this.myGroup.valid) {
      return false;
    } else {
      const password_lama = this.myGroup.value.sandi_lama;
      const password_baru = this.myGroup.value.sandi_baru;
      const password_baru_2 = this.myGroup.value.sandi_baru2; 
      if (data_button == 0) {
        this.setget.setButton(1);
        if (this.pasword_ls != password_lama) {
          this.loadingService.tutup_loading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Sandi lama anda tidak sama !");
        } else {
          if (password_baru_2 != password_baru) {
            this.loadingService.tutup_loading();
            this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Sandi baru anda tidak sama !");
          } else {
            this.loadingService.tampil_loading("Mengganti sandi . . .");
            this.modalCtrl.dismiss({data: password_baru});
          }
        }
      } else {
        this.toastService.Toast_tampil();
      }


    }
  }

}
