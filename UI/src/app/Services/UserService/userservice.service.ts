import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import {
  DELETEUSER,
  FETCH_CP_USER,
  FETCHALLUSERS,
  FORGOTPASSWORD,
  GETALLUSERDTO,
  GETALLUSERS,
  GETBYUSERID,
  Getuserdetailsbymanagerid,
  GETUSERDTOBYUSER,
  LOGIN,
  ORGANIZATIONCHART,
  REFRESHTOKEN,
  RESETPASSWORD,
  SAVE_CP_USER,
  SAVEUSER,
  UPDATEPASSWORD,
  UPDATEUSER,
  VERIFYOTP,
} from 'src/app/Apis/UserApis/User';
import { Page } from 'src/app/Models/CommanModel/Page';
import { Login } from 'src/app/Models/User/Login';
import { OrgDto, User } from 'src/app/Models/User/User';
import { IUserDto, UserDto } from 'src/app/Models/User/UserDto';
import { environment } from 'src/environments/environment';
import { AuthService } from '../CommanService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authHeaders = new HttpHeaders({ 'No-Auth': 'True' });

  constructor(private http: HttpClient, private authService: AuthService) {}

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.userBaseUrl}${GETALLUSERS}`);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(
      `${environment.userBaseUrl}${GETBYUSERID}` + '/' + userId
    );
  }

  getUserDtoByUserId(userId: number): Observable<IUserDto> {
    return this.http.get<IUserDto>(
      `${environment.userBaseUrl}${GETUSERDTOBYUSER}?userId=${userId}`
    );
  }

  addUser(user: any): Observable<any> {
    console.log(user);
    return this.http.post<any>(`${environment.userBaseUrl}${SAVEUSER}`, user);
  }
  saveCpUser(user: any, cpId: number): Observable<any> {
    console.log(user);
    return this.http.post<any>(
      `${environment.userBaseUrl}${SAVE_CP_USER}?cpId=${cpId}`,
      user
    );
  }

  getCpUsers(
    userName: string,
    page: any,
    size: any,
    organizationId: any,
    cpId: any
  ): Observable<any> {
    if (organizationId == undefined) organizationId = 0;

    return this.http.get<any>(
      `${environment.userBaseUrl}${FETCH_CP_USER}?userName=${userName}&page=${page}&size=${size}&organizationId=${organizationId}&cpId=${cpId}`
    );
  }

  deleteUser(userId: number): Observable<string> {
    console.log(userId);

    return this.http
      .delete<string>(`${environment.userBaseUrl}${DELETEUSER}/${userId}`)
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  //update menu
  updateUser(user: any): Observable<any> {
    console.log(user);
    return this.http.put<any>(`${environment.userBaseUrl}${UPDATEUSER}`, user);
  }

  getAllUsersByName(
    userName: string,
    page: any,
    size: any,
    organizationId: any
  ) {
    console.log(userName, page, size);
    return this.http.get<Page<UserDto>>(
      `${environment.userBaseUrl}${GETALLUSERDTO}?userName=${userName}&page=${page}&size=${size}&organizationId=${organizationId}`
    );
  }

  fetchAllUsers(userName?: string, OrganizationId?: any): Observable<User[]> {
    userName = userName ? userName : '';
    return this.http.get<User[]>(
      `${environment.userBaseUrl}${FETCHALLUSERS}?userName=${userName}&organizationId=${OrganizationId}`
    );
  }

  confirmPassword(email: string, newPassword: string): Observable<any> {
    return this.http.get<User>(
      `${environment.userBaseUrl}${UPDATEPASSWORD}${email}/${newPassword}`,
      {
        headers: this.authHeaders,
      }
    );
  }

  resetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.get<User>(
      `${environment.userBaseUrl}${RESETPASSWORD}${userId}/${newPassword}`,
      {
        headers: this.authHeaders,
      }
    );
  }
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.get<any>(
      `${environment.userBaseUrl}${VERIFYOTP}${email}/${otp}`,
      {
        headers: this.authHeaders,
      }
    );
  }
  forgotPassword(forgotPasswordEmail: string): Observable<any> {
    return this.http.get<User>(
      `${environment.userBaseUrl}${FORGOTPASSWORD}${forgotPasswordEmail}`,
      {
        headers: this.authHeaders,
      }
    );
  }

  login(loginForm: Login): Observable<any> {
    return this.http.post(`${environment.userBaseUrl}${LOGIN}`, loginForm, {
      headers: this.authHeaders,
    });
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken'); // Retrieve the access token from local storage

    return this.http.post<any>(
      `${environment.userBaseUrl}${REFRESHTOKEN}`,
      { accessToken: accessToken, token: refreshToken }, // Send both tokens in the request body
      {
        headers: this.authHeaders,
      }
    );
  }

  isloggedin(): boolean {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    return !!user;
  }

  getOrganizationChart(
    organizationId: number,
    userId: number
  ): Observable<OrgDto> {
    return this.http.get<OrgDto>(
      `${environment.userBaseUrl}${ORGANIZATIONCHART}?orgId=${organizationId}&userId=${userId}`
    );
  }

  getUserByManagerId(
    userId: number,
    userName?: string,
    maualAssignment?: any
  ): Observable<UserDto[]> {
    if (userName === undefined) userName = '';
    if (maualAssignment === undefined) maualAssignment = '';
    return this.http.get<UserDto[]>(
      `${environment.userBaseUrl}${Getuserdetailsbymanagerid}?userId=${userId}&userName=${userName}&maualAssignment=${maualAssignment}`
    );
  }

  registerUserImage(file: File, userId: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.put<any>(
      `${environment.userBaseUrl}/user/${userId}/uploadimage`,
      formData,
      {
        headers: new HttpHeaders({
          enctype: 'multipart/form-data',
        }),
      }
    );
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get<string>(
      `${environment.userBaseUrl}/user/getImage?userId=${userId}`,
      { responseType: 'text' as 'json' }
    );
  }
  getImage(userName: string, url: string): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.userBaseUrl}/user/download-image?userName=${userName}&imageUrl=${url}`,
      { responseType: 'blob' as 'json' }
    );
  }

  getTeamMembers(
    userId: number,
    projectId?: any,
    memberId?: any
  ): Observable<any> {
    projectId = projectId || '';
    memberId + memberId || '';
    return this.http.get<any>(
      `${environment.userBaseUrl}/user/allProjectMembers?userId=${userId}&projectId=${projectId}&memberId=${memberId}`
    );
  }
  //cloneuser;
  cloneUser(sourceUserId: any, targetUserId: any) {
    sourceUserId = sourceUserId || '';
    targetUserId = targetUserId || '';
    return this.http.put(
      `${environment.userBaseUrl}/user/cloneuser?sourceUserId=${sourceUserId}&tagetUserId=${targetUserId}`,
      "{'emtpy'}"
    );
  }

  fetchUsersByRolesAndOrganization(
    roleNames: string[],
    organizationId: number,
    status?: string,
    userName?: string
  ): Observable<any> {
    let params = new HttpParams();
    const roleNamesParam = roleNames.join(',');
    // Append multiple roleNames separately
    // roleNames.forEach((role) => {
    params = params.append('roleNames', roleNamesParam);
    // });

    // Append organizationId
    params = params.set('organizationId', organizationId.toString());

    // Append status only if it is provided
    if (status) {
      params = params.set('status', status);
    }
    if (userName) {
      params = params.set('userName', userName);
    }

    return this.http.get(
      `${environment.userBaseUrl}/user/getuserdetailsbyrolenames`,
      { params }
    );
  }

  // fetchUsersByRoleIdAndOrganizationId(roleId: string[], organizationId: number): Observable<any> {
  //   // Create the query params object
  //   const params = {
  //     roroleIdleNames: role.join(','),
  //     organizationId: organizationId.toString()
  //   };

  //   return this.http.get(`${environment.userBaseUrl}/user/getuserdetailsbyrolenames`, { params });
  // }

  checkEmail(email: string): Observable<any> {
    return this.http.post(`${environment.userBaseUrl}/user/checkEmail`, {
      email,
    });
  }

  checkPhoneNumber(phoneNumber: string): Observable<any> {
    return this.http.post(`${environment.userBaseUrl}/user/checkPhoneNumber`, {
      phoneNumber,
    });
  }

  checkEmailSentStatus(userId: number): Observable<string> {
    return this.http.get<string>(
      `${environment.userBaseUrl}/user/check-email-sent?userId=${userId}`
    );
  }
  getUsersByRoleName(
    roleName: string,
    organizationId: number,
    status?: string,
    userName?: string
  ): Observable<any> {
    organizationId = organizationId === undefined ? 0 : organizationId;
    roleName = roleName === undefined ? '' : roleName;
    status = status === undefined ? '' : status;
    userName = userName === undefined ? '' : userName;

    return this.http.get(
      `${environment.userBaseUrl}/user/getusersbyrolenames?organizationId=${organizationId}&roleName=${roleName}&status=${status}&userName=${userName}`
    );
  }

  getUsersByRoleNamesForUnit(
    organizationId: number,
    userName?: string,
    roleNames?:string
  ): Observable<UserDto[]> {
    organizationId = organizationId === undefined ? 0 : organizationId;
    userName = userName === undefined ? '' : userName;
    roleNames=roleNames===undefined?'':roleNames
    return this.http.get<UserDto[]>(
      `${environment.userBaseUrl}/user/users/rolenames?organizationId=${organizationId}&userName=${userName}&roleName=${roleNames}`
    );
  }
}
