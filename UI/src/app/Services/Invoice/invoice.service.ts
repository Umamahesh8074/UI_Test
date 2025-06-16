import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';

import { InvoiceReportDto, Page } from 'src/app/Models/Invoice/invoice';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all invoices to display invoice in front end
  // getAllInvoice(size: any, index: any): Observable<Page<Invoice>> {
  //   return this.http.get<Page<Invoice>>(
  //     `${environment.baseUrl}${ControllerPaths.INVOICE}/all/${index}/${size}`
  //   );
  // }

  //adding invoice
  addInvoice(invoice: any): Observable<any> {
    console.log(invoice);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.INVOICE}/save`,
      invoice
    );
  }


  deleteInvoice(invoiceId: number): Observable<string> {
    console.log(invoiceId);
    return this.http.delete<string>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.INVOICE}/${invoiceId}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }

  //update invoice
  updateInvoice(invoice: any): Observable<any> {
    console.log(invoice);
    console.log(invoice);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.INVOICE}/update`,
      invoice
    );
  }

  //getting filter data based on invoice name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/invoice/invoices?invoiceName=Users&page=0&size=10
  getAllInvoice(invoiceName: string, page: any, size: any) {
    console.log(invoiceName, page, size);
    return this.http.get<Page<InvoiceReportDto>>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.INVOICE}/getall/${page}/${size}`
    );
  }

  getInvoiceById(id: any) {

    return this.http.get<InvoiceReportDto[]>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.INVOICE}/${id}`
    );
  }


  generateExcel(reportId: number): Observable<Blob> {

    // Include responseType: 'blob' in the options object
    return this.http.get(`${environment.facilitymanagementBaseUrl}/${ControllerPaths.INVOICEREPORT}/generateInvoice?reportId=${reportId}`, { responseType: 'blob' }
    );
  }

  getAllCustomerInvoiceDetails(consumption: string,customerName:string, month:number, year:number) {
    console.log(consumption);

    return this.http.get<any>(
      `${environment.facilitymanagementBaseUrl}/${ControllerPaths.INVOICE}/fetch/invoicedeatils?consumption=${consumption}&customerName=${customerName}&month=${month}&year=${year}`
    );

  }

 
}

