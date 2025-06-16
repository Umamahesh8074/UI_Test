import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  ControllerPaths,
  CRMControllerPaths,
} from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  DELETEPROJECT,
  GET_ALL_NOTIFICATIONS,
  GET_ALL_PROJECTS_FOR_SALES,
  GET_ALL_PROJECTS_SPEC,
  GET_NOTIFICATIONS,
  GETALLPROJECTBYORGID,
  GETALLPROJECTDETAILS,
  GETALLPROJECTS,
  GETALLPROJECTSBYIDS,
  GETALLPROJECTSFORPO,
  GETALLPROJECTSFORSTORE,
  GETBYPROJECTBYID,
  SAVECUSTOMERLEGALDOCUMENT,
  SAVEPROJECT,
  UPDATE_NOTES_STATUS_AS_READ,
  UPDATEPROJECT,
} from 'src/app/Apis/ProjectApis/Project';
import { Page } from 'src/app/Models/CommanModel/Page';
import {
  PaymentDetails,
  PaymentDetailsDto,
} from 'src/app/Models/Crm/PaymentDetails';
import {
  CustomerLegalDocument,
  Project,
  ProjectDetails,
  ProjectDocuments,
} from 'src/app/Models/Project/project';
import { SalesAgreementTemplateFieldsDto } from 'src/app/Models/Project/salesAggrementTemplate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private _refreshRequired: any;

  constructor(private http: HttpClient) {}

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  //adding project
  addProject(project: any, companyLogo: File | null): Observable<any> {
    console.log(project);
    const formData: FormData = new FormData();
    formData.append('projectBean', JSON.stringify(project));
    if (companyLogo) {
      formData.append('logo', companyLogo);
    } else {
      formData.append(
        'logo',
        new File([''], '', {
          type: '',
        })
      );
    }
    return this.http.post<any>(
      `${environment.projectBaseUrl}${SAVEPROJECT}`,
      formData
    );
  }

  //delete project
  deleteProject(projectId: number): Observable<string> {
    console.log(projectId);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${DELETEPROJECT}/${projectId}`
      )
      .pipe(
        tap(() => {
          this._refresh.next(); // Emit refresh event
        })
      );
  }

  //update project
  updateProject(project: any, companyLogo: File | null) {
    console.log(project);
    console.log(companyLogo);
    const formData: FormData = new FormData();
    formData.append('projectBean', JSON.stringify(project));
    if (companyLogo) {
      formData.append('logo', companyLogo);
    } else {
      formData.append(
        'logo',
        new File([''], '', {
          type: '',
        })
      );
    }
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATEPROJECT}`,
      formData
    );
  }

  //get all projects for pagination (spec)
  getAllProjects(
    projectName: string,
    page: number,
    size: number,
    displayProject: string,
    organizationId: number
  ): Observable<Page<Project>> {
    displayProject = displayProject || '';
    return this.http.get<Page<Project>>(
      `${environment.projectBaseUrl}${GET_ALL_PROJECTS_SPEC}?projectName=${projectName}&page=${page}&size=${size}&organizationId=${organizationId}&displayProject=${displayProject}`
    );
  }

  // get all projects with out pagination
  getProjects(name?: string, organizationId?: any) {
    name = name === undefined ? '' : name;
    if (organizationId === undefined || organizationId === null) {
      organizationId = '';
    } else {
      organizationId = organizationId;
    }
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GETALLPROJECTS}?name=${name}&organizationId=${organizationId}`
    );
  }

  //get projects based on id
  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(
      `${environment.projectBaseUrl}${GETBYPROJECTBYID}/${projectId}`
    );
  }

  getProjectsByOrgId(organizationId: number): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${environment.projectBaseUrl}${GETALLPROJECTBYORGID}?organizationId=${organizationId}`
    );
  }
  getProjectsByOrgIdWithProjectFilter(
    organizationId: any,
    projectName: any,
    displayProjectName?: string
  ): Observable<Project[]> {
    // If projectName is undefined, set it to an empty string
    const sanitizedProjectName = projectName !== undefined ? projectName : '';
    const sanitizedDisplayProjectName =
      displayProjectName !== undefined ? displayProjectName : '';

    return this.http.get<Project[]>(
      `${environment.projectBaseUrl}${GETALLPROJECTBYORGID}?organizationId=${organizationId}&projectName=${sanitizedProjectName}&displayProjectName=${sanitizedDisplayProjectName}`
    );
  }

  //get all projects for pagination (spec)
  getAllProjectsForSalesMember(
    projectName: string,
    page: number,
    size: number,
    displayProject: string,
    saleMemberId: number
  ): Observable<Page<Project>> {
    displayProject = displayProject || '';
    return this.http.get<Page<Project>>(
      `${environment.projectBaseUrl}${GET_ALL_PROJECTS_FOR_SALES}?projectName=${projectName}&page=${page}&size=${size}&saleMemberId=${saleMemberId}&displayProject=${displayProject}`
    );
  }

  getNotifications(roleId: number, userId: number): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_NOTIFICATIONS}?roleId=${roleId}&userId=${userId}`
    );
  }
  getAllNotifications(
    userId: number,
    roleId?: number,
    eventId?: number
  ): Observable<any> {
    roleId = roleId ?? 0;
    eventId = eventId ?? 0;
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_NOTIFICATIONS}?recipientId=${userId}&roleId=${roleId}` +
        `&eventId=${eventId}`
    );
  }

  addSalesAggrementTemplate(formData: any, files: File[]): Observable<any> {
    // alert(formData)
    const salesAgreementData = formData.salesAgreementTemplateBean;

    // Create FormData
    const requestPayload = new FormData();
    requestPayload.append(
      'salesAggrementTemplateBean',
      JSON.stringify(salesAgreementData)
    );

    files.forEach((file) => {
      requestPayload.append('files', file, file.name); // Append each file
    });

    // Return the Observable
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ControllerPaths.SALESAGGREMENTTEMPLATE}/save`,
      requestPayload
    );
  }

  getSalesAggrementTemplateByProjectI(
    projectId: number,
    projectDetailsId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${ControllerPaths.SALESAGGREMENTTEMPLATE}/getTemplatesByProjectId?projectId=${projectId}&projectDetailsId=${projectDetailsId}`
    );
  }

  addSalesAggrementTemplateFields(
    dto: SalesAgreementTemplateFieldsDto
  ): Observable<any> {
    console.log(dto);
    return this.http.post<any>(
      `${environment.projectBaseUrl}/salesAgreementTemplateFields/save/salesaggrementfields`,
      dto
    );
  }
  getFieldsForTemplates(
    projectId: number,
    templateId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${ControllerPaths.SALESAGGREMENTTEMPLATEFIELDS}/getfieldsbytemplateid?projectId=${projectId}&projectTemplateId=${templateId}`
    );
  }
  getValuesForFillingForm(
    projectId: number,
    flatName: string
  ): Observable<PaymentDetailsDto[]> {
    return this.http.get<PaymentDetailsDto[]>(
      `${environment.projectBaseUrl}${CRMControllerPaths.PAYMENT_DETAILS}/getallpaymentdetailsForSaleAgreement?projectId=${projectId}&unitName=${flatName}`
    );
  }
  // submitSalesAgreement(data: any): Observable<any> {
  //   return this.http.post<any>(
  //     `${environment.projectBaseUrl}${ControllerPaths.GENERATESALESAGGREMENT}/generate-pdf`, data
  //   );

  // }
  // submitSalesAgreement(data: any): Observable<any> {
  //   return this.http.post<any>(
  //     `${environment.projectBaseUrl}${ControllerPaths.GENERATESALESAGGREMENT}/generate-doc`, data
  //   );

  // }
  submitSalesAgreement(data: any): Observable<Blob> {
    return this.http.post<Blob>(
      `${environment.projectUrl}${ControllerPaths.GENERATESALESAGGREMENT}/generate-doc`,
      data,
      { responseType: 'blob' as 'json' } // Specify 'blob' for binary data
    );
  }

  // Generate Sales Agreement Excel
  generateSalesAgreementExcel(data: any): Observable<string> {
    return this.http.post(
      `${environment.projectBaseUrl}${ControllerPaths.GENERATESALESAGGREMENT}/update-excel`,
      data,
      { responseType: 'text' } // 👈 Expect a plain text response
    );
  }

  getSalesAgreementZip(
    projectId: number,
    flatNo: number,
    templateId: number
  ): Observable<HttpResponse<Blob>> {
    const url = `${environment.projectBaseUrl}${ControllerPaths.GENERATESALESAGGREMENT}/download-zip?projectId=${projectId}&flatNo=${flatNo}&templateId=${templateId}`;

    return this.http.get(url, {
      observe: 'response', // Observe full response to get headers
      responseType: 'blob', // Expect binary file
    });
  }

  getAllTemplates(
    salesAggrementTemplateName: any,
    page: number,
    size: number
  ): Observable<any> {
    if (salesAggrementTemplateName == undefined || 0)
      salesAggrementTemplateName = '';
    return this.http.get<any>(
      `${environment.projectBaseUrl}${ControllerPaths.SALESAGGREMENTTEMPLATE}/getall?salesAggrementTemplateName=${salesAggrementTemplateName}&page=${page}&size=${size}`
    );
  }

  getAllGeneratedAgreement(id: number) {
    return this.http.get<boolean>(
      `${environment.projectBaseUrl}${ControllerPaths.GENERATESALESAGGREMENT}/generatedtemplatecheck?&id=${id}`
    );
  }
  downloadSalesAgreement(
    id: number,
    projectId: number,
    unitName: string
  ): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.projectBaseUrl}${ControllerPaths.GENERATESALESAGGREMENT}/downloadsalesagreement?&id=${id}&projectId=${projectId}&unitName=${unitName}`,
      { responseType: 'blob' as 'json' }
    );
  }

  downloadSalesAgreementPdfOrDocx(
    id: number,
    projectId: number,
    unitName: string,
    fileType: string // New parameter
  ): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.projectBaseUrl}${ControllerPaths.GENERATESALESAGGREMENT}/downloadsalesagreement?id=${id}&projectId=${projectId}&unitName=${unitName}&fileType=${fileType}`,
      { responseType: 'blob' as 'json' }
    );
  }

  deleteTemplate(templateId: number): Observable<string> {
    console.log(templateId);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${ControllerPaths.SALESAGGREMENTTEMPLATE}/delete?salesAggrementTemplateId=${templateId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //adding customer legal document
  addCustomerLegalDocument(
    documentDetails: any,
    file: File | null
  ): Observable<any> {
    console.log(documentDetails);
    const formData: FormData = new FormData();
    formData.append('documentDetails', JSON.stringify(documentDetails));
    if (file) {
      formData.append('file', file);
    } else {
      formData.append(
        'file',
        new File([''], '', {
          type: '',
        })
      );
    }
    // formData.append('projectId',documentDetails.projectId);
    // console.log(formData);

    return this.http.post<any>(
      `${environment.projectBaseUrl}${SAVECUSTOMERLEGALDOCUMENT}`,
      formData
    );
  }

  getCustomerLegalDocument(
    documentType: any,
    projectName: string,
    projectId: number,
    page: number,
    size: number,
    roleName?: string
  ): Observable<Page<ProjectDocuments[]>> {
    (roleName == roleName) === undefined ? '' : roleName;
    return this.http.get<Page<ProjectDocuments[]>>(
      `${environment.projectBaseUrl}${ControllerPaths.CUSTOMERLEGALDOCUMENT}/getall?documetType=${documentType}&referanceId=${projectId}&projectName=${projectName}&page=${page}&size=${size}&roleName=${roleName}`
    );
  }

  getProjectDetailsByProjectId(
    projectId: number
  ): Observable<ProjectDetails[]> {
    return this.http.get<ProjectDetails[]>(
      `${environment.projectBaseUrl}${ControllerPaths.PROJECTDETAILS}/getbyprojectid?projectId=${projectId}`
    );
  }

  downloadFile(fileType: string, filePath: string): Observable<Blob> {
    console.log(filePath);
    const encodedFilePath = encodeURIComponent(filePath);
    return this.http.get<Blob>(
      `${environment.projectBaseUrl}/paymentdetails/download/${fileType}?filePath=${encodedFilePath}`,
      { responseType: 'blob' as 'json' }
    );
  }

  // get all projects with out pagination
  getProjectsByIds(
    name?: string,
    organizationId?: any,
    projectIds?: any,
    dislayProject?: any
  ) {
    name = name === undefined ? '' : name;
    if (organizationId === undefined || organizationId === null) {
      organizationId = '';
    } else {
      organizationId = organizationId;
    }
    projectIds = projectIds || '';
    dislayProject = dislayProject || '';
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GETALLPROJECTSBYIDS}?name=${name}&organizationId=${organizationId}&projectId=${projectIds}&dislayProject=${dislayProject}`
    );
  }
  getProjectsForPO(name?: string, organizationId?: any, userId?: any) {
    name = name === undefined ? '' : name;
    if (userId == undefined || userId === 0) userId = '';
    if (organizationId === undefined || organizationId === null) {
      organizationId = '';
    } else {
      organizationId = organizationId;
    }
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GETALLPROJECTSFORPO}?name=${name}&organizationId=${organizationId}&userId=${userId}`
    );
  }

  updateNotificationStatusAsRead(id: number): Observable<any> {
    const url = `${environment.projectBaseUrl}${UPDATE_NOTES_STATUS_AS_READ}?id=${id}`;
    console.log(url);

    return this.http.get<any>(
      `${environment.projectBaseUrl}${UPDATE_NOTES_STATUS_AS_READ}?id=${id}`
    );
  }

  getProjectsForStore(projectName?: string, organizationId?: any) {
    projectName = projectName === undefined ? '' : projectName;
    if (organizationId === undefined || organizationId === null) {
      organizationId = '';
    } else {
      organizationId = organizationId;
    }
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GETALLPROJECTSFORSTORE}?projectName=${projectName}&organizationId=${organizationId}`
    );
  }
  getProjectDetailsByProjectAndType(
    projectId?: number,
    typeId?: number
  ): Observable<ProjectDetails> {
    if (projectId == undefined || projectId === 0) {
      projectId = 0;
    }
    if (typeId == undefined || typeId === 0) {
      typeId = 0;
    }
    return this.http.get<ProjectDetails>(
      `${environment.projectBaseUrl}${GETALLPROJECTDETAILS}?projectId=${projectId}&typeId=${typeId}`
    );
  }
}
