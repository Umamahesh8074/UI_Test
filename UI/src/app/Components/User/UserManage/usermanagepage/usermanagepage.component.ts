import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import {
  IProjectSalesTeam,
  IProjectSalesTeamDto,
  ProjectSalesTeam,
} from 'src/app/Models/Presales/projectSalesTeam';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { User } from 'src/app/Models/User/User';
import {
  IUserManage,
  IUserManageDto,
  UserManage,
} from 'src/app/Models/User/UserManage'
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';

@Component({
  selector: 'app-usermanagepage',
  templateUrl: './usermanagepage.component.html',
  styleUrls: ['./usermanagepage.component.css'],
})
export class UsermanagepageComponent {
  constructor(
    private userManageService: UsermanageService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}
  private destroy$ = new Subject<void>();
  public user: User = new User();
  userManage?: IUserManage = new UserManage();
  userManageData: IUserManageDto[] = [];
  displayedColumns: string[] = ['projectName', 'userId', 'userName', 'actions'];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  organizationId: any;
  userName: any;
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    this.route.params.subscribe((params) => {
      this.handleRouteParams(params);
    });
    this.getUserManage();
  }
  referenceKey: any = 'SPP';
  pageSizeOptions = pageSizeOptions;

  getUserManage() {
    console.log('getting all user manage');
    this.userManageService
      .getUserManageDto(
        this.pageIndex,
        this.pageSize,
        this.referenceKey,
        '',
        this.userName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          this.userManageData = page.records;
          this.totalItems = page.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getUserManage();
  }

  addUserManage() {
    this.router.navigate(['layout/add/usermanage'], {
      state: {
        organizationId: this.organizationId,
        referenceKey: this.referenceKey,
      },
    });
  }

  onSearch(serachText: any) {
    this.userName = serachText;
    this.getUserManage();
  }

  editUserManage(data: any) {
    console.log(data.id);
    this.userManageService
      .getById(data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.userManage = data;
          this.router.navigate(['layout/add/usermanage'], {
            state: {
              organizationId: this.organizationId,
              referenceKey: this.referenceKey,
              userManage: data,
            },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete User Manage' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteById(id);
        }
      });
  }
  deleteById(id: any) {
    this.userManageService
      .deleteById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.getUserManage();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  private handleRouteParams(params: any): void {
    this.referenceKey = params['Team'];
    //const param2 = params['param2'];
    if (params['Team'] == 'P') {
      //this.title = 'Pre Sale Team';
    } else if (params['Team'] == 'S') {
      // this.title = 'Sale Team';
    } else if (params['Team'] === 'SA') {
      //this.title = 'Stage Approvals';
      //this.getStageType();
    } else if (params['Team'] === 'SP') {
      //this.title = 'Security Assign For QR Scan';
    } else if (params['Team'] === 'SPP') {
      //this.title = 'Security Assign For QR Scan On Project';
    }
  }
}
