import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';


import { Customerconsumption, CustomerconsumptionDto, CustomerconsumptionWithoutAreaDto, CustomerInvoiceDetails, Page } from 'src/app/Models/Customerconsumption/customerconsumption';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerconsumptionService {

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
  addCustomerconsumption(customerconsumption: any): Observable<any> {
    console.log(customerconsumption);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CUSTOMERCONSUMPTION}/save`,
      customerconsumption
    );
  }


  deleteCustomerconsumption(customerconsumptionId: number): Observable<string> {
    console.log(customerconsumptionId);
    return this.http.delete<string>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CUSTOMERCONSUMPTION}/${customerconsumptionId}`
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
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CUSTOMERCONSUMPTION}/update`,
      customerconsumption
    );
  }

  //getting filter data based on customerconsumption name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/customerconsumption/customerconsumptions?customerconsumptionName=Users&page=0&size=10
  getAllCustomerconsumption( customerconsumptionName: string,page: any,size: any) {
    console.log(customerconsumptionName,page,size);
    return this.http.get<Page<Customerconsumption>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CUSTOMERCONSUMPTION}/getall/${page}/${size}`
    );
  }

  getArea(customerId:any): Observable<string> {
    console.log(customerId);
    return this.http.get<string>(`${environment.facilitymanagementBaseUrl}/${ControllerPaths.CUSTOMERCONSUMPTION}/insert/nextMonth?customerId=${customerId}`);


  }

  getElectricityConsumption(customerId: number): Observable< CustomerconsumptionWithoutAreaDto[]> {
    return this.http.get< CustomerconsumptionWithoutAreaDto[]>(`${environment.facilitymanagementBaseUrl}/${ControllerPaths.CUSTOMERCONSUMPTION}/${customerId}/electricity-consumption`);
  }

  getCustomerconsumptionId(consumptionId: any) {
    return this.http.get<CustomerconsumptionWithoutAreaDto[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CUSTOMERCONSUMPTION}/${consumptionId}`);

  }

}
