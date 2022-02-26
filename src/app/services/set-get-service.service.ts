import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetGetServiceService {

  constructor() { }

private _data: SetGetServiceService;

  getData(): SetGetServiceService {
    return this._data;
  }

  setData(data:SetGetServiceService) {
    this._data = data;
  }
}
