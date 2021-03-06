import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetGetServiceService {
  
  //variable mengirimkan data
  private id_kegiatan;
  private nama_proyek_header;
  private proses_id_detail;

  private lapor_item;
  private lapor_volume;
  private lapor_keterangan;
  private lapor_file;

  private data_tab_to_page;

  private log_id;
  private log_nama_kegiatan;
  private log_satuan;

  private list_data_img;
  private alamat;

  private dokumen_judul;
  private dokumen_id;

  private detail_dokumen_id;
  private detail_dokumen_uraian;
  private detail_dokumen_pic;
  private detail_dokumen_keterangan;
  private detail_dokumen_path;

  //variable fungsi tricky
  private alert_data;
  private data_koneksi;
  private _press_button;
  private _data;
  private _page;
  private _persen;
  private _swal;
  private _hasil_akhir = [];
  private data_list_gambar;
  private data_list_nama;
  private total_meter;
  private progress_meter;
  private notifikasi_id_rap = [];
  
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
  setProses(id_detail){
    this.proses_id_detail = id_detail;
  }

  getProses(){
    return this.proses_id_detail;
  }

  //setter getter fungsi untuk mengirimkan data, data id kegiatan dan judul kegiatan ke aktiviti formulir lapor, yang berada di proses.page.ts ke laporan.page.ts
  setLog(id, nama_kegiatan, satuan){
    this.log_id = id;
    this.log_nama_kegiatan = nama_kegiatan;
    this.log_satuan = satuan;
  }

  getLog(){
    let a = [];
    return a = [this.log_id, this.log_nama_kegiatan, this.log_satuan];
  }

  //setter getter fungsi untuk mengirimkan data, data id rap dan judul rap ke aktiviti dokumen, yang berada di tab1.page.ts ke dokumen.page.ts
  setDokumen(id, judul_rap){
    this.dokumen_id = id;
    this.dokumen_judul = judul_rap;
  }

  getDokumen(){
    let a = [];
    return a = [this.dokumen_id, this.dokumen_judul];
  }

  //setter getter fungsi untuk mengirimkan data, data id rap dan judul rap ke aktiviti dokumen, yang berada di tab1.page.ts ke dokumen.page.ts
  setDokumen_detail(id, uraian, pic, keterangan, path){
    this.detail_dokumen_id = id;
    this.detail_dokumen_uraian = uraian; 
    this.detail_dokumen_pic = pic;
    this.detail_dokumen_keterangan = keterangan; 
    this.detail_dokumen_path = path;
  }

  getDokumen_detail(){
    let a = [];
    return a = [this.detail_dokumen_id, this.detail_dokumen_uraian, this.detail_dokumen_pic, this.detail_dokumen_keterangan, this.detail_dokumen_path];
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

  //setter getter data keterangan untuk membaca fungsi apakah keterangan, persen pengerjaan, dan atau gambar ada atau tidak, yang ada di lapor.page.ts ke app.component.ts
  set_lapor(data1, data2, data3, data4){
    this.lapor_item = data1;
    this.lapor_volume = data2;
    this.lapor_keterangan = data3;
    this.lapor_file = data4;
  }

  get_lapor(){
    let a = [];
    return a = [this.lapor_item, this.lapor_volume, this.lapor_keterangan, this.lapor_file];
  }

  //setter getter untuk data list_path_image dari proses.page.ts ke list.page.ts 
  set_list_path(data1, data2){
    this.list_data_img = data1;
    this.alamat = data2;
  }

  get_list_path(){
    let a = [];
    return a = [this.list_data_img, this.alamat];
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
  setData(data) {
    this._data = data;
  }

  getData() {
    return this._data;
  }

  //setter getter data press button 0 boleh klik, 1 tidak boleh.
  setButton(data) {
    this._press_button = data;
  }
  
  getButton() {
    return this._press_button;
  }

  //setter getter data dari list ke detail kegiatan, yang ada di list.page.ts dan modal-isikonten.page.ts
  setdatalist(data1, data2){
    this.data_list_gambar = data1;
    this.data_list_nama = data2;
  }

  getdatalist(){
    let a = [];
    return a = [this.data_list_gambar, this.data_list_nama];
  }

  //setter getter data arr untuk menampilkan array hasil akhir, yang ada di lapor.page.ts ke modal hasilakhir
  set_hasil_akhir(data){
    this._hasil_akhir = data;
  }

  get_hasil_akhir(){
    return this._hasil_akhir;
  }

  setMeter(data1, data2){
    this.total_meter = data1;
    this.progress_meter = data2;
  }

  getMeter(){
    let a = [];
    return a = [this.total_meter, this.progress_meter];
  }

  setArrIdRap(data1){
    this.notifikasi_id_rap = data1;
  }

  getArrIdRap(){
    return this.notifikasi_id_rap;
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
