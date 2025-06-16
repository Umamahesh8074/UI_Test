import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';
import {
  GET_VENDOR_BY_ID,
  GETALL_VENDORS_SPEC,
  GETALL_VENDORS_WITHOUT_PAGE,
  SAVE_VENDOR,
  UPDATE_VENDOR,
} from 'src/app/Apis/WorkOrderApis/Vendor';
import { Vendor, VendorDto } from 'src/app/Models/WorkOrder/VendorData';

@Injectable({
  providedIn: 'root',
})
export class vendorService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  //adding vendor
  addvendor(formData: any): Observable<Vendor> {
    console.log(formData);
    return this.http.post<Vendor>(
      `${environment.procurementBaseUrl}${SAVE_VENDOR}`,
      formData
    );
  }

  inActivateVendor(vendorId: number): Observable<string> {
    console.log(vendorId);
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${GET_VENDOR_BY_ID}/${vendorId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update vendor
  updatevendor(formData: any): Observable<Vendor> {
    console.log(formData);
    return this.http.put<Vendor>(
      `${environment.procurementBaseUrl}${UPDATE_VENDOR}`,
      formData
    );
  }

  getAllvendors(
    page: number,
    size: number,
    vendorName: string,
    vendorCode: string,
    vendorType: string,
    phoneNumber: string,
    email: string,
    companyName: any,
    projectId: number
  ) {
    return this.http.get<Page<VendorDto>>(
      `${environment.procurementBaseUrl}${GETALL_VENDORS_SPEC}?name=${vendorName}&page=${page}&size=${size}&vendorCode=${vendorCode}&vendorType=${vendorType}&phoneNumber=${phoneNumber}&companyName=${companyName}&projectId=${projectId}`
    );
  }

  getAllvendorsById(id: number) {
    console.log(id);
    return this.http.get<Vendor>(
      `${environment.procurementBaseUrl}${GET_VENDOR_BY_ID}/fetchbyid?vendorId=${id}`
    );
  }

  getVendorCodesWithOutPage(
    vendorCode: string,
    vendorName: string
  ): Observable<Vendor[]> {
    vendorName = vendorName === undefined ? '' : vendorName;
    vendorCode = vendorCode === undefined ? '' : vendorCode;

    return this.http.get<Vendor[]>(
      `${environment.procurementBaseUrl}${GETALL_VENDORS_WITHOUT_PAGE}?vendorCode=${vendorCode}&vendorName=${vendorName}`
    );
  }
}
