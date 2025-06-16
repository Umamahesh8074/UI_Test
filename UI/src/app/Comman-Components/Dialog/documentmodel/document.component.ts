import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DocumentSharedService } from 'src/app/Apis/SharedServices/DocumnetSharedService';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CommanDocumentService } from 'src/app/Services/CommanService/document.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent implements OnInit {
  @Output() documentsUploaded = new EventEmitter<any[]>();
  isAdding: boolean = true;
  formData!: FormGroup;
  navigateUrl: string = '';
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  public dialogRef: MatDialogRef<DocumentComponent> | undefined;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  documentsArray: any;
  documentType: string = '';
  displayedColumnsDocuments = ['fileName', 'createdDate', 'actions'];
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeFormData();

    if (this.data) {
      console.log(this.data);
      this.documentsArray = this.data.documents.records;
      this.documentType = this.data.documentType;
      this.isAdding = this.data.isAdding; // Use the passed `navigateTo` value
    }
    const navigateUrl = history.state.navigateTo;
    if (navigateUrl) {
      this.navigateUrl = navigateUrl;
    }
  }

  constructor(
    private builder: FormBuilder,
    private documentService: DocumentSharedService,
    private commonService: CommanService,
    private commanDocumentService: CommanDocumentService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    dialogRef: MatDialogRef<DocumentComponent>
  ) {
    this.dialogRef = dialogRef;
  }

  //initialize form data
  private initializeFormData(): void {
    this.formData = this.builder.group({
      documents: this.builder.array([this.createDocuments()]),
    });
  }

  createDocuments(): FormGroup {
    return this.builder.group({
      documentName: [''],
      documentPath: [''],
      file: [''],
    });
  }

  save() {
    const documents = this.formData.value.documents;
    this.documentService.setDocuments(documents);
    this.documentsUploaded.emit(documents);
    if (this.dialogRef) {
      console.log('entered');
      this.dialogRef.close(); // Close the dialog
    }
  }

  clearForm() {
    this.formData.reset();
  }

  goBack() {
    this.onClose.emit(false);
    if (this.dialogRef) {
      this.dialogRef.close(); // Close the dialog
    } else {
      console.error('Dialog reference is undefined');
    }
  }
  get documents(): FormArray {
    return this.formData.get('documents') as FormArray;
  }
  onFileSelected(event: any, index: number): void {
    const file: File = event.target.files[0];
    this.documents.at(index).patchValue({
      documentPath: file,
      file: file.name,
    });
  }
  addDocuments(): void {
    const documentArray = this.formData.get('documents') as FormArray;
    documentArray.push(this.createDocuments());
  }

  deleteDocument(data: any) {
    this.commanDocumentService.inactivateDocument(data.id).subscribe({
      next: (response) => {
        if (response) {
          this.getDocumentsBasedOnId(data.id, this.documentType);
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  downloadDocument(data: any) {
    this.commanDocumentService.downloadDocument(data);
  }

  getDocumentsBasedOnId(id: number, documentType: string) {
    this.commonService
      .getDocumentById(
        id,
        documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.data.documents = response;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  removeIcons(index: number) {
    if (this.documents.length > 1 && this.isAdding) {
      const documentArray = this.formData.get('documents') as FormArray;
      documentArray.removeAt(index);
    }
  }
}
