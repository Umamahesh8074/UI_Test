import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Client } from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';
import { Page } from 'src/app/Models/CommanModel/Page';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  //get all clients to display client in front end
  // getAllclient(size: any, index: any): Observable<Page<client>> {
  //   return this.http.get<Page<client>>(
  //     `${environment.baseUrl}${ControllerPaths.CLIENT}/all/${index}/${size}`
  //   );
  // }

  //adding client
  addclient(client: any): Observable<any> {
    console.log(client);
    return this.http.post<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/save`,
      client
    );
  }

  deleteclient(clientId: number): Observable<string> {
    console.log(clientId);
    return this.http
      .delete<string>(
        `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/${clientId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update client
  updateclient(client: any): Observable<any> {
    console.log(client);
    console.log(client);
    return this.http.put<any>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/update`,
      client
    );
  }

  //getting filter data based on client name
  // event,this.pageIndex,this.pageSize
  // http://localhost:9000/api/user/client/clients?clientName=Users&page=0&size=10
  getAllclient(clientName: string, page: any, size: any) {
    console.log(clientName, page, size);
    return this.http.get<Page<Client>>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/clients?clientName=${clientName}&page=${page}&size=${size}`
    );
  }
  getAllclients(
    clientName: string,
    projectLocation: string,
    page: number,
    size: number
  ) {
    console.log(clientName, projectLocation, page, size);
    if (clientName == undefined || 0) clientName = '';
    if (projectLocation == undefined || 0) projectLocation = '';
    return this.http.get<Page<Client>>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/getall?clientName=${clientName}&projectLocation=${projectLocation}&page=${page}&size=${size}`
    );
  }
  getClientById(clientId: number): Observable<Client> {
    return this.http.get<Client>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/${clientId}`
    );
  }

  getClientByIdServiceName(clientId: number): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/client/${clientId}`
    );
  }

  getClientDetailsByClientId(): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${environment.facilitymanagementBaseUrl}${ControllerPaths.CLIENT}/fetchall`
    );
  }
}
