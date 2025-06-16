import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PresalesControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { LeadFollowupPaths } from 'src/app/Apis/Presales/presales';
import { Page } from 'src/app/Models/CommanModel/Page';
import {
  ILeadFollowup,
  ILeadFollowupDto,
} from 'src/app/Models/Presales/leadFollowup';
import { CommanService } from '../../CommanService/comman.service';
import { MapDto } from 'src/app/Models/Presales/lead';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadFollowupService {
  constructor(private http: HttpClient, private commonService: CommanService) {}

  //fetch follow ups based on logged in user
  // fetchFollowUpsBasedOnLoggedInUser(
  //   leadName: string,
  //   page: number,
  //   size: number,
  //   userId: any,
  //   roleId: number,
  //   leadId: any,
  //   isSalesTeamFollowups: any,
  //   dateRange: any,
  //   statusId: any,
  //   isLeadFollowups: boolean,
  //   customStartDate?: any,
  //   customEndDate?: any
  // ): Observable<Page<ILeadFollowup[]>> {
  //   dateRange = dateRange == undefined ? 0 : dateRange;
  //   statusId = statusId == undefined ? '' : statusId;
  //   customStartDate = customStartDate == undefined ? '' : customStartDate;
  //   customEndDate = customEndDate == undefined ? '' : customEndDate;
  //   console.log('lead id :' + leadId);
  //   return this.http.get<Page<ILeadFollowup[]>>(
  //     `${environment.leadBaseUrl}${LeadFollowupPaths.ALL}?leadName=${leadName}&userId=${userId}&roleId=${roleId}&leadId=${leadId}&isSalesTeamFollowUps=${isSalesTeamFollowups}&page=${page}&size=${size}&range=${dateRange}&statusIds=${statusId}&isLeadFollowups=${isLeadFollowups}&startDate=${customStartDate}&endDate=${customEndDate}`
  //   );
  // }
  fetchFollowUpsBasedOnLoggedInUser(
    leadName: string,
    page: number,
    size: number,
    userId: any,
    roleId: number,
    leadId: any,
    isSalesTeamFollowups: any,
    dateRange: any,
    statusId: any,
    isLeadFollowups: boolean,
    customStartDate?: any,
    customEndDate?: any,
    roleName?: string,
    projectId?: number,
    isFromDashBoard?: boolean
  ): Observable<Page<ILeadFollowup[]>> {
    dateRange = dateRange == undefined ? 0 : dateRange;
    statusId = statusId == undefined ? '' : statusId;
    customStartDate = customStartDate == undefined ? '' : customStartDate;
    customEndDate = customEndDate == undefined ? '' : customEndDate;
    console.log('lead id :' + leadId);
    projectId = projectId == undefined ? 0 : projectId;
    isFromDashBoard = isFromDashBoard === undefined ? false : isFromDashBoard;
    if (roleName?.toLocaleLowerCase() === 'sales head') {
      return this.http.get<Page<ILeadFollowup[]>>(
        `${environment.leadBaseUrl}${LeadFollowupPaths.CP_HEAD_FOLLOWUPS}?leadName=${leadName}&page=${page}&size=${size}&userId=${userId}&leadId=${leadId}&roleId=${roleId}&rangeOfDays=${dateRange}&statusIds=${statusId}&startDate=${customStartDate}&endDate=${customEndDate}&projectId=${projectId}&isFromDashBoard=${isFromDashBoard}`
      );
    } else {
      return this.http.get<Page<ILeadFollowup[]>>(
        `${environment.leadBaseUrl}${LeadFollowupPaths.CP_FOLLOWUPS}?leadName=${leadName}&page=${page}&size=${size}&userId=${userId}&leadId=${leadId}&roleId=${roleId}&rangeOfDays=${dateRange}&statusIds=${statusId}&startDate=${customStartDate}&endDate=${customEndDate}&isFromDashBoard=${isFromDashBoard}`
      );
    }
  }

  fetchFollowUpByLeadId(
    leadName: string,
    page: number,
    size: number,
    leadId: number,
    userId?: number,
    roleId?: number
  ): Observable<Page<ILeadFollowup[]>> {
    return this.http.get<Page<ILeadFollowup[]>>(
      `${environment.leadBaseUrl}${LeadFollowupPaths.ALL}?leadName=${leadName}&leadId=${leadId}&userId=${userId}&roleId=${roleId}&page=${page}&size=${size}`
    );
  }
  // fetchFollowUpByLeadId(
  //   leadName: string,
  //   page: number,
  //   size: number,
  //   userId?: number,
  //   leadId?: number,
  //   roleId?: number
  // ): Observable<Page<ILeadFollowup[]>> {
  //   return this.http.get<Page<ILeadFollowup[]>>(
  //     `${environment.leadBaseUrl}${LeadFollowupPaths.ALLFOLLOWUPS}?leadName=${leadName}&page=${page}&size=${size}&userId=${userId}&leadId=${leadId}&roleId=${roleId}`
  //   );
  // }

  //   java.lang.RuntimeException: missing authorization header
  // 	at com.cn.apigateway.filter.AuthenticationFilter.lambda$0(AuthenticationFilter.java:30) ~[classes/:na]
  // 	Suppressed: reactor.core.publisher.FluxOnAssembly$OnAssemblyException:
  // Error has been observed at the following site(s):
  // 	*__checkpoint ⇢ org.springframework.cloud.gateway.filter.WeightCalculatorWebFilter [DefaultWebFilterChain]
  // 	*__checkpoint ⇢ HTTP GET "/api/lead/lead/dashboard/leads?userId=3&roleId=2&range=0&startDate=&endDate=" [ExceptionHandlingWebHandler]
  // Original Stack Trace:

  fetchFollowup(id: number): Observable<ILeadFollowup> {
    return this.http.get<ILeadFollowup>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_FOLLOWUP}/${id}`
    );
  }

  fetchFollowupTypes(type: string) {
    return this.commonService.fetchCommonReferenceTypes(type);
  }

  saveFollowup(
    followup: ILeadFollowup,
    isSalesTeamFollowUp: boolean
  ): Observable<any> {
    console.log(followup, isSalesTeamFollowUp);

    return this.http.post<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_FOLLOWUP}/save?isSalesTeamFollowUp=${isSalesTeamFollowUp}`,
      followup
    );
  }
  updateFollowup(
    followup: ILeadFollowup,
    isSalesTeamFollowUp: boolean,
    leadTypeId?: number
  ): Observable<any> {
    console.log(followup);
    followup.isDone = 'Yes';
    return this.http.put<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_FOLLOWUP}/update?isSalesTeamFollowUp=${isSalesTeamFollowUp}` +
        `&leadTypeId=${leadTypeId}`,
      followup
    );
  }

  fetchDashboardFollowupsData(
    userId: number,
    roleId: number,
    rangeOfDays?: number,
    startDate?: any,
    endDate?: any
  ): Observable<MapDto[]> {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    return this.http.get<MapDto[]>(
      `${environment.leadBaseUrl}${LeadFollowupPaths.DASHBOARD_FOLLOWUPS}?userId=${userId}&roleId=${roleId}&rangeOfDays=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  fetchCpFollowups(
    leadName: string,
    page: number,
    size: number,
    userId: any,
    roleId: number,
    leadId: any,
    dateRange: any,
    statusId: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: number,
    subsourceId?: any,
    isFromDashBoard?: boolean
  ): Observable<Page<ILeadFollowupDto[]>> {
    dateRange = dateRange == undefined ? 0 : dateRange;
    statusId = statusId == undefined ? '' : statusId;
    customStartDate = customStartDate == undefined ? '' : customStartDate;
    customEndDate = customEndDate == undefined ? '' : customEndDate;
    projectId = projectId == undefined ? 0 : projectId;
    subsourceId = subsourceId == undefined ? '' : subsourceId;
    isFromDashBoard = isFromDashBoard === undefined ? false : isFromDashBoard;
    console.log('lead id :' + leadId);
    return this.http.get<Page<ILeadFollowupDto[]>>(
      `${environment.leadBaseUrl}${LeadFollowupPaths.CP_FOLLOWUPS}?leadName=${leadName}&userId=${userId}&roleId=${roleId}&leadId=${leadId}&page=${page}&size=${size}&rangeOfDays=${dateRange}&statusIds=${statusId}&startDate=${customStartDate}&endDate=${customEndDate}&projectId=${projectId}&subsourceId=${subsourceId}&isFromDashBoard=${isFromDashBoard}`
    );
  }

  fetchLeadFollowEvents(start: any, end: any, userId: any, isExpried: any) {
    start = start || '';
    end = end || '';
    userId = userId || '';
    console.log(start);
    console.log(end);
    isExpried = isExpried || '';
    console.log(isExpried);
    return this.http.get<Page<ILeadFollowupDto[]>>(
      `${environment.leadBaseUrl}${LeadFollowupPaths.FETCH_LEADS_PENDING_FOLLOW}?start=${start}&end=${end}&userId=${userId}&isExpried=${isExpried}`
    );
  }

  fetchFollowupsData(
    searchText: any,
    page: number,
    size: number,
    followupIds: any
  ): Observable<Page<ILeadFollowupDto[]>> {
    searchText = searchText || '';
    followupIds: followupIds || '';
    return this.http.get<Page<ILeadFollowupDto[]>>(
      `${environment.leadBaseUrl}${LeadFollowupPaths.CALENDAR_FOLLOWUPS}?page=${page}&size=${size}&followupsIds=${followupIds}&leadName=${searchText}`
    );
  }

  addFollowupToLead(
    phoneNumber: string,
    leadIds: number[],
    followup: ILeadFollowup[],
    isSalesTeamFollowUp: boolean
  ): Observable<String> {
    const encodedPhoneNumber = encodeURIComponent(phoneNumber);
    return this.http.post<String>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_FOLLOWUP}/add/followup?phoneNumber=${encodedPhoneNumber}&leadIds=${leadIds}&isSalesTeamFollowUp=${isSalesTeamFollowUp}`,

      followup
    );
  }
}
