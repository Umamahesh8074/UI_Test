import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, throwError, timer } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { LoaderComponent } from '../Comman-Components/common/loader/loader.component';
import { User } from '../Models/User/User';
import { AuthService } from '../Services/CommanService/auth.service';
import { UserService } from '../Services/UserService/userservice.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../Services/CommanService/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private loaderService: LoaderService
  ) {}

  currentUser: User = new User();
  Mainuser: User = new User();

  // private shouldSkipLoader(req: HttpRequest<any>): boolean {
  //   return req.url.includes('/dashboard/lead/current/status/count');
    
  // }

  // private showLoading(req: HttpRequest<any>) {
  //   if (this.shouldSkipLoader(req)) {
  //     console.log('Skipping loader show for:', req.url);
  //     return; // Don’t show loader automatically
  //   }
  //   console.log('Showing loader for:', req.url);
  //   this.loaderService.show();
  // }

  // private hideLoading(req: HttpRequest<any>) {
  //   if (this.shouldSkipLoader(req)) {
  //     console.log('Skipping loader hide for:', req.url);
  //     return; // Don’t hide loader automatically
  //   }
  //   console.log('Hiding loader for:', req.url);
  //   this.loaderService.hide();
  // }

  private isTokenExpiringSoon(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = expiry - currentTime;
    console.log('timeLeft--->' + timeLeft);
    return timeLeft < 5 * 60; // 5 minutes in seconds
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {


    // this.showLoading(req);
    // Check if the request has the custom 'No-Auth' header
    if (req.headers.get('No-Auth') === 'True') {
      return next
        .handle(req.clone())
        // .pipe(finalize(() => this.hideLoading(req)));
    }

    const token: string | null = this.authService.getAccessToken();

    if (token) {
      if (this.isTokenExpiringSoon(token)) {
        // Show SweetAlert2 popup before refreshing token
        return from(
          Swal.fire({
            title: 'Session Expiring Soon',
            text: 'Your session is about to expire. Refreshing token...',
            icon: 'warning',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 2000, // Show for 2 seconds
          })
        ).pipe(
          switchMap(() => this.refreshTokenAndRetry(req, next)),
          // finalize(() => this.hideLoading(req))
        );
      } else {
        const updatedReq = this.addToken(req, token);
        return next.handle(updatedReq).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              console.warn(
                '401 Unauthorized error received, refreshing token...'
              );
              return this.refreshTokenAndRetry(updatedReq, next);
            } else if (error.status === 403) {
              console.error('403 Forbidden error received.');
            } else if (error.status === 504) {
              console.error('504 Gateway Timeout error received.');
              // Notify the user and implement retry logic if needed
              Swal.fire({
                title: 'Request Timeout',
                text: 'The request took too long to process.',
                icon: 'warning',
                confirmButtonText: 'OK',
              });
              // Optionally retry the request or handle as needed
              return this.retryRequest(req, next);
            }
            return throwError(error);
          }),
          // finalize(() => this.hideLoading(req))
        );
      }
    } else {
      // this.hideLoading(req);
      this.router.navigate(['/login']);
      return throwError('No token found');
    }
  }

  private addToken(
    req: HttpRequest<any>,
    token: string | null
  ): HttpRequest<any> {
    const Mainuser = this.authService.getMainUser();
    const currentUser = this.authService.getUser();
    if (Mainuser) {
      this.Mainuser = JSON.parse(Mainuser);
    }
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        proxyId: `${this.Mainuser.userId}`,
        userId: `${this.currentUser.userId}`,
      },
    });
  }

  private refreshTokenAndRetry(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Reset the subject before refreshing
      return this.userService.refreshToken().pipe(
        switchMap((response: any) => {
          console.log('Token refreshed successfully.');
          // Update tokens in local storage
          this.authService.setAccessToken(response.accessToken);
          this.authService.setRefreshToken(response.token);
          // Notify other requests
          this.refreshTokenSubject.next(response.accessToken);
          // Retry the original request with the new token
          const updatedReq = this.addToken(req, response.accessToken);
          return next.handle(updatedReq);
        }),
        catchError((err) => {
          this.authService.clear(); // Clear local storage on failure
          this.router.navigate(['/login']); // Redirect to login
          return throwError(err);
        }),
        finalize(() => {
          this.isRefreshing = false;
          // this.hideLoading(req);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          // Retry the original request with the token once it's available
          const updatedReq = this.addToken(req, token);
          return next.handle(updatedReq);
        }),
        // finalize(() => this.hideLoading(req)) // Ensure loading is hidden after retry
      );
    }
  }

  private retryRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retry the request after a delay
    return timer(5000).pipe(
      switchMap(() => next.handle(req)),
      catchError((error) => {
        // Handle errors after retrying
        return throwError(error);
      })
    );
  }
}
