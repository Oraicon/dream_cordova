import { Component, OnInit } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { LoadingServiceService } from 'src/app/services/loading-service.service';


@Component({
  selector: 'app-proses-log',
  templateUrl: './proses-log.page.html',
  styleUrls: ['./proses-log.page.scss'],
})
export class ProsesLogPage implements OnInit {

  dataid;
  datanamakegiatan;
  array_detail;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private http: HTTP, private loadingService: LoadingServiceService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.tampilkan_data();
  }

  tampilkan_data(){
    this.loadingService.tampil_loading_login();

    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.dataid = params.data_id;
      this.datanamakegiatan = params.data_nama_kegiatan;
    });

    this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressMilestone', {'progress_detail_id' : this.dataid}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
    .then(data => {

      const data_json = JSON.parse(data.data);
      console.log(data_json);
      
      const data_status = JSON.parse(data_json.status);
      const array_master = data_json.data;

      if (data_status == 1) {
        this.array_detail = array_master;
        this.loadingService.tutuploading();
      } else {
        console.log("kosong");
        this.loadingService.tutuploading();
      }


    })
    .catch(error => {

      console.log(error); // error message as string

    });
  }

  kembali(){
    this.navCtrl.back();
  }

}
