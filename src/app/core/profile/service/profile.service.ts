import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    public http: HttpClient, 
    public authService: AuthService
) {}

  getProfile() {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = URL_SERVICIOS + "/profile";
    return this.http.get(URL, { headers: headers });
  }
  updateProfile(userId: string, data: any) {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = `${URL_SERVICIOS}/users/profile/${userId}`;
    return this.http.put(URL, data, { headers: headers });
  }
}
