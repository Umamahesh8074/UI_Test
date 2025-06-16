import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  IMenuDto,
  IMenuItemsDto,
  MenuDto,
  MenuItemDto,
  MenuItemsDto,
} from 'src/app/Models/CommanModel/menuDto';
import { Role } from 'src/app/Models/User/Role';
import { User } from 'src/app/Models/User/User';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { RolepermissionService } from 'src/app/Services/UserService/rolepermission.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rolepermissiondisplay',
  templateUrl: './rolepermissiondisplay.component.html',
  styleUrls: ['./rolepermissiondisplay.component.css'],
})
export class RolepermissiondisplayComponent {
  constructor(
    private router: Router,
    private roleService: RoleService,
    private rolepermissionService: RolepermissionService,
    private organizationService: OrganizationService,
    private toastrService: ToastrService
  ) {}
  role = new FormControl<string>('');
  organization = new FormControl<string>('');
  private destroy$ = new Subject<void>();
  roles?: Role[];
  searchText: any = '';
  selectedSearchText: any = '';
  menuItems?: IMenuDto[];
  selectedMenu?: IMenuDto[];
  matchedMenus: any = [];
  selectedMatchedMenus: any = [];
  roleId?: any;
  seletedOrganization: any;
  //pagination

  totalItems: number = 0;
  pageSize: number = 100;
  pageIndex: number = 0;
  roleName: string = '';
  public user: User = new User();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  organizationId: any = 0;
  organizations: any;
  organizationName: any;

  onRoleSerach(searchText: any) {
    this.roleName = searchText;
    this.getallRoles(this.roleName, this.organizationId);
  }

  onOrganizationSerach(searchText: any) {
    this.organizationName = searchText;
    //this.getallRoles(this.roleName, this.organizationId);
  }

  ngOnInit() {
    const user = localStorage.getItem('user');
    this.getAllOrganizations();
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;

      console.log(this.organizationId);
    }
    if (this.organizationId > 0) {
      this.getallRoles(this.roleName, this.organizationId);
    }
    console.log('role display');
  }

  displayRole(role: Role): string {
    return role && role.roleName ? role.roleName : '';
  }
  displayOrganization(organization: any): string {
    return organization && organization.organizationName
      ? organization.organizationName
      : '';
  }
  hasAccessibleItems(menu: any): boolean {
    return (
      menu.menuItems &&
      menu.menuItems.length > 0 &&
      menu.menuItems.some((item: any) => item.accessiable === 1)
    );
  }
  private handleSuccessResponse(response: any): void {
    console.log('Success');

    this.toastrService.success('', 'Persmission Updated Successfully!', {
      timeOut: 2000, // Set success timeout
    });
    this.goToRolePermission();
  }

  private handleErrorResponse(error: any): void {
    console.error('Error saving/updating lead:', error);
    this.toastrService.error('Failed', error, {
      timeOut: 3000, // Set success timeout
    });
    this.goToRolePermission();
  }

  getMatchedMenu(searchText: any) {
    console.log('search');
    this.searchText = searchText;
    if (searchText.length >= 3 && this.roleId) {
      console.log('inside search');
      this.rolepermissionService
        .getMenuSearch(this.roleId, searchText, this.menuItems)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (matchedMenus) => {
            console.log(matchedMenus);
            this.matchedMenus = matchedMenus;
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  getSelectedMenuMatched(searchText: any) {
    console.log('search');
    this.selectedSearchText = searchText;
    if (searchText.length >= 3 && this.roleId) {
      console.log('inside search');
      this.rolepermissionService
        .getMenuSearch(this.roleId, searchText, this.selectedMenu)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (matchedMenus) => {
            console.log(matchedMenus);
            this.selectedMatchedMenus = matchedMenus;
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  getallRoles(roleName: any, organizationId: any) {
    this.roleName = roleName;
    this.roleService
      .getAllRole(this.roleName, this.pageIndex, this.pageSize, organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.roles = resp.records;
        },
        error: (err) => {
          console.error(err);
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
    this.role = new FormControl<string>('');
    this.menuItems = [] as IMenuDto[];
    this.matchedMenus = [];

    this.seletedOrganization = event.option.value.organizationId;
    this.getallRoles(this.roleName, this.seletedOrganization);
  };

  getMenuItems(roleId: number) {
    console.log(roleId);
    this.rolepermissionService
      .getMenu(
        roleId,
        this.seletedOrganization > 0
          ? this.seletedOrganization
          : this.organizationId
      )
      .subscribe((menuItems) => {
        console.log(menuItems);
        this.menuItems = menuItems;
        this.filteringSelectedLead(this.menuItems);
      });
  }

  onRoleSelete = (event: any) => {
    console.log(event.option.value);

    this.roleId = event.option.value.roleId;
    this.getMenuItems(event.option.value.roleId);
  };

  onSelectionChange(selectedMenuItemName: string) {
    console.log(selectedMenuItemName); // Log the selected menuItemName
  }

  onOptionChecked(menuItem: any) {
    console.log('Option clicked:', menuItem);

    // Toggle the accessiable property for all menuItems
    this.menuItems?.forEach((menu) => {
      menu.menuItems.forEach((item) => {
        if (item.menuItemId == menuItem.menuItemId) {
          item.accessiable = item.accessiable === 1 ? 0 : 1;
        }
      });
    });
    this.filteringSelectedLead(this.menuItems);
  }

  addRole(menuItemDto: MenuItemDto[]) {
    // Check if the form is valid

    this.rolepermissionService
      .saveRolePermission(menuItemDto, this.roleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.getMenuItems(this.roleId);
          this.handleSuccessResponse(resp);
        },
        error: (err) => {
          console.error('Error adding Role', err);
          this.handleErrorResponse(err);
        },
      });
  }

  goToRolePermission() {
    this.router.navigate(['layout/role/permission']);
  }

  onSubmit = () => {
    const menuItemsDto: MenuItemDto[] = [];
    if (this.menuItems) {
      console.log('formatting:', this.roleId);
      this.menuItems.forEach((menuItem) => {
        if (menuItem && menuItem.menuItems) {
          menuItem.menuItems.forEach((item) => {
            if (item && item.accessiable == 1) {
              const menuItemDto: MenuItemsDto = {
                roleMenuItemId: item.roleMenuItemId,
                roleId: this.roleId,
                menuId: menuItem.menuId,
                menuItemId: item.menuItemId,
                accessiable: item.accessiable,
                organizationId:
                  this.seletedOrganization > 0
                    ? this.seletedOrganization
                    : this.organizationId,
              };
              menuItemsDto.push(menuItemDto);
            }
          });
        }
      });
    }
    console.log(menuItemsDto);
    this.addRole(menuItemsDto);
  };

  togglePanelState(menu: any) {
    menu.expanded = !menu.expanded;
    // Additional logic if needed to sync with the right panel
  }

  filteringSelectedLead(menus?: IMenuDto[]) {
    const filteredMenuItem: IMenuDto[] = [];

    menus?.forEach((m) => {
      if (this.hasAccessibleItems(m)) {
        // Create a deep copy of the menu object
        const menu = { ...m, menuItems: [...m.menuItems] };

        // Filter the menu items without modifying the original menu
        menu.menuItems = menu.menuItems.filter((mi) => mi.accessiable == 1);

        // Add the modified menu to the filtered list
        filteredMenuItem.push(menu);
      }
    });

    // Update the selectedMenu with the filtered items
    this.selectedMenu = filteredMenuItem;
    if (this.selectedSearchText) {
      console.log(this.selectedSearchText);
      this.getSelectedMenuMatched(this.selectedSearchText);
    }
  }
}
