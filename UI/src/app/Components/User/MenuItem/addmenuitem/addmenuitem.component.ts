import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { Menu } from 'src/app/Models/User/menu';
import { IMenuItem, MenuItem } from 'src/app/Models/User/menuItem';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { MenuItemService } from 'src/app/Services/UserService/menu-item.service';
import { MenuService } from 'src/app/Services/UserService/menu.service';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';

@Component({
  selector: 'app-addmenuitem',
  templateUrl: './addmenuitem.component.html',
  styleUrls: ['./addmenuitem.component.css'],
})
export class AddmenuitemComponent implements OnInit {
  menuItem: IMenuItem = new MenuItem();
  isAdding: boolean = true;
  formData!: FormGroup;
  private destroy$ = new Subject<void>();
  organizationId: any;
  menus: Menu[] = [];
  menuConfig = ['Yes', 'No'];
  errorMessage: string | null = null;
  selectedOrganizationId: any;
  organizations: any;
  statuses: any;
  constructor(
    private router: Router,
    private menuItemService: MenuItemService,
    private builder: FormBuilder,
    private menuService: MenuService,
    private organizationService: OrganizationService,
    private commanService: CommanService,
    private toastrService: ToastrService

  ) {}

  ngOnInit(): void {
    console.log('add nenu');
    this.getCommonStatuses();
    this.getAllOrganizations();
    this.organizationId = history.state.organizationId;
    console.log(this.organizationId);

    this.menuItem = history.state.menuItem;

    if (this.organizationId > 0) {
      this.fetchMenus();
    }

    this.initializeForm();
    if (history.state.menuItem != null && this.menuItem !== undefined) {
      this.isAdding = false;
      this.patchFormData();
    }
  }
  initializeForm() {
    this.formData = this.builder.group({
      menuItemId: [],
      menuItemName: ['', Validators.required],
      path: ['', Validators.required],
      menuId: ['', Validators.required],
      status: ['A'],
      organizationId: [history.state.organizationId],
      order: [0, Validators.required],
      moblieDisplay: ['', Validators.required],
      webSiteDisplay: ['', Validators.required],
    });
  }
  patchFormData() {
    console.log(this.menuItem);
    this.formData.patchValue(this.menuItem);
  }
  // save() {
  //   console.log('adding menu');
  //   console.log('save' + this.organizationId);
  //   console.log(this.formData);
  //   if (this.formData.valid) {
  //     if (this.isAdding) {
  //       this.menuItemService
  //         .addMenuItem(
  //           this.formData.value,
  //           this.selectedOrganizationId > 0
  //             ? this.selectedOrganizationId
  //             : this.organizationId
  //         )
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe({
  //           next: (resp) => {
  //             console.log('Menu Item added successfully:', resp);
  //             this.router.navigate(['layout/menu/item']);
  //           },
  //           error: (err) => {
  //             console.error('Error adding Menu Item:', err);
  //             // Handle error or log error details
  //           },
  //         });
  //     } else {
  //       console.log(this.formData.value);
  //       this.menuItemService
  //         .updateMenuItem(this.formData.value, this.organizationId)
  //         .pipe(takeUntil(this.destroy$))
  //         .subscribe({
  //           next: () => {
  //             console.log('Menu Item updated successfully');
  //             this.router.navigate(['layout/menu/item']);
  //           },
  //           error: (err) => {
  //             console.error('Error updating Menu Item:', err);
  //             // Handle error or log error details
  //           },
  //         });
  //     }
  //   }
  // }


  save() {
    console.log('Adding menu');
    console.log('Save organizationId:', this.organizationId);
    console.log('Form Data:', this.formData);

    if (this.formData.valid) {
        if (this.isAdding) {
            this.menuItemService
                .addMenuItem(
                    this.formData.value,
                    this.selectedOrganizationId > 0
                        ? this.selectedOrganizationId
                        : this.organizationId
                )
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (resp) => {
                        console.log('Menu Item added successfully:', resp);
                        this.router.navigate(['layout/menu/item']);
                    },
                    error: (err) => {
                        console.error('Error adding Menu Item:', err);
                        this.handleError(err);  // Handle the error
                    },
                });
        } else {
            console.log('Form Data:', this.formData.value);
            this.menuItemService
                .updateMenuItem(this.formData.value, this.organizationId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        console.log('Menu Item updated successfully');
                        this.router.navigate(['layout/menu/item']);
                    },
                    error: (err) => {
                        console.error('Error updating Menu Item:', err);
                        this.handleError(err);  // Handle the error
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

  clearForm() {
    this.formData.reset();
  }

  gotoMenus() {
    this.router.navigate(['layout/menu/item']);
  }

  fetchMenus() {
    this.menuService
      .fetchAllMenus(
        this.selectedOrganizationId > 0
          ? this.selectedOrganizationId
          : this.organizationId,
        ''
      )
      .subscribe({
        next: (menus) => {
          console.log(menus);
          this.menus = menus;
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
    console.log(event)
    this.selectedOrganizationId = event.value;
    this.formData.value.organizationId =
      this.selectedOrganizationId > 0
        ? this.selectedOrganizationId
        : this.organizationId;
    this.fetchMenus();
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
