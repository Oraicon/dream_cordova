import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingServiceService } from 'src/app/services/loading-service.service';


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
    private loadingService: LoadingServiceService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      nama_pengguna: ['', [Validators.required]]
    })
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  onSubmit(){
    this.isSubmitted = true;

    if (!this.myGroup.valid) {
      return false;
    } else {
      this.loadingService.tampil_loading("Mengirim data . . .");
      this.modalCtrl.dismiss({data: this.myGroup.value.nama_pengguna});
    }
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
