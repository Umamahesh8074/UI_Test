import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-tech-admin-dash-board',
  templateUrl: './tech-admin-dash-board.component.html',
  styleUrls: ['./tech-admin-dash-board.component.css'],
})
export class TechAdminDashBoardComponent implements OnInit {
  UserDetails: UserDto[] = [];
  Mainuser: User = new User();
  userName: string = '';
  proxyLoginDisplay: Boolean = true;
  user: User = new User();
  userId: number = 0;
  User: any = new FormControl([] as UserDto[]);
  public login: Login = new Login('', '');
  today: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.today = new Date().toDateString();
    const user = localStorage.getItem('user');
    const MainUser = localStorage.getItem('Mainuser');
    if (user) {
      this.user = JSON.parse(user);
    }
    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
    }
    if (this.Mainuser.userId == this.user.userId) {
      this.proxyLoginDisplay = false;
    } else {
      console.log(this.proxyLoginDisplay);
    }
  }
  fetchUser() {
    this.userService
      .getUserByManagerId(this.Mainuser.userId, this.userName)
      .subscribe({
        next: (UserDetails) => {
          this.UserDetails = UserDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
      });
  }
  searchUser(event: any) {
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      console.log(event.target.value);
      this.userName = event.target.value;
      this.fetchUser();
    }
  }
  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }
  onUserSelect(event: any) {
    console.log(event.option.value);
    this.userId = event.option.value.userId;
    this.login.identifier = event.option.value.email;
    this.login.password = event.option.value.showPassword;

    this.userService.login(this.login).subscribe({
      next: (response) => {
        this.user = response.userDto;
        console.log(this.user);
        // Swal.fire('Login!', 'success');
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
}
