import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GET_FACEBOOK_CAMPAGINNAME, GET_FACEBOOK_LEADS, LeadPaths } from 'src/app/Apis/Presales/presales';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacebookLeadService {
  constructor(private http: HttpClient) {}

  getFacebookLeads(pageIndex: number, pageSize: number) {
   return this.http.get<any>(
      `${environment.leadBaseUrl}${GET_FACEBOOK_LEADS}?page=${pageIndex}&Size=${pageSize}`
    );
  }

  getFacebookCamapaginNames(campaginName:any,digitalPartner:any) {
    campaginName=campaginName||''
    digitalPartner=digitalPartner||''
    return this.http.get<any>(
       `${environment.leadBaseUrl}${GET_FACEBOOK_CAMPAGINNAME}?campaginName=${campaginName}&digitalPartner=${digitalPartner}`
     );
   }
}
