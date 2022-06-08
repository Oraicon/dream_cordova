import { Injectable } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';

@Injectable({
  providedIn: 'root'
})
export class NativegeocoderServiceService {

  lokasi;

  constructor(
    private nativeGeocoder: NativeGeocoder
  ) { }

  //delay
  interval_counter() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 50);});
  }

  async latlong_converter(lat, long){

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lat, long, options)
    .then(data => {
      let data_mentah = data[0];

      console.log(data_mentah);
      console.log(data);
      this.lokasi = data_mentah.thoroughfare + data_mentah.subLocality + data_mentah.locality + data_mentah.subAdministrativeArea;
      console.log(this.lokasi);
      // return this.lokasi;
    })
    .catch(error => {
  
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
  
    });
  }
}
