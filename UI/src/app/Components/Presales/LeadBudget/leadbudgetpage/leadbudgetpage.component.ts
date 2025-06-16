import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { ILeadBudget, LeadBudget } from 'src/app/Models/LeadBudget/leadBudget';
import { User } from 'src/app/Models/User/User';
import { LeadbudgetService } from 'src/app/Services/LeadBugetService/leadbudget.service';

@Component({
  selector: 'app-leadbudgetpage',
  templateUrl: './leadbudgetpage.component.html',
  styleUrls: ['./leadbudgetpage.component.css'],
})
export class LeadbudgetpageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  leadBudget: ILeadBudget = new LeadBudget();
  leadBudgets: LeadBudget[] = [];
  userName: string = '';
  displayedColumns: string[] = [
    'sourceName',
    'paymentDate',
    'amount',
    'actions',
  ];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  stageType: any = [];
  stages: any = [];
  constructor(
    // private userService: UserService,
    private leadBudgetSevice: LeadbudgetService,
    private router: Router
  ) {}
  public user: User = new User();
  organizationId: any;
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    this.getLeadBudgets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getLeadBudgets();
  }

  getLeadBudgets() {
    this.leadBudgetSevice
      .getAllLeadBudget(this.pageIndex, this.pageSize, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.leadBudgets = data.records;
          console.log(data.records);
          this.totalItems = data.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  addLeadBuget() {
    this.router.navigate(['layout/presales/saveleadbudget'], {
      state: {
        //isAdding: this.isAdding,
        organizationId: this.organizationId,
      },
    });
  }
  updateLeadBuget(leadBudgetId: any) {
    this.fetchLeadBudgetById(leadBudgetId);
  }

  fetchLeadBudgetById(leadBudgetId: any): void {
    this.leadBudgetSevice.fetchLeadBudget(leadBudgetId).subscribe({
      next: (leadBudget: LeadBudget) => {
        console.log(leadBudget);
        this.router.navigate(['layout/presales/saveleadbudget'], {
          state: {
            leadBudget: leadBudget,
            organizationId: this.organizationId,
          },
        });
      },
      error: (error: any) => {
        console.error('Error fetching lead budget by id:', error);
      },
    });
  }
  
}
