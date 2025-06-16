import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

import {
  ILevelsByProject,
  IPojectBookingChargesDto,
  IProjectCharge,
  IProjectChargeDto,
  LevelsByProject,
} from 'src/app/Models/Crm/ProjectCharge';
import {
  DELETE_PROJECT_CHARGES,
  GETALL_PROJECT_CHARGE,
  GETALL_PROJECT_CHARGE_SPEC,
  GETALL_PROJECT__BOOKING_CHARGE,
  LEVELS_BY_PROJECT_ID,
  PROJECT_CHARGE_BY_ID,
  SAVE_PROJECT_CHARGE,
} from 'src/app/Apis/CrmApis/ProjectChargeApis';

@Injectable({
  providedIn: 'root',
})
export class ProjectChargeService {
  constructor(private http: HttpClient) {}

  // Define refreshRequired as a Subject
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  getAllProjectCharges(
    chargeName: string,
    page: number,
    size: number
  ): Observable<Page<IProjectChargeDto>> {
    console.log(chargeName, page, size);
    return this.http.get<Page<IProjectChargeDto>>(
      `${environment.projectBaseUrl}${GETALL_PROJECT_CHARGE_SPEC}?name=${chargeName}&page=${page}&size=${size}`
    );
  }
  getProjectCharges(
    amountCalculate: number,
    chargeIn: number,
    projectId: number,
    levelId: number,
    phaseId: number
  ): Observable<IProjectChargeDto[]> {
    console.log(amountCalculate, chargeIn, projectId, levelId, phaseId);
    return this.http.get<IProjectChargeDto[]>(
      `${environment.projectBaseUrl}${GETALL_PROJECT_CHARGE}?amountCalculate=${amountCalculate}&chargeIn=${chargeIn}&projectId=${projectId}&levelId=${levelId}&phaseId=${phaseId}`
    );
  }

  getAllProjectChargesWithoutFilters(
    amountCalculate: number,
    chargeIn: number,
    projectId: number,
    levelId: number,
    phaseId: number
  ): Observable<IProjectChargeDto[]> {
    console.log(amountCalculate, chargeIn, projectId, levelId, phaseId);
    return this.http.get<IProjectChargeDto[]>(
      `${environment.projectBaseUrl}${GETALL_PROJECT_CHARGE}?amountCalculate=${amountCalculate}&chargeIn=${chargeIn}&projectId=${projectId}&levelId=${levelId}&phaseId=${phaseId}`
    );
  }

  // getProjectCharges(
  //   chargeIn: number,projectId: number,levelId: number
  // ): Observable<IProjectChargeDto[]>{
  //   console.log(chargeIn,projectId,levelId);
  //   return this.http.get<IProjectChargeDto[]>(
  //     `${environment.projectBaseUrl}${GETALL_PROJECT_CHARGE}?chargeIn=${chargeIn}&projectId=${projectId}&levelId=${levelId}`
  //   );
  // }

  addProjectCharge(projectCharge: IProjectCharge): Observable<string> {
    console.log(projectCharge);
    return this.http.post<string>(
      `${environment.projectBaseUrl}${SAVE_PROJECT_CHARGE}`,
      projectCharge
    );
  }

  getProjectChargeById(projectChargeId: number): Observable<IProjectCharge> {
    return this.http.get<IProjectCharge>(
      `${environment.projectBaseUrl}${PROJECT_CHARGE_BY_ID}${projectChargeId}`
    );
  }
  updateProjectCharge(projectCharge: IProjectCharge): Observable<string> {
    console.log(projectCharge);
    return this.http.post<string>(
      `${environment.projectBaseUrl}${SAVE_PROJECT_CHARGE}`,
      projectCharge
    );
  }
  // updatePrimeActivity(
  //   PrimeActivityCode: IPrimeActivityCode
  // ): Observable<string> {
  //   return this.http.put<string>(
  //     `${environment.procurementBaseUrl}${UPDATE_PRIME_ACTIVITY_CODE}`,
  //     PrimeActivityCode
  //   );
  // }

  // inActivatePrimeActivityCode(primeActivityCodeId: number): Observable<string> {
  //   return this.http
  //     .delete<string>(
  //       `${environment.procurementBaseUrl}${PRIME_ACTIVITY_CODE_BY_ID}/${primeActivityCodeId}`
  //     )
  //     .pipe(
  //       tap(() => {
  //         this._refreshRequired.next();
  //       })
  //     );
  // }

  // getAllPrimeActivityCodeWithOutPage(
  //   primeActivityNumber?: string
  // ): Observable<IPrimeActivityCodeDto[]> {
  //   primeActivityNumber =
  //     primeActivityNumber === undefined ? '' : primeActivityNumber;
  //   return this.http.get<IPrimeActivityCodeDto[]>(
  //     `${environment.procurementBaseUrl}${GETALL_PRIME_ACTIVITY_CODE}?primeActivityNumber=${primeActivityNumber}`
  //   );
  // }
  getLevelsByProjectId(
    projectId: number,
    levelName?: string
  ): Observable<LevelsByProject> {
    return this.http.get<LevelsByProject>(
      `${environment.projectBaseUrl}${LEVELS_BY_PROJECT_ID}?projectId=${projectId}&levelName=${levelName}`
    );
  }

  getProjectBookingCharges(
    bookingId: any,
    name?: string,
    projectId?: any,
    levelId?: any
  ): Observable<IPojectBookingChargesDto[]> {
    console.log(bookingId);
    return this.http.get<IPojectBookingChargesDto[]>(
      `${environment.projectBaseUrl}${GETALL_PROJECT__BOOKING_CHARGE}?bookingId=${bookingId}&name=${name}&projectId=${projectId}&levelId=${levelId}`
    );
  }

  deleteProjectCharge(id: any) {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.projectBaseUrl}${DELETE_PROJECT_CHARGES}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
