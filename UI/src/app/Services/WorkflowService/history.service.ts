import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { WorkflowHistoryDto } from 'src/app/Models/Workflow/workflowHistoryDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  getHistoryDetails(incidentId: number) {
    return this.http.get<WorkflowHistoryDto[]>(
      `${environment.workflowBaseUrl}${ControllerPaths.WORKFLOWSERVICE}/fetch/historydetails?incidentId=${incidentId}`
    );
  }

}
