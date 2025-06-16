import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Employee } from 'src/app/Models/Employee/employee';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class EmployeeBankDetailsService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding client
  addEmployeeBankDetails(EmployeeBankDetails: any): Observable<any> {
    console.log(EmployeeBankDetails);
    return this.http.post<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.EMPLOYEEBANKDETAILS}/save`,
      EmployeeBankDetails
    );
  }


  updateEmployeeBankDetails(EmployeeBankDetails: any): Observable<any> {
    console.log(EmployeeBankDetails);

    return this.http.put<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.EMPLOYEEBANKDETAILS}/update`,
      EmployeeBankDetails
    );
  }



  getAllEmployeesBankingDetails(employeeId:string,page:number,size: number) {
    console.log(employeeId,page,size);
    return this.http.get<Page<Employee>>(
      `${environment.hrmBaseUrl}${ControllerPaths.EMPLOYEEBANKDETAILS}/getall?employeeId=${employeeId}&page=${page}&size=${size}`
    );
  }

  deleteEmployeeBankingDetails(id: number): Observable<string> {
    console.log(id);
    return this.http.delete<string>(
      `${environment.hrmBaseUrl}${ControllerPaths.EMPLOYEEBANKDETAILS}/${id}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }


  getEmployeesBankingDetailsById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.EMPLOYEEBANKDETAILS}/${id}`
    );
  }
}
