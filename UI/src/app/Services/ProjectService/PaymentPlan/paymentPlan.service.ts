import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  GET_ALL_PAYMENT_PLANS,
  ADD_PAYMENT_PLAN,
  UPDATE_PAYMENT_PLAN,
  GET_PAYMENT_PLAN_BY_ID,
  DELETE_PAYMENT_PLAN_BY_ID,
  GET_ALL_PAYMENT_PLANS_BY_PROJECT_ID,
} from 'src/app/Apis/ProjectApis/Project';
import { environment } from 'src/environments/environment';
import { Page } from 'src/app/Models/CommanModel/Page';
import { PaymentPlan } from 'src/app/Models/Project/PaymentPlan';

@Injectable({
  providedIn: 'root',
})
export class PaymentPlanService {
  private _refresh: any;
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //adding paymentPlan
  addPaymentPlan(paymentPlan: any): Observable<any> {
    console.log(paymentPlan);
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ADD_PAYMENT_PLAN}`,
      paymentPlan
    );
  }

  //update paymentPlan
  updatePaymentPlan(paymentPlan: any): Observable<any> {
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATE_PAYMENT_PLAN}`,
      paymentPlan
    );
  }

  //getting filter data based on projectName name with pagination
  getAllPaymentPlans(projectName: string, page: any, size: any) {
    console.log(page, size);
    return this.http.get<Page<PaymentPlan>>(
      `${environment.projectBaseUrl}${GET_ALL_PAYMENT_PLANS}?projectName=${projectName}&page=${page}&size=${size}`
    );
  }

  //getting filter data based on projectName name without pagination
  getAllPaymentPlansByProjectId(projectId: any, blockId?: any, planId?: any) {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (blockId === undefined || blockId === 0) blockId = '';
    if (planId === undefined || planId === 0) planId = '';
    console.log(projectId, blockId, planId);
    return this.http.get<PaymentPlan[]>(
      `${environment.projectBaseUrl}${GET_ALL_PAYMENT_PLANS_BY_PROJECT_ID}?projectId=${projectId}&blockId=${blockId}&planId=${planId}`
    );
  }

  getPaymentPlanById(id: number): Observable<any> {
    return this.http.get<Page<PaymentPlan>>(
      `${environment.projectBaseUrl}${GET_PAYMENT_PLAN_BY_ID}/${id}`
    );
  }

  deletePaymentPlan(id: any) {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${DELETE_PAYMENT_PLAN_BY_ID}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
