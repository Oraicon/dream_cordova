import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(public http: HTTP) { }

  panggil_api_awal(api_name, api_sandi){

    return this.http.post('https://dads-demo-1.000webhostapp.com/api/getdatakaryawan', {"username" :api_name, "password" :api_sandi}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }
}
