import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  constructor() { }

  ubah_format_tanggal(string_date){
    const ubah_format = moment(string_date).format('DD-MM-YYYY');

    return ubah_format;
  }

  ubah_format_tanggal_waktu(string_date){
    const ubah_format = moment(string_date).format('hh:mm:ss DD-MM-YYYY');

    return ubah_format;
  }
}
