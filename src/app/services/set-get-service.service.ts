import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetGetServiceService {
  
  private _data;
  
  constructor() { }

  getData() {
    return this._data;
  }

  setData(data) {
    this._data = data;
  }
}
