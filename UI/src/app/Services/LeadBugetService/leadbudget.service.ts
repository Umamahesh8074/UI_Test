import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  GETALLLEADBUDGET,
  GETBYLEADBUDGETID,
  GETLEADBYBADGESPENT,
  SAVELEADBUDGET,
  UPDATELEADBUDGET,
} from 'src/app/Apis/LeadBudgetApis/LeadBudget';
import { LeadBudget } from 'src/app/Models/LeadBudget/leadBudget';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadbudgetService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  addLeadBudget(leadBudget: any): Observable<any> {
    console.log('save service');
    console.log(leadBudget);
    return this.http.post<any>(
      `${environment.leadBaseUrl}${SAVELEADBUDGET}`,
      leadBudget
    );
  }

  getAllLeadBudget(page: any, size: any, organizationId: any) {
    console.log(page, size, organizationId);
    return this.http.get<Page<LeadBudget>>(
      `${environment.leadBaseUrl}${GETALLLEADBUDGET}?page=${page}&size=${size}&organizationId=${organizationId}`
    );
  }
  updateLeadBudget(leadBudget: LeadBudget): Observable<any> {
    return this.http.put<any>(
      `${environment.leadBaseUrl}${UPDATELEADBUDGET}`,
      leadBudget
    );
  }

  fetchLeadBudget(leadBudgetId: number): Observable<LeadBudget> {
    return this.http.get<LeadBudget>(
      `${environment.leadBaseUrl}${GETBYLEADBUDGETID}/${leadBudgetId}`
    );
  }

  getAllBudgetSpent(startDate: any, endDate: any, organizationId: any) {
    console.log(startDate, endDate, organizationId);
    return this.http.get<any>(
      `${environment.leadBaseUrl}${GETLEADBYBADGESPENT}?start=${startDate}&end=${endDate}&organizationId=${organizationId}`
    );
  }
}
