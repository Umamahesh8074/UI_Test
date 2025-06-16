import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import Swal from 'sweetalert2';

type CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree;
export const AuthGuard = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  if (authService.IsAuthenticated()) {
    return true;
  } else {
    Swal.fire({
      title: 'Un-Authorized',
      text: 'Navigating to Login page',
      timerProgressBar: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.navigate(['/login']);
      }
    });

    return false;
  }
};

export const CanActivatePath: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const commonService = inject(CommanService);
  const urlSegments = state.url.split('/');
  const desiredPath = urlSegments.slice(2).join('/');

  console.log(`Desired path: ${desiredPath}`);
  if (commonService.hasPermission(desiredPath)) {
    return true;
  } else {
    Swal.fire({
      title: 'Un-Authorized',
      text: 'Navigating to Home page',
      timerProgressBar: true,
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const authService = inject(AuthService);
        const path = authService.getDashBoardPath();
        console.log(path);
        if (path != null) {
          router.navigate(['/layout']);
        } else {
          router.navigate(['/layout']);
        }
      }
    });
    return false;
  }
};

export const canActivateAddEditPath = (manualPath: string): boolean => {
  const commonService = inject(CommanService);
  const router = inject(Router);
  if (commonService.hasPermission(manualPath)) {
    return true;
  } else {
    return false;
  }
};
