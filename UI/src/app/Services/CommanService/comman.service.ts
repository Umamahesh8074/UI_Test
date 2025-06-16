import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject, catchError, map, of, takeUntil } from 'rxjs';
import { MenuDto } from 'src/app/Models/CommanModel/menuDto';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  GET_REF_DETAILS_BY_REF_TYPE,
  GET_REF_DETAILS_ID_BY_REF_TYPE_AND_KEY,
  GET_REF_DETAILS_WITH_FILTERS,
} from 'src/app/Apis/CommonRefernceDetailsApis/CommonRefernceDetails';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { UPDATE_CP_APPROVAL } from 'src/app/Apis/Presales/presales';
import {
  GETALLDOCUMENTS,
  URL_DOWNLOAD_DOCUMENT,
} from 'src/app/Apis/ProcurementApis/documnet';
import { GETALLROLEMENUITEM } from 'src/app/Apis/UserApis/RoleMenuItem';
import {
  UPDATE_WORK_ORDER_BILLING_QUANTITY_STATUS,
  UPDATE_WORK_ORDER_QUANTITY_STATUS,
} from 'src/app/Apis/WorkOrderApis/WorkOrderBilling';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RoleService } from '../UserService/role.service';
import { LeadsCommonService } from './leads-common.service';
import { text } from 'd3';
import { GET_QUOTATION_TERMS_AND_CONDITIONS } from 'src/app/Apis/ProcurementApis/Quotation';

@Injectable({
  providedIn: 'root',
})
export class CommanService {
  getByRefDetails(TRANSACTION_TYPE_PAYMENT: string) {
    throw new Error('Method not implemented.');
  }
  destroy$ = new Subject<void>();
  isCpApproval: boolean = false;

  constructor(
    private http: HttpClient,
    private roleService: RoleService,
    public dialog: MatDialog,
    private router: Router,
    private leadCommonService: LeadsCommonService
  ) {}
  private menuItems: MenuDto[] = [];
  //fetching all menus and sub menuItems
  getMenu(roleId: number): Observable<MenuDto[]> {
    return this.http
      .get<MenuDto[]>(
        `${environment.userBaseUrl}${GETALLROLEMENUITEM}/${roleId}`
      )
      .pipe(
        map((menuItems) => {
          this.menuItems = menuItems;
          return menuItems;
        }),
        catchError((error) => {
          console.error('Error fetching menu items', error);
          return of([]);
        })
      );

    return this.http.get<MenuDto[]>(
      `${environment.userBaseUrl}${GETALLROLEMENUITEM}/${roleId}`
    );
  }

