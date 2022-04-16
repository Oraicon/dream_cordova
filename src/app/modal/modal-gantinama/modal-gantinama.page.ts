import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingServiceService } from 'src/app/services/loading-service.service';


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
    private formBuilder: FormBuilder,
    private loadingService: LoadingServiceService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      nama_pengguna: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

  onSubmit(){
    this.isSubmitted = true;
    if (!this.myGroup.valid) {
      return false;
    } else {
      this.loadingService.tampil_loading("Mengganti nama . . .");
      this.modalCtrl.dismiss({data: this.myGroup.value.nama_pengguna});
    }
  }


}
