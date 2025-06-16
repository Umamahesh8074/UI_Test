import { OverlayContainer } from '@angular/cdk/overlay';
import { ThisReceiver } from '@angular/compiler';
import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { filter, Subject, takeUntil } from 'rxjs';
import { IMenuItemsDto, MenuDto } from 'src/app/Models/CommanModel/menuDto';
import { Login } from 'src/app/Models/User/Login';
import { MultiLogin } from 'src/app/Models/User/multiLogin';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { NotificationsDto } from 'src/app/Models/Project/notifications';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { MultiLoginService } from 'src/app/Services/CommanService/multiLoginService';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';

import Swal from 'sweetalert2';

interface MenuItem {
  menuItemName?: string; // Now allows string | undefined
  path?: string; // Now allows string | undefined
}

interface Menu {
  menuId: number;
  menuName: string;
  icon: string;
  menuItems: MenuItem[];
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  imageUrl: any;
  userName: string = '';
  private destroy$ = new Subject<void>();
  constructor(
    private commonservice: CommanService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private overlayContainer: OverlayContainer,
    private sanitizer: DomSanitizer,
    private projectService: ProjectService,
    private multiLoginService: MultiLoginService
  ) {
    this.checkScreenSize();
  }
  intervalId: any;

  public user: User = new User();
  Mainuser: User = new User();
  public roleName: string = '';
  showFiller = false;
  homePath: string | null = '/layout/plain';
  UserDetails: UserDto[] = [];
  expandedMenu: number | null = null;
  tempExpandedMenus: Set<any> = new Set(); // NEW
  activeSubMenu: string | null = null;
  collapsed: boolean = false;
  isHomeActive: boolean = true;
  chart: Chart | any;
  displaySwitchLogin: boolean = false;
  menuItems: MenuDto[] = [];
  multilogins: MultiLogin[] = [];
  isMobile: boolean = false;
  notifications: NotificationsDto[] = [];
  lastUnreadCount = 0;
  notificationSound = new Audio('assets/notification.mp3'); // Path to your sound file

  menuSearch: string = '';
  filteredMenuItems: any[] = [];
  public login: Login = new Login('', '');
  userDto: UserDto = new UserDto();
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const mainUser = localStorage.getItem('Mainuser');
    if (mainUser != null) {
      this.Mainuser = JSON.parse(mainUser);
    }
    if (user != null) {
      this.user = JSON.parse(user);
      const role = this.user.title;
      if (role != undefined) {
        this.roleName = '(' + role + ')';
      }
      console.log(this.user);
    }
    this.multilogins = this.authService.getMultiLogins();
    this.multilogins = this.multilogins.filter(
      (login) => login.email !== this.user.email
    );
    console.log(this.multilogins);

