import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  ClientInvoiceReport,
  MonthlyInvoiceReportDto,
  MonthlyInvoiceReportDtoList,
} from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';

import { Page } from 'src/app/Models/CommanModel/Page';

import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class clientinvoicereportService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all clientinvoicereports to display clientinvoicereport in front end
  // getAllclientinvoicereport(size: any, index: any): Observable<Page<clientinvoicereport>> {
  //   return this.http.get<Page<clientinvoicereport>>(
  //     `${environment.baseUrl}${ControllerPaths.CLIENTINVOICEREPORT}/all/${index}/${size}`
  //   );
  // }

  //adding clientinvoicereport
  addclientinvoicereport(clientinvoicereport: any): Observable<any> {
    console.log(clientinvoicereport);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORT}/save`,
      clientinvoicereport
    );
  }

  deleteclientinvoicereport(clientinvoicereportId: number): Observable<string> {
    console.log(clientinvoicereportId);
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENTINVOICEREPORT}/${clientinvoicereportId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update clientinvoicereport
  updateclientinvoicereport(clientinvoicereport: any): Observable<any> {
    console.log(clientinvoicereport);
    console.log(clientinvoicereport);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORTDATA}/update`,
      clientinvoicereport
    );
  }

  //getting filter data based on clientinvoicereport name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/clientinvoicereport/clientinvoicereports?clientinvoicereportName=Users&page=0&size=10
  getAllclientinvoicereportView(
    clientName: string,
    serviceName: string,
    invoiceDate: string,
    clientId: number,
    page: any,
    size: any
  ): Observable<any> {
    console.log(clientName, serviceName, invoiceDate, clientId, page, size);
    return this.http.get<Page<MonthlyInvoiceReportDtoList>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORTDATA}/fetch/clientinvoicedeatils?clientName=${clientName}&serviceName=${serviceName}&invoiceDate=${invoiceDate}&clientId=${clientId}&page=${page}&size=${size}`
    );
  }
  getAllclientinvoicereport(
    projectLocation: string,
    serviceName: string,
    month: string,
    year: string,
    page: number,
    size: number
  ) {
    if (projectLocation == undefined || 0) projectLocation = '';
    if (serviceName == undefined || 0) serviceName = '';
    if (month == undefined || 0) month = '';
    if (year == undefined || 0) year = '';

    console.log(
      'Request parameters:',
      projectLocation,
      serviceName,
      month,
      year,
      page,
      size
    );
    return this.http.get<Page<MonthlyInvoiceReportDtoList>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORTDATA}/fetch/clientinvoicedeatils?projectLocation=${projectLocation}&serviceName=${serviceName}&month=${month}&year=${year}&page=${page}&size=${size}`
    );
  }

  getMonthlyGrandTotal(month: string, year: string): Observable<number> {
    const url = `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORTDATA}/monthly-grand-total?month=${month}&year=${year}`;

    return this.http.get<number>(url); // Assuming your backend returns a number
  }
  getAllclientinvoicereportByClientId(
    clientId: number,
    page: any,
    size: any
  ): Observable<any> {
    console.log(clientId, page, size);
    return this.http.get<Page<MonthlyInvoiceReportDtoList>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORT}/getall?clientId=${clientId}&page=${page}&size=${size}`
    );
  }

  // generateExcel(monthlyInvoiceReport:any): Observable<Blob> {

  //   // Include responseType: 'blob' in the options object
  //   return this.http.get(`${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORT}/generateInvoiceReport`, { responseType: 'blob' }
  //   );
  // }

  generateExcel(
    monthlyInvoiceReportData: MonthlyInvoiceReportDtoList[]
  ): Observable<Blob> {
    console.log('Sending data to generate Excel:', monthlyInvoiceReportData);

    const url = `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORT}/generateInvoiceReport`;

    return this.http
      .post<Blob>(url, monthlyInvoiceReportData, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'blob' as 'json', // Casting for TypeScript
      })
      .pipe(
        catchError((error) => {
          console.error('Error generating Excel file:', error);
          return throwError(
            () => new Error('Failed to generate Excel file. Please try again.')
          );
        })
      );
  }

  getclientinvoiceById(
    monthlyClientInvoiceReportId: number
  ): Observable<MonthlyInvoiceReportDto> {
    console.log(monthlyClientInvoiceReportId);
    return this.http.get<MonthlyInvoiceReportDto>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORT}/${monthlyClientInvoiceReportId}`
    );
  }

  getClientInvoiceByObject(invoice: any): Observable<any> {
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORT}/getByObject`,
      invoice
    );
  }

  getClientInvoiceById(id: any) {
    return this.http.get<ClientInvoiceReport[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORTDATA}/${id}`
    );
  }
  generateMonthlyInvoiceReport(month: any, year: any): Observable<Blob> {
    const url = `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORT}/monthlyinvoicesave?month=${month}&year=${year}`;

    return this.http
      .get<Blob>(url, {
        headers: new HttpHeaders().set('Accept', 'application/vnd.ms-excel'),
        responseType: 'blob' as 'json', // Correctly handle binary data
      })
      .pipe(
        catchError((error) => {
          console.error('Error generating invoice report:', error);
          // Show error Swal message
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Failed to generate invoice report',
            text: 'Please try again later.',
            showConfirmButton: true,
          });
          return throwError(
            () =>
              new Error('Failed to generate invoice report. Please try again.')
          );
        })
      );
  }

  deleteFacility(clientinvoicereportId: number): Observable<string> {
    console.log(clientinvoicereportId);
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}/${ControllerPaths.CLIENTINVOICEREPORTDATA}/${clientinvoicereportId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }
}