  fetchCommonReferenceTypes(type: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.userBaseUrl}${ControllerPaths.COMMON_REFERENCE_TYPE}/${type}`
    );
  }
  fetchCommonReferenceTypesByKey(
    type: string
  ): Observable<CommonReferenceDetails> {
    return this.http.get<CommonReferenceDetails>(
      `${environment.userBaseUrl}${ControllerPaths.COMMON_REFERENCE_KEY}?refKey=${type}`
    );
  }
  //fetch status of schedule visit
  getRefDetailsByType(refTypeName: string): Observable<any> {
    console.log(refTypeName);
    return this.http.get<any>(
      `${environment.userBaseUrl}${GET_REF_DETAILS_BY_REF_TYPE}/${refTypeName}`
    );
  }
  hasPermission(path: string): boolean {
    return this.menuItems.some((menu) =>
      menu.menuItems.some((item) => {
        console.log(item.path + ' ==> ' + path);
        return item.path === path;
      })
    );
  }

  getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  openApprovalDialog(
    status: string,
    incidentId: number,
    workflowTypeId: number,
    userId: number,
    isCpApprove?: any,
    cpId?: any
  ) {
    console.log('isCpApprove' + isCpApprove);

    const dialogRef = this.dialog.open(ApproveDialogComponent, {
      width: '60%',
      height: '250px',
    });

    if (this.isCpApproval != undefined) {
      this.isCpApproval = isCpApprove;
    }
    console.log('isCpApprove after approve...' + this.isCpApproval);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'result');
      if (result === 'cancel') {
        // this.router.navigate(['layout/presales/cp/approve'], {});
      } else {
        console.log('' + result);
        this.updateApproval(
          status,
          result.remarks,
          incidentId,
          workflowTypeId,
          userId,
          cpId
        );
      }
    });
  }

  /**
   * Updates the approval status for channel partner
   */
  updateApproval(
    status: string,
    remarks: string,
    incidentId: number,
    workflowTypeId: number,
    userId: number,
    cpId: any
  ) {
    this.leadCommonService.showLoading();
    if (this.isCpApproval) {
      this.updateCpApprovalStatus(
        incidentId,
        workflowTypeId,
        userId,
        status,
        remarks,
        cpId
      )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedApproval: any) => {
            this.leadCommonService.hideLoading();

            const responseMessage = updatedApproval.message;
            console.log(responseMessage);

            if (status == 'cancel') {
              Swal.fire({
                icon: 'error',
                text: responseMessage,
              });
            } else {
              Swal.fire({
                icon: 'success',
                text: responseMessage,
              });
            }

            if (responseMessage) {
              this.router.navigate(['layout/presales/cp/approval/ACP'], {});
            }
          },
          error: (error: any) => {
            console.log(error);
            let errorMsg = 'An unexpected error occurred.';

            try {
              const rawMsg = error?.error?.message;

              // Example: '409 Conflict: "{\"error\":\"Email already exists\"}"'
              const match = rawMsg?.match(/\"(\{.*\})\"/);

              if (match && match[1]) {
                const parsed = JSON.parse(match[1]);
                errorMsg = parsed.error || errorMsg;
              } else {
                // If not in nested format, show raw message
                errorMsg = rawMsg || errorMsg;
              }
            } catch (e) {
              console.error('Error parsing backend error:', e);
              errorMsg = 'An error occurred while processing your request.';
            }

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errorMsg,
            });

            this.leadCommonService.hideLoading();
          },
        });
    } else {
      this.updateApprovalStatus(
        incidentId,
        workflowTypeId,
        userId,
        status,
        remarks
      )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedApproval: any) => {
            console.log(updatedApproval);
            this.leadCommonService.hideLoading();

            // this.router.navigate(['layout/presales/cp/approval/ACP']);
            this.router.navigate([
              'layout/procurement/purchase/order/approval/APO',
            ]);
          },
          error: (error: Error) => {
            console.log(error);
            this.leadCommonService.hideLoading();
          },
        });
    }
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

  updateCpApprovalStatus(
    incidentId: number,
    workflowTypeId: number,
    userId: number,
    status: string,
    remarks: string,
    cpId: string
  ) {
    return this.http.get<String>(
      `${environment.leadBaseUrl}${UPDATE_CP_APPROVAL}?incidentId=${incidentId}&workFlowTypeId=${workflowTypeId}&status=${status}&remarks=${remarks}&userId=${userId}&cpId=${cpId}`
    );
  }
  getRefDetailsId(typeName: any, key: any): Observable<any> {
    console.log(key);
    return this.http.get<any>(
      `${environment.userBaseUrl}${GET_REF_DETAILS_ID_BY_REF_TYPE_AND_KEY}?refTypeName=${typeName}&refKey=${key}`
    );
  }

  getCommanReferanceDetailsWithFilters(refTypeName: string, refValue?: string) {
    refValue = refValue === undefined ? '' : refValue;
    return this.http.get<any>(
      `${environment.userBaseUrl}${GET_REF_DETAILS_WITH_FILTERS}?refTypeName=${refTypeName}&refValue=${refValue}`
    );
  }

  getDocumentById(
    referanceId: number,
    documetType: string,
    page: number,
    size: number
  ) {
    console.log(referanceId);
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GETALLDOCUMENTS}?referanceId=${referanceId}&documetType=${documetType}&page=${page}&size=${size}`
    );
  }

  /* Don't use this method */

  // downLoadDocument(
  //   subFolderName: string,
  //   url: string,
  //   documetType: string
  // ): Observable<Blob> {
  //   console.log(subFolderName, url);
  //   return this.http.get<Blob>(
  //     `${environment.procurementBaseUrl}${DOWNLOAD_DOCUMENT}?subFolderName=${subFolderName}&url=${url}&documentType=${documetType}`,
  //     { responseType: 'blob' as 'json' }
  //   );
  // }

  // downLoadDocument1(fileName: string): Observable<Blob> {
  //   console.log(fileName);
  //   return this.http.get<Blob>(
  //     `${environment.procurementBaseUrl}${URL_DOWNLOAD_DOCUMENT}?filename=${fileName}`,
  //     { responseType: 'blob' as 'json' }
  //   );
  // }

  updateBillingStatus(billingId: number) {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_WORK_ORDER_BILLING_QUANTITY_STATUS}?billingId=${billingId}`,
      billingId
    );
  }

  updateQuantityStatus(workOrderId: number, status: String) {
    return this.http.put<string>(
      `${environment.procurementBaseUrl}${UPDATE_WORK_ORDER_QUANTITY_STATUS}?workOrderId=${workOrderId}&status=${status}`,
      workOrderId
    );
  }

  downLoadDoc(filePath: string): Observable<Blob> {
    const encodedFilePath = encodeURIComponent(filePath);
    return this.http.get<Blob>(
      `${environment.procurementBaseUrl}${URL_DOWNLOAD_DOCUMENT}?filename=${encodedFilePath}`,
      { responseType: 'blob' as 'json' }
    );
  }

  getTermsAndCond(quotationId: number, page: number, size: number) {
    return this.http.get<any>(
      `${environment.procurementBaseUrl}${GET_QUOTATION_TERMS_AND_CONDITIONS}?page=${page}&size=${size}&quotationId=${quotationId}`
    );
  }
}
