import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { User } from 'src/app/Models/User/User';
import { Menu } from 'src/app/Models/User/menu';
import { MenuService } from 'src/app/Services/UserService/menu.service';

@Component({
  selector: 'app-displaymenu',
  templateUrl: './displaymenu.component.html',
  styleUrls: ['./displaymenu.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplaymenuComponent implements OnInit {
  private destroy$ = new Subject<void>();
  menuData: Menu[] = [];
  menuName: string = '';
  displayedColumns: string[] = ['menuName', 'status', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  organizationId: any;
  public user: User = new User();
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  pageSizeOptions = pageSizeOptions;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    this.getMenu(this.menuName, this.organizationId);
  }
  onSearch(searchText: any) {
    this.menuName = searchText;
    this.getMenu(this.menuName, this.organizationId);
  }
  constructor(
    private menuService: MenuService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getMenu(this.menuName, this.organizationId, this.pageIndex);
  }

  getMenu(menuName: string, organizationId: number, pageIndex: number = 0) {
    // Reset to the first page if a new search term is entered
    if (this.menuName !== menuName) {
        this.pageIndex = 0;
    } else {
        this.pageIndex = pageIndex;  // Maintain the current page index if the search term is the same
    }

    this.menuName = menuName;
    this.menuService
        .getAllMenu(menuName, this.pageIndex, this.pageSize, organizationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (menuData) => {
                this.menuData = menuData.records;
                this.totalItems = menuData.totalRecords;
            },
            error: (error) => {
                console.error('Error fetching menus:', error);
            },
        });
}

  ///opening confirm dialog
  openConfirmDialog(menuId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Menu' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteMenu(menuId);
        }
      }
    );
  }

  //delete menu by menu id
  deleteMenu(menuId: number) {
    this.menuService
      .deleteMenu(menuId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menuData) => {
          console.log(menuData);
          this.getMenu('', this.organizationId);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding menu
  addMenu() {
    this.router.navigate(['layout/addmenu'], {
      state: { organizationId: this.organizationId },
    });
  }

  editMenu(menuData: any) {
    this.router.navigate(['layout/addmenu'], {
      state: { menu: menuData, organizationId: this.organizationId },
    });
  }
}
