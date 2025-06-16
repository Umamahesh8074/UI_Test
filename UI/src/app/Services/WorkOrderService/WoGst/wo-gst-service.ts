import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GET_WORK_ORDER_AMOUNT,
  GET_WORK_ORDER_GST,
} from 'src/app/Apis/WorkOrderApis/WorkOrderBilling';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IWorkOrderAmount } from 'src/app/Models/WorkOrder/WorkOrderAmount';
import { IworkOrderGST } from 'src/app/Models/WorkOrder/WorkOrderGstDetails';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderGstService {
  constructor(private http: HttpClient) {}

  fetchAllWorkOrderGst(workOrderGstType: string) {
    return this.http.get<IworkOrderGST[]>(
      `${environment.procurementBaseUrl}${GET_WORK_ORDER_GST}?workOrderGstType=${workOrderGstType}`
    );
  }
}
