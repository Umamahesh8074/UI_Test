import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  ADD_ALL_UNITS,
  ALL_SBA_AREA,
  ALL_UNITS,
  ALL_UNITS_NAME,
  CHECKING_UNITS,
  DELETE_UNIT,
  GET_ALL_UNITS,
  GET_ALL_UNITS_SPEC,
  GET_UNITS_DATA,
  GET_UNIT_BY_UNIT_ID,
  GET_UNIT_TYPES,
  GET_UNIT_TYPE_BY_UNIT_ID,
  UPDATE_ALL_UNITS,
  UPDATE_UNIT_STATUS,
} from 'src/app/Apis/ProjectApis/Project';
import { Page } from 'src/app/Models/CommanModel/Page';
import { AvailableUnitsDto } from 'src/app/Models/Project/unit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  addUnits(units: any): Observable<any> {
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ADD_ALL_UNITS}`,
      units
    );
  }

  deleteUnit(unitId: any) {
    return this.http
      .delete<any>(`${environment.projectBaseUrl}${DELETE_UNIT}/${unitId}`)
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }
  getAllUnits(
    unitName: string,
    page: number,
    size: number,
    projectName: string,
    blockName: string,
    status?: string,
    projectId?: any,
    blockId?: any,
    typeId?: number
  ): Observable<Page<any>> {
    if (projectName === undefined) projectName = '';
    const finalStatus = status === undefined || status === 'All' ? '' : status;
    projectId = projectId === undefined ? '' : projectId;
    blockId = blockId === undefined ? '' : blockId;
    typeId = typeId === undefined ? 0 : typeId;
    return this.http.get<Page<any>>(
      `${environment.projectBaseUrl}${GET_ALL_UNITS_SPEC}?unitName=${unitName}&projectName=${projectName}&page=${page}&size=${size}&blockName=${blockName}&status=${finalStatus}&projectId=${projectId}&blockId=${blockId}&companyTypeId=${typeId}`
    );
  }
  updateUnits(units: any) {
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATE_ALL_UNITS}`,
      units
    );
  }

  getUnitById(unitId: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${ALL_UNITS}?unitId=${unitId}`
    );
  }
  getUnitByName(unitName: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${ALL_UNITS_NAME}?unitName=${unitName}`
    );
  }
  getUnitsBasedOnLevelId(
    levelId: number,
    status?: string,
    unitName?: string,
    unitTypeId?: number
  ): Observable<any> {
    unitTypeId = unitTypeId === undefined ? 0 : unitTypeId;
    status = status === undefined ? '' : status;
    unitName = unitName === undefined ? '' : unitName;
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_UNITS}?levelId=${levelId}&status=${status}&unitName=${unitName}&unitTypeId=${unitTypeId}`
    );
  }

  getAvailableUnits(
    page: number,
    size: number,
    projectId: number,
    blockId: number,
    levelId: number,
    phaseReferenceId: number,
    unitTypeReferenceId: number,
    area: number
  ): Observable<Page<AvailableUnitsDto[]>> {
    return this.http.get<Page<AvailableUnitsDto[]>>(
      `${environment.projectBaseUrl}${ControllerPaths.UNIT}/fetch/availableunits?page=${page}&size=${size}&projectId=${projectId}
      &blockId=${blockId}&levelId=${levelId}&phaseReferenceId=${phaseReferenceId}&unitTypeReferenceId=${unitTypeReferenceId}&area=${area}`
    );
  }

  getAllAvailableUnits(
    projectId?: number,
    unitName?: string
  ): Observable<AvailableUnitsDto[]> {
    return this.http.get<AvailableUnitsDto[]>(
      `${environment.projectBaseUrl}${ControllerPaths.UNIT}/get/availableunits?projectId=${projectId}&unitName=${unitName}
      `
    );
  }
  downloadExcel(
    projectId: number,
    blockId: number,
    levelId: number,
    phaseReferenceId: number,
    unitTypeReferenceId: number,
    area: number
  ): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${ControllerPaths.UNIT}/generate?projectId=${projectId}&blockId=${blockId}
      &levelId=${levelId}&phaseReferenceId=${phaseReferenceId}&unitTypeReferenceId=${unitTypeReferenceId}&area=${area}`,
      { responseType: 'blob' as 'json' }
    );
  }
  getBookedUnits(
    page: number,
    size: number,
    projectId: number,
    blockId: number,
    levelId: number,
    phaseReferenceId: number,
    unitType: string,
    area: number
  ): Observable<Page<AvailableUnitsDto[]>> {
    return this.http.get<Page<AvailableUnitsDto[]>>(
      `${environment.projectBaseUrl}${ControllerPaths.UNIT}/fetch/bookedunits?page=${page}&size=${size}&projectId=${projectId}
      &blockId=${blockId}&levelId=${levelId}&phaseReferenceId=${phaseReferenceId}&unitType=${unitType}&area=${area}`
    );
  }

  getUnitTypeByUnitId(unitId: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_UNIT_TYPE_BY_UNIT_ID}?unitId=${unitId}`
    );
  }
  getUnitByUnitId(unitId: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_UNIT_BY_UNIT_ID}/${unitId}`
    );
  }

  getAllUnitsBasedOnProjectId(
    projectId: any,
    unitName?: string,
    blockId?: any
  ): Observable<any> {
    const validUnitName = (unitName = unitName === undefined ? '' : unitName);
    if (projectId === undefined || projectId === 0) projectId = '';
    if (blockId === undefined || blockId === 0) blockId = '';
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_ALL_UNITS}?projectId=${projectId}&unitName=${validUnitName}&blockId=${blockId}`
    );
  }
  getAreas() {
    return this.http.get<number[]>(
      `${environment.projectBaseUrl}${ALL_SBA_AREA}`
    );
  }

  checkingUnits(projectId: number, blockId: number, levelId: number) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${CHECKING_UNITS}?projectId=${projectId}&blockId=${blockId}&levelId=${levelId}`
    );
  }

  getAllUnitTypes(projectId: number, unitTypeName?: string): Observable<any> {
    projectId = projectId === undefined ? 0 : projectId;
    unitTypeName = unitTypeName === undefined ? '' : unitTypeName;
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_UNIT_TYPES}?projectId=${projectId}&unitTypeName=${unitTypeName}`
    );
  }
  getUnitDetailsData(projectId: number, unitId: number): Observable<any> {
    projectId = projectId === undefined ? 0 : projectId;
    return this.http.get<any>(
      `${environment.projectBaseUrl}${GET_UNITS_DATA}?projectId=${projectId}&unitId=${unitId}`
    );
  }
  updateUnitStatus(units: any) {
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATE_UNIT_STATUS}`,
      units
    );
  }
}
