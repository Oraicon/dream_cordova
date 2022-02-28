import { Component, OnInit } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from '@ionic/angular';
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
  data_laporan = true;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private http: HTTP, private loadingService: LoadingServiceService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // this.array_detail =[
    //   {
    //       "id": "3",
    //       "evidence_img": "/DATA/img/image_3.jpg",
    //       "remark": "baru penggalian awal",
    //       "progress_pengerjaan": "10%",
    //       "create_date": "2022-02-24"
    //   }
    // ];
    this.tampilkan_data();
  }

  tampilkan_data(){
    this.loadingService.tampil_loading_login();

    this.route.queryParams.subscribe(params => {
      this.dataid = params.data_id;
      this.datanamakegiatan = params.data_nama_kegiatan;
    });

    this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressMilestone', {'progress_detail_id' : this.dataid}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
    .then(data => {

      console.log(data);

      const data_json = JSON.parse(data.data);
      
      const data_status = JSON.parse(data_json.status);
      
      if (data_status == 1) {
        this.data_laporan = false;
        this.array_detail =  data_json.data;
        this.loadingService.tutuploading();
      } else {
      //   console.log("kosong");
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
