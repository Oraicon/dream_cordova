import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SizecountServiceService {

  private data_count

  constructor() { }

  size(base64){
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
