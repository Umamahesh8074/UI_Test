import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOMER } from 'src/app/Constants/CommanConstants/Comman';
import { Login } from 'src/app/Models/User/Login';
import { MultiLogin } from 'src/app/Models/User/multiLogin';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { MultiLoginService } from 'src/app/Services/CommanService/multiLoginService';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public login: Login = new Login('', '');
  public user: User = new User();
  public isForgotPassword: boolean = false;
  public isLogin: boolean = false;
  public forOtp: boolean = false;
  public forNewPassword: boolean = false;
  public Titile: string = '';
  public otp: string = '';
  public newPassword: string = '';
  public otpInvalid: boolean = true;
  public otpvalid: boolean = true;
  public forgotPasswordEmail: string = '';
  public showMessage: string = '';
  passwordVisible = false;
  multiLogins: MultiLogin[] = [];
  constructor(
    private router: Router,
    private service: UserService,
    private authService: AuthService,
    private multiLoginService: MultiLoginService,
    private loaderService: LoaderService
  ) {
    this.isLogin = true;
    this.Titile = 'Login';
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  saveLogin(form: NgForm) {
    //this.clearCacheAndCookies();
    if (form.valid) {
      this.showLoading();
      this.service.login(this.login).subscribe({
        next: (response) => {
          this.user = response.userDto;
          console.log(this.user, 'after setting');
          this.authService.setUser(JSON.stringify(this.user));
          this.authService.setRole(this.user.roleName);
          this.authService.setAccessToken(response.accessToken);
          this.authService.setRefreshToken(response.token);
          if (this.user.multiLogin === 'Yes') {
            console.log('check');
            this.multiLoginService.getByUserId(this.user.userId).subscribe({
              next: (data: MultiLogin[]) => {
                console.log('API Response:', data); // Log the entire response
                if (data && data.length > 0) {
                  this.multiLogins = data;
                  this.authService.setMultiLogins(this.multiLogins);
                } else {
                  console.log('No multi-login data found.');
                }
                this.navigateToDashBoard(this.user.homePath);
              },
              error: (error) => {
                console.error('Error fetching data:', error);
              },
            });
          } else {
            this.navigateToDashBoard(this.user.homePath);
          }
          this.authService.setMainUser(JSON.stringify(this.user));
          this.authService.setIsCanBulkUpload(this.user.isCanBulkUpload);
          this.authService.setBulkUploadLimit(this.user.bulkUploadLimit);
          if (this.user.userProfileUrl != null) {
            this.authService.setUserProfileUrl(this.user.userProfileUrl);
          }
          this.hideLoading();
          // this.router.navigate(['/layout/facility/management/issuedashboard']);
        },
        error: (err) => {
          this.hideLoading();
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
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
      console.error('Invalid form');
    }
  }

  private navigateToDashBoard(homePath: string) {
    this.authService.setDashBoardPath(homePath);
    if (this.user.roleName == CUSTOMER) {
      this.router.navigate(['/custlayout']);
    } else {
      this.router.navigate([`${homePath}`]);

      // this.router.navigate([`/layout`]);
    }
  }

  // private navigateToDashBoard(role: string | null) {
  //   let roles: string[] = ROLES;
  //   roles.map((constRole) => {
  //     console.log('Role = > ' + role + ' , Role  =>  ' + constRole);
  //     if (
  //       constRole.toLocaleLowerCase().trim() ===
  //       role?.toLocaleLowerCase().trim()
  //     ) {
  //       console.log('If login');
  //       this.authService.setDashBoardPath(
  //         '/layout/facility/management/issuedashboard'
  //       );
  //       this.router.navigate(['/layout/facility/management/issuedashboard']);
  //     } else {
  //       console.log('Else login');
  //       this.authService.setDashBoardPath('/layout');
  //       this.router.navigate(['/layout']);
  //     }
  //   });
  // }

  forgotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
    this.Titile = 'Forgot Password';
  }
  backToLogin() {
    this.isForgotPassword = !this.isForgotPassword;
    this.Titile = 'Login';
  }
  sendResetPasswordEmail(form: NgForm) {
    if (form.valid) {
      this.service.forgotPassword(this.forgotPasswordEmail).subscribe({
        next: (response) => {
          setTimeout(() => {
            this.showMessage = '';
          }, 2000);

          this.Titile = 'VERIFY OTP';
          this.isForgotPassword = !this.isForgotPassword;
          this.isLogin = false;
          this.forOtp = !this.forOtp;
        },
        error: (err) => {
          this.showMessage = 'Invalid Email';
          setTimeout(() => {
            this.showMessage = '';
          }, 2000);
          console.error('Error occurred:', err);
        },
      });
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
    }
  }
  verifyOtp(form: NgForm) {
    if (form.valid) {
      if (this.otp != null && this.otpvalid) {
        this.service.verifyOtp(this.forgotPasswordEmail, this.otp).subscribe({
          next: (response) => {
            this.Titile = 'RESET';
            this.otpvalid = false;
            this.otpInvalid = false;
          },
          error: (err) => {
            this.showMessage = 'Invalid OTP';
            setTimeout(() => {
              this.showMessage = '';
            }, 2000);
            this.Titile = 'VERIFY OTP';
            this.isForgotPassword = false;
            this.isLogin = false;
            console.error('Error occurred:', err);
          },
        });
      } else {
        this.service
          .confirmPassword(this.forgotPasswordEmail, this.newPassword)
          .subscribe({
            next: (response) => {
              this.isLogin = true;
              this.Titile = 'Login';
              this.forNewPassword = false;
              this.forOtp = false;
            },
            error: (err) => {
              console.error('Error occurred:', err);
            },
          });
      }
    } else {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
    }
  }

  clearCacheAndCookies(): void {
    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();
    console.log('clearing cache ', document.cookie);

    // Clear cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      console.log(cookie);

      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
