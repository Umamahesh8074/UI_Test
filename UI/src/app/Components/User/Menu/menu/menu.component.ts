import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { IMenu, Menu } from 'src/app/Models/User/menu';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ToastrService } from 'ngx-toastr';

import { MenuService } from 'src/app/Services/UserService/menu.service';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',

  styleUrls: ['./menu.component.css'],
})
export class AddMenuComponent implements OnInit {
  menu: IMenu = new Menu();
  menuData: Menu[] = [];
  organizationId: any;
  isAdding: boolean = true;
  formData!: FormGroup;
  selectedOrganizationId: any;
  organizations: any;
  errorMessage: string | null = null;
  statuses: any = [];
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private menuService: MenuService,
    private builder: FormBuilder,
    private organizationService: OrganizationService,
    private commanService: CommanService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllOrganizations();
    this.getCommonStatuses();
    this.menu = history.state.menu;
    console.log(history.state.organizationId);
    this.organizationId = history.state.organizationId;
    this.initializeForm();
    if (history.state.menu != null && this.menu !== undefined) {
      this.isAdding = false;
      this.patchFormData();
    }
  }

  initializeForm() {
    this.formData = this.builder.group({
      menuId: [],
      menuName: ['', Validators.required],
      status: ['A'],
      organizationId: [history.state.organizationId],
      order: [null, Validators.pattern('^[0-9]+$')],
      icon:[]
    });
  }

  patchFormData() {
    console.log(this.menu);
    this.formData.patchValue(this.menu);
  }
  // formData = this.builder.group({
  //   menuId: this.builder.control(0),
  //   menuName: this.builder.control('', Validators.required),
  //   status: this.builder.control(''),
  //   organizationId: this.builder.control(''),
  // });

  save() {
    //adding menu
    console.log;
    if (this.formData.valid) {
      if (this.isAdding) {
        this.menuService
          .addMenu(
            this.formData.value,
            this.selectedOrganizationId > 0
              ? this.selectedOrganizationId
              : this.organizationId
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/menu']);
            },
            error: (err) => {
              console.error('Error adding Menu Item:', err);
              this.handleError(err);  // Handle the error
          },
          });
      } else {
        //updating menu
        this.menuService
          .updateMenu(this.formData.value, this.organizationId)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/menu']);
            },
            error: (err) => {
              console.error('Error updating commonreferencetype', err);
            },
          });
      }
    }
  }


  private handleError(err: any): void {
    console.error('Error saving/updating menu:', err.error.message);
    this.toastrService.error('Failed', err.error.message, {
      timeOut: 3000, // Set success timeout
    });

  }
//   private handleError(err: any) {
//     if (err.status === 409) { // Conflict error
//         this.errorMessage = 'Menu already exists. Please try a different name.';
//     } else {
//         this.errorMessage = 'An error occurred while processing your request. Please try again later.';
//     }
//     // Optionally log the error or display a toast notification
//     console.error('Detailed error:', err);
// }
  clearForm() {
    this.formData.reset();
  }

  gotoMenus() {
    this.router.navigate(['layout/menu']);
  }

  fetchAllMenus() {
    this.menuService.fetchAllMenus(this.organizationId).subscribe({
      next: (menus) => {
        console.log(menus);
        this.menuData = menus;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getAllOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (data) => {
        console.log(data);
        this.organizations = data.records;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  onOrganizationSelete = (event: any) => {
    console.log(event.value);
    this.selectedOrganizationId = event.value;
    this.formData.value.organizationId =
      this.selectedOrganizationId > 0
        ? this.selectedOrganizationId
        : this.organizationId;
    console.log(this.formData.value);
  };

  getCommonStatuses() {
    this.commanService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
}
