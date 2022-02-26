import { Component, OnInit } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { ActivatedRoute } from "@angular/router";
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proses',
  templateUrl: './proses.page.html',
  styleUrls: ['./proses.page.scss'],
})
export class ProsesPage implements OnInit {

  //variable
  array_progress = [];
  dataid;
  datajudul;

  constructor(private route: ActivatedRoute, private setget: SetGetServiceService, private http :HTTP) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.array_progress = [
      {
          "id": "1",
          "nama_kegiatan": "Gali Tanam",
          "keterangan": null,
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
    this.tampilkan_data();
  }

  tampilkan_data(){
    // const data_id = this.setget.getData();
    this.route.queryParams.subscribe(params => {
      console.log(params.data_id);
      this.dataid = params.data_id;
      this.datajudul = params.data_judul;


  });
  
    
    // this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressDetail', {'progress_id' : data_id}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
    // .then(data => {

    //   const data_json = JSON.parse(data.data);
    //   console.log(data_json);
      
    //   const data_status = JSON.parse(data_json.status);
    //   const array_master = data_json.data;

    //   if (data_status == 1) {
    //     for (let i = 0; i < array_master.length; i++) {
    //       if (array_master[i].status_pengerjaan == "IN PROGRESS") {
    //         this.array_progress.push(array_master[i]);
    //       }
    //     }
    //     console.log(this.array_progress);
    //   } else {
        
    //   }

    // })
    // .catch(error => {

    //   console.log(error); // error message as string

    // });
  }

  card_klik(get_id){
    console.log(get_id);
  }
}
