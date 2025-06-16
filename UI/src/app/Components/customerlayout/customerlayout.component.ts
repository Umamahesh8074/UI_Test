import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, Event } from '@angular/router';
import { OverlayContainer } from 'ngx-toastr';
import { filter, Subject, Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-customerlayout',
  templateUrl: './customerlayout.component.html',
  styleUrls: ['./customerlayout.component.css'],
  encapsulation: ViewEncapsulation.None /*Applied CSS Particular Component */,
})
export class CustomerlayoutComponent implements OnInit {
  constructor(
    private commonservice: CommanService,
    private router: Router,
    private userService: UserService,
    private overlayContainer: OverlayContainer /*Applied CSS Particular Component */,
    private renderer: Renderer2 /*Applied CSS Particular Component */,
    private sanitizer: DomSanitizer
  ) {}

  userName: string = '';

  public user: User = new User();
  imageUrl: any;
  private destroy$ = new Subject<void>();
  showHomeButton: boolean = false;
  private routeSubscription!: Subscription;
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    /*Applied CSS Particular Component */
    const overlayElement = this.overlayContainer.getContainerElement();
    this.renderer.addClass(overlayElement, 'customer-layout');
    console.log('Classes on OverlayContainer:', overlayElement.classList);
    this.routeSubscription = this.router.events
      .pipe(
        // Explicitly assert that we are only interested in NavigationEnd events
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        console.log('Route changed:', event.url);
        if (event.url != '/custlayout') {
          this.showHomeButton = true;
        } else {
          this.showHomeButton = false;
        }
      });
  }

  ngOnDestroy(): void {
    /*Applied CSS Particular Component */
    const overlayElement = this.overlayContainer.getContainerElement();
    this.renderer.removeClass(overlayElement, 'customer-layout');
    console.log(
      'Classes on OverlayContainer after destroy:',
      overlayElement.classList
    );
  }

  profile() {
    this.router.navigate(['custlayout/profile']);
  }
  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
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
  loadImage(userName: string, url: string): void {
    // Replace with your actual S3 URL
    this.userService.getImage(userName, url).subscribe((blob) => {
      const objectURL = URL.createObjectURL(blob);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      console.log(this.imageUrl);
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/custlayout']); // Adjust the route if necessary
  }
}
