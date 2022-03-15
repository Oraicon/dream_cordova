import { Component, OnInit } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ActivatedRoute, Router } from "@angular/router";
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { AlertController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { Storage } from '@ionic/storage';
import { MomentService } from 'src/app/services/moment.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';


@Component({
  selector: 'app-proses',
  templateUrl: './proses.page.html',
  styleUrls: ['./proses.page.scss'],
})
export class ProsesPage implements OnInit {

  data_type_page;
  data_id_header;
  data_id_kegiatan;
  data_judul_kegiatan;
  data_obj_kegiatan = {};
  data_obj_kegiatan_tanggal = {};
  data_arr_progressmilsetone;
  persen_tertinggi;
  tanggal_pm = {};
  tanggal_detail;

  tipe_page = true;
  riwayat_laporan = false;
  riwayat_loading = true;
  //variable
  judul_proses;
  array_progress = [];
  tanggal_baru;
  dataid;
  datajudul;
  datapage;
  data_kegiatan = true;
  data_tanggal = true;

  constructor(private momentService: MomentService,
    private swal: SwalServiceService,
    private apiService: ApiServicesService, 
    private loadingService: LoadingServiceService, 
    private navCtrl: NavController, private route: ActivatedRoute, 
    private setget: SetGetServiceService, 
    private alertController: AlertController,
    private http :HTTP, 
    private strg: Storage) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    // this.data_kegiatan = true;
    // this.array_progress = [];

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

  // tampilkan_data(){
  //   this.loadingService.tampil_loading_login();
  //   // this.route.queryParams.subscribe(params => {
  //   //   console.log(params);
  //   //   this.dataid = params.data_id;
  //   //   this.datajudul = params.data_judul;
  //   //   this.datapage = params.data_page;
  //   // });
  //   let a = this.setget.getTab2();
  //   let b = this.setget.get_Page();

  //   this.dataid = a[0];
  //   this.datajudul = a[1];
  //   this.datapage = b;
  
    
  //   if (this.datapage == 1) {
  //     this.judul_proses = "Dalam Proses"
  //     this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressDetail', {'progress_id' : this.dataid}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  //     .then(data => {
        
  //       const data_json = JSON.parse(data.data);
        
  //       const data_status = JSON.parse(data_json.status);
  //       const array_master = data_json.data;
  
  //       if (data_status == 1) {
  //         this.data_kegiatan = false;
  //         for (let i = 0; i < array_master.length; i++) {
  //           if (array_master[i].status_pengerjaan == "IN PROGRESS") {
  //             this.array_progress.push(array_master[i]);
  //           }
  //         }

  //         if (this.array_progress.length == 0) {
  //           this.data_kegiatan = true;
  //         } else {
  //           this.data_kegiatan = false;
  //         }
          
  //         this.loadingService.tutuploading();
  //       } else {
  //         this.loadingService.tutuploading();
  //       }
  
  //     })
  //     .catch(error => {
  
  //       console.log(error); // error message as string
  
  //     });
  //   } else {
  //     this.judul_proses = "Riwayat Data"
  //     this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressDetail', {'progress_id' : this.dataid}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  //     .then(data => {
        
  //       const data_json = JSON.parse(data.data);
        
  //       const data_status = JSON.parse(data_json.status);
  //       const array_master = data_json.data;
        
  //       let tanggal = [];

  //       if (data_status == 1) {
  //         for (let i = 0; i < array_master.length; i++) {
  //           if (array_master[i].status_pengerjaan == "COMPLETED") {
  //             this.array_progress.push(array_master[i]);
  //             let a = this.array_progress[i].completed_date;
  //             let b = this.momentService.ubah_format_tanggal_waktu(a);
  //             tanggal.push(b);
  //           }
  //         }

  //         this.tanggal_baru = tanggal;
  //         this.data_tanggal = false;

  //         if (this.array_progress.length == 0) {
  //           this.data_kegiatan = true;
  //         } else {
  //           this.data_kegiatan = false;
  //         }



  //         this.loadingService.tutuploading();
  //       } else {
  //         this.data_kegiatan = true;
  //         this.loadingService.tutuploading();
  //       }
  
  //     })
  //     .catch(error => {
  
  //       console.log(error); // error message as string
  
  //     });
  //   }
  // }

  // card_klik(get_id, get_nama_kegiatan){
    
  //   let navigationExtras: NavigationExtras = {
  //     queryParams: {
  //         data_id: get_id,
  //         data_judul: this.datajudul,
  //         data_nama_kegiatan: get_nama_kegiatan,
  //         data_page: this.datapage
  //     }
  //   };

  //   // this.setget.setProses(get_id, this.datajudul, get_nama_kegiatan);
  //   this.setget.set_Page(this.datapage);
  //   this.navCtrl.navigateForward(['/proses_log'], navigationExtras);
  // }

  //baru
  kembali(){
    // this.strg.set('auth', true);
    this.navCtrl.back();
  }

  async tampilkan_data(){
    this.loadingService.tampil_loading_login();
    const a = this.setget.getProses();
    const b = this.setget.get_Page();

    this.data_id_header = a[0];
    this.data_id_kegiatan = a[1];

    this.data_type_page = b;

    if (this.data_type_page == 1) {
      this.tipe_page = false;
    } else {
      this.tipe_page = true; 
    }

    this.apiService.panggil_api_get_progres_detail(this.data_id_header)
    .then(data => {

      console.log(data);

      const data_json = JSON.parse(data.data);
      const arr = data_json.data;

      if (arr.length == 0) {
        
      } else {
        for (let index = 0; index < arr.length; index++) {
          if (arr[index].id == this.data_id_kegiatan) {
            this.data_obj_kegiatan = arr[index];
            this.data_judul_kegiatan = arr[index].nama_kegiatan;
            if (arr[index].completed_date != null) {
              this.tanggal_detail = this.momentService.ubah_format_tanggal(arr[index].completed_date);
            } else {
              this.tanggal_detail = null;
            }
            // this.data_obj_kegiatan_tanggal[0] = arr[index];
          }
        }
        console.log(this.data_obj_kegiatan);
        this.tampilkan_data3();
      }
      
    })
    .catch(error => {
  
      console.log(error);
      this.tutuploading_retry();
  
    });
        
  }

  async tampilkan_data3(){
    
    // console.log(this.data_obj_kegiatan_tanggal[0].completed_date);
    // if (this.data_obj_kegiatan_tanggal[0].completed_date != null) {
    //   this.tanggal_detail = this.momentService.ubah_format_tanggal(this.data_obj_kegiatan_tanggal[0].completed_date);
    // } else {
    //   this.tanggal_detail = null;
    // }

    this.apiService.panggil_api_progres_milestone(this.data_id_kegiatan)
    .then(data => {

      console.log(data);
      
      const data_json = JSON.parse(data.data);
      const data_status = data_json.status;

      if (data_status == 1) {
        const array_milestone = data_json.data;

        if (array_milestone != 0) {
          array_milestone.sort(this.compare);
          array_milestone.reverse();
          this.data_arr_progressmilsetone = array_milestone;
          this.persen_tertinggi = array_milestone[0].progress_pengerjaan;
    
          this.asynctanggal();
        } else {
          this.data_arr_progressmilsetone = null;
        }
      }
      else{
        this.riwayat_loading = false;
        this.loadingService.tutuploading();
      }
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);

      this.tutuploading_retry();
  
    });

  }

  asynctanggal(){
    const arr_ms =  this.data_arr_progressmilsetone
    const arr_ms_length = this.data_arr_progressmilsetone.length;

    for (let index = 0; index < arr_ms_length; index++) {
      let id_ms = arr_ms[index].id;

      let tanggal = this.momentService.ubah_format_tanggal(arr_ms[index].create_date);

      this.tanggal_pm[id_ms] = tanggal;
    }

    this.riwayat_laporan = true;
    this.riwayat_loading = false;
    this.loadingService.tutuploading();
    this.back_with_success();
    console.log(this.tanggal_pm);
  }

  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  compare( a, b ) {
    return a.progress_pengerjaan - b.progress_pengerjaan;
  }

  tutuploading_retry(){
    this.loadingService.tutuploading();
      
    this.alertController.create({
      header: 'Terjadi kesalahan !',
      message: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
      cssClass:'my-custom-class',
      backdropDismiss: false,
      mode: "ios",
      buttons: [{
        text: 'OK !',
        handler: () => {
          this.tampilkan_data();
        }
      }]
    }).then(res => {

      res.present();

    });
  }

  formulir(){
    let a = this.persen_tertinggi;
    
    if(a == undefined){
      a = 0;
    }else{
      a = this.persen_tertinggi;
    }

    console.log("data persen = " + a)

    this.setget.setLog(this.data_id_kegiatan, this.data_judul_kegiatan);
    this.setget.set_persen(a);

    this.navCtrl.navigateForward(['/lapor']);
  }

  async back_with_success(){
    await this.setget.getAlert();
    
    if (this.setget.getAlert() == 1) {
      this.swal.swal_aksi_berhasil("Laporan Terkirim !", "Data laporan telah terkirim !");
      console.log(1);
      this.setget.setAlert(0);
    } else {
      console.log(2);
    }
  }
}
