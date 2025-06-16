import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { CRMControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  GENERATE_COST_SHEET,
  GET_ADDRESS_BY_PIN_CODE,
  GET_ADDRESS_BY_PIN_CODE_ADDRESS,
  GET_ALL_APPLICANT_INFO,
  GET_ALL_APPLICANT_INFO_BY_BOOKING_ID,
  GET_ALL_APPLICANT_INFO_BY_PROJECTID,
  GET_ALL_APPLICANT_INFO_FOR_SALEAGREEMENTS,
  GET_APPLICANT_INFO_BY_APPLICANT_ID,
  GET_APPLICANT_INFO_BY_ID,
  GET_APPLICANT_INFO_BY_ID_AND_STAGE_ID,
  GET_SALES_MEMBERS,
  GET_UNIT_DOCS,
  SAVE_APPLICANT_INFO,
  UPDATE_APPLICANT_INFO,
  UPLOAD_BOOKING_FORM,
} from 'src/app/Apis/CrmApis/ProjectChargeApis';
import {
  ApplicantInfo,
  IApplicantInfo,
  IApplicantInfoDto,
  ISaleMembers,
} from 'src/app/Models/Crm/ApplicantInfo';
import {
  CustomerPaymentDto,
  PaymentDetailsDto,
} from 'src/app/Models/Crm/PaymentDetails';
import { DocumentUrlDto } from 'src/app/Models/Project/project';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationInfoService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  addApplicantInfo(applicantInfo: IApplicantInfo): Observable<{
    bookingId: number;
    basePrice: number;
    message: string;
    applicantInfo: any;
  }> {
    console.log(applicantInfo);
    return this.http.post<{
      bookingId: number;
      basePrice: number;
      message: string;
      applicantInfo: any;
    }>(`${environment.projectBaseUrl}${SAVE_APPLICANT_INFO}`, applicantInfo);
  }

  getAllApplicantInfo(
    page: number,
    size: number,
    // status: string,
    typeCommonReferenceDetailsId: number,
    projectId: number,
    firstApplicantName?: string,
    projectName?: string,
    unitName?: string,
    bookedById?: number,
    typeId?: number,
    blockName?: string,
    blockId?: number,
    crmUserId?: number,
    levelId?: number,
    planId?: number,
    roleName?: string
  ): Observable<Page<IApplicantInfoDto>> {
    projectName = projectName && projectName !== 'All' ? projectName : '';
    console.log(page, size, name, unitName, bookedById);

    return this.http.get<Page<IApplicantInfoDto>>(
      `${
        environment.projectBaseUrl
      }${GET_ALL_APPLICANT_INFO}?page=${page}&size=${size}&typeCommonReferenceDetailsId=${
        typeCommonReferenceDetailsId || 0
      }
      &projectId=${projectId || 0}&firstApplicantName=${
        firstApplicantName || ''
      }&projectName=${projectName || ''}&unitName=${
        unitName || ''
      }&bookedById=${bookedById || ''}&typeId=${typeId || 0}&blockName=${
        blockName || ''
      }&blockId=${blockId || ''}
      &crmUserId=${crmUserId || ''}&levelId=${levelId || ''}&planId=${
        planId || ''
      }&roleName=${roleName || ''}`
    );
  }

  getAllApplicantInfoByProjectIdAndUnitId(
    projectId: number,
    applicantName?: string,
    unitId?: number
  ): Observable<IApplicantInfoDto[]> {
    console.log(unitId);
    console.log(applicantName);
    return this.http.get<IApplicantInfoDto[]>(
      `${environment.projectBaseUrl}${GET_ALL_APPLICANT_INFO_BY_PROJECTID}?projectId=${projectId}&firstApplicantFirstName=${applicantName}&unitId=${unitId}`
    );
  }
  getApplicantInfoByApplicantId(
    applicantId: number
  ): Observable<IApplicantInfo> {
    console.log(applicantId);
    return this.http.get<IApplicantInfo>(
      `${environment.projectBaseUrl}${GET_APPLICANT_INFO_BY_APPLICANT_ID}${applicantId}`
    );
  }

  getApplicantInfosByBookingId(
    bookingId: number
  ): Observable<IApplicantInfoDto> {
    console.log(bookingId);
    return this.http.get<IApplicantInfoDto>(
      `${environment.projectBaseUrl}${GET_ALL_APPLICANT_INFO_BY_BOOKING_ID}?bookingId=${bookingId}`
    );
  }

  // updateApplicantInfo(applicantInfo: IApplicantInfo[]): Observable<{ bookingId: number; basePrice: number; message: string; applicantInfo: any }> {
  //   console.log(applicantInfo);
  //   return this.http.put<{
  //     bookingId: number;
  //     basePrice: number;
  //     message: string;
  //     applicantInfo: any;
  //   }>(
  //     `${environment.projectBaseUrl}${UPDATE_APPLICANT_INFO}`,
  //     applicantInfo
  //   );
  // }

  updateApplicantInfo(
    applicantInfo: IApplicantInfo[],
    files?: { firstApplicantPanCard?: any },
    files1?: { firstApplicantAadharCard?: any },
    files2?: { secondApplicantPanCard?: any },
    files3?: { secondApplicantAadharCard?: any },
    files4?: { thirdApplicantPanCard?: any },
    files5?: { thirdApplicantAadharCard?: any },
    files6?: { sanctionLetter?: any }
  ): Observable<{
    bookingId: number;
    basePrice: number;
    message: string;
    applicantInfo: any;
  }> {
    const formData: FormData = new FormData();
    const serializedApplicantInfo = JSON.stringify(applicantInfo);
    console.log('Serialized Applicant Info:', serializedApplicantInfo);
    formData.append('applicantInfo', serializedApplicantInfo);
    if (files && files.firstApplicantPanCard) {
      formData.append('firstApplicantPanCard', files.firstApplicantPanCard);
    }
    if (files1 && files1.firstApplicantAadharCard) {
      formData.append(
        'firstApplicantAadharCard',
        files1.firstApplicantAadharCard
      );
    }
    if (files2 && files2.secondApplicantPanCard) {
      formData.append('secondApplicantPanCard', files2.secondApplicantPanCard);
    }
    if (files3 && files3.secondApplicantAadharCard) {
      formData.append(
        'secondApplicantAadharCard',
        files3.secondApplicantAadharCard
      );
    }
    if (files4 && files4.thirdApplicantPanCard) {
      formData.append('thirdApplicantPanCard', files4.thirdApplicantPanCard);
    }
    if (files5 && files5.thirdApplicantAadharCard) {
      formData.append(
        'thirdApplicantAadharCard',
        files5.thirdApplicantAadharCard
      );
    }
    if (files6 && files6.sanctionLetter) {
      formData.append('sanctionLetter', files6.sanctionLetter);
    }

    return this.http.put<{
      bookingId: number;
      basePrice: number;
      message: string;
      applicantInfo: any;
    }>(`${environment.projectBaseUrl}${UPDATE_APPLICANT_INFO}`, formData);
  }

  getApplicantInfoById(bookingId: number): Observable<any> {
    return this.http.get<Page<ApplicantInfo>>(
      `${environment.projectBaseUrl}${GET_APPLICANT_INFO_BY_ID}/${bookingId}`
    );
  }
  sendWelcomeEmail(userId: number, bookingId: number): Observable<string> {
    // Make a PUT request with userId and bookingId as query parameters
    return this.http.post<string>(
      `${environment.projectBaseUrl}${GET_APPLICANT_INFO_BY_ID}/send-welcome-email`,
      { userId, bookingId },
      { responseType: 'text' as 'json' }
    );
  }
  deleteApplicantInfo(id: any) {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${GET_APPLICANT_INFO_BY_ID}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }

  getCustomerDetails(applicantId: number): Observable<PaymentDetailsDto[]> {
    return this.http.get<PaymentDetailsDto[]>(
      `${environment.projectBaseUrl}${CRMControllerPaths.PAYMENT_DETAILS}/getallpaymentdetailsForSaleAgreement?applicantId=${applicantId}`
    );
  }

  getSaleMembers(
    projectId: number,
    typeCommonReferenceDetailsId: number
  ): Observable<ISaleMembers[]> {
    return this.http.get<ISaleMembers[]>(
      `${environment.projectBaseUrl}${GET_SALES_MEMBERS}?projectId=${projectId}&typeCommonReferenceDetailsId=${typeCommonReferenceDetailsId}`
    );
  }

  generateCostSheet(applicantId: number): Observable<string> {
    const url = `${environment.projectBaseUrl}${GENERATE_COST_SHEET}?applicantId=${applicantId}`;
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(() => {
        this._refreshRequired.next();
      })
    );
  }
  uploadBookingForm(bookingId: number, files: File[]): Observable<any> {
    const formData = new FormData();

    // Append bookingId as a parameter
    formData.append('bookingId', bookingId.toString());

    // Append files to FormData
    files.forEach((file) => {
      formData.append('file', file, file.name);
    });
    console.log(formData);

    // Set the API endpoint and make the PUT request
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPLOAD_BOOKING_FORM}`,
      formData
    );
  }
  downloadDemandDraft(demandLetterUrl: string): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${CRMControllerPaths.PAYMENT_DETAILS}/dmnpdf?filePath=${demandLetterUrl}`
    );
  }
  getUnitDocuments(unitId: number, roleName?: string) {
    return this.http.get<DocumentUrlDto[]>(
      `${environment.projectBaseUrl}${GET_UNIT_DOCS}?unitId=${unitId}&roleName=${roleName}`
    );
  }
  getApplicantStageDetails(
    bookingId: number,
    stageId: number,
    transactionTypeId?: number
  ): Observable<any> {
    transactionTypeId = transactionTypeId === undefined ? 0 : transactionTypeId;
    return this.http.get<Page<CustomerPaymentDto>>(
      `${environment.projectBaseUrl}${GET_APPLICANT_INFO_BY_ID_AND_STAGE_ID}?applicantId=${bookingId}&stageId=${stageId}&transactionTypeId=${transactionTypeId}`
    );
  }

  getAddressByPinCode(
    pincode: any,
    location: string
  ): Observable<Map<string, string>> {
    console.log(pincode);
    return this.http.get<Map<string, string>>(
      `${environment.projectBaseUrl}${GET_ADDRESS_BY_PIN_CODE}?pincode=${pincode}&location=${location}`
    );
  }

  private apiUrl = `${environment.projectBaseUrl}${GET_ADDRESS_BY_PIN_CODE_ADDRESS}`; // The base URL

  // Service method to get filtered addresses based on query and pincode
  getAddresses(query: string, pincode: string): Observable<string[]> {
    return this.http
      .get<Map<string, string>>(
        `${this.apiUrl}?query=${query}&pincode=${pincode}`
      )
      .pipe(
        map((response: Map<string, string>) => {
          // Extract the keys from the Map to get the city names or addresses
          return Array.from(response.keys());
        })
      );
  }

  uploadSaleAgreement(
    bookingId: number,
    file: File,
    fileName: string,
    isSignedSaleAgreement?: boolean
  ): Observable<{ fileUrl: string; message: string }> {
    const formData = new FormData();
    formData.append('bookingId', bookingId.toString());
    formData.append('multipartFile', file); // Ensure the key matches the backend
    formData.append('fileName', fileName);
    if (isSignedSaleAgreement != undefined) {
      formData.append(
        'isSignedSaleAgreement',
        isSignedSaleAgreement.toString()
      );
    }

    return this.http.put<{ fileUrl: string; message: string }>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/uploadsaleagreement`,
      formData
    );
  }

  updateCrmUserId(bookingIds: number[], crmUserId: number): Observable<string> {
    const payload = { bookingIds, crmUserId };

    return this.http.post<string>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/update-crm-user`,
      payload,
      { responseType: 'text' as 'json' } // Ensure response is treated as text
    );
  }

  getPendingApplicantDetails(
    page: number,
    size: number,
    userId: number,
    projectId?: number,
    unitId?: number,
    applicantName?: string
  ): Observable<Page<ApplicantInfo>> {
    projectId = projectId === undefined ? 0 : projectId;
    unitId = unitId === undefined ? 0 : unitId;
    applicantName = applicantName === undefined ? '' : applicantName;
    return this.http.get<Page<ApplicantInfo[]>>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/pending/applicants?page=${page}&size=${size}&loggedInUserId=${userId}&projectId=${projectId}&unitId=${unitId}&applicantName=${applicantName}`
    );
  }

  moveSaleAgreementToWorkFlow(
    bookingId: number,
    userId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/send/workflow?applicantId=${bookingId}&loggedInUserId=${userId}`
    );
  }
  getApprovedApplicantDetails(
    page: number,
    size: number,
    userId: number,
    projectId?: number,
    unitId?: number,
    applicantName?: string
  ): Observable<Page<ApplicantInfo>> {
    return this.http.get<Page<ApplicantInfo[]>>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/approved/applicants?page=${page}&size=${size}&loggedInUserId=${userId}&projectId=${projectId}&unitId=${unitId}&applicantName=${applicantName}`
    );
  }
  moveSaleAgreementAfterWorkFlow(
    bookingId: number,
    userId: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/afterrework/send/workflow?applicantId=${bookingId}&loggedInUserId=${userId}`
    );
  }

  getAllApplicantInfoForSaleAgreements(
    page: number,
    size: number,
    status: string,
    projectId: any,
    typeCommonReferenceDetailsId: number,
    firstApplicantName?: string,
    projectName?: string,
    unitName?: string,
    blockId?: any,
    crmUserId?: number,
    levelId?: number,
    planId?: number,
    actionStatusId?: number,
    typeId?: number
    // roleName?: string
  ): Observable<Page<IApplicantInfoDto>> {
    projectName = projectName && projectName !== 'All' ? projectName : '';
    console.log(page, size, name, unitName);
    actionStatusId = actionStatusId === undefined ? 0 : actionStatusId;
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<Page<IApplicantInfoDto>>(
      `${
        environment.projectBaseUrl
      }${GET_ALL_APPLICANT_INFO_FOR_SALEAGREEMENTS}?page=${page}&size=${size}&status=${status}&projectId=${
        projectId || 0
      }&typeCommonReferenceDetailsId=${typeCommonReferenceDetailsId}&firstApplicantName=${
        firstApplicantName || ''
      }&projectName=${projectName || ''}&unitName=${unitName || ''}&blockId=${
        blockId || ''
      }&crmUserId=${crmUserId || ''}&levelId=${levelId || ''}&planId=${
        planId || ''
      }&actionStatusId=${actionStatusId}&typeId=${typeId}
      `
    );
  }
  updateCancelRemarks(
    bookingId: number,
    remarks: string,
    userId: number,
    fileName: string,
    selectedFile: any,
    cancelledBookingDate: any
  ): Observable<any> {
    const formData = new FormData();
    formData.append('applicantId', bookingId.toString());
    formData.append('remarks', remarks);
    formData.append('logedInUserId', userId.toString());
    formData.append('fileName', fileName);
    formData.append('multipartFile', selectedFile);
    formData.append('cancelledBookingDate', cancelledBookingDate);
    return this.http.put<any>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/update/cancel/remarks`,
      formData
    );
  }
  getPendingApplicantDetailsForCancelBooking(
    page: number,
    size: number,
    userId: number,
    projectId?: number,
    unitId?: number,
    applicantName?: string,
    selectedStatus?: string,
    typeId?: number
  ): Observable<Page<ApplicantInfo>> {
    projectId = projectId === undefined ? 0 : projectId;
    unitId = unitId === undefined ? 0 : unitId;
    applicantName = applicantName === undefined ? '' : applicantName;
    selectedStatus = selectedStatus === undefined ? '' : selectedStatus;
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<Page<ApplicantInfo[]>>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/cancel/booking/pending/applicants?page=${page}&size=${size}&loggedInUserId=${userId}&projectId=${projectId}&unitId=${unitId}&applicantName=${applicantName}&status=${selectedStatus}&typeId=${typeId}`
    );
  }
  getApprovedApplicantDetailsForCancelBooking(
    page: number,
    size: number,
    userId: number,
    projectId?: number,
    unitId?: number,
    applicantName?: string,
    selectedStatus?: string
  ): Observable<Page<ApplicantInfo>> {
    projectId = projectId === undefined ? 0 : projectId;
    unitId = unitId === undefined ? 0 : unitId;
    applicantName = applicantName === undefined ? '' : applicantName;
    selectedStatus = selectedStatus === undefined ? '' : selectedStatus;
    return this.http.get<Page<ApplicantInfo[]>>(
      `${environment.projectBaseUrl}${CRMControllerPaths.APPLICANT_INFO}/cancel/booking/approved/applicants?page=${page}&size=${size}&loggedInUserId=${userId}&projectId=${projectId}&unitId=${unitId}&applicantName=${applicantName}&status=${selectedStatus}`
    );
  }
}
