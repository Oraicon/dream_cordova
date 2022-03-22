import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController,  } from '@ionic/angular';
import { ModalLupasandiPage } from 'src/app/modal/modal-lupasandi/modal-lupasandi.page';
import { ApiServicesService } from 'src/app/services/api-services.service';
import { Storage } from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { LoadingServiceService } from 'src/app/services/loading-service.service';
import { SwalServiceService } from 'src/app/services/swal-service.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  //variable
  myGroup: FormGroup;
  isSubmitted = false;
  cek_koneksi = true;
  showPassword = false;
  passwordToggleIcon = 'eye-outline';
  local_nama;
  local_sandi;
  data_api_lupa_sandi_nama;

  constructor(
    private formBuilder: FormBuilder,
    private network: Network,
    private router:Router,
    private storage:Storage,
    private loadingService:LoadingServiceService,
    private apiService:ApiServicesService,
    private modalCtrl: ModalController,
    private swal: SwalServiceService) { 

    this.ngOnInit();
  }

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
      }, );
    });

    //validasi
    this.myGroup = this.formBuilder.group({
      nama_pengguna: ['', [Validators.required]],
      sandi_pengguna: ['', [Validators.required]]
    })
  }

  //error form
  get errorControl() {
    return this.myGroup.controls;
  }

  //button on click / enter
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
        return;
      } else {
        this.data_api_lupa_sandi_nama = data.data.data;
        this.manggil_api_lupa_nama(this.data_api_lupa_sandi_nama);
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
          console.log(res);
          const data_json = JSON.parse(res.data);
          const data_status = data_json.status;
      
          //validasi data
          if (data_status == 1) {
            //mendapatkan data
            const data_email = data_json.data[0].email;
            this.loadingService.tutuploading();
            this.swal.swal_aksi_berhasil("Sandi terkirim !", "Sandi baru sudah dikirim ke email: "+data_email);
      
          } else if (data_status == 0) {
            //jika status != 1
            this.loadingService.tutuploading();
            this.swal.swal_aksi_gagal("Sandi tidak terkirim !", "Sandi gagal dikirim ke email");
          } 
          else if (data_status == 2) {
            //jika status != 1
            this.loadingService.tutuploading();
            this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Nama tidak ditemukan !");
          }         
        })
        .catch(err => {
          //error
          this.loadingService.tutuploading();
          if (err.status == -4) {
            this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Server tidak merespon !");
          } else {
            this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 3 !");
          }
        });
  }

  //memanggil api data karyawan
  manggil_api_login(var_nama, var_sandi){
    this.loadingService.tampil_loading_login();
    

    this.apiService.panggil_api_data_karyawan(var_nama, var_sandi)
    .then(res => {

    const data_json = JSON.parse(res.data);
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

    })
    .catch(err => {
      
      this.loadingService.tutuploading();
      // console.log(err);
      
      if (err.status == -4 ) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Server tidak merespon !");
      } else {
      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 2 !");
      }
    });
  }
}
