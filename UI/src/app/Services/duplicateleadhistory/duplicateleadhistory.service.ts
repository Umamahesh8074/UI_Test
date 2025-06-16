import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Page } from 'src/app/Models/CommanModel/Page';
import { Duplicateleadhistory } from 'src/app/Models/duplicateleadhistory/duplicateleadhistory';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class duplicateleadhistoryService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all duplicateleadhistorys to display duplicateleadhistory in front end
  // getAllduplicateleadhistory(size: any, index: any): Observable<Page<duplicateleadhistory>> {
  //   return this.http.get<Page<duplicateleadhistory>>(
  //     `${environment.baseUrl}${ControllerPaths.DUPLICATELEADHISTORY}/all/${index}/${size}`
  //   );
  // }

  //adding duplicateleadhistory
  addduplicateleadhistory(duplicateleadhistory: any): Observable<any> {
    console.log(duplicateleadhistory);
    return this.http.post<any>(
      `${environment.leadBaseUrl}${ControllerPaths.DUPLICATELEADHISTORY}/save`,
      duplicateleadhistory
    );
  }


  deleteduplicateleadhistory(duplicateleadhistoryId: number): Observable<string> {
    console.log(duplicateleadhistoryId);
    return this.http.delete<string>(
      `${environment.leadBaseUrl}${ControllerPaths.DUPLICATELEADHISTORY}/${duplicateleadhistoryId}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }

  //update duplicateleadhistory
  updateduplicateleadhistory(duplicateleadhistory: any): Observable<any> {
    console.log(duplicateleadhistory);
    console.log(duplicateleadhistory);
    return this.http.put<any>(
      `${environment.leadBaseUrl}${ControllerPaths.DUPLICATELEADHISTORY}/update`,
      duplicateleadhistory
    );
  }

  //getting filter data based on duplicateleadhistory name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/duplicateleadhistory/duplicateleadhistorys?duplicateleadhistoryName=Users&page=0&size=10
  getAllduplicateleadhistory( duplicateleadhistoryName: string,page: any,size: any) {
    console.log(duplicateleadhistoryName,page,size);
    return this.http.get<Page<Duplicateleadhistory>>(
      `${environment.leadBaseUrl}${ControllerPaths.DUPLICATELEADHISTORY}/duplicateleadhistorys?duplicateleadhistoryName=${duplicateleadhistoryName}&page=${page}&size=${size}`
    );
  }
}
