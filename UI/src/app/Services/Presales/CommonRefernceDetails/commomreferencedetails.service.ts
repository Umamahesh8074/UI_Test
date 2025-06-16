import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonRefernceDetailsPath,
  GET_REF_DETAILS_BY_REF_TYPE,
} from 'src/app/Apis/CommonRefernceDetailsApis/CommonRefernceDetails';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommomReferenceDetailsService {
  constructor(private http: HttpClient) {}

  fetchCommonRefernceDetailsId(refernceKey: any): Observable<any> {
    //alert(refernceKey)
    return this.http.get<number>(
      `${environment.userBaseUrl}${CommonRefernceDetailsPath.GETREFERENCEDETAILSID}` +
        '?refTypeName=' +
        'Team_Type' +
        '&refKey=' +
        refernceKey
    );
  }
  getById(id: any): Observable<any> {
    //alert(refernceKey)
    return this.http.get<any>(
      `${environment.userBaseUrl}${CommonRefernceDetailsPath.GETREFERENCEDETAILSID}/${id}`
    );
  }

  fetchLeadStatusListByRole(
    typeName: string,
    moduleNames: string[]
  ): Observable<any> {
    return this.http.get<any[]>(
      `${environment.userBaseUrl}${CommonRefernceDetailsPath.GET_LEAD_STATUS_DETAILS_BY_REF_TYPE}?typeName=${typeName}&moduleNames=${moduleNames}`
    );
  }

  fetchTypeName(typeName: string): Observable<any> {
    //alert(refernceKey)
    return this.http.get<any>(
      `${environment.userBaseUrl}${GET_REF_DETAILS_BY_REF_TYPE}/${typeName}`
    );
  }
}
