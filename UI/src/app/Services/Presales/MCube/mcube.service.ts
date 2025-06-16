import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MCUBE } from 'src/app/Apis/Presales/presales';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class McubeService {
  constructor(private http: HttpClient) {}

  makeOutboundCall(
    phoneNumber: string,
    userPhoneNumber: string,
    refid?: string
  ): Observable<any> {
    return this.http.post<any>(`${environment.leadBaseUrl}${MCUBE}`, {
      phoneNumber,
      userPhoneNumber,
      refid,
    });
  }
}
