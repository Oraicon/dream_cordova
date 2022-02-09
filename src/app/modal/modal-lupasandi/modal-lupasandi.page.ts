import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-lupasandi',
  templateUrl: './modal-lupasandi.page.html',
  styleUrls: ['./modal-lupasandi.page.scss'],
})
export class ModalLupasandiPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  tutup(){
    this.modalCtrl.dismiss();
  }

}
