import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PresalesControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { LeadPaths } from 'src/app/Apis/Presales/presales';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IFileUploadResponse } from 'src/app/Models/Presales/FileUploadResponse';
import {
  IApplicantLeadDto,
  ILeadFilterDto,
  Lead,
  LeadDto,
  LeadHistoryDto,
  LeadTransfer,
  MapDto,
  TeamDashBoardDataDto,
  TotalLeadsDto,
} from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { environment } from 'src/environments/environment';
import { ProjectService } from '../../ProjectService/Project/project.service';
import { UnitTypeService } from '../../ProjectService/UnitType/unittype.service';
import { LeadSourceService } from '../LeadSource/lead-source.service';
import { LeadSubsourceService } from '../LeadSubSource/lead-subsource.service';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  constructor(
    private http: HttpClient,
    private leadSourceService: LeadSourceService,
    private leadSubsourceService: LeadSubsourceService,
    private projectService: ProjectService,
    private unitTypeService: UnitTypeService
  ) {}
  private _refreshRequired = new Subject<void>();
  get refreshRequired() {
    return this._refreshRequired;
  }

  fetchAllLeads(phoneNumber?: string | '', page?: number, size?: number) {
    page = page !== undefined ? page : 0;
    size = size !== undefined ? size : 0;
    phoneNumber = phoneNumber ? phoneNumber : '';
    return this.http.get<Page<Lead>>(
      `${environment.leadBaseUrl}${LeadPaths.ALL}?phoneNumber=${phoneNumber}&page=${page}&size=${size}`
    );
  }

  saveLead(lead: Lead, isSiteVisit?: boolean): Observable<any> {
    // Create the options object with params
    const options: any = {
      params: {},
    };
    if (isSiteVisit !== undefined) {
      options.params.isSiteVistForm = isSiteVisit.toString();
    }
    return this.http.post<any>(
      `${environment.leadBaseUrl}${LeadPaths.SAVE}`,
      lead,
      options
    );
  }

  saveCpLead(
    lead: Lead,
    loggedInUserId: number,
    logedInRoleId: number,
    cpRegisterId: number
  ): Observable<any> {
    loggedInUserId === undefined || loggedInUserId === null ? '' : 0;
    logedInRoleId === undefined || logedInRoleId === null ? '' : 0;
    cpRegisterId === undefined || cpRegisterId === null ? '' : 0;
    return this.http.post<any>(
      `${environment.leadBaseUrl}${LeadPaths.SAVE}/cplead?loggedInUserId=${loggedInUserId}&logedInRoleId=${logedInRoleId}&cpRegisterId=${cpRegisterId}`,
      lead
    );
  }

  updateLead(lead: Lead, isSiteVisit?: boolean): Observable<any> {
    // Create the options object with params
    const options: any = {
      params: {},
    };
    if (isSiteVisit !== undefined) {
      options.params.isSiteVistForm = isSiteVisit.toString();
    }

    // Perform the HTTP PUT request
    return this.http.put<any>(
      `${environment.leadBaseUrl}${LeadPaths.UPDATE}`,
      lead,
      options
    );
  }

  fetchLead(leadId: number): Observable<Lead> {
    return this.http.get<Lead>(`${environment.leadBaseUrl}/lead/${leadId}`);
  }

  fetchLeadSources(sourceName?: string): Observable<LeadSource[]> {
    return this.leadSourceService.fetchAllLeadSources(sourceName);
  }

  fetchLeadSubSources(sourceId: number): Observable<LeadSubSource[]> {
    return this.leadSubsourceService.fetchSubSources(sourceId);
  }

  deleteLead(lead: Lead): Observable<any> {
    return this.http.put<any>(
      `${environment.leadBaseUrl}${LeadPaths.UPDATE_STATUS}`,
      lead
    );
  }

  fetchProjects(projectName: string, organizationId?: any) {
    return this.projectService.getProjects(projectName, organizationId);
  }

  fetchLeads(
    leadName?: string,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    referenceKey?: any,
    sourceUserId?: any
  ): Observable<Lead[]> {
    leadName = leadName || '';
    sourceId = sourceId || '';
    subSourceId = subSourceId || '';
    statusId = statusId || '';
    referenceKey = referenceKey || '';
    sourceUserId = sourceUserId || '';
    return this.http.get<Lead[]>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_ALL}?name=${leadName}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&referenceKey=${referenceKey}&sourceUserId=${sourceUserId}`
    );
  }

  //get all leads based on logged in person whether he is sales or presales or admin
  findLeadsBasedOnLoggedInUser(
    userId: number,
    roleId: number,
    digitalPartnerName: any,
    phoneNumber?: any,
    page?: number,
    size?: number,
    name?: string,
    statusId?: any,
    isSalesTeam?: any,
    rangeOfDays?: any,
    isMenuLeads?: boolean,
    isExportExcel?: boolean,
    customStartDate?: any,
    customEndDate?: any,
    sourceId?: any,
    subSourceId?: any,
    preSalesId?: any,
    salesId?: any,
    projectId?: any,
    opportunityId?: string
  ): Observable<any> {
    customStartDate =
      customStartDate === undefined || customStartDate === null
        ? ''
        : customStartDate;
    customEndDate =
      customEndDate === null || customEndDate === undefined
        ? ''
        : customEndDate;
    rangeOfDays =
      rangeOfDays === null || rangeOfDays === undefined ? '' : rangeOfDays;
    sourceId = sourceId || '';
    subSourceId = subSourceId || '';
    preSalesId = preSalesId || '';
    salesId = salesId || '';
    statusId = statusId || '';
    name = name === undefined ? '' : name;
    phoneNumber = phoneNumber === undefined ? '' : phoneNumber;
    if (projectId === undefined || projectId === 0) projectId = '';
    digitalPartnerName = digitalPartnerName || '';
    opportunityId = opportunityId ?? '';
    return this.http.get<Page<Lead>>(
      `${environment.leadBaseUrl}${LeadPaths.ALL_LEADS}?userId=${userId}&roleId=${roleId}&phoneNumber=${phoneNumber}&page=${page}&size=${size}&name=${name}&statusId=${statusId}&isSalesTeam=${isSalesTeam}&range=${rangeOfDays}&isMenuLeads=${isMenuLeads}&isExportExcel=${isExportExcel}&startDate=${customStartDate}&endDate=${customEndDate}&sourceId=${sourceId}&subSourceId=${subSourceId}&preSalesId=${preSalesId}&salesId=${salesId}&projectId=${projectId}&digitalPartner=${digitalPartnerName}&opportunityId=${opportunityId}`,
      { responseType: isExportExcel ? ('blob' as 'json') : 'json' }
    );
  }

  fetchDashBoardLeads(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any
  ): Observable<MapDto[]> {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    return this.http.get<MapDto[]>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEADS}?userId=${userId}&roleId=${roleId}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  fetchTotalLeadsCount(
    userId: number,
    roleId: number,
    cpSource: any
  ): Observable<MapDto[]> {
    cpSource = cpSource || '';
    return this.http.get<MapDto[]>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_TOTAL_LEADS}?userId=${userId}&roleId=${roleId}&cpSource=${cpSource}`
    );
  }

  //duplicate leads
  // getDuplicateLeads(page: number, size: number, phoneNumber: string) {
  //   console.log(page, size);
  //   return this.http.get<Page<any>>(
  //     `${environment.leadBaseUrl}${PresalesControllerPaths.DUPLICATE_LEADS}/getall?page=${page}&size=${size}&phoneNumber=${phoneNumber}`
  //   );
  // }
  getDuplicateLeads(filterDto: ILeadFilterDto) {
    console.log(filterDto.page, filterDto.size);
    console.log(filterDto);
    return this.http.post<Page<any>>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.DUPLICATE_LEADS}/getall`,
      filterDto,
      {
        responseType: filterDto.isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }

  fetchTeamLeadsData(
    userId: number,
    roleId: number,
    rangeOfDays: number,
    startDate?: any,
    endDate?: any
  ): Observable<TeamDashBoardDataDto[]> {
    rangeOfDays =
      rangeOfDays === undefined || rangeOfDays === null ? 0 : rangeOfDays;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';

    return this.http.get<TeamDashBoardDataDto[]>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.TEAM_LEADS_DATA}?userId=${userId}&roleId=${roleId}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}`
    );
  }
  uploadFile(
    file: File,
    userId: number,
    roleId: number
  ): Observable<IFileUploadResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());
    formData.append('roleId', roleId.toString());

    return this.http.post<IFileUploadResponse>(
      `${environment.leadBaseUrl}${LeadPaths.UPLOAD_EXCEL}`,
      formData,
      {
        headers: new HttpHeaders({
          enctype: 'multipart/form-data',
        }),
      }
    );
  }
  downloadUpdatedExcel(fileName: string): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.leadBaseUrl}${LeadPaths.DOWNLOAD_UPLOADED_EXCEL}${fileName}`,
      { responseType: 'blob' as 'json' }
    );
  }

  // fetchLeadDetails(leadId: number): Observable<ILeadDto> {
  //   return this.http.get<ILeadDto>(
  //     `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_DETAILS}/${leadId}`
  //   );
  // }

  fetchLeadDetails(leadId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_DETAILS}/${leadId}`
    );
  }

  fetchAllUnitTypes() {
    return this.unitTypeService.getAllUnitTypes();
  }

  getLeadSubSource(userId: number): Observable<any> {
    console.log('userId ', userId);
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADS}/subsource/${userId}`
    );
  }

  getSource(name: string): Observable<any> {
    console.log(name);
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_SOURCE}/source?name=${name}`
    );
  }
  downloadTemplate(isCp: boolean): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.leadBaseUrl}${LeadPaths.DOWNLOAD_TEMPLATE_EXCEL}${isCp}`,
      { responseType: 'blob' as 'json' }
    );
  }

  updateManualLeadAssign(
    leadIds: any,
    targetUserId: any,
    teamType: any,
    loggedInUserId: any
  ) {
    targetUserId = targetUserId || '';
    loggedInUserId = loggedInUserId ?? '';
    return this.http.put<any>(
      `${environment.leadBaseUrl}${LeadPaths.UPDATE_MANUAL_LEAD_ASSIGN}?teamType=${teamType}&targetUserId=${targetUserId}&loginUserId=${loggedInUserId}`,
      leadIds
    );
  }
  getLeadHistories(leadId: any, page: any, size: any) {
    console.log(leadId, page, size);
    return this.http.get<Page<LeadHistoryDto>>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_LEAD_HISTORY}/${leadId}?page=${page}&size=${size}`
    );
  }

  fetchLeadReport(): Observable<any> {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEAD_REPORT}`
    );
  }
  fetchDashBoardNoncontactableLeads(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    statusId?: any
  ): Observable<MapDto[]> {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    statusId = statusId || '';
    return this.http.get<MapDto[]>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_NONCONACTABLE_LEADS}?userId=${userId}&roleId=${roleId}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&statusId=${statusId}`
    );
  }
  getLeadReport(
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    sourceId?: any,
    subSourceId?: any,
    userId?: any,
    digitalPartner?: any,
    projectId?: any
  ): Observable<any> {
    rangeOfDays = rangeOfDays ?? rangeOfDays;
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    (sourceId = sourceId || ''), (subSourceId = subSourceId || '');
    userId = userId ? userId : '';
    digitalPartner = digitalPartner || '';
    if (projectId === undefined || projectId === 0) projectId = '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.GET_LEAD_REPORT}?range=${rangeOfDays}&startDate=${customStartDate}&endDate=${customEndDate}&sourceId=${sourceId}&subSourceId=${subSourceId}&userId=${userId}&digitalPartner=${digitalPartner}&projectId=${projectId}`
    );
  }

  manualLeadAssign(
    userId: number,
    roleId: number,
    phoneNumber?: any,
    name?: string,
    statusId?: any,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    sourceId?: any,
    subSourceId?: any,
    teamType?: any,
    selectedIds?: any,
    targetUserId?: any,
    isMenuLeads?: any,
    presaleMemberId?: any,
    saleMemberId?: any
  ) {
    console.log(roleId);
    phoneNumber = phoneNumber || '';
    name = name || '';
    statusId = statusId || '';
    (rangeOfDays = rangeOfDays || ''),
      (customStartDate = customStartDate || '');
    customEndDate = customEndDate || '';
    (sourceId = sourceId || ''),
      (subSourceId = subSourceId || ''),
      (teamType = teamType || '');
    targetUserId = targetUserId || '';
    // isMenuLeads = isMenuLeads || '';
    presaleMemberId = presaleMemberId || '';
    saleMemberId = saleMemberId || '';
    return this.http.put<any>(
      `${environment.leadBaseUrl}${LeadPaths.UPDATE_ALL_CHECK_MANUAL_LEAD_ASSIGN}?teamType=${teamType}&userId=${userId}&roleId=${roleId}&phoneNumber=${phoneNumber}&name=${name}&statusId=${statusId}&range=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&sourceId=${sourceId}&subsource=${sourceId}&targetUserId=${targetUserId}&isMenuLeads=${isMenuLeads}&saleMemberId=${saleMemberId}&presaleMemberId=${presaleMemberId}`,
      selectedIds
    );
  }
  getAllUserNames(userId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.LEADS}/getusernames?userId=${userId}`
    );
  }

  ///Calling procedure in Backend
  getDashBoardCount(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: number,
    subSourceId?: number
  ) {
    console.log(projectId);
    console.log(sourceId);
    console.log(subSourceId);

    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (sourceId == undefined) sourceId = 0;
    if (subSourceId == undefined) subSourceId = 0;
    return this.http.get<MapDto[]>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEADS_COUNT}?userId=${userId}&roleId=${roleId}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}`
    );
  }

  //Calling native query
  getDashBoardLeadsDetails(
    userId: number,
    roleId: number,
    digitalPartner: any,
    page: number,
    pageSize: number,
    isMenuLeads: boolean,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    preSalesId?: any,
    salesId?: any,
    phoneNumber?: any,
    userName?: any,
    leadType?: any,
    opportunityId?: string,
    campaginName?: any,
    isExportExcel?: any,
    isManualAssignMenu?: any,
    isExpried?: any
  ) {
    console.log('preSalesId' + preSalesId);
    console.log('salesId' + salesId);
    console.log('statusId' + statusId);
    console.log('subSourceId' + subSourceId);
    console.log(sourceId);

    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (sourceId === undefined) sourceId = 0;
    if (subSourceId === undefined) subSourceId = '';
    if (statusId === undefined) statusId = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (preSalesId === undefined) preSalesId = '';
    if (salesId === undefined) salesId = '';
    if (phoneNumber === undefined) phoneNumber = '';
    if (userName === undefined) userName = '';
    if (userName === undefined) userName = '';
    leadType = leadType || '';
    digitalPartner = digitalPartner || '';
    campaginName = campaginName || '';
    if (opportunityId === undefined) opportunityId = '';
    if (isExportExcel === undefined) isExportExcel = false;
    isManualAssignMenu = isManualAssignMenu || '';
    isExpried = isExpried;
    return this.http.get<Page<LeadDto[]>>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEADS_DETAILS}?userId=${userId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&isMenuLeads=${isMenuLeads}&preSalesId=${preSalesId}&salesId=${salesId}&phoneNumber=${phoneNumber}&userName=${userName}&leadType=${leadType}&opportunityId=${opportunityId}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&isExportExcel=${isExportExcel}&isManualAssignMenu=${isManualAssignMenu}&isExpried=${isExpried}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }

  teamWiseLeadsData(
    userId: number,
    roleId: number,
    dateRange: number,
    startDate?: any,
    endDate?: any,
    projectId?: any
  ): Observable<any> {
    if (projectId === undefined || projectId === 0) projectId = '';
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.TEAM_WISE_LEADS_DATA}?userId=${userId}&roleId=${roleId}&range=${dateRange}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}`
    );
  }
  // fetchTotalCountForMembers(userId: number, roleId: number): Observable<MapDto[]> {
  //   return this.http.get<MapDto[]>(
  //     `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEADS_COUNT}?userId=${userId}&roleId=${roleId}`
  //   );
  // }

  getProjectTeamReport(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    teamUserId?: any,
    teamId?: any,
    sourceId?: any,
    subSourceId?: any,
    digitalPartnerName?: any,
    isExpried?: any
  ): Observable<any> {
    rangeOfDays =
      rangeOfDays !== undefined && rangeOfDays !== null ? rangeOfDays : '';
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    if (projectId === undefined || projectId === 0)
      (projectId = ''),
        (teamUserId = teamUserId || ''),
        (teamId = teamId || '');
    sourceId = sourceId || '';
    subSourceId = subSourceId || '';
    digitalPartnerName = digitalPartnerName || '';
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.GET_PROJECT_TEAM_REPORT}?rangeOfDays=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&projectId=${projectId}&teamUserId=${teamUserId}&teamId=${teamId}&userId=${userId}&roleId=${roleId}&sourceId=${sourceId}&subSourceId=${subSourceId}&digitalPartner=${digitalPartnerName}&isExpried=${isExpried}`
    );
  }

  //fetchcpwise data

  fetchCpWiseData(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    isExpried?: any
  ): Observable<any> {
    console.log(rangeOfDays);
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (customStartDate == undefined) customStartDate = '';
    if (customEndDate == undefined) customEndDate = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.CP_WISE_LEADS_DATA}?rangeOfDays=${rangeOfDays}&startDate=${customStartDate}&endDate=${customEndDate}&userId=${userId}&roleId=${roleId}&projectId=${projectId}&isExpried=${isExpried}`
    );
  }

  getDuplicateLeadHistories(phoneNumber: any, page: any, size: any) {
    console.log(phoneNumber, page, size);
    if (phoneNumber == undefined) {
      phoneNumber = '';
    }
    return this.http.get<Page<LeadHistoryDto>>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_DUPLICATE_LEAD_HISTORY}?page=${page}&size=${size}&phoneNumber=${phoneNumber}`
    );
  }
  getLeadByPhoneNumber(phoneNumber: any) {
    console.log(phoneNumber);
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_LEAD_BY_PHONE_NUMBER}?phoneNumber=${phoneNumber}`
    );
  }
  getAddressByPinCode(
    pincode: any,
    location: string
  ): Observable<Map<string, string>> {
    console.log(pincode);
    return this.http.get<Map<string, string>>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_ADDRESS_BY_PINCODE}?pincode=${pincode}&location=${location}`
    );
  }

  fetchAllLead(
    phoneNumber: String,
    email: string,
    name: string
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.ALL_LEADS}?phoneNumber=${phoneNumber}&email=${email}&name=${name}`
    );
  }

  //get all leads  to display from tanle to show lead details
  getTotalLeadDisplay(
    page: number,
    size: number
  ): Observable<Page<TotalLeadsDto[]>> {
    return this.http.get<Page<TotalLeadsDto[]>>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_ALL_LEADS_DISPLAY}?page=${page}&size=${size}`
    );
  }
  getProjectTeamReportForChannelPatner(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: number,
    subSourceId?: number
  ) {
    console.log(projectId);
    console.log(sourceId);
    console.log(subSourceId);
    console.log(startDate);
    console.log(endDate);
    console.log(rangeOfDays);
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (sourceId == undefined) sourceId = 0;
    if (subSourceId == undefined) subSourceId = 0;
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.CHANNEL_PATNER_DASHBOARD_COUNT}?range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&userId=${userId}&roleId=${roleId}`
    );
  }
  getExpiringLeadsData(
    userId: number,
    roleId: number,
    digitalPartner: any,
    page: number,
    pageSize: number,
    isMenuLeads: boolean,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    preSalesId?: any,
    salesId?: any,
    phoneNumber?: any,
    userName?: any,
    leadType?: any,
    isExportExcel?: any
  ) {
    console.log('preSalesId' + preSalesId);
    console.log('salesId' + salesId);
    console.log('statusId' + statusId);

    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (sourceId === undefined) sourceId = 0;
    if (subSourceId === undefined) subSourceId = '';
    if (statusId === undefined) statusId = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (preSalesId === undefined) preSalesId = '';
    if (salesId === undefined) salesId = '';
    if (phoneNumber === undefined) phoneNumber = '';
    if (userName === undefined) userName = '';
    if (isExportExcel === undefined) leadType = leadType || '';
    digitalPartner = digitalPartner || '';
    return this.http.get<Page<LeadDto[]>>(
      `${environment.leadBaseUrl}${LeadPaths.EXPIRING_LEADS_DATA}?userId=${userId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&isMenuLeads=${isMenuLeads}&preSalesId=${preSalesId}&salesId=${salesId}&phoneNumber=${phoneNumber}&userName=${userName}&leadType=${leadType}&digitalPartner=${digitalPartner}&isExportExcel=${isExportExcel}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }
  changeLeadExpiry(id: number, sourceId: number) {
    return this.http.put<string>(
      `${environment.leadBaseUrl}${LeadPaths.EXTEND_LEAD_EXPIRY_DATE}?leadId=${id}&sourceId=${sourceId}`,
      {}
    );
  }

  fetchLeadsDashboardCount(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    teamUserId?: any,
    teamId?: any
  ): Observable<any> {
    rangeOfDays =
      rangeOfDays !== undefined && rangeOfDays !== null ? rangeOfDays : '';
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    if (projectId === undefined || projectId === 0) projectId = '';
    (teamUserId = teamUserId || ''), (teamId = teamId || '');
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEAD_COUNT}?rangeOfDays=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&projectId=${projectId}&teamUserId=${teamUserId}&teamId=${teamId}&userId=${userId}&roleId=${roleId}`
    );
  }
  fetchDuplicateLeadHistories(phoneNumber: any, page: any, size: any) {
    console.log(phoneNumber, page, size);
    if (phoneNumber == undefined) {
      phoneNumber = '';
    }
    return this.http.get<Page<LeadHistoryDto>>(
      `${environment.leadBaseUrl}${LeadPaths.GET_DUPLICATE_LEAD_HISTORY}?page=${page}&size=${size}&phoneNumber=${phoneNumber}`
    );
  }

  getLeadByPhoneNumberAndProjectId(phoneNumber: any, projectId: number) {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_LEAD_BY_PHONE_NUMBER_AND_PROJECT}?phoneNumber=${phoneNumber}&projectId=${projectId}`
    );
  }

  getBookCount(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    teamUserId?: any,
    teamId?: any
  ): Observable<any> {
    rangeOfDays =
      rangeOfDays !== undefined && rangeOfDays !== null ? rangeOfDays : '';
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    if (projectId === undefined || projectId === 0)
      (projectId = ''),
        (teamUserId = teamUserId || ''),
        (teamId = teamId || '');
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.GET_BOOKED_COUNT}?rangeOfDays=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&projectId=${projectId}&teamUserId=${teamUserId}&teamId=${teamId}&userId=${userId}&roleId=${roleId}`
    );
  }

  //Calling native query
  getDashBoardUnassignedLeadsDetails(
    userId: number,
    roleId: number,
    page: number,
    pageSize: number,
    isMenuLeads: boolean,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    preSalesId?: any,
    salesId?: any,
    phoneNumber?: any,
    userName?: any,
    opportunityId?: string,
    isExportExcel?: any,
    isExpried?: any
  ) {
    console.log('preSalesId' + preSalesId);
    console.log('salesId' + salesId);
    console.log('statusId' + statusId);
    console.log('subSourceId' + subSourceId);
    console.log(sourceId);

    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (sourceId === undefined) sourceId = 0;
    if (subSourceId === undefined) subSourceId = '';
    if (statusId === undefined) statusId = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (preSalesId === undefined) preSalesId = '';
    if (salesId === undefined) salesId = '';
    if (phoneNumber === undefined) phoneNumber = '';
    if (userName === undefined) userName = '';
    if (userName === undefined) userName = '';
    if (opportunityId === undefined) opportunityId = '';
    if (isExportExcel === undefined) isExportExcel = false;
    isExpried = isExpried || '';
    return this.http.get<Page<LeadDto[]>>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_UNASSIGNED_LEADS_DETAILS}?userId=${userId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&isMenuLeads=${isMenuLeads}&preSalesId=${preSalesId}&salesId=${salesId}&phoneNumber=${phoneNumber}&userName=${userName}&opportunityId=${opportunityId}&isExportExcel=${isExportExcel}&isExpried=${isExpried}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }

  fetchLeadAudio(leadId: number) {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_LEAD_AUDIO}/${leadId}`
    );
  }
  //called
  fetchLeadsDashboardCountV1(
    userId: number,
    roleId: number,
    digitalPartner: any,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    teamUserId?: any,
    teamId?: any,
    campaginName?: any,
    sourceIds?: any,
    subSourceIds?: any,
    isExpried?: any
  ): Observable<any> {
    console.log(rangeOfDays);
    rangeOfDays =
      rangeOfDays !== undefined && rangeOfDays !== null ? rangeOfDays : '';
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    if (projectId === undefined || projectId === 0) projectId = '';
    (teamUserId = teamUserId || ''), (teamId = teamId || '');
    console.log(digitalPartner);
    digitalPartner = digitalPartner || '';
    campaginName = campaginName || '';
    console.log(digitalPartner);
    sourceIds = sourceIds || '';
    subSourceIds = subSourceIds || '';
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEAD_COUNT_V1}?rangeOfDays=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&projectId=${projectId}&teamUserId=${teamUserId}&teamId=${teamId}&userId=${userId}&roleId=${roleId}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&sourceId=${sourceIds}&subSourceId=${subSourceIds}&isExpried=${isExpried}`
    );
  }

  getDashBoardLeadsDetailsV1(
    userId: number,
    roleId: number,
    digitalPartner: any,
    page: number,
    pageSize: number,
    isMenuLeads: boolean,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    preSalesId?: any,
    salesId?: any,
    phoneNumber?: any,
    userName?: any,
    leadType?: any,
    opportunityId?: string,
    salesleads?: any,
    campaginName?: any,
    isExportExcel?: any,
    isExpried?: any
  ) {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (sourceId === undefined) sourceId = '';
    if (subSourceId === undefined) subSourceId = '';
    if (statusId === undefined) statusId = '';
    if (projectId === undefined || projectId == 0) projectId = [];
    if (preSalesId === undefined) preSalesId = '';
    if (salesId === undefined) salesId = '';
    if (phoneNumber === undefined) phoneNumber = '';
    if (userName === undefined) userName = '';
    if (userName === undefined) userName = '';
    salesleads = salesleads || false;
    leadType = leadType || '';
    digitalPartner = digitalPartner || '';
    campaginName = campaginName || '';
    if (isExportExcel === undefined) isExportExcel = false;
    if (opportunityId === undefined) opportunityId = '';
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEADS_DETAILS_V1}?userId=${userId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&isMenuLeads=${isMenuLeads}&preSalesId=${preSalesId}&salesId=${salesId}&phoneNumber=${phoneNumber}&userName=${userName}&leadType=${leadType}&opportunityId=${opportunityId}&salesLeads=${salesleads}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&isExportExcel=${isExportExcel}&isExpried=${isExpried}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }

  getLeadSourceSubSourceWithoutPagination(
    phoneNumber: string,
    projectId: number
  ): Observable<IApplicantLeadDto[]> {
    return this.http.get<IApplicantLeadDto[]>(
      `${environment.leadBaseUrl}${LeadPaths.FETCH_LEAD_SOURCE_SUB_SOURCE_DETAILS_FOR_APPLICANT}?phoneNumber=${phoneNumber}&projectId=${projectId}`
    );
  }

  //called
  fetchLeadsCurrentStatusDashboardCount(
    userId: number,
    roleId: number,
    digitalPartner: any,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    teamUserId?: any,
    teamId?: any,
    campaginName?: any,
    sourceIds?: any,
    subSourceIds?: any,
    isExpried?: any
  ): Observable<any> {
    rangeOfDays =
      rangeOfDays !== undefined && rangeOfDays !== null ? rangeOfDays : '';
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    if (projectId === undefined || projectId === 0) projectId = '';
    (teamUserId = teamUserId || ''), (teamId = teamId || '');
    digitalPartner = digitalPartner || '';
    campaginName = campaginName ? campaginName : '';
    sourceIds = sourceIds || [];
    subSourceIds = subSourceIds || [];
    isExpried = isExpried || '';
    console.log(digitalPartner);
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEAD_CURRENT_STATUS_COUNT}?rangeOfDays=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&projectId=${projectId}&teamUserId=${teamUserId}&teamId=${teamId}&userId=${userId}&roleId=${roleId}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&sourceId=${sourceIds}&subSourceId=${subSourceIds}&isExpried=${isExpried}`
    );
  }

  getDashBoardLeadsCurrentStatusDetails(
    userId: number,
    roleId: number,
    page: number,
    pageSize: number,
    isMenuLeads: boolean,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    preSalesId?: any,
    salesId?: any,
    phoneNumber?: any,
    userName?: any,
    leadType?: any,
    opportunityId?: string,
    digitalPartner?: string,
    campaginName?: string,
    isExportExcel?: any,
    isExpried?: any
  ) {
    console.log('preSalesId' + preSalesId);
    console.log('salesId' + salesId);
    console.log('statusId' + statusId);
    console.log('subSourceId' + subSourceId);
    console.log(sourceId);

    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (sourceId === undefined) sourceId = 0;
    if (subSourceId === undefined) subSourceId = '';
    if (statusId === undefined) statusId = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (preSalesId === undefined) preSalesId = '';
    if (salesId === undefined) salesId = '';
    if (phoneNumber === undefined) phoneNumber = '';
    if (userName === undefined) userName = '';
    if (userName === undefined) userName = '';
    if (digitalPartner === undefined) digitalPartner = '';
    campaginName = campaginName || '';
    leadType = leadType || '';
    if (isExportExcel === undefined) isExportExcel = false;
    if (opportunityId === undefined) opportunityId = '';
    isExpried = isExpried || '';
    return this.http.get<Page<LeadDto[]>>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEADS_CURRENT_STATUS_DETAILS}?userId=${userId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&isMenuLeads=${isMenuLeads}&preSalesId=${preSalesId}&salesId=${salesId}&phoneNumber=${phoneNumber}&userName=${userName}&leadType=${leadType}&opportunityId=${opportunityId}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&isExportExcel=${isExportExcel}&isExpried=${isExpried}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }

  getLeadSourceCount(
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    roleId?: any,
    isExpried?: any
  ) {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (roleId === undefined) roleId = '';
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.LEADS_SOURCE_COUNT}?range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&roleId=${roleId}&isExpried=${isExpried}`
    );
  }

  findCustomerLeads(
    userId: number,
    roleId: number,
    phoneNumber?: any,
    page?: number,
    size?: number,
    name?: string,
    statusId?: any,
    isSalesTeam?: any,
    rangeOfDays?: any,
    isMenuLeads?: boolean,
    isExportExcel?: boolean,
    customStartDate?: any,
    customEndDate?: any,
    sourceId?: any,
    subSourceId?: any,
    preSalesId?: any,
    salesId?: any,
    projectId?: any
  ): Observable<any> {
    customStartDate =
      customStartDate === undefined || customStartDate === null
        ? ''
        : customStartDate;
    customEndDate =
      customEndDate === null || customEndDate === undefined
        ? ''
        : customEndDate;
    rangeOfDays =
      rangeOfDays === null || rangeOfDays === undefined ? '' : rangeOfDays;
    sourceId = sourceId || '';
    subSourceId = subSourceId || '';
    preSalesId = preSalesId || '';
    salesId = salesId || '';
    statusId = statusId || '';
    name = name === undefined ? '' : name;
    phoneNumber = phoneNumber === undefined ? '' : phoneNumber;
    projectId = projectId === undefined ? '' : projectId;
    return this.http.get<Page<Lead>>(
      `${environment.leadBaseUrl}${LeadPaths.CUSTOMER_LEADS}?userId=${userId}&roleId=${roleId}&phoneNumber=${phoneNumber}&page=${page}&size=${size}&name=${name}&statusId=${statusId}&isSalesTeam=${isSalesTeam}&range=${rangeOfDays}&isMenuLeads=${isMenuLeads}&isExportExcel=${isExportExcel}&startDate=${customStartDate}&endDate=${customEndDate}&sourceId=${sourceId}&subSourceId=${subSourceId}&preSalesId=${preSalesId}&salesId=${salesId}&projectId=${projectId}`,
      { responseType: isExportExcel ? ('blob' as 'json') : 'json' }
    );
  }

  fetchLeadByPhoneNumber(
    phoneNumber: any,
    userId?: number,
    isSalesTeam?: boolean
  ) {
    console.log(phoneNumber);
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.LEAD_BY_PHONE_NUMBER_AND_COUNTRY_CODE}?phoneNumber=${phoneNumber}&userId=${userId}&isSalesTeam=${isSalesTeam}`
    );
  }

  fetchMemberReport(
    userId: number,
    roleId: number,
    digitalPartner: any,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    teamUserId?: any,
    teamId?: any,
    campaginName?: any,
    sourceIds?: any,
    subSourceIds?: any,
    presales?: any,
    sale?: any,
    isExpried?: any
  ): Observable<any> {
    console.log(rangeOfDays);
    rangeOfDays =
      rangeOfDays !== undefined && rangeOfDays !== null ? rangeOfDays : '';
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    (projectId = projectId || ''),
      (teamUserId = teamUserId || ''),
      (teamId = teamId || '');
    console.log(digitalPartner);
    digitalPartner = digitalPartner || '';
    campaginName = campaginName || '';
    console.log(digitalPartner);
    sourceIds = sourceIds || '';
    subSourceIds = subSourceIds || '';
    presales = presales || '';
    sale = sale || '';
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_MEMBER_REPORT}?rangeOfDays=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&projectId=${projectId}&teamUserId=${teamUserId}&teamId=${teamId}&userId=${userId}&roleId=${roleId}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&sourceId=${sourceIds}&subSourceId=${subSourceIds}&presales=${presales}&sales=${sale}&isExpried=${isExpried}`
    );
  }

  getDashBoardUniqueLeadsDetails(
    userId: number,
    roleId: number,
    digitalPartner: any,
    page: number,
    pageSize: number,
    isMenuLeads: boolean,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    preSalesId?: any,
    salesId?: any,
    phoneNumber?: any,
    userName?: any,
    leadType?: any,
    opportunityId?: string,
    campaginName?: any,
    isExportExcel?: any,
    isExpried?: any
  ) {
    console.log('preSalesId' + preSalesId);
    console.log('salesId' + salesId);
    console.log('statusId' + statusId);
    console.log('subSourceId' + subSourceId);
    console.log(sourceId);

    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (sourceId === undefined) sourceId = 0;
    if (subSourceId === undefined) subSourceId = '';
    if (statusId === undefined) statusId = '';
    if (projectId === undefined || projectId == 0) projectId = '';
    if (preSalesId === undefined) preSalesId = '';
    if (salesId === undefined) salesId = '';
    if (phoneNumber === undefined) phoneNumber = '';
    if (userName === undefined) userName = '';
    if (userName === undefined) userName = '';
    leadType = leadType || '';
    digitalPartner = digitalPartner || '';
    campaginName = campaginName || '';
    if (opportunityId === undefined) opportunityId = '';
    if (isExportExcel === undefined) isExportExcel = false;
    isExpried = isExpried || '';
    return this.http.get<Page<LeadDto[]>>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_UNIQUE_LEADS_DETAILS}?userId=${userId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&isMenuLeads=${isMenuLeads}&preSalesId=${preSalesId}&salesId=${salesId}&phoneNumber=${phoneNumber}&userName=${userName}&leadType=${leadType}&opportunityId=${opportunityId}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&isExportExcel=${isExportExcel}&isExpried=${isExpried}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }
  fetchLeadsCurrentStatusDashboardCountNew(
    userId: number,
    roleId: number,
    digitalPartner: any,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any,
    teamUserId?: any,
    teamId?: any,
    campaginName?: any,
    sourceIds?: any,
    subSourceIds?: any,
    isExpried?: any
  ): Observable<any> {
    rangeOfDays =
      rangeOfDays !== undefined && rangeOfDays !== null ? rangeOfDays : '';
    customStartDate = customStartDate || '';
    customEndDate = customEndDate || '';
    if (projectId === undefined || projectId === 0) projectId = '';
    (teamUserId = teamUserId || ''), (teamId = teamId || '');
    digitalPartner = digitalPartner || '';
    campaginName = campaginName ? campaginName : '';
    sourceIds = sourceIds || [];
    subSourceIds = subSourceIds || [];
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEAD_CURRENT_STATUS_COUNT_NEW}?rangeOfDays=${rangeOfDays}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&projectId=${projectId}&teamUserId=${teamUserId}&teamId=${teamId}&userId=${userId}&roleId=${roleId}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&sourceId=${sourceIds}&subSourceId=${subSourceIds}&isExpried=${isExpried}`
    );
  }

  getDashBoardLeadsDetailsNew(
    userId: number,
    roleId: number,
    digitalPartner: any,
    page: number,
    pageSize: number,
    isMenuLeads: boolean,
    rangeOfDays?: any,
    startDate?: any,
    endDate?: any,
    projectId?: any,
    sourceId?: any,
    subSourceId?: any,
    statusId?: any,
    preSalesId?: any,
    salesId?: any,
    phoneNumber?: any,
    userName?: any,
    leadType?: any,
    opportunityId?: string,
    salesleads?: any,
    campaginName?: any,
    isExportExcel?: any,
    followUpType?: any,
    isExpried?: any
  ) {
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (startDate == undefined) startDate = '';
    if (endDate == undefined) endDate = '';
    if (sourceId === undefined) sourceId = '';
    if (subSourceId === undefined) subSourceId = '';
    if (statusId === undefined) statusId = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    if (preSalesId === undefined) preSalesId = '';
    if (salesId === undefined) salesId = '';
    if (phoneNumber === undefined) phoneNumber = '';
    if (userName === undefined) userName = '';
    if (userName === undefined) userName = '';
    salesleads = salesleads || false;
    leadType = leadType || '';
    digitalPartner = digitalPartner || '';
    campaginName = campaginName || '';
    if (isExportExcel === undefined) isExportExcel = false;
    if (opportunityId === undefined) opportunityId = '';
    followUpType = followUpType || '';
    isExpried = isExpried || '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.DASHBOARD_LEADS_DETAILS_NEW}?userId=${userId}&roleId=${roleId}&page=${page}&pageSize=${pageSize}&range=${rangeOfDays}&startDate=${startDate}&endDate=${endDate}&projectId=${projectId}&sourceId=${sourceId}&subSourceId=${subSourceId}&statusId=${statusId}&isMenuLeads=${isMenuLeads}&preSalesId=${preSalesId}&salesId=${salesId}&phoneNumber=${phoneNumber}&userName=${userName}&leadType=${leadType}&opportunityId=${opportunityId}&salesLeads=${salesleads}&digitalPartner=${digitalPartner}&campaginName=${campaginName}&isExportExcel=${isExportExcel}&followUpType=${followUpType}&isExpried=${isExpried}`,
      {
        responseType: isExportExcel ? ('blob' as 'json') : 'json',
      }
    );
  }

  searchLead(phoneNumber: string, projectId: number) {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.SEARCH_LEAD}?projectId=${projectId}&phoneNumber=${phoneNumber}`
    );
  }

  fetchCpWiseDataForDownload(
    userId: number,
    roleId: number,
    rangeOfDays?: any,
    customStartDate?: any,
    customEndDate?: any,
    projectId?: any
  ): Observable<any> {
    console.log(rangeOfDays);
    if (rangeOfDays == undefined) rangeOfDays = 0;
    if (customStartDate == undefined) customStartDate = '';
    if (customEndDate == undefined) customEndDate = '';
    if (projectId === undefined || projectId === 0) projectId = '';
    return this.http.get<any>(
      `${environment.leadBaseUrl}${LeadPaths.CP_WISE_LEADS_DATA_DOWNLOAD}?rangeOfDays=${rangeOfDays}&startDate=${customStartDate}&endDate=${customEndDate}&userId=${userId}&roleId=${roleId}&projectId=${projectId}`,
      {
        responseType: 'blob' as 'json',
      }
    );
  }

  sendLeadTransferRequest(leadTransfer: LeadTransfer): Observable<any> {
    return this.http.post<any>(
      `${environment.leadBaseUrl}${LeadPaths.SEND_LEAD_TRANSFER_REQUEST}`,
      leadTransfer
    );
  }
}
