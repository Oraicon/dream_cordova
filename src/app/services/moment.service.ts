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
}
