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

  kirim_api_progres(api_progres, api_remark, api_progres_pengerjaan){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/insertProgressMilestone', {"progress_detail_id" :api_progres, "url_image" :null, "remark" :api_remark, "progress_pengerjaan" :api_progres_pengerjaan}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  kirim_api_progres_img(api_id, api_img){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/insertProgressEvidence', {"progress_milestone_id" :api_id, "url_image" :api_img}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  cek_koneksi(){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/cekAPI', {}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  dapatkan_data_proyek_rap_master(username){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/dapatkan_data_proyek', {"username" :username}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  dapatkan_data_proyek_rap_detail($id_master_rap){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/dapatkan_detail_kegiatan', {"id_master_rap": $id_master_rap }, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  dapatkan_data_detail_kegiatan($id_detail_kegiatan){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/dapatkan_kegiatan', {"id_detail_rap": $id_detail_kegiatan }, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  kirim_data_laporan(id_rap_detail, item, volume, lattitude, longitude, keterangan){
      // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
      this.http.setRequestTimeout(30.0);
      return this.http.post('https://dream-beta.technosolusitama.in/api/kirim_data_harian_detail', {"id_rap_detail": id_rap_detail, "item": item, "volume": volume, "lattitude": lattitude, "longitude": longitude, "keterangan": keterangan}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  menyimpan_path_file(id_progress_harian_detail, url_image){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/menyimpan_path_file', {"id_progress_harian_detail": id_progress_harian_detail, "url_image": url_image}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  menampilkan_data_harian(id_rap_detail){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/menampilkan_data_harian_detail', {"id_rap_detail": id_rap_detail}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

  menampilkan_data_file_sesuai_id(id_progres_harian_detail){
    // this.http.useBasicAuth('dream_1.0', 'dream_1.0');
    this.http.setRequestTimeout(30.0);
    return this.http.post('https://dream-beta.technosolusitama.in/api/menampilkan_data_file', {"id_progres_harian_detail": id_progres_harian_detail}, {'Accept': 'application/json', 'Content-Type':'application/x-www-form-urlencoded'})
  }

}
