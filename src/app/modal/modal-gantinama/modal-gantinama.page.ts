import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';


@Component({
  selector: 'app-modal-gantinama',
  templateUrl: './modal-gantinama.page.html',
  styleUrls: ['./modal-gantinama.page.scss'],
})
export class ModalGantinamaPage implements OnInit {

  pasword_ls;

  myGroup: FormGroup;
  isSubmitted = false;

  constructor( 
    private swal: SwalServiceService,
    private setget: SetGetServiceService,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private loadingService: LoadingServiceService,
    private toastService: ToastService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      nama_pengguna: ['', [Validators.required, Validators.minLength(8)]],
      sandi_lama: ['', [Validators.required, Validators.minLength(8)]]

    })
  }

  ionViewWillEnter(){
    this.setget.set_tab_page(3);
    this.setget.setButton(0);
    this.get_data_lokal();
  }

  ionViewWillLeave(){
    this.setget.set_tab_page(0);
    this.setget.setButton(0);
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

  onSubmit(){
    const password_lama = this.myGroup.value.sandi_lama;
    this.isSubmitted = true;
    let data_button = this.setget.getButton();

    if (!this.myGroup.valid) {
      return false;
    } else {
      if (this.pasword_ls != password_lama) {
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Sandi lama anda tidak sama !");
      } else {
        if (data_button == 0) {
          this.setget.setButton(1);
          this.loadingService.tampil_loading("Mengganti nama . . .");
          this.modalCtrl.dismiss({data: this.myGroup.value.nama_pengguna});
        } else {
          this.toastService.Toast_tampil();
        }
      }
    }
  }

}
