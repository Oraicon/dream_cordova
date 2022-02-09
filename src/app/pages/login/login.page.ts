import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalLupasandiPage } from 'src/app/modal/modal-lupasandi/modal-lupasandi.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router:Router, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  login(){
    this.router.navigateByUrl("/tabs/tab1");
  }

  async lupasandi(){
    const modal = await this.modalCtrl.create({
      component: ModalLupasandiPage,
      cssClass: 'small-modal'
    });
    await modal.present();
  }

}
