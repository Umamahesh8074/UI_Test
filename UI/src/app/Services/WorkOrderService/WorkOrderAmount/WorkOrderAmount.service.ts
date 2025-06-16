import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GET_WORK_ORDER_AMOUNT } from 'src/app/Apis/WorkOrderApis/WorkOrderBilling';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IWorkOrderAmount } from 'src/app/Models/WorkOrder/WorkOrderAmount';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderAmountService {
  constructor(private http: HttpClient) {}

  fetchWorkOrderAmount(page: number, size: number, workOrderId: number) {
    return this.http.get<Page<IWorkOrderAmount[]>>(
      `${environment.procurementBaseUrl}${GET_WORK_ORDER_AMOUNT}?page=${page}&size=${size}&workOrderId=${workOrderId}`
    );
  }
}
