import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import {
  ControllerPaths,
  CRMControllerPaths,
} from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Page } from 'src/app/Models/CommanModel/Page';
import { Approvals } from 'src/app/Models/Procurement/approvals';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApprovalsService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  // get all approvalss to display approvals in front end
  // getAllApprovals(size: any, index: any): Observable<Page<Approvals>> {
  //   return this.http.get<Page<Approvals>>(
  //     `${environment.baseUrl}${ControllerPaths.WORKFLOWSERVICE}/all/${index}/${size}`
  //   );
  // }

  //adding approvals
  addApprovals(approvals: any): Observable<any> {
    console.log(approvals);
    return this.http.post<any>(
      `${environment.workflowBaseUrl}${ControllerPaths.WORKFLOWSERVICE}/save`,
      approvals
    );
  }

  deleteApprovals(approvalsId: number): Observable<string> {
    console.log(approvalsId);
    return this.http
      .delete<string>(
        `${environment.workflowBaseUrl}${ControllerPaths.WORKFLOWSERVICE}/${approvalsId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update approvals
  updateApprovals(approvals: any): Observable<any> {
    console.log(approvals);
    console.log(approvals);
    return this.http.put<any>(
      `${environment.workflowBaseUrl}${ControllerPaths.WORKFLOWSERVICE}/update`,
      approvals
    );
  }

  //getting filter data based on approvals name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/approvals/approvalss?approvalsName=Users&page=0&size=10
  getAllApprovals(roleId: number, page: any, size: any) {
    console.log(roleId, page, size);
    return this.http.get<Page<Approvals>>(
      `${environment.workflowBaseUrl}${ControllerPaths.WORKFLOWSERVICE}/fetch?roleId=${roleId}&page=${page}&size=${size}`
    );
  }

  getAllApprovalsWithoutPages(roleId: number) {
    return this.http.get<Approvals[]>(
      `${environment.workflowBaseUrl}${ControllerPaths.WORKFLOWSERVICE}/approvals?roleId=${roleId}`
    );
  }

  updateApprovalStatus(
    incidentId: number,
    workflowTypeId: number,
    userId: number,
    status: string,
    remarks: string
  ) {
    return this.http.get<String>(
      `${environment.workflowBaseUrl}${ControllerPaths.WORKFLOWSERVICE}/updateapprovalstatus?incidentId=${incidentId}&workFlowTypeId=${workflowTypeId}&status=${status}&remarks=${remarks}&userId=${userId}`
    );
  }
  uploadPaymentReceipts(
    paymentId: number,
    file: File,
    fileName: string
  ): Observable<string> {
    const formData = new FormData();
    formData.append('paymentId', paymentId.toString());
    formData.append('multipartFile', file); // Ensure the key matches the backend
    formData.append('fileName', fileName);
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    return this.http
      .put<string>(
        `${environment.projectBaseUrl}${CRMControllerPaths.PAYMENT_DETAILS}/uploadpaymentreceipts`,
        formData
      )
      .pipe(
        catchError((error) => {
          console.error('Error uploading file:', error);
          return throwError(
            () => new Error('Failed to upload payment receipts')
          );
        })
      );
  }
}
