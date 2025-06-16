import { Injectable } from '@angular/core';
import { MultiLogin } from 'src/app/Models/User/multiLogin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  public setAccessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }

  public getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  public setRefreshToken(token: string) {
    return localStorage.setItem('refreshToken', token);
  }

  public getRefreshToken() {
    localStorage.getItem('refreshToken');
  }

  public setUser(user: string) {
    localStorage.setItem('user', user);
  }
  public setMainUser(user: string) {
    localStorage.setItem('Mainuser', user);
  }

  public getUser() {
    return localStorage.getItem('user');
  }

  public setRole(role: string) {
    return localStorage.setItem('role', role);
  }

  public getRole() {
    return localStorage.getItem('role');
  }
  public getMainUser() {
    return localStorage.getItem('Mainuser');
  }

  public clear() {
    localStorage.clear();
  }
  public isLoggedIn() {
    return this.getRole() && this.getAccessToken();
  }
  IsAuthenticated() {
    return this.isLoggedIn() ? true : false;
  }

  public setDashBoardPath(path: string) {
    localStorage.setItem('homePath', path);
  }

  public getDashBoardPath() {
    return localStorage.getItem('homePath');
  }

  public setIsCanBulkUpload(bulkUpload: string) {
    localStorage.setItem('isCanBulkUpload', bulkUpload);
  }

  public getIsCanBulkUpload(): boolean {
    return this.getRole() !== 'Channel Partner' && this.getRole() !== 'CP Users'
      ? true
      : this.getRole() === 'Channel Partner' &&
        localStorage.getItem('isCanBulkUpload') === 'Yes'
      ? true
      : this.getRole() === 'CP Users' &&
        localStorage.getItem('isCanBulkUpload') === 'Yes'
      ? true
      : false;
  }

  public setBulkUploadLimit(limit: number) {
    localStorage.setItem('bulkUploadLimit', JSON.stringify(limit));
  }

  public getBulkUploadLimit(): number {
    const limit = localStorage.getItem('bulkUploadLimit');
    return limit ? JSON.parse(limit) : -1;
  }
  public setUserProfileUrl(userProfileUrl: string) {
    localStorage.setItem('userProfileUrl', userProfileUrl);
  }

  public getUserProfileUrl() {
    return localStorage.getItem('userProfileUrl');
  }

  setMultiLogins(multiLogins: MultiLogin[]): void {
    const multiLoginsJSON = JSON.stringify(multiLogins);
    localStorage.setItem('multiLogins', multiLoginsJSON);
  }

  getMultiLogins(): MultiLogin[] {
    const multiLoginsJSON = localStorage.getItem('multiLogins');
    return multiLoginsJSON ? (JSON.parse(multiLoginsJSON) as MultiLogin[]) : [];
  }
}
