import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage-angular';

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
    private storage: Storage,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      sandi_lama: ['', [Validators.required, Validators.minLength(8)]],
      sandi_baru: ['', [Validators.required, Validators.minLength(8)]],
      sandi_baru2: ['', [Validators.required, Validators.minLength(8)]]
    })

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
    if (!this.myGroup.valid) {
      return false;
    } else {
      console.log(this.myGroup.value.sandi_lama);
      const password_lama = this.myGroup.value.sandi_lama;
      const password_baru = this.myGroup.value.sandi_baru;
      const password_baru_2 = this.myGroup.value.sandi_baru2; 

      if (this.pasword_ls != password_lama) {
        console.log("password lama tidak sama")
      } else {
        if (password_baru_2 != password_baru) {
          console.log("password baru tidak sama")
        } else {
          this.modalCtrl.dismiss({data: password_baru});
        }
      }
    }
  }

}
