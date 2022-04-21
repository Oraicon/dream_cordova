import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class GuardServiceService {

  constructor(private router: Router, private strg: Storage) { 
    this.init();
  }

  init() {
    this.strg.create();
  }

  async canActivate(){
    
    let authInfo;
    const dataauth = await this.strg.get('auth');
    // const dataauth = true;
    
    if(dataauth == true){
      authInfo= {
        authenticated: true
      };
    }else{
      authInfo= {
        authenticated: false
      };
    }

    if (!authInfo.authenticated) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
}
