import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MultiLogin } from 'src/app/Models/User/multiLogin';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('userFileInput') userFileInput!: ElementRef;

  public user: User = new User();
  showFiller = false;
  editMode: boolean = false;
  changePasswordMode: boolean = false;
  isHomeActive: boolean = false;
  newPassword: string = '';
  private destroy$ = new Subject<void>();
  userName: string = '';
  url: string = '';
  imageUrl: any;
  multiLogins: MultiLogin[] = [];
  userRole:string='';
  isCustomerLoggedIn: boolean = false;
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}
  passwordVisible = false;
  fileNames: any = {
    user: null,
  };
  fileErrors: any = {
    user: null,
  };
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.multiLogins = this.authService.getMultiLogins();
    if (user != null) {
      this.user = JSON.parse(user);
      this.userName = this.user.userName;
      this.url = this.user.userProfileUrl;
      console.log(this.user);
      this.userRole=this.user.roleName;
    }
    const userProfileUrl = this.authService.getUserProfileUrl();
    if (userProfileUrl != null) {
      this.loadImage(this.userName, userProfileUrl);
    }
    // this.getUrlByuserId(this.user.userId);
    this.disableDesignation();
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.changePasswordMode = false;
  }

  cancelEditMode() {
    this.editMode = false;
  }
  triggerFileInput(): void {
    if (this.userFileInput) {
      this.userFileInput.nativeElement.click();
    } else {
      console.error('userFileInput is not initialized');
    }
  }

  userFileChange(event: Event): void {
    this.handleFileChange(event, 'user');
  }

  handleFileChange(event: Event, key: string): void {
    console.log('hii');
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      console.log('File selected:', file);

      this.userService.registerUserImage(file, this.user.userId).subscribe(
        (response: any) => {
          console.log('Upload successful', response);
          this.getUrlByuserId(this.user.userId);
          console.log('entered......');
        },
        (error) => {
          console.error('Upload failed', error);
        }
      );

      // Validate file size and type

      console.log(`File errors for ${key}:`, this.fileErrors[key]);
    }
  }

  loadUserProfile() {
    console.log('hiii');
    this.userService.getUserProfile(this.user.userId).subscribe((profile) => {
      this.user = profile;
      console.log('User object:', this.user);
      this.imageUrl = profile; // Ensure this line is being executed
      console.log('Image URL:', this.imageUrl);
    });
  }
  saveChanges() {
    this.userService
      .updateUser(this.user)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: User) => {
          console.log(resp);
          this.authService.setUser(JSON.stringify(resp));
          Swal.fire({
            icon: 'success',
            text: 'Profile Updated Successfully',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 100);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            text: 'Error Occurred',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          console.error('Error while Update profile', err);
        },
      });
    this.editMode = false;
  }

  changePassword() {
    this.changePasswordMode = !this.changePasswordMode;
    this.editMode = false;
  }

  saveNewPassword() {
    console.log('Saving new password...', this.user.email, this.newPassword);
    this.userService
      .confirmPassword(this.user.email, this.newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          if (resp != null) {
            const password = resp.showPassword;
            this.authService.setUser(JSON.stringify(resp));
            const user = this.authService.getUser();
            if (user != null && this.multiLogins != null) {
              this.user = JSON.parse(user);
              this.multiLogins.forEach((multiLogin) => {
                if (multiLogin.email === this.user.email) {
                  multiLogin.password = password; // Assuming `this.user.password` holds the password
                }
              });
              console.log(this.multiLogins);
              this.authService.setMultiLogins(this.multiLogins);
            }
          }
          Swal.fire({
            icon: 'success',
            text: 'Password Updated successfully',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            text: 'Error Occurred',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          console.error('Error while Update password', err);
        },
      });
    this.changePasswordMode = false;
  }

  goBack() {
    const path = this.authService.getDashBoardPath();
    if (path != null) {
      this.router.navigate([path]);
    } else {
     
        this.router.navigate(['/layout']);
     
     
    }
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
          if (this.imageUrl != null) {
            this.loadImage(this.userName, this.imageUrl);
            setTimeout(() => {
              window.location.reload();
            }, 100); // Adding a small delay to ensure the image is processed before reloading
          }
        },
        error: (err) => {
          console.error('Error while Update profile', err);
        },
      });
  }

  disableDesignation()
  {
    if(this.userRole=='Customer')
    {
      this.isCustomerLoggedIn=true;
       this.editMode = !this.editMode;
    }

  }

}
