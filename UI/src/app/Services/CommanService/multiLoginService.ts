import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetMultiLoginsByUserid } from 'src/app/Apis/UserApis/User';
import { MultiLogin } from 'src/app/Models/User/multiLogin';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MultiLoginService {
  constructor(private http: HttpClient) {}

  getByUserId(userId: number): Observable<MultiLogin[]> {
    console.log('multiloginservice');
    return this.http.get<MultiLogin[]>(
      `${environment.userBaseUrl}${GetMultiLoginsByUserid}?userId=${userId}`
    );
  }
}
