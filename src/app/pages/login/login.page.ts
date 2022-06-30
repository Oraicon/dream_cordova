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
import { SetGetServiceService } from 'src/app/services/set-get-service.service';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  //variable
  myGroup: FormGroup;
  local_nama;
  local_sandi;
  data_api_lupa_sandi_nama;

  //variable tricky
  sedang_mengirim = false;
  data_progres_bar = 0;
  isSubmitted = false;
  cek_koneksi = true;
  showPassword = false;
  passwordToggleIcon = 'eye-outline';

  constructor(
    private formBuilder: FormBuilder,
    private network: Network,
    private toastService: ToastService,
    private router:Router,
    private storage:Storage,
    private setget:SetGetServiceService,
    private loadingService:LoadingServiceService,
    private apiService:ApiServicesService,
    private modalCtrl: ModalController,
    private swal: SwalServiceService) { 

    //menjalankan oninit dan setget koneksi
    this.ngOnInit();
    this.setget.set_koneksi(0);
  }

  //Ionic lifecycle
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

  ionViewWillEnter(){
    this.setget.setButton(0);

    const a = this.setget.getData();
    if (a == 1) {
      this.loadingService.tutup_loading();
    }
  }

  async ionViewDidEnter(){
    this.interval_counter(500);
    this.auto_login();
  }
  
  ionViewDidLeave(){
    this.router.navigate(["/tabs/tab1"], { replaceUrl: true });
  }

  //delay
  interval_counter(timer) {
    return new Promise(resolve => { setTimeout(() => resolve(""), timer);});
  }

  async auto_login(){
    const data_l_nama = await this.storage.get('nama');
    const data_l_sandi = await this.storage.get('sandi');

    if (data_l_nama != null && data_l_sandi != null) {
      this.toastService.Toast("Data akun masih terimpan");
      this.sedang_mengirim = true;
      this.data_progres_bar = 0.1;
      this.loadingService.tampil_loading("Auto login . . . ");
      this.manggil_api_login(data_l_nama, data_l_sandi);
    }
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

  //error form
  get errorControl() {
    return this.myGroup.controls;
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
        this.loadingService.tutup_loading();
        return;
      } else {
        this.data_api_lupa_sandi_nama = data.data.data;

        if (this.cek_koneksi == true) {
          this.sedang_mengirim = true;
          this.data_progres_bar = 0.1;
          this.test_koneksi(this.data_api_lupa_sandi_nama);
        }else{
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
        }
        
      }
    }).catch(err => {
      console.log(err);
    });
    await modal.present().then(() => {
      
    });
  }

  //validasi
  onSubmit(){
    this.isSubmitted = true;

    let data_button = this.setget.getButton();
    console.log(data_button);
    
    if (!this.myGroup.valid) {
      return false;
    } else {

      if (data_button == 0) {
        this.setget.setButton(1);

        this.local_nama = this.myGroup.value.nama_pengguna;
        this.local_sandi = this.myGroup.value.sandi_pengguna;
        if (this.cek_koneksi == true) {
          this.loadingService.tampil_loading("Sedang memproses . . .");
          this.sedang_mengirim = true;
          this.data_progres_bar = 0.1;
          this.manggil_api_login(this.local_nama, this.local_sandi);
        }else{
          this.swal.swal_aksi_gagal("Terjadi kesalahan", "Tidak ada koneksi internet !");
        }
      } else {
        this.toastService.Toast_tampil();
      }

    }
  }

  //test koneksi
  test_koneksi(nama){
    this.data_progres_bar = 0.3;

    this.toastService.Toast("Pengecekan koneksi internet . . .");
    this.apiService.cek_koneksi()
    .then(data => {
      this.manggil_api_lupa_nama(nama);
    })
    .catch(error => {
      console.log(error);

      const a = this.setget.getData();
      if (a == 1) {
        this.loadingService.tutup_loading();
      }
      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
    });
  }

  //memanggil api data karyawan
  manggil_api_login(var_nama, var_sandi){
    this.data_progres_bar = 0.3;
    
    this.interval_counter(250);

    this.apiService.panggil_api_data_karyawan(var_nama, var_sandi)
    .then(res => {

    const data_json = JSON.parse(res.data);
    const data_status = data_json.status;

    if (data_status == 1) {
      this.data_progres_bar = 0.6;
      this.cek_user_rap(var_nama, var_sandi);

    } else if (data_status == 2) {
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();
      
      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Sandi tidak sesuai !");

    } else if (data_status == 3) {
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();

      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Pengguna tidak aktif !");

    } else if (data_status == 0){
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();

      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Pengguna tidak ditemukan !");
    } else {
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();

      this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Code error 1 !");
    }

    })
    .catch(err => {
      console.log(err);
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();
      
      if (err.status == -4 ) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
      } 
      
      if (err.status == -3) {
        this.loadingService.tutup_loading();
        this.loadingService.tampil_loading("");
        Swal.fire({
          title: 'Terjadi kesalahan !',
          text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
          icon: 'error',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Kirim ulang !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingService.tutup_loading();
            this.loadingService.tampil_loading("Mengirim data . . .");
            this.interval_counter(5000);
            this.manggil_api_login(var_nama, var_sandi);
          }
        })
      }
      
      if(err.status != -4 && err.status != -3) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Code error 2 !");
      }
    });
  }
  
  //memanggil api lupa nama
  manggil_api_lupa_nama(nama_baru){
    this.data_progres_bar = 0.6;

    this.interval_counter(250);

    this.apiService.panggil_api_reset_password(nama_baru)
    .then(res => {
      console.log(res);

      const data_json = JSON.parse(res.data);
      const data_status = data_json.status;
  
      //validasi data
      if (data_status == 1) {
        //mendapatkan data
        const data_email = data_json.data[0].email;
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_berhasil("Berhasil !", "Sandi baru sudah dikirim ke email: " + data_email);
  
      } else if (data_status == 0) {
        //jika status != 1
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Sandi gagal dikirim ke email !");
      } 
      else if (data_status == 2) {
        //jika status != 1
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingService.tutup_loading();
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Nama tidak ditemukan !");
      }         
    })
    .catch(err => {
      //error
      console.log(err);
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();
      if (err.status == -4) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
      } 
      
      if (err.status == -3) {
        this.loadingService.tutup_loading();
        this.loadingService.tampil_loading("");
        Swal.fire({
          title: 'Terjadi kesalahan !',
          text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
          icon: 'error',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Kirim ulang !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingService.tutup_loading();
            this.loadingService.tampil_loading("Mengirim data . . .");
            this.interval_counter(5000);
            this.manggil_api_lupa_nama(nama_baru)
          }
        })
      }

      if (err.status !=4 && err.status != 3) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "code error 3 !");
      }
    });
  }

  //pengecekan user jika user terdaftar pada proyek
  async cek_user_rap(var_nama, var_sandi){
    this.data_progres_bar = 0.7;
    this.apiService.dapatkan_data_proyek_rap_master(var_nama)
    .then(data => {

      const data_json = JSON.parse(data.data);
      const status_data = data_json.status;

      if (status_data == 1) {
        this.storage.set('auth', true);
        this.storage.set('nama', var_nama);
        this.storage.set('sandi', var_sandi);

        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        
        this.loadingService.tutup_loading();
  
        this.ionViewDidLeave();
      } else {
        this.data_progres_bar = 0.9;
        this.sedang_mengirim = false;
        this.loadingService.tutup_loading();

        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada proyek untuk anda !");
      }
  
    })
    .catch(error => {
  
      console.log(error);
      this.data_progres_bar = 0.9;
      this.sedang_mengirim = false;
      this.loadingService.tutup_loading();
      
      if (error.status == -4 ) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Tidak ada respon, coba beberapa saat lagi !");
      } 
      
      if (error.status == -3) {
        this.loadingService.tampil_loading("");
        Swal.fire({
          title: 'Terjadi kesalahan !',
          text: "Restart data seluler terlebih dahulu, lalu tekan 'kirim ulang' untuk mengirim kembali !",
          icon: 'error',
          backdrop: false,
          confirmButtonColor: '#3880ff',
          confirmButtonText: 'Kirim ulang !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.loadingService.tutup_loading();
            this.loadingService.tampil_loading("Mengirim data . . .");
            this.interval_counter(5000);
            this.cek_user_rap(var_nama, var_sandi);
          }
        })
      }

      if (error.status !=4 && error.status != 3) {
        this.swal.swal_aksi_gagal("Terjadi kesalahan !", "Code error 71 !");
      }
  
    });

  }
  
}
