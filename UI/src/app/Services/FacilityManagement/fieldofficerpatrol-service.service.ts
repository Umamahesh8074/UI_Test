import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IFeildOfficerpatrol } from 'src/app/Models/Securitypatrol/feildofficerpatrol';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FieldofficerpatrolServiceService {

   constructor(
      private http: HttpClient,
    ) {}
    // url = '/api/facility-management/attendance';
    private _refreshRequired = new Subject<void>();
  
    get refreshRequired() {
      return this._refreshRequired;
    }
      

      getAllFeildOfficerPatrol(page:number,size:number,organizationId?:number,projectId?:number,userName?:string,userId?:number,startDate?:any,endDate?:any,dateRange?:any):Observable<Page<IFeildOfficerpatrol[]>>{
        organizationId=organizationId===undefined?0:organizationId;
        projectId=projectId===undefined?0:projectId;
        userName=userName===undefined?'':userName;
        userId=userId===undefined?0:userId;
        startDate=startDate==null?'':startDate;
         endDate=endDate==null?'':endDate;
        dateRange=dateRange==undefined?'':dateRange
        return this.http.get<Page<IFeildOfficerpatrol[]>>(
          `${environment.facilitymanagementBaseUrl}/${ControllerPaths.FEILDOFFICER_PATROL}/getallfiledofficepatrol?page=${page}&size=${size}&organizationId=${organizationId}&projectId=${projectId}&userName=${userName}&userId=${userId}&startDate=${startDate}&endDate=${endDate}&rangeOfDays=${dateRange}`
        )
      }
      deleteFeildOfficerPatrolId(patrolId:number):Observable<any>{
        return this.http.delete<any>(`${environment.facilitymanagementBaseUrl}${ControllerPaths.FEILDOFFICER_PATROL}/${patrolId}`);
      }
}
