import { Injectable } from '@angular/core';
import { LoadingServiceService } from './loading-service.service';
import { SetGetServiceService } from './set-get-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SwalServiceService {

  constructor(
    private setget: SetGetServiceService,
    private loading: LoadingServiceService,
    private router: Router
  ) { }

  //info
  swal_info(text1, text2){
    Swal.fire({
      icon: 'warning',
      title: '' + text1,
      text: ''+ text2 ,
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'OK !',
    })
  }

  swal_aksi_berhasil(text1, text2){
    this.loading.tampil_loading(null);
    Swal.fire({
      icon: 'success',
      title: '' + text1,
      text: ''+text2,
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'OK !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.tutup_loading();
      }
    });
  }

  swal_aksi_berhasil_timer2d(text1, text2){
    this.loading.tampil_loading(null);
    Swal.fire({
      icon: 'success',
      title: '' + text1,
      text: ''+text2,
      backdrop: false,
      timer: 1500,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.tutup_loading();
      }else{
        this.loading.tutup_loading();
      }
    });
  }

  swal_aksi_gagal(text1, text2){
    this.loading.tampil_loading(null);
    Swal.fire({
      icon: 'error',
      title: '' + text1,
      text: ''+text2,
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'OK !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.tutup_loading();
      }
    });
  }

  swal_code_error(text1, text2){
    this.loading.tampil_loading(null);
    Swal.fire({
      icon: 'error',
      title: '' + text1,
      text: ''+text2,
      backdrop: false,
      confirmButtonColor: '#3880ff',
      confirmButtonText: 'OK !',
    }).then((result) => {
      if (result.isConfirmed) {
        this.setget.set_swal(0);
        this.loading.tutup_loading();
        this.loading.tutup_loading();
        this.router.navigate(["/login"], { replaceUrl: true });
      }
    });
  }

}
