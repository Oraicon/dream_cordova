import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(public http: HTTP) { }

  panggil_api_data_karyawan(api_name, api_sandi){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    return this.http.post('https://dads-demo-1.000webhostapp.com/api/getdatakaryawan', {"username" :api_name, "password" :api_sandi}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_progres_header(api_name){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    return this.http.post('https://dads-demo-1.000webhostapp.com/api/getProgressHeader', {"username" :api_name}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_upload_teknisi(api_keterangan, api_file_img){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    return this.http.post('https://dads-demo-1.000webhostapp.com/api/uploadProgressTeknisi', {"keterangan" :api_keterangan, "url_image" :api_file_img}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_update_data_karyawan(api_type_akun, api_flagusername, api_new_username, api_new_password, api_image){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    return this.http.post('https://dads-demo-1.000webhostapp.com/api/updateDataKaryawan', {"type" :api_type_akun, "flag_username" :api_flagusername, "new_username" :api_new_username, "new_password" :api_new_password, "image" :api_image}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_reset_password(api_name){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    return this.http.post('https://dads-demo-1.000webhostapp.com/api/forgotpassword', {"username" :api_name}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }
}
