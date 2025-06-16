import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  IIndentDto,
  IIndentItems,
  IndentDto,
} from 'src/app/Models/Procurement/indentDto';
import { StageDto } from 'src/app/Models/Project/stage';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { IndentItemService } from 'src/app/Services/ProcurementService/IndentItem/indent-item.service';

@Component({
  selector: 'indent-details',
  templateUrl: './indent-details.component.html',
  styleUrls: ['./indent-details.component.css'],
})
export class IndentDetailsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  indentsArray: IIndentDto = new IndentDto();
  indentItems: IIndentItems[] = [];
  previousIndentItems: IIndentItems[] = [];
  totalItems: number = TOTAL_ITEMS;
  previousTotalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  previousPageSize = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  previousPageIndex = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  indentId: number = 0;
  stages: StageDto[] = [];
  isLoading: boolean = true;
  isFromQuotation: boolean = false;
  status: string = '';
  displayPageData: any;
  loggedInUserId: number = 0;
  organizationId: number = 0;
  createdUserId: number = 0;

  displayColumns: string[] = [
    'itemCategory',
    'subCategory',
    'specification',
    'itemUnit',
    'quantity',
  ];

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getDataFromState();
  }
  constructor(
    private indentItemService: IndentItemService,
    private router: Router,
    private indentService: IndentService,
    private loaderService: LoaderService,
    private commonService: CommanService
  ) {}

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.loggedInUserId = user.userId;
      this.organizationId = user.organizationId;
    }
  }

  getDataFromState() {
    const { indentData, status, displayPage } = history.state;

    if (status === 'PendingQuotation') {
      this.isFromQuotation = true;
    }
    console.log(indentData);
    if (displayPage) {
      this.displayPageData = displayPage;
    }
    if (indentData) {
      this.indentsArray = indentData;
      this.createdUserId = indentData.createdUserId;
    }
    this.status = status;
    this.indentId = indentData.indentId;
    if (this.indentId && this.createdUserId > 0) {
      this.loadDetails();
    }
  }

  loadDetails() {
    this.showLoading();
    this.isLoading = true;
    forkJoin({
      indentItems:
        this.indentItemService.getIndentItemsByIndentIdWithPagination(
          this.indentId,
          this.pageIndex,
          this.pageSize,
          this.loggedInUserId
        ),
      previousIndentItems:
        this.indentItemService.getPreviousIndentItemsByIndentIdWithPagination(
          this.indentId,
          this.previousPageIndex,
          this.previousPageSize,
          this.loggedInUserId
        ),
      stages: this.indentService.getStages(this.indentId, this.createdUserId),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ indentItems, stages, previousIndentItems }) => {
          this.indentItems = indentItems.records;
          this.previousIndentItems = previousIndentItems.records;
          this.totalItems = indentItems.totalRecords;
          this.previousTotalItems = previousIndentItems.totalRecords;
          this.stages = stages;
          this.hideLoading();
        },
        error: (err) => {
          console.error(err);
          this.hideLoading();
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  gotoIndent() {
    if (this.status === 'PendingIndent') {
      this.router.navigate(['/layout/procurement/indent'], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    } else if (this.status === 'ApprovedIndent') {
      this.router.navigate(['/layout/procurement/app/rej/rework/Indents'], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    } else if (this.status === 'PendingQuotation') {
      this.router.navigate(['/layout/procurement/quotation'], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDetails();
  }
  onPreviousIndentPageChange(event: any) {
    this.previousPageSize = event.pageSize;
    this.previousPageIndex = event.pageIndex;
    this.loadDetails();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
