import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetGetServiceService {
  
  private _data;
  private alert_data;
  private tab2_id;
  private tab2_judul;
  private proses_id_header;
  private proses_id_detail;
  private log_id;
  private log_nama_kegiatan;
  private lapor_id;
  private lapor_nama_kegiatan;
  private _page;
  private _persen;
  private _tab3;

  private _id_kegiatan;
  private _nama_proyek_header;
  
  constructor() { }

  getData() {
    return this._data;
  }

  setData(data) {
    this._data = data;
  }
  
  getDatakegiatan() {
    let a = [];
    return a = [this._id_kegiatan, this._nama_proyek_header];
  }

  setDatakegiatan(data, data2) {
    this._id_kegiatan = data;
    this._nama_proyek_header = data2;
  }

  getDatatab3() {
    return this._tab3;
  }

  setDatatab3(data) {
    this._tab3 = data;
  }

  setAlert(data){
    this.alert_data = data;
  }

  getAlert(){
    return this.alert_data;
  }

  setTab2(id, judul){
    this.tab2_id = id;
    this.tab2_judul = judul;
  }

  getTab2(){
    let a = [];
    return a = [this.tab2_id, this.tab2_judul];
  }

  setProses(id_header, id_detail){
    this.proses_id_header = id_header;
    this.proses_id_detail = id_detail;
  }

  getProses(){
    let a = [];
    return a = [this.proses_id_header, this.proses_id_detail];
  }

  setLog(id, nama_kegiatan){
    this.log_id = id;
    this.log_nama_kegiatan = nama_kegiatan;
  }

  getLog(){
    let a = [];
    return a = [this.log_id, this.log_nama_kegiatan];
  }

  setLapor(id, nama_kegiatan){
    this.lapor_id = id;
    this.lapor_nama_kegiatan = nama_kegiatan;
  }

  getLapor(){
    let a = [];
    return a = [this.lapor_id, this.lapor_nama_kegiatan];
  }

  set_Page(nomor){
    this._page = nomor;
  }

  get_Page(){
    return this._page;
  }

  set_persen(persen){
    this._persen = persen;
  }

  get_persen(){
    return this._persen;
  }

}
