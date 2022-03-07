import { Component, OnInit } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ActivatedRoute, Router } from "@angular/router";
import { NavigationExtras } from '@angular/router';
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
  datapage;
  array_detail;
  data_laporan = true;
  footer_ = false;
  new_arr = [];
  persen_tertinggi;

  constructor(private navCtrl: NavController, private route: ActivatedRoute, private http: HTTP, private loadingService: LoadingServiceService) { 
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.data_laporan = true;

    // this.data_statik();
    this.tampilkan_data();
  }

  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  data_statik(){
    this.data_laporan = false;
    this.array_detail =[
      {
          "id": "3",
          "evidence_img": "/DATA/img/image_3.jpg",
          "remark": "baru penggalian awal",
          "progress_pengerjaan": "10",
          "create_date": "2022-02-24"
      },
      {
        "id": "4",
        "evidence_img": "/DATA/img/image_3.jpg",
        "remark": "baru penggalian awal",
        "progress_pengerjaan": "30",
        "create_date": "2022-02-24"
      },
      {
        "id": "5",
        "evidence_img": "/DATA/img/image_3.jpg",
        "remark": "baru penggalian awal",
        "progress_pengerjaan": "20",
        "create_date": "2022-02-24"
      }
    ];

    this.array_detail.sort(this.compare);
    this.array_detail.reverse();
    this.persen_tertinggi = this.array_detail[0].progress_pengerjaan;
    
  }

  compare( a, b ) {
    return a.progress_pengerjaan - b.progress_pengerjaan;
  }

  tampilkan_data(){
    this.array_detail = [];
    this.loadingService.tampil_loading_login();

    this.route.queryParams.subscribe(params => {
      this.dataid = params.data_id;
      this.datanamakegiatan = params.data_nama_kegiatan;
      this.datapage = params.data_page;
    });

    if (this.datapage == 1) {
      this.footer_ = false;
    } else {
      this.footer_ = true;
    }

    this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressMilestone', {'progress_detail_id' : this.dataid}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
    .then(data => {


      const data_json = JSON.parse(data.data);
      
      const data_status = JSON.parse(data_json.status);
      
      if (data_status == 1) {
        this.array_detail= data_json.data
        this.array_detail.sort(this.compare);
        this.array_detail.reverse();
        this.persen_tertinggi = this.array_detail[0].progress_pengerjaan;
        
        if (this.array_detail.length == 0) {
          this.data_laporan = true;
        } else {
          this.data_laporan = false;
        }
        
        this.loadingService.tutuploading();
      } else {
        this.data_laporan = true;
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

  laporan(){
    let a = this.persen_tertinggi;

    if (a != null) {
      a = this.persen_tertinggi;
    } else {
      a = 0;
    }


    let navigationExtras: NavigationExtras = {
      queryParams: {
          data_id: this.dataid,
          data_nama_kegiatan: this.datanamakegiatan,
          data_persen: a
      }
    };

    this.navCtrl.navigateForward(['/lapor'], navigationExtras);
  }

}
