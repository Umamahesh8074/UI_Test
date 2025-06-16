import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { User } from 'src/app/Models/User/User';
import { MenuItem } from 'src/app/Models/User/menuItem';
import { MenuItemDto } from 'src/app/Models/User/menuItemDto';
import { MenuItemService } from 'src/app/Services/UserService/menu-item.service';

@Component({
  selector: 'app-display-menu-item',
  templateUrl: './display-menu-item.component.html',
  styleUrls: ['./display-menu-item.component.css'],
})
export class DisplayMenuItemComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  menuItemData: MenuItemDto[] = [];
  menuItemName: string = '';
  displayedColumns: string[] = [
    'menuName',
    'menuItemName',
    'path',
    'status',
    'actions',
  ];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  organizationId: any;
  public user: User = new User();
  constructor(
    private menuItemService: MenuItemService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    this.getMenuItem('');
    this.menuItemService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getMenuItem(this.menuItemName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getMenuItem(this.menuItemName);
  }

  getMenuItem(menuItemName: any) {
    if (this.menuItemName !== menuItemName) {
      this.pageIndex = 0; // Reset to the first page if a new search term is entered
    }

    this.menuItemName = menuItemName;
    this.menuItemService
      .getAllMenuItem(
        this.menuItemName,
        this.pageIndex,
        this.pageSize,
        this.organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menuItemData) => {
          this.menuItemData = menuItemData.records;
          this.totalItems = menuItemData.totalRecords;
          console.log(menuItemData.records);
        },
        error: (error) => {
          console.error('Error fetching menu items:', error);
        },
      });
  }

  openConfirmDialog(menuItemId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete MenuItem' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteMenuItem(menuItemId);
        }
      });
  }

  deleteMenuItem(menuItemId: number) {
    this.menuItemService
      .deleteMenuItem(menuItemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Menu item deleted successfully:', response);
          this.menuItemService.refreshRequired.next();
        },
        error: (error) => {
          console.error('Error deleting menu item:', error);
        },
      });
  }

  addMenuItem() {
    this.router.navigate(['layout/addmenuitem'], {
      state: { organizationId: this.organizationId },
    });
  }

  editMenuItem(menuItemData: MenuItem) {
    console.log(menuItemData);
    this.router.navigate(['layout/addmenuitem'], {
      state: { menuItem: menuItemData, organizationId: this.organizationId },
    });
  }
}
