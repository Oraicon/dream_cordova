import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordServiceService {

  constructor() { }

  disable_password(sandi_pengguna){
    const get_password = sandi_pengguna;
    const length_password = get_password.length;
    let censored_password = "";

    for (let i = 0; i < length_password; i++) {
      censored_password += "*";
    }

    return censored_password;
  }
}
