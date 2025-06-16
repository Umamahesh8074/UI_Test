import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GET_ALL_SITE_VISITS_SPEC,
  GET_SITE_VISIT_BY_ID,
  SAVE_SITE_VISIT,
  UPDATE_SITE_VISIT,
} from 'src/app/Apis/Presales/presales';
import {
  ISiteVisitDto,
  SiteVisit,
  SiteVisitDto,
} from 'src/app/Models/Presales/siteVisit';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SiteVisitService {
  constructor(private http: HttpClient) {}

  //get all site visits
  getSiteVisits(
    page: number,
    size: number,
    email?: string
  ): Observable<Page<ISiteVisitDto>> {
    email = email ? email : '';
    return this.http.get<Page<SiteVisitDto>>(
      `${environment.leadBaseUrl}${GET_ALL_SITE_VISITS_SPEC}?email=${email}&page=${page}&size=${size}`
    );
  }

  //save site visit
  saveSiteVisit(siteVisit: SiteVisit): Observable<SiteVisit> {
    console.log(siteVisit);
    return this.http.post<SiteVisit>(
      `${environment.leadBaseUrl}${SAVE_SITE_VISIT}`,
      siteVisit
    );
  }

  //update site visit
  updateSiteVisit(siteVisit: SiteVisit): Observable<SiteVisit> {
    console.log(siteVisit);
    return this.http.put<SiteVisit>(
      `${environment.leadBaseUrl}${UPDATE_SITE_VISIT}`,
      siteVisit
    );
  }

  //get site visit by id
  getSiteVisitById(siteVisitId: number): Observable<SiteVisit> {
    console.log(siteVisitId);
    return this.http.get<SiteVisit>(
      `${environment.leadBaseUrl}${GET_SITE_VISIT_BY_ID}/${siteVisitId}`
    );
  }
}
