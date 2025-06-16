import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LeadPaths } from 'src/app/Apis/Presales/presales';
import { Page } from 'src/app/Models/Qrgenerator/qrgenerator';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadTransferServiceService {

  constructor(private http: HttpClient) { }

   getLeadTransferApprovalDetails(
      userId: number,
      page: number,
      pageSize: number,
      startDate?: any,
      endDate?: any,
      projectId?: any
    ) {
      if (startDate == undefined) startDate = '';
      if (endDate == undefined) endDate = '';
      return this.http.get<Page<any[]>>(
        `${environment.leadBaseUrl}${LeadPaths.LEAD_TRANSFER_FOR_APPROVAL}?userId=${userId}&page=${page}&size=${pageSize}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}`
      );
    }
}
