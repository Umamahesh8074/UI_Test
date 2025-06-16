import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DOWNLOAD_DEMAND_LETTER_PDF,
  GENERATE_DEMAND_LETTER,
  GET_DEMANDLETTER_BY_BOOKINGID,
} from 'src/app/Apis/CrmApis/PaymentDetailsApis';
import {
  GET_ALL_CUSTOMER_STAGES_AND_PAYMENT_STATUS,
  GET_ALL_CUSTOMER_STAGES_WITH_TOTAL_AMOUNT,
  GET_CUSTOMER_STAGES,
  GET_CUSTOMER_STAGES_BY_BOOKINGID,
  GET_STAGE_BY_STAGE_ID,
  SAVE_CUSTOMER_STAGE,
  UPDATE_CUSTOMER_STAGE,
} from 'src/app/Apis/CrmApis/ProjectChargeApis';
import {
  CustomerStages,
  CustomerStagesDtoWithAmount,
  ICustomerStages,
  ICustomerStagesDto,
} from 'src/app/Models/Project/customerStages';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerStageService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  addCustomerStage(customerStage: ICustomerStages[]): Observable<string> {
    console.log(customerStage);
    return this.http.post<string>(
      `${environment.projectBaseUrl}${SAVE_CUSTOMER_STAGE}`,
      customerStage
    );
  }
  getCustomerStagesByBookingId(
    bookingId: number,
    stageName?: string
  ): Observable<CustomerStages[]> {
    console.log(bookingId);
    console.log(stageName);
    return this.http.get<CustomerStages[]>(
      `${environment.projectBaseUrl}${GET_CUSTOMER_STAGES_BY_BOOKINGID}?bookingId=${bookingId}&stageName=${stageName}`
    );
  }
  getStageByStageId(stageId: number): Observable<CustomerStages> {
    console.log(stageId);
    return this.http.get<CustomerStages>(
      `${environment.projectBaseUrl}${GET_STAGE_BY_STAGE_ID}${stageId}`
    );
  }

  updateCustomerStage(customerStage: ICustomerStages[]): Observable<string> {
    console.log(customerStage);
    return this.http.put<string>(
      `${environment.projectBaseUrl}${UPDATE_CUSTOMER_STAGE}`,
      customerStage
    );
  }

  getAllCustomerStages(
    page: number,
    size: number,
    projectId: number,
    typeCommonReferenceDetailsId: number,
    firstApplicantName?: string,
    stageName?: string,
    initiated?: string,
    unitName?: string,
    projectName?: string,
    stageOrder?: number,
    stageId?: number,
    typeId?: number,
    blockId?: number,
    planId?: number,
    roleName?: string,
    bookedById?: number
  ): Observable<Page<ICustomerStagesDto>> {
    planId = planId === undefined ? 0 : planId;
    projectName = projectName && projectName !== 'All' ? projectName : '';
    typeId = typeId === undefined ? 0 : typeId;
    console.log(page, size);
    return this.http.get<Page<ICustomerStagesDto>>(
      `${
        environment.projectBaseUrl
      }${GET_CUSTOMER_STAGES}?page=${page}&size=${size}&projectId=${
        projectId || 0
      }&typeCommonReferenceDetailsId=${
        typeCommonReferenceDetailsId || 0
      }&firstApplicantName=${firstApplicantName}&stageName=${stageName}&initiated=${initiated}&unitName=${unitName}&projectName=${projectName}&stageOrder=${stageOrder}&stageId=${stageId}&typeId=${typeId}&blockId=${blockId}&planId=${planId}&roleName=${roleName}&bookedById=${bookedById}`
    );
  }

  getCustomerStagesWithoutPagination(
    bookingId?: number,
    bookingName?: string,
    stageName?: string,
    initiated?: string
  ): Observable<CustomerStagesDtoWithAmount> {
    return this.http.get<CustomerStagesDtoWithAmount>(
      `${environment.projectBaseUrl}${GET_ALL_CUSTOMER_STAGES_AND_PAYMENT_STATUS}?bookingId=${bookingId}&bookingName=${bookingName}&stageName=${stageName}&initiated=${initiated}`
    );
  }

  generateDemandLetterPdf(filePath: string): Observable<Blob> {
    // Ensure the filePath is properly encoded for a URL
    const encodedFilePath = encodeURIComponent(filePath);

    return this.http.get<Blob>(
      `${environment.projectBaseUrl}${DOWNLOAD_DEMAND_LETTER_PDF}?filePath=${encodedFilePath}`,
      { responseType: 'blob' as 'json' }
    );
  }

  downloadFile(fileType: string, filePath: string): Observable<Blob> {
    const encodedFilePath = encodeURIComponent(filePath);
    return this.http.get<Blob>(
      `${environment.projectBaseUrl}/download/${fileType}?filePath=${encodedFilePath}`,
      { responseType: 'blob' as 'json' }
    );
  }

  generateIndividualDemandLetter(applicantId: number): Observable<string> {
    const url = `${environment.projectBaseUrl}${GENERATE_DEMAND_LETTER}?applicantId=${applicantId}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(() => {
        this._refreshRequired.next();
      })
    );
  }

  sendDemandLetter(bookingId: number, stageId?: number): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_DEMANDLETTER_BY_BOOKINGID}?bookingId=${bookingId}&stageId=${stageId}`
    );
  }

  getCustomerStages(
    bookingId?: number
  ): Observable<CustomerStagesDtoWithAmount> {
    return this.http.get<CustomerStagesDtoWithAmount>(
      `${environment.projectBaseUrl}${GET_ALL_CUSTOMER_STAGES_WITH_TOTAL_AMOUNT}?bookingId=${bookingId}`
    );
  }
}
