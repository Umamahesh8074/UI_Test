import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor( private http: HttpClient) {}
  addAddress(address: any): Observable<any> {
    console.log(address);
    return this.http.post<any>(
      `${environment.userBaseUrl}${ControllerPaths.ADDRESS}/save`,
      address
    );
  }
}
