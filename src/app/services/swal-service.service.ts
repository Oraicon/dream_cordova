import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { LoadingServiceService } from './loading-service.service';


@Injectable({
  providedIn: 'root'
})
export class SwalServiceService {

  constructor(
    private loading: LoadingServiceService
  ) { }

  //info
  swal_info(text1, text2){
    Swal.fire({
      icon: 'warning',
      title: '' + text1,
      text: ''+ text2 ,
      backdrop: false,
    })
  }

  swal_input_tidak_diisi(text1, text2){
    Swal.fire({
      icon: 'warning',
      title: '' + text1 + ' kosong !',
      text: 'Harap mengisi '+ text2 +' !',
      backdrop: false,
    })
  }

  swal_aksi_berhasil(text1, text2){
    // this.loading.tutuploading();
    Swal.fire({
      icon: 'success',
      title: '' + text1,
      text: ''+text2,
      backdrop: false,
    })
  }

  swal_aksi_gagal(text1, text2){
    Swal.fire({
      icon: 'error',
      title: '' + text1 + 'gagal !',
      text: ''+text2,
      backdrop: false,
    })
  }

}
