import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GET_SOA_DOCUMENTS } from 'src/app/Apis/CrmApis/PaymentDetailsApis';
import { IDocumentDto, IPaymentCount } from 'src/app/Models/Crm/dashboard';
import { Page } from 'src/app/Models/Qrgenerator/qrgenerator';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrmDocumentsService {

 constructor(private http: HttpClient) {}
 
   // Define refreshRequired as a Subject
   private _refreshRequired = new Subject<void>();
   public refreshRequired = this._refreshRequired.asObservable();
     getAllSoaDocument(
      projectId?:number,
      unitId?:number,
      page?:number,
      size?:number,
      fristapplicantName?:string,
      typeId?:number
     ): Observable<Page<IDocumentDto[]>> {
      
      projectId=projectId===undefined?0:projectId;
      unitId=unitId===undefined?0:unitId;
       typeId=typeId===undefined?0:typeId;
       return this.http.get<Page<IDocumentDto[]>>(
         `${environment.projectBaseUrl}${GET_SOA_DOCUMENTS}?projectId=${projectId}&unitId=${unitId}&page=${page}&size=${size}&fristapplicantName=${fristapplicantName}&typeId=${typeId}`  
       );
     }
 
}
