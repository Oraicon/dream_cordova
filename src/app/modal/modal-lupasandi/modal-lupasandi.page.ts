import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SetGetServiceService } from 'src/app/services/set-get-service.service';


@Component({
  selector: 'app-modal-lupasandi',
  templateUrl: './modal-lupasandi.page.html',
  styleUrls: ['./modal-lupasandi.page.scss'],
})
export class ModalLupasandiPage implements OnInit {

  //variable frontend
  myGroup: FormGroup;
  isSubmitted = false;

  constructor(
    private setget: SetGetServiceService,
    private loadingService: LoadingServiceService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController) {
    }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      nama_pengguna: ['', [Validators.required]]
    })
    console.log("kepanggil");
    this.setget.setButton(0);
  }

  ionViewWillEnter(){
    this.setget.set_tab_page(3);
  }

  ionViewWillLeave(){
    this.setget.set_tab_page(0);
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  onSubmit(){
    this.isSubmitted = true;

    let data_button = this.setget.getButton();

    if (!this.myGroup.valid) {
      return false;
    } else {
      if (data_button == 0) {
        this.setget.setButton(1);
        this.loadingService.tampil_loading("Mengirim data . . .");
        this.modalCtrl.dismiss({data: this.myGroup.value.nama_pengguna});
      } else {
        this.toastService.Toast_tampil();
      }

    }
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
