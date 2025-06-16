import { NotificationsDto } from 'src/app/Models/Project/notifications';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { Page } from 'src/app/Models/CommanModel/Page';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  private _refresh = new Subject<void>();

  get refresh() {
    return this._refresh;
  }

  //adding project
  addNotification(notifications: any, attachmentUrl: any): Observable<any> {
    // Create a new FormData object to send both JSON data and files
    const formData: FormData = new FormData();

    // Append the 'notifications' data as a stringified JSON object
    formData.append('notifications', JSON.stringify(notifications));
    console.log(formData);
    // Check if the file exists and append it to the formData
    if (attachmentUrl) {
      formData.append('attachmentUrl', attachmentUrl, attachmentUrl.name); // Third argument should be the file name
    }

    // Perform the HTTP POST request to send the formData
    return this.http.post<any>(
      `${environment.projectBaseUrl}${ControllerPaths.Notifications + '/save'}`,
      formData
    );
  }

  //update project
  updateNotification(notifications: any, attachmentUrl: any): Observable<any> {
    // Create a new FormData object to send both JSON data and files
    const formData: FormData = new FormData();

    // Append the 'notifications' data as a stringified JSON object
    formData.append('notifications', JSON.stringify(notifications));

    // Check if the file exists and append it to the formData
    if (attachmentUrl instanceof File) {
      formData.append('attachmentUrl', attachmentUrl, attachmentUrl.name); // Ensure it's a valid File
    }

    // Now, send the formData in the HTTP PUT request
    return this.http.put<any>(
      `${environment.projectBaseUrl}${
        ControllerPaths.Notifications + '/update'
      }`,
      formData // Use formData instead of raw notifications
    );
  }

  getAllNotifications(
    page: number,
    size: number,
    organizationId: number,
    userId: number
  ): Observable<Page<NotificationsDto>> {
    return this.http.get<Page<NotificationsDto>>(
      `${environment.projectBaseUrl}${
        ControllerPaths.Notifications + '/getall'
      }?page=${page}&size=${size}&recipientId=${userId}`
    );
  }

  //get projects based on id
  getNotificationById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.projectBaseUrl}${ControllerPaths.Notifications}/${id}`
    );
  }
}
