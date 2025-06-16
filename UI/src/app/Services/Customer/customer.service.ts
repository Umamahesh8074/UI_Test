import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  ControllerPaths,
  CRMControllerPaths,
} from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { ApplicationInfoDto } from 'src/app/Models/Crm/ApplicantInfo';

import { Customer, CustomerDto, Page } from 'src/app/Models/Customer/customer';
import { CustomerUnitPaymentDetailsDto } from 'src/app/Models/Customer/StagesAndPayments';
import { CustomerIssueDetailsDto } from 'src/app/Models/Issues/issues';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all customers to display customer in front end
  // getAllCustomer(size: any, index: any): Observable<Page<Customer>> {
  //   return this.http.get<Page<Customer>>(
  //     `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/all/${index}/${size}`
  //   );
  // }

  //adding customer
  addCustomer(customer: any): Observable<any> {
    console.log(customer);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/save`,
      customer
    );
  }

  deleteCustomer(customerId: number): Observable<string> {
    console.log(customerId);
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/${customerId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update customer
  updateCustomer(customer: any): Observable<any> {
    console.log(customer);
    console.log(customer);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/update`,
      customer
    );
  }

  //getting filter data based on customer name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/customer/customers?customerName=Users&page=0&size=10
  getAllCustomer(customerName: string, page: any, size: any) {
    console.log(customerName, page, size);
    return this.http.get<Page<Customer>>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/customers?customerName=${customerName}&page=${page}&size=${size}`
    );
  }

  getAllCustomersWithPagination(
    page: number,
    size: number
  ): Observable<Page<CustomerDto[]>> {
    return this.http.get<Page<CustomerDto[]>>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/getall/${page}/${size}`
    );
  }
  getprojectTYpe(projectId: number): Observable<string> {
    return this.http.get<string>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/projecttype/${projectId}`
    );
  }

  getUserInfoById(userId: number): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/${userId}`
    );
  }
  getUserIssueByPhoneNo(
    phoneNumber: string
  ): Observable<CustomerIssueDetailsDto[]> {
    return this.http.get<CustomerIssueDetailsDto[]>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/getcustomers/${phoneNumber}`
    );
  }
  getUserDetailsByUserId(userId: number): Observable<CustomerDto[]> {
    return this.http.get<CustomerDto[]>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/userId/${userId}`
    );
  }

  getUserDetailsByCustomerId(): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CUSTOMER}/fetchall`
    );
  }

  getBookingDetailsByCustomerId(
    userId: number
  ): Observable<ApplicationInfoDto[]> {
    return this.http.get<ApplicationInfoDto[]>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/getallapplicantinfos?userId=${userId}`
    );
  }
  getUnitsBookedByCustomerId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/getunitsofcustomer?userId=${userId}`
    );
  }
  getStagesAndPayments(unitId: number): Observable<CustomerUnitPaymentDetailsDto> {
    return this.http.get<CustomerUnitPaymentDetailsDto>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/getunitstagesandpayments?unitId=${unitId}`
    );
  }
  getInitiatedStageAmount(bookingId: number): Observable<number> {
    return this.http.get<number>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/getinitiatedstageamount?bookingId=${bookingId}`
    );
  }
}
