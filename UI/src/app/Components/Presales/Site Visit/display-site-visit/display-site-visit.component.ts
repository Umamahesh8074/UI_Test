import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  pageSizeOptions,
  searchTextLength,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  ISiteVisit,
  ISiteVisitDto,
  SiteVisit,
  SiteVisitDto,
} from 'src/app/Models/Presales/siteVisit';
import { SiteVisitService } from 'src/app/Services/Presales/SiteVisit/site-visit.service';

@Component({
  selector: 'app-display-site-visit',
  templateUrl: './display-site-visit.component.html',
  styleUrls: ['./display-site-visit.component.css'],
})
export class DisplaySiteVisitComponent implements OnInit {
  destroy$ = new Subject<void>();
  siteVisits: SiteVisitDto[] = [];
  page: number = 0;
  size: number = 10;
  totalItems: number = 0;
  pageSizeOptions = pageSizeOptions;

  siteVisit: ISiteVisit = new SiteVisit();

  displayedColumns: string[] = [
    'name',
    'email',
    'flatType',
    'budget',
    'source',
    'followupDateTime',
    'actions',
  ];

  ngOnInit(): void {
    this.getAllSiteVisits();
  }

  constructor(
    private siteVisitService: SiteVisitService,
    private router: Router
  ) {}

  //get all site visits
  getAllSiteVisits(email?: string) {
    console.log(email);
    this.siteVisitService
      .getSiteVisits(this.page, this.size, email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.siteVisits = response.records;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onSearch(email: any) {
    console.log(email);
    console.log(email.length);
    if (email.length > searchTextLength) {
      this.getAllSiteVisits(email);
    }
  }

  addSiteVisit() {
    this.router.navigate(['layout/presales/site/visit']);
  }

  updateSiteVisit(siteVisitId: any) {
    this.fetchSiteVisit(siteVisitId);
  }

  fetchSiteVisit(siteVisitId: number) {
    console.log(siteVisitId);
    this.siteVisitService
      .getSiteVisitById(siteVisitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.siteVisit = response;
          console.log(this.siteVisit);
          this.router.navigate(['layout/presales/site/visit'], {
            state: { sitevisit: this.siteVisit },
          });
        },
      });
  }
  onPageChange(event: any) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
