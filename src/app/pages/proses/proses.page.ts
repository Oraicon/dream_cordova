import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import { NavController } from '@ionic/angular';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { MomentService } from 'src/app/services/moment.service';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import Swal from 'sweetalert2';


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
    private setget: SetGetServiceService,) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
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

  //baru
  kembali(){
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
          }
        }
        this.tampilkan_data3();
      }
      
    })
    .catch(error => {
  
      console.log(error);
      this.tutuploading_retry();
  
    });
  }

  async tampilkan_data3(){
    
    this.apiService.panggil_api_progres_milestone(this.data_id_kegiatan)
    .then(data => {

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
  
      console.log(error);

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
  }

  errorHandler(event) {
    event.target.src = "assets/bi.png";
  }

  compare( a, b ) {
    return a.progress_pengerjaan - b.progress_pengerjaan;
  }

  tutuploading_retry(){
    this.loadingService.tutuploading();
    this.loadingService.tampil_loading_login();
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'OK !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.tutuploading();
        this.tampilkan_data();
      }
    });
  }

  formulir(){
    let a = this.persen_tertinggi;
    
    if(a == undefined){
      a = 0;
    }else{
      a = this.persen_tertinggi;
    }

    this.setget.setLog(this.data_id_kegiatan, this.data_judul_kegiatan);
    this.setget.set_persen(a);

    this.navCtrl.navigateForward(['/lapor']);
  }

  async back_with_success(){
    await this.setget.getAlert();
    
    if (this.setget.getAlert() == 1) {
      this.swal.swal_aksi_berhasil("Laporan Terkirim !", "Data laporan telah terkirim !");
      this.setget.setAlert(0);
    } else {
    }
  }
}