    if (this.multilogins.length != 0) {
      this.displaySwitchLogin = true;
    }
    this.getMenuItems(this.user.roleId);
    this.router.events.subscribe(() => {
      this.isHomeActive = this.router.url === this.homePath;
    });
    console.log(this.authService.getDashBoardPath());
    this.homePath = this.authService.getDashBoardPath()
      ? this.authService.getDashBoardPath()
      : '/layout/plain';
    console.log(this.homePath);
    this.getUrlByuserId(this.user.userId);
    // this.loadImage(this.userName,this.user.userProfileUrl);
    this.overlayContainer.getContainerElement().classList.remove('user-div');
    if (this.chart) {
      this.chart.destroy();
    }
    this.collapse();
    this.fetchUser();
    // Then call every 1 minute
    this.intervalId = setInterval(() => {
      this.getAllNotifications();
    }, 60000);
  }
  fetchUser() {
    this.userService
      .getUserByManagerId(this.Mainuser.userId, this.userName)
      .subscribe({
        next: (UserDetails) => {
          this.UserDetails = UserDetails;
          const userId = this.Mainuser.userId; // Extract userId
          this.getAllNotifications(); // Pass to the method
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer.getContainerElement().classList.remove('user-div');
    if (this.chart) {
      this.chart.destroy();
    }
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const width = window.innerWidth;
    this.isMobile = width <= 1024; // You can adjust the width threshold as needed
    this.collapsed = this.isMobile;
  }

  expandMenu(menuId: number) {
    console.log('Expand Menu');
    this.isHomeActive = false;
    this.expandedMenu = this.expandedMenu === menuId ? null : menuId;
  }

  toggleMenu(menuId: number) {
    console.log('Toggle Menu');
    if (this.collapsed) {
      this.isHomeActive = false;
      this.expandedMenu = menuId;
      this.collapsed = false;
    } else {
      this.expandedMenu = this.expandedMenu === menuId ? null : menuId;
    }
  }

  setActiveSubMenu(path?: string) {
    if (path) {
      this.activeSubMenu = path;
    }
  }

  inActiveHome() {
    this.isHomeActive = false;
    this.collapse();
  }

  collapse() {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.expandedMenu = null;
    }
  }

  isSubMenuActive(menu: MenuDto): boolean {
    return menu.menuItems.some(
      (item: IMenuItemsDto) => item.path === this.activeSubMenu
    );
  }

  toggleHomeMenu() {
    this.expandedMenu = null;
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = true;
    }
  }

  //get all menu items
  getMenuItems(roleId: number) {
    console.log(roleId);
    this.commonservice.getMenu(roleId).subscribe((menuItems) => {
      console.log(menuItems);
      this.menuItems = menuItems;
      this.filteredMenuItems = [...this.menuItems]; // initialize on load
    });
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
  goToHome = () => {
    this.isHomeActive = true;
    this.router.navigate([this.homePath]);
  };

  profile() {
    this.router.navigate(['layout/profile']);
  }

  loadImage(userName: string, url: string): void {
    // Replace with your actual S3 URL
    this.userService.getImage(userName, url).subscribe((blob) => {
      const objectURL = URL.createObjectURL(blob);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      console.log(this.imageUrl);
    });
  }
  getUrlByuserId(userId: number) {
    this.userService
      .getUserProfile(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.imageUrl = resp;
          console.log(this.imageUrl);
          if (this.imageUrl != null) {
            this.loadImage(this.userName, this.imageUrl);
          }
        },
        error: (err) => {
          console.error('Error while Update profile', err);
        },
      });
  }

  switchLogin(multilogin: MultiLogin) {
    console.log('Switched to:', multilogin);
    this.login.identifier = multilogin.email;
    this.login.password = multilogin.password;
    this.userService.login(this.login).subscribe({
      next: (response) => {
        this.user = response.userDto;
        console.log(this.user);
        this.authService.setUser(JSON.stringify(this.user));
        this.authService.setRole(this.user.roleName);
        this.authService.setAccessToken(response.accessToken);
        this.authService.setRefreshToken(response.token);
        this.navigateToDashBoard(this.user.homePath);
      },
      error: (err) => {
        if (err.status === 0) {
          Swal.fire('Failed', 'Failed to connect to server', 'error');
        } else if (err.status === 403 || err.status == 401) {
          Swal.fire('Failed', 'Invalid Credentials', 'error');
        } else {
          Swal.fire('Failed', 'An unexpected error occurred', 'error');
        }
        console.error('Failed to fetch:', err);
      },
    });
  }
  private navigateToDashBoard(homePath: string) {
    this.authService.setDashBoardPath(homePath);
    this.router.navigate(['/layout']).then(() => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          window.location.reload();
        });
    });
  }
  onGroupClick() {
    console.log(this.Mainuser);
    const mainUser = this.UserDetails.find(
      (user) => user.userId === this.Mainuser.userId
    );
    console.log(mainUser);
    if (mainUser != null || mainUser != undefined) {
      this.userDto = mainUser;
      this.login.identifier = this.userDto.email;
      this.login.password = this.userDto.showPassword;
      this.userService.login(this.login).subscribe({
        next: (response) => {
          this.user = response.userDto;
          console.log(this.user);
          this.authService.setUser(JSON.stringify(this.user));
          this.authService.setRole(this.user.roleName);
          this.authService.setAccessToken(response.accessToken);
          this.authService.setRefreshToken(response.token);
          console.log(this.user.homePath);
          this.navigateToDashBoard(this.user.homePath);
        },
        error: (err) => {
          if (err.status === 0) {
            Swal.fire('Failed', 'Failed to connect to server', 'error');
          } else if (err.status === 403 || err.status == 401) {
            Swal.fire('Failed', 'Invalid Credentials', 'error');
          } else {
            Swal.fire('Failed', 'An unexpected error occurred', 'error');
          }
          console.error('Failed to fetch:', err);
        },
      });
    }
  }

  getAllNotifications() {
    this.projectService.getAllNotifications(this.Mainuser.userId).subscribe({
      next: (record) => {
        console.log(record);

        const currentUnreadCount = record.filter(
          (n: any) => n.status !== 'Read'
        ).length;

        // Play sound only if there are new unread notifications
        if (currentUnreadCount > this.lastUnreadCount) {
          this.playNotificationSound();
        }

        // Update last count and notifications list
        this.lastUnreadCount = currentUnreadCount;
        this.notifications = record;
      },
      error: () => {},
    });
  }

  playNotificationSound() {
    this.notificationSound.pause();
    this.notificationSound.currentTime = 0;
    this.notificationSound.play().catch((err) => {
      console.warn('Notification sound failed to play:', err);
    });
  }
  get unreadCount() {
    return this.notifications.filter((n) => n.status !== 'Read').length;
  }

  openNotification(note: any) {
    console.log('Notification clicked******************************:', note); // Log full object

    // note.status = 'Read';
    // Optionally navigate or open a dialog
    this.projectService.updateNotificationStatusAsRead(note.id).subscribe({
      next: (record) => {
        console.log(record);
        this.getAllNotifications();
        // this.notifications = record;
      },
      error: () => {},
    });
  }

  viewAllNotifications() {
    // Navigate to a full notifications page if needed
    this.router.navigate(['/layout/project/displaynotifications']);
  }

  filterMenuItems() {
    const search = this.menuSearch.toLowerCase().trim();

    this.tempExpandedMenus.clear();

    if (!search) {
      this.filteredMenuItems = [...this.menuItems];
      this.collapsed = false;
      return;
    }

    this.filteredMenuItems = this.menuItems
      .map((menu) => {
        const matchedItems = menu.menuItems?.filter((item) =>
          item.menuItemName?.toLowerCase().includes(search)
        );

        const isMatch =
          menu.menuName.toLowerCase().includes(search) ||
          (matchedItems && matchedItems.length > 0);

        if (isMatch) {
          this.tempExpandedMenus.add(menu.menuId); // Track multiple for search
          return {
            ...menu,
            menuItems: matchedItems.length > 0 ? matchedItems : menu.menuItems,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  filterMenuItems1() {
    const searchTerm = this.menuSearch.toLowerCase();

    if (!searchTerm) {
      this.filteredMenuItems = [...this.menuItems];
      return;
    }

    this.filteredMenuItems = this.menuItems
      .map((menu) => {
        const matchedSubItems = menu.menuItems.filter((sub: any) =>
          sub.menuItemName?.toLowerCase().includes(searchTerm)
        );

        if (
          menu.menuName.toLowerCase().includes(searchTerm) ||
          matchedSubItems.length > 0
        ) {
          return {
            ...menu,
            menuItems: matchedSubItems,
          };
        }

        return null;
      })
      .filter(Boolean); // remove nulls
  }
  // onSearchFocus() {
  //   this.collapsed = false; // Collapse sidebar immediately on input focus
  // }
  // onSideNavHover(isHovering: boolean) {
  //   if (isHovering) {
  //     this.collapsed = false;  // Expand on hover
  //   } else {
  //     this.collapsed = true;   // Collapse when hover leaves
  //   }
  // }
}
