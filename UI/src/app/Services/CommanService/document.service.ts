import { Injectable } from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { CommanService } from './comman.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DELETE_DOCUMENT } from 'src/app/Apis/ProcurementApis/documnet';

@Injectable({
  providedIn: 'root',
})
export class CommanDocumentService {
  private destroy$ = new Subject<void>();
  private _refreshRequired = new Subject<void>();
  public refreshRequired = this._refreshRequired.asObservable();

  constructor(private commanService: CommanService, private http: HttpClient) {}

  downloadDocument(document: any) {
    this.commanService
      .downLoadDoc(document.documentPath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.downloadFile(response, document.documentName);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  downloadFile(response: Blob, fileName: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  inactivateDocument(documentId: number) {
    return this.http
      .delete<string>(
        `${environment.procurementBaseUrl}${DELETE_DOCUMENT}/${documentId}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next();
        })
      );
  }
}
