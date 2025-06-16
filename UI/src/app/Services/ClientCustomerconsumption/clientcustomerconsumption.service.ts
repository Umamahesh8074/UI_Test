import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { FacilityServiceDataDto, FacilityServicesDto, FaclityService } from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';

import { Customerconsumption, CustomerInvoiceDetails, Page } from 'src/app/Models/Customerconsumption/customerconsumption';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientCustomerconsumptionService {

  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all customerconsumptions to display customerconsumption in front end
  // getAllCustomerconsumption(size: any, index: any): Observable<Page<Customerconsumption>> {
  //   return this.http.get<Page<Customerconsumption>>(
  //     `${environment.baseUrl}${ControllerPaths.CUSTOMERCONSUMPTION}/all/${index}/${size}`
  //   );
  // }

  //adding customerconsumption
  addClientCustomerconsumption(dto: FacilityServicesDto): Observable<any> {
    console.log(dto);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/facilityservices/save/faclityservices`,
      dto
    );
  }



  deleteCustomerconsumption(customerconsumptionId: number): Observable<string> {
    console.log(customerconsumptionId);
    return this.http.delete<string>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FACILITYSERVICES }/${customerconsumptionId}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }

  //update customerconsumption
  updateCustomerconsumption(customerconsumption: any): Observable<any> {
    console.log(customerconsumption);
    console.log(customerconsumption);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FACILITYSERVICES }/update/facilityservices`,
      customerconsumption
    );
  }

    getAllFacilityservice( projectLocation: string,page: any,size: any) {
    console.log(projectLocation,page,size);
    if (projectLocation == undefined||0) projectLocation = '';
    return this.http.get<Page<FacilityServicesDto>>(
      `${environment.facilitymanagementBaseUrl}/facilityservices/getall?projectLocation=${projectLocation}&page=${page}&size=${size}`
    );
  }

  getArea(customerId:any): Observable<string> {
    console.log(customerId);
    return this.http.get<string>(`${environment.facilitymanagementBaseUrl}/${ControllerPaths.AGNACUSTOMERCONSUMPTION }/insert/nextMonth?customerId=${customerId}`);

  }

  getFacilityServiceById(facilityServiceId: number): Observable<FaclityService> {
    return this.http.get<FaclityService>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FACILITYSERVICES}/${facilityServiceId}`
    );
  }

getCustomerConsumptionById(facilityServiceId: any) : Observable<any> {
  return this.http.get<FacilityServiceDataDto>(
    `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FACILITYSERVICES}/facility?facilityServiceId=${facilityServiceId}`
  );
}
}
