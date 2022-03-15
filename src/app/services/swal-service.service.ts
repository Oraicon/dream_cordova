import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SwalServiceService {

  constructor() { }

  //info
  swal_info(text1){
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'code error'+ text1 +' !',
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
