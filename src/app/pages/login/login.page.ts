import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController,  } from '@ionic/angular';
import { ModalLupasandiPage } from 'src/app/modal/modal-lupasandi/modal-lupasandi.page';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { Storage } from '@ionic/storage-angular';
import { AlertServicesService } from '../../services/alert-services.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private network: Network,
    private router:Router,
    private storage:Storage,
    private loadingService:LoadingServiceService,
    private apiService:ApiServicesService,
    private alertService:AlertServicesService, 
    private modalCtrl: ModalController,
    private swal: SwalServiceService) { 

    this.ngOnInit();
  }

  //variable
  cobalogiktimeout = 0;
  data_api;
  data_api_error;
  local_nama;
  local_sandi;
  myGroup: FormGroup;
  isSubmitted = false;
  cek_koneksi = true;
  showPassword = false;
  passwordToggleIcon = 'eye-outline';

  ngOnInit() {
    //persiapan storage
    this.storage.create();
    
    //pengecekan koneksi
    this.network.onDisconnect().subscribe(() => {
      this.cek_koneksi = false;
    });
  
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.cek_koneksi = true;
      }, 250);
    });

    //validasi
    this.myGroup = this.formBuilder.group({
      nama_pengguna: ['', [Validators.required]],
      sandi_pengguna: ['', [Validators.required]]
    })
  }

  get errorControl() {
    return this.myGroup.controls;
  }

  onSubmit(){
    this.isSubmitted = true;

    this.storage.set('auth', false);
    this.storage.set('nama', null);
    this.storage.set('sandi', null);
    
    if (!this.myGroup.valid) {
      return false;
    } else {
      this.local_nama = this.myGroup.value.nama_pengguna;
      this.local_sandi = this.myGroup.value.sandi_pengguna;

      if (this.cek_koneksi == true) {
        this.manggil_api_login(this.local_nama, this.local_sandi);
      }else{
        this.swal.swal_aksi_gagal("Tidak ada internet !", "Anda tidak terhubung dengan internet !");
      }
    }
  }

  //manggil modal lupa sandi
  async lupasandi(){
    const modal = await this.modalCtrl.create({
      component: ModalLupasandiPage,
      cssClass: 'small-modal',
      backdropDismiss:false
    });
    modal.onDidDismiss().then(data => {
      if (data.data.data == null) {
        
      } else {
        let nama_baru = data.data.data;
        this.manggil_api_lupa_nama(nama_baru);
      }
    }).catch(err => {
      // console.log(err);
    });
    await modal.present();
  }

  //fungsi lihat sandi
  lihat_sandi(){
    this.showPassword = !this.showPassword;

    if (this.passwordToggleIcon == 'eye-outline') {
      this.passwordToggleIcon = 'eye-off-outline';
    } else {
      this.passwordToggleIcon = 'eye-outline';
    }
  }

  //transisi page
  ionViewDidLeave(){
    this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
  }

  //memanggil api lupa nama
  manggil_api_lupa_nama(nama_baru){
    this.loadingService.tampil_loading_login();

        this.apiService.panggil_api_reset_password(nama_baru)
        .then(res => {

          const data_json = JSON.parse(res.data);
          const data_status = data_json.status;

          //validasi data
          if (data_status == 1) {
            //mendapatkan data
            const data_email = data_json.data[0].email;
            this.loadingService.tutuploading();
            this.swal.swal_aksi_berhasil("Sandi terkirim !", "Sandi baru sudah dikirim ke email: "+data_email);

          } else {
            //jika status != 1
            this.loadingService.tutuploading();
            this.swal.swal_aksi_gagal("Sandi tidak terkirim !", "Sandi gagal dikirim ke email");
          }
          
        })
        .catch(err => {
          //error
          this.loadingService.tutuploading();
          this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 3 !");
        });
  }

  //memanggil api data karyawan
  manggil_api_login(var_nama, var_sandi){
    this.loadingService.tampil_loading_login();
    console.log("sebelum");
    

    this.apiService.panggil_api_data_karyawan(var_nama, var_sandi)
    .then(res => {
    console.log("sesudah");

    this.data_api = res;

    })
    .catch(err => {

      this.loadingService.tutuploading();

      this.data_api_error = 1;
      // this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 2 !");
    });
  }

  //mengolah data karyawan
  olah_data_api(var_nama, var_sandi){
    const data_json = JSON.parse(this.data_api.data);
    const data_status = data_json.status;

    if (data_status == 1) {
      this.storage.set('auth', true);
      this.storage.set('nama', var_nama);
      this.storage.set('sandi', var_sandi);
      
      this.loadingService.tutuploading();

      this.ionViewDidLeave();
      
    } else if (data_status == 2) {
      this.loadingService.tutuploading();
      
      this.swal.swal_aksi_gagal("Login gagal !", "Sandi tidak sesuai !");

    } else if (data_status == 3) {
      this.loadingService.tutuploading();

      this.swal.swal_aksi_gagal("Login gagal !", "Pengguna tidak aktif !");

    } else if (data_status == 0){
      this.loadingService.tutuploading();

      this.swal.swal_aksi_gagal("Login gagal !", "Pengguna tidak ditemukan !");
    } else {
      this.loadingService.tutuploading();

      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 1 !");

    }

    this.data_api = null;
  }

  //delay waktu 0,5 detik
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }

  //logika set timeout api data karyawan
  async waktu_login(){
    for (let i = 0; i < 20; i++) {
      await this.interval_counter();

      if (this.data_api != null) {

        this.olah_data_api(this.local_nama, this.local_sandi);
        this.cobalogiktimeout = 0;
        return;

      } else if(this.data_api_error == 1) {

        this.data_api_error = 0;
        this.loadingService.tutuploading();
        this.cobalogiktimeout++;

        if (this.cobalogiktimeout == 2) {
          Swal.fire({
            icon: 'warning',
            title: 'Terjadi kesalahan !',
            text: 'Keluar dari aplikasi !',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Iya !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.cobalogiktimeout = 0;
              this.storage.set('nama', null);
              this.storage.set('sandi', null);
              this.loadingService.tutuploading();
              navigator['app'].exitApp();
            }
          });

          return;

        } else {

          this.loadingService.tampil_loading_login();
          Swal.fire({
            icon: 'warning',
            title: 'Terjadi kesalahan !',
            text: 'Data tidak terbaca, silahkan tekan OK untuk mencoba lagi !',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Iya !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutuploading();
              this.data_api = null;
              this.waktu_login();
              this.manggil_api_login(this.local_nama, this.local_sandi);
            }
          });

          return;

        }
      }else {

        console.log("sedang coba lagi");
        if (i == 19) {
          Swal.fire({
            icon: 'warning',
            title: 'Terjadi kesalahan !',
            text: 'Memuat data melebihi batas waktu, coba lagi !',
            backdrop: false,
            confirmButtonColor: '#3880ff',
            confirmButtonText: 'Iya !',
          }).then((result) => {
            if (result.isConfirmed) {
              this.loadingService.tutuploading();
              this.data_api = null;
              this.waktu_login();
              this.manggil_api_login(this.local_nama, this.local_sandi);
            }
          });
          return;
        }
      }
    }
  }

}
