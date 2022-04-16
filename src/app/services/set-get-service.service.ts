import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetGetServiceService {
  
  //variable mengirimkan data
  private id_kegiatan;
  private nama_proyek_header;
  private proses_id_header;
  private proses_id_detail;
  private data_tab_to_page;
  private log_id;
  private log_nama_kegiatan;
  //variable fungsi tricky
  private alert_data;
  private data_koneksi;
  private _data;
  private _page;
  private _persen;
  private _swal;
  
  constructor() { }

  // setget mengirim data
  //setter getter fungsi untuk mengirimkan data, data id kegiatan dan nama proyek ke aktiviti proyek, yang berada di tab.tabs1.page.ts ke kegiatan.page.ts
  setDatakegiatan(data, data2) {
    this.id_kegiatan = data;
    this.nama_proyek_header = data2;
  }

  getDatakegiatan() {
    let a = [];
    return a = [this.id_kegiatan, this.nama_proyek_header];
  }

  //setter getter fungsi untuk mengirimkan data, data id header dan data id detail ke aktiviti detail kegiatan, yang berada di kegiatan.page.ts ke proses.page.ts
  setProses(id_header, id_detail){
    this.proses_id_header = id_header;
    this.proses_id_detail = id_detail;
  }

  getProses(){
    let a = [];
    return a = [this.proses_id_header, this.proses_id_detail];
  }

  //setter getter fungsi untuk mengirimkan data, data id kegiatan dan judul kegiatan ke aktiviti formulir lapor, yang berada di proses.page.ts ke laporan.page.ts
  setLog(id, nama_kegiatan){
    this.log_id = id;
    this.log_nama_kegiatan = nama_kegiatan;
  }

  getLog(){
    let a = [];
    return a = [this.log_id, this.log_nama_kegiatan];
  }

  //setter getter logika fungsi page untuk menentukan aktivi detail kegiatan apakah dia masih proses atau sudah komplit, yang ada di kegiatan.page.ts
  set_Page(nomor){
    this._page = nomor;
  }

  get_Page(){
    return this._page;
  }

  //setter getter logika fungsi persen untuk mengirim data persern tertinggi, dari aktiviti detail kegiatan ke aktiviti formulir laporan, yang ada di proses.page.ts
  set_persen(persen){
    this._persen = persen;
  }

  get_persen(){
    return this._persen;
  }

  //fungsi tricky
  //setter getter untuk mengatur logika tab perpindahan dari aktiviti tabs ke aktiviti proyek, untuk mengtrigger ionic lifcycle ionviewwillenter, yang berada di app.component.ts
  set_tab_page(data) {
    this.data_tab_to_page = data;
  }

  get_tab_page() {
    return this.data_tab_to_page;
  }

  //setter getter untuk fungsi alert jika mengirim laporan sukses maka akan diarahkan kembali ke aktiviti detail page dan mentrigger fungsi swal sukses, yang ada di laporan.page.ts ke proses.page.ts
  setAlert(data){
    this.alert_data = data;
  }

  getAlert(){
    return this.alert_data;
  }

  //setter getter logika fungsi untuk pengecekan koneksi, yang ada di app.component.ts
  set_koneksi(data){
    this.data_koneksi = data;
  }

  get_koneksi(){
    return this.data_koneksi;
  }

  //setter getter logika fungsi supaya swal tidak ke trigger lebih dari 1 kali, yang ada di tab1.page.ts, dan proses.page.ts
  set_swal(data){
    this._swal = data;
  }

  get_swal(){
    return this._swal;
  }

  //setter getter loading untuk mengatur logika jika loading muncul maka tidak bisa menggunakan hard back button.
  getData() {
    return this._data;
  }

  setData(data) {
    this._data = data;
  }


  //data tab.tabs2.page.ts
  // setLapor(id, nama_kegiatan){
  //   this.lapor_id = id;
  //   this.lapor_nama_kegiatan = nama_kegiatan;
  // }

  // getLapor(){
  //   let a = [];
  //   return a = [this.lapor_id, this.lapor_nama_kegiatan];
  // }

  // setTab2(id, judul){
  //   this.tab2_id = id;
  //   this.tab2_judul = judul;
  // }

  // getTab2(){
  //   let a = [];
  //   return a = [this.tab2_id, this.tab2_judul];
  // }
}
