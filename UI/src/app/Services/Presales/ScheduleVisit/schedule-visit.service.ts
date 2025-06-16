import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GET_ALL_SCHEDULE_VISITS_SPEC,
  GET_SCHEDULE_VISIT_BY_ID,
  SAVE_SCHEDULE_VISIT,
  UPDATE_SCHEDULE_VISIT,
} from 'src/app/Apis/Presales/presales';
import {
  ScheduleVisit,
  ScheduleVisitDto,
} from 'src/app/Models/Presales/scheduleVisit';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleVisitService {
  constructor(private http: HttpClient) {}

  //get all schedule visits with pagination
  getAllScheduleVisits(
    page: any,
    size: any,
    leadId: number
  ): Observable<Page<ScheduleVisitDto>> {
    console.log(page, size,leadId);
    return this.http.get<Page<ScheduleVisitDto>>(
      `${environment.leadBaseUrl}${GET_ALL_SCHEDULE_VISITS_SPEC}?leadId=${leadId}&page=${page}&size=${size}`
    );
  }

  //save schedule visits
  saveScheduleVisit(scheduleVisit: ScheduleVisit): Observable<ScheduleVisit> {
    console.log('schedule visits' + scheduleVisit);
    return this.http.post<ScheduleVisit>(
      `${environment.leadBaseUrl}${SAVE_SCHEDULE_VISIT}`,
      scheduleVisit
    );
  }
  


  //update schedule visit
  updateScheduleVisit(scheduleVisit: ScheduleVisit): Observable<ScheduleVisit> {
    console.log('schedule visits' + scheduleVisit);
    return this.http.put<ScheduleVisit>(
      `${environment.leadBaseUrl}${UPDATE_SCHEDULE_VISIT}`,
      scheduleVisit
    );
  }

  //get schedule visit based on id
  getScheduleVisit(id: any): Observable<ScheduleVisit> {
    console.log(id);
    return this.http.get<ScheduleVisit>(
      `${environment.leadBaseUrl}${GET_SCHEDULE_VISIT_BY_ID}/${id}`
    );
  }
}
