import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(public http: HTTP) { }

  panggil_api_data_karyawan(api_name, api_sandi){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/getdatakaryawan', {"username" :api_name, "password" :api_sandi}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_reset_password(api_name){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    return this.http.post('https://dream-beta.technosolusitama.in/api/forgotpassword', {"username" :api_name}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_progres_header(api_name){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/getProgressHeader', {"username" :api_name}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_get_progres_detail(api_id){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/getProgressDetail', {'progress_id' : api_id}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_progres_milestone(api_id){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/getProgressMilestone', {'progress_detail_id' : api_id}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  panggil_api_update_data_karyawan(api_type_akun, api_flagusername, api_new_username, api_new_password, api_image){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    return this.http.post('https://dream-beta.technosolusitama.in/api/updateDataKaryawan', {"type" :api_type_akun, "flag_username" :api_flagusername, "new_username" :api_new_username, "new_password" :api_new_password, "image" :api_image}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  kirim_api_progres(api_progres, api_image, api_remark, api_progres_pengerjaan){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/insertProgressMilestone', {"progress_detail_id" :api_progres, "url_image" :api_image, "remark" :api_remark, "progress_pengerjaan" :api_progres_pengerjaan}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  cek_koneksi(){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/cekAPI', {}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }
}
