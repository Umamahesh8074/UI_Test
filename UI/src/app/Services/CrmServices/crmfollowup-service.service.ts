import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FETCH_CRM_FOLLOWUPS,
  SAVE_CRM_FOLLOWUP,
} from 'src/app/Apis/CrmApis/PaymentDetailsApis';
import { ICRMFollowup } from 'src/app/Models/Crm/PaymentDetails';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CRMFollowupServiceService {
  constructor(private http: HttpClient) {}

  save(crmFollowup: ICRMFollowup) {
    return this.http.post<any>(
      `${environment.projectBaseUrl}${SAVE_CRM_FOLLOWUP}`,
      crmFollowup
    );
  }

  fetchAll(
    page: number,
    size: number,
    applicantId: number,
    applicantName: string,
    stageId: number
  ) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${FETCH_CRM_FOLLOWUPS}` +
        `?page=${page}` +
        `&size=${size}` +
        `&applicantId=${applicantId}` +
        `&applicantName=${applicantName}` +
        `&stageId=${stageId}`
    );
  }
}
