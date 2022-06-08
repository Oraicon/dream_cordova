import { Injectable } from '@angular/core';
import { ApiServicesService } from './api-services.service';
import { SetGetServiceService } from './set-get-service.service';


@Injectable({
  providedIn: 'root'
})
export class NotifServiceService {

  constructor(
  private apiService: ApiServicesService,
  private setget: SetGetServiceService
  ) { 
    
  }

  //delay
  interval_counter_notif() {
    return new Promise(resolve => { setTimeout(() => resolve(""), 500);});
  }

  async pengecekan_notif(){

  //   let arr_id_rap = await this.setget.getArrIdRap();
  //   this.data_notif(arr_id_rap);

  // }

  // async data_notif(arr_id_rap){
  //   let arr = arr_id_rap;

  //   for (let index = 0; index < arr.length; index++) {
  //     let element = arr[index];

  //     this.api_data_notif(element, arr_id_rap)
      
  //   }
  // }

  // async api_data_notif(id_rap, arr_id_rap){
  //   this.apiService.get_notif_status(id_rap)
  //   .then(data => {

  //     const data_json = JSON.parse(data.data);
  //     const status_data = data_json.status;

  //     if (status_data == 1) {
  //       // this.data_notif_ = true;
  //       console.log("ada");

  //       this.looping(arr_id_rap);
  //     }else{
  //       // this.data_notif_ = false;
  //       console.log("tidak");
  //     }

  
  //   })
  //   .catch(error => {
  
  //     console.log(error.status);
  //     console.log(error.error); // error message as string
  //     console.log(error.headers);

  //     this.looping(arr_id_rap);

  //   });
  // }

  // async looping(arr_id_rap){
  //   await this.interval_counter_notif();

  //   this.data_notif(arr_id_rap)
  }

}
