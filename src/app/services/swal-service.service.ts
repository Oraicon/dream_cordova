import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class SwalServiceService {

  constructor() { }

  //sukses
  swal_sukses(text1){
    Swal.fire({
      icon: 'success',
      title: 'Sukses !',
      text: 'Perubahan '+text1+' berhasil !',
      backdrop: false,
      allowOutsideClick: false
    })
  }

  //gagal
  swal_gagal(text1){
    Swal.fire({
      icon: 'error',
      title: 'Gagal !',
      text: 'Perubahan '+text1+' gagal !',
      backdrop: false,
      allowOutsideClick: false
    })
  }

  //info
  swal_info(text1){
    Swal.fire({
      icon: 'warning',
      title: 'Terjadi kesalahan !',
      text: 'code error'+ text1 +' !',
      backdrop: false,
      allowOutsideClick: false
    })
  }

}
