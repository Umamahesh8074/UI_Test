import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentSharedService {
  private documents: any[] = [];

  setDocuments(docs: any[]) {
    this.documents = docs;
  }

  getDocuments(): any[] {
    return this.documents;
  }
}
