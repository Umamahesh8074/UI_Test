import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ClearAllKeys,
  ClearEachKey,
  GetCacheKeys,
  GetValue,
} from 'src/app/Apis/UserApis/User';

@Injectable({
  providedIn: 'root',
})
export class CacheManagementService {
  constructor(private http: HttpClient) {}

  getAllKeys(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.userBaseUrl}${GetCacheKeys}`);
  }

  clearCacheKey(key: string): Observable<string> {
    return this.http.delete<string>(
      `${environment.userBaseUrl}${ClearEachKey}${key}`
    );
  }

  clearAllCache(): Observable<string> {
    return this.http.delete<string>(
      `${environment.userBaseUrl}${ClearAllKeys}`
    );
  }
  getCacheValue(key: string): Observable<any> {
    return this.http.get<any>(`${environment.userBaseUrl}${GetValue}${key}`);
  }
}
