import { Component, OnInit } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ActivatedRoute, Router } from "@angular/router";
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { Storage } from '@ionic/storage';
import { MomentService } from 'src/app/services/moment.service';

@Component({
  selector: 'app-proses',
  templateUrl: './proses.page.html',
  styleUrls: ['./proses.page.scss'],
})
export class ProsesPage implements OnInit {

  //variable
  judul_proses;
  array_progress = [];
  tanggal_baru;
  dataid;
  datajudul;
  datapage;
  data_kegiatan = true;
  data_tanggal = true;

  constructor(private momentService: MomentService, private loadingService: LoadingServiceService, private navCtrl: NavController, private route: ActivatedRoute, private setget: SetGetServiceService, private http :HTTP, private strg: Storage) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.data_kegiatan = true;
    this.array_progress = [];

    // this.data_statik();
    this.tampilkan_data();
  }

  data_statik(){
        this.data_kegiatan = false;

        this.array_progress = [
          {
              "id": "1",
              "nama_kegiatan": "Gali Tanam",
              "keterangan": "asik",
              "alamat_pengerjaan": "Kec. Manokwari Bar. Kabupaten Manokwari Papua Bar.",
              "lattitude": "-0.8425675",
              "longitude": "134.0020447",
              "status_pengerjaan": "COMPLETED",
              "create_date": "2022-02-24"
          },
          {
              "id": "2",
              "nama_kegiatan": "Cor Pondasi Finishing",
              "keterangan": null,
              "alamat_pengerjaan": "Kec. Manokwari Bar. Kabupaten Manokwari Papua Bar.",
              "lattitude": "-0.8425675",
              "longitude": "134.0020447",
              "status_pengerjaan": "IN PROGRESS",
              "create_date": "2022-02-24"
          },
          {
              "id": "3",
              "nama_kegiatan": "Acc. Tiang",
              "keterangan": null,
              "alamat_pengerjaan": "Kec. Manokwari Bar. Kabupaten Manokwari Papua Bar.",
              "lattitude": "-0.8425675",
              "longitude": "134.0020447",
              "status_pengerjaan": "IN PROGRESS",
              "create_date": "2022-02-24"
          },
          {
              "id": "4",
              "nama_kegiatan": "Label Kabel Tiang",
              "keterangan": null,
              "alamat_pengerjaan": "Kec. Manokwari Bar. Kabupaten Manokwari Papua Bar.",
              "lattitude": "-0.8425675",
              "longitude": "134.0020447",
              "status_pengerjaan": "IN PROGRESS",
              "create_date": "2022-02-24"
          }
      ];
  }

  tampilkan_data(){
    this.loadingService.tampil_loading_login();
    // this.route.queryParams.subscribe(params => {
    //   console.log(params);
    //   this.dataid = params.data_id;
    //   this.datajudul = params.data_judul;
    //   this.datapage = params.data_page;
    // });
    let a = this.setget.getTab2();
    let b = this.setget.get_Page();

    this.dataid = a[0];
    this.datajudul = a[1];
    this.datapage = b;
  
    
    if (this.datapage == 1) {
      this.judul_proses = "Dalam Proses"
      this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressDetail', {'progress_id' : this.dataid}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
      .then(data => {
        
        const data_json = JSON.parse(data.data);
        
        const data_status = JSON.parse(data_json.status);
        const array_master = data_json.data;
  
        if (data_status == 1) {
          this.data_kegiatan = false;
          for (let i = 0; i < array_master.length; i++) {
            if (array_master[i].status_pengerjaan == "IN PROGRESS") {
              this.array_progress.push(array_master[i]);
            }
          }

          if (this.array_progress.length == 0) {
            this.data_kegiatan = true;
          } else {
            this.data_kegiatan = false;
          }
          
          this.loadingService.tutuploading();
        } else {
          this.loadingService.tutuploading();
        }
  
      })
      .catch(error => {
  
        console.log(error); // error message as string
  
      });
    } else {
      this.judul_proses = "Riwayat Data"
      this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressDetail', {'progress_id' : this.dataid}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
      .then(data => {
        
        const data_json = JSON.parse(data.data);
        
        const data_status = JSON.parse(data_json.status);
        const array_master = data_json.data;
        
        let tanggal = [];

        if (data_status == 1) {
          for (let i = 0; i < array_master.length; i++) {
            if (array_master[i].status_pengerjaan == "COMPLETED") {
              this.array_progress.push(array_master[i]);
              let a = this.array_progress[i].completed_date;
              let b = this.momentService.ubah_format_tanggal_waktu(a);
              tanggal.push(b);
            }
          }

          this.tanggal_baru = tanggal;
          this.data_tanggal = false;

          if (this.array_progress.length == 0) {
            this.data_kegiatan = true;
          } else {
            this.data_kegiatan = false;
          }



          this.loadingService.tutuploading();
        } else {
          this.data_kegiatan = true;
          this.loadingService.tutuploading();
        }
  
      })
      .catch(error => {
  
        console.log(error); // error message as string
  
      });
    }
  }

  card_klik(get_id, get_nama_kegiatan){
    
    let navigationExtras: NavigationExtras = {
      queryParams: {
          data_id: get_id,
          data_judul: this.datajudul,
          data_nama_kegiatan: get_nama_kegiatan,
          data_page: this.datapage
      }
    };

    this.setget.setProses(get_id, this.datajudul, get_nama_kegiatan);
    this.setget.set_Page(this.datapage);
    this.navCtrl.navigateForward(['/proses_log'], navigationExtras);
  }

  kembali(){
    this.strg.set('auth', true);
    this.navCtrl.back();
  }
}
