import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths, PresalesControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { EoiDto } from 'src/app/Models/Eoi/eoi';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EoiService {
 

  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }
  addEoi(eoi: any,files?: {
    checkFile: any;
    
  }): Observable<any> {
    console.log(eoi);
    
    
    const formData: FormData = new FormData();
    formData.append('eoi', JSON.stringify(eoi));
    console.log(formData);

    console.log(files?.checkFile);
    // Append files to formData
    if (files) {
      console.log("enter into file");
      if (files.checkFile) {
        console.log("enter into file need to patch");
        formData.append('checkFile', files.checkFile);
      }
    }
    console.log(formData);
    
    return this.http.post<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.EOI}/save`,
      formData
    );
  }


  updateEoiDetails( eoi: any): Observable<any> {
    console.log(eoi);

    return this.http.put<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.EOI}/update`,
      eoi
    );
  }



  getAllEoiDetails(firstApplName:string,page:number,size: number) {
    console.log(firstApplName,page,size);
    if (firstApplName == undefined||'') firstApplName = '';
    return this.http.get<Page<EoiDto>>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.EOI}/getall?firstApplName=${firstApplName}&page=${page}&size=${size}`
    );
  }

  deleteEoiDetails(id: number): Observable<string> {
    console.log(id);
    return this.http.delete<string>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.EOI}/${id}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }


  getEoiById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.EOI}/${id}`
    );
  }


}
