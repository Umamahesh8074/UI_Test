import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  ADD_ALL_UNIT_TYPE,
  GET_ALL_UNIT_TYPE,
  GET_ALL_UNIT_TYPE_SPEC,
  UNIT_TYPE,
  UPDATE_ALL_UNIT_TYPE,
} from 'src/app/Apis/ProjectApis/Project';
import { Page } from 'src/app/Models/CommanModel/Page';
import { UnitType } from 'src/app/Models/Project/unit';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitTypeService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //fetch unit types with pagination
  getAllUnits(
    unitTypeName: string,
    page: number,
    size: number
  ): Observable<Page<any>> {
    return this.http.get<Page<any>>(
      `${environment.projectBaseUrl}${GET_ALL_UNIT_TYPE_SPEC}?unitTypeName=${unitTypeName}&page=${page}&size=${size}`
    );
  }

  //fetch unit types without pagination
  getAllUnitTypes(): Observable<UnitType[]> {
    return this.http.get<UnitType[]>(
      `${environment.projectBaseUrl}${GET_ALL_UNIT_TYPE}`
    );
  }

  addUnits(units: any): Observable<any> {
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ADD_ALL_UNIT_TYPE}`,
      units
    );
  }

  updateUnits(units: any): Observable<any> {
    return this.http.put<any>(
      `${environment.projectBaseUrl}${UPDATE_ALL_UNIT_TYPE}`,
      units
    );
  }

  deleteUnitType(unitTypeId: any) {
    return this.http
      .delete<any>(`${environment.projectBaseUrl}${UNIT_TYPE}/${unitTypeId}`)
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  getUnitTypeById(unitTypeId: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${UNIT_TYPE}/${unitTypeId}`
    );
  }

  getUnitTypeNames() {
    return this.http.get<string[]>(
      `${environment.projectBaseUrl}${ControllerPaths.UNITTYPE}/fetch/unittypenames`
    );
  }

  getAreas() {
    return this.http.get<number[]>(
      `${environment.projectBaseUrl}${ControllerPaths.UNITTYPE}/fetch/areas`
    );
  }
  getUnitTypeByProjectId(projectId: any) {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${UNIT_TYPE}/fetch/unittypes?projectId=${projectId}`
    );
  }

 
}
