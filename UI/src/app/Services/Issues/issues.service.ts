import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';

import { CustomerIssueDetailsDto, Issues, IssuesCountByProjectDto, IssuesCountDto, IssuesDto, Page, SalesResponse } from 'src/app/Models/Issues/issues';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { environment } from 'src/environments/environment';
import * as Highcharts from 'highcharts';
@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  constructor(private http: HttpClient) { }

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  addIssues(issues:any,imageFile: File): Observable<any> {
    const formData = new FormData();
    const headers = new HttpHeaders();

    // issues.append('image',imageFile);
    // if(imageFile!=null){
    //   issues.image=imageFile;
    // }
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('issues', new Blob([JSON.stringify(issues)], {
      type: 'application/json'
    }));

    if (imageFile) {
      formData.append('imageFile', imageFile,
         imageFile.name);
    }

    headers.append('Content-Type', 'multipart/form-data');


    return this.http.post<any>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/save`,
      formData,
      { headers: headers }
    );
  }



  deleteIssues(issuesId: number): Observable<string> {
    console.log(issuesId);
    return this.http.delete<string>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/${issuesId}`
    ).pipe(
      tap(() => {
        this._refreshRequired.next(); // Emit refresh event
      })
    );
  }

  //update issues
  updateIssues(issues: any): Observable<any> {
    console.log(issues);
    console.log(issues);
    return this.http.patch<any>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/update`,
      issues
    );
  }

  //getting filter data based on issues name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/issues/issuess?issuesName=Users&page=0&size=10
  getAllIssues(issuesName: string, page: any, size: any) {
    console.log(issuesName, page, size);
    return this.http.get<Page<Issues>>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/issuess?issuesName=${issuesName}&page=${page}&size=${size}`
    );
  }
  getAllIssuesWithPagination(page: number, size: number, userId: number): Observable<Page<IssuesDto[]>> {
    return this.http.get<Page<IssuesDto[]>>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/getall/${page}/${size}?userId=${userId}`
    );
  }
  getIssuesByUserId(userId: number,roleName:string,page: number, size: number,status:string): Observable<Page<CustomerIssueDetailsDto[]>> {
    return this.http.get<Page<CustomerIssueDetailsDto[]>>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/getissues/${page}/${size}?userId=${userId}&roleName=${roleName}&issueStatus=${status}`
    );
  }
  getReassignIssueTypeByUserId(page: number, size: number, userId: number): Observable<Page<CustomerIssueDetailsDto[]>> {
    return this.http.get<Page<CustomerIssueDetailsDto[]>>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/reasignIssueType/${page}/${size}/${userId}`
    );
  }
  updateReassignIssueType(issues: any): Observable<any> {
    console.log(issues);
    console.log(issues);
    return this.http.patch<any>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/reasignissue`,
      issues
    );
  }
  getIssuesCount() {
    return this.http.get<IssuesCountDto[]>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/issuescount`
    );
  }
  getIssuesCountByProject() {
    return this.http.get<IssuesCountByProjectDto[]>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/issuescountbyprojects`
    );
  }

  getIssueTypes(typeName: string, issueType: string): Observable<CommonReferenceDetailsDto[]> {
    return this.http.get<CommonReferenceDetailsDto[]>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/getissuetypes?typeName=${typeName}&issueType=${issueType}`
    );
  }
  reOpenIssue(issues: any): Observable<any> {
    console.log(issues);
    console.log(issues);
    return this.http.patch<any>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/reopenissue`,
      issues
    );
  }
  getImage(filename: string): Observable<Blob> {
    return this.http.get(`${environment.projectBaseUrl}${ControllerPaths.ISSUES}/image/${filename}`, { responseType: 'blob' });
  }

  getIssueStatusByIssueType(): Observable<IssuesCountByProjectDto[]>
  {
    return this.http.get<IssuesCountByProjectDto[]>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/issuescountbyissuetype`
    );
  }

  // getAllIssuesForAdmin(page: number, size: number):Observable<Page<IssuesDto[]>>
  // {
  //   return this.http.get<Page<IssuesDto[]>>(
  //     `${environment.facilitymanagementBaseUrl}${ControllerPaths.ISSUES}/getall/${page}/${size}`
  //   );
  // }
  createChart(container: any, options: any) {
    Highcharts.chart(container, options);
  }

  getIssueStatusByIssueType1() {
    return this.http.get<IssuesCountByProjectDto[]>(
      `${environment.projectBaseUrl}${ControllerPaths.ISSUES}/issuesstatuscountbyissuetype`
    );

  }

}
