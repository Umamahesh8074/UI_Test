import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { AvailableUnitsDto } from 'src/app/Models/Project/unit';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding block
  addBooking(booking: any): Observable<any> {
    console.log(booking);
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ControllerPaths.BOOKING}/save/booking`,
      booking
    );
  }
  getBookedUnits(
    userId: number,
    page: any,
    size: any,
    roleId: any
  ) {
    console.log(userId, page, size,roleId);
    return this.http.get<Page<AvailableUnitsDto>>(
      `${environment.projectBaseUrl}${ControllerPaths.BOOKING}/fetch/bookedunits?userId=${userId}&page=${page}&size=${size}&roleId=${roleId}`
    );
  }
}
