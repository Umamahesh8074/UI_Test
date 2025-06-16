import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, tap } from 'rxjs';
import {
  DELETE_BOOKING_CHARGES,
  GET_ALL_BOOKING_CHARGES,
  SAVE_BOOKING_CHARGES,
  UPDATE_BOOKING_CHARGES,
} from 'src/app/Apis/CrmApis/ProjectChargeApis';
import { IBookingCharges, IbookingChargesDto } from 'src/app/Models/Crm/BookingCharges';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingChargesService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  addBookingCharges(bookingCharge: IBookingCharges[]): Observable<string> {
    console.log(bookingCharge);
    return this.http.post<string>(
      `${environment.projectBaseUrl}${SAVE_BOOKING_CHARGES}`,
      bookingCharge
    );
  }

  updateBookingCharges(bookingCharge: IBookingCharges[]): Observable<string> {
    console.log(bookingCharge);
    return this.http.put<string>(
      `${environment.projectBaseUrl}${UPDATE_BOOKING_CHARGES}`,
      bookingCharge
    );
  }

  getAllBookingCharges(
    status: string,
    page: number,
    size: number,
    firstApplicantName?: string,
    chargeName? : string,
    projectName? : string,
    unitName? : string
  ): Observable<Page<IbookingChargesDto>> {
    console.log(page, size);
    
    let url = `${environment.projectBaseUrl}${GET_ALL_BOOKING_CHARGES}?status=${status}&page=${page}&size=${size}&firstApplicantName=${firstApplicantName}&chargeName=${chargeName}&projectName=${projectName}&unitName=${unitName}`;
    // url += bookingId !== undefined ? `&bookingId=${bookingId}` : `&bookingId=`;
  
    return this.http.get<Page<IbookingChargesDto>>(url);
  }

  getBookingCharges(
    status: string,
    page: number,
    size: number,
    bookingId: number,
  ): Observable<Page<IBookingCharges>> {
    console.log(page, size);
    
    let url = `${environment.projectBaseUrl}${GET_ALL_BOOKING_CHARGES}?status=${status}&page=${page}&size=${size}&bookingId=${bookingId}`;
    // url += bookingId !== undefined ? `&bookingId=${bookingId}` : `&bookingId=`;
  
    return this.http.get<Page<IBookingCharges>>(url);
  }

  
  deleteBookingCharge(id: any) {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${DELETE_BOOKING_CHARGES}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
