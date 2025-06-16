import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChannelPartnerRegisterBean } from 'src/app/Models/Presales/channelPartner';
import { User } from 'src/app/Models/User/User';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-cp-documents',
  templateUrl: './display-cp-documents.component.html',
  styleUrls: ['./display-cp-documents.component.css'],
})
export class DisplayCpDocumentsComponent implements OnInit {
  documentsData: any = [];
  displayedColumns: string[] = ['documentName', 'actions'];
  user = new User();
  channelPartnerData: ChannelPartnerRegisterBean[] = [];
  userId: number = 0;
  cpId: number = 0;
  destroy$ = new Subject<void>();

  channelPartnerDocuments: { fileName: string; fileUrl: any; varName: any }[] =
    [];
  selectedFile: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cpService: ChannelPartnerRegisterService,
    private channelPartnerService: ChannelPartnerRegisterService
  ) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      console.log('user');
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.cpId = this.user.cpRegisterId;
    }

    this.getDocuments();
  }

  getDocuments() {
    this.getCPById(this.cpId).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.channelPartnerData = response;
        this.buildDocumentList();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getCPById(cpId: any) {
    console.log(cpId);
    return this.cpService
      .getChannelPartnerByCpId(cpId)
      .pipe(takeUntil(this.destroy$));
  }
  buildDocumentList() {
    console.log(this.channelPartnerData);

    this.channelPartnerDocuments = [
      {
        fileName: 'Aadhar',
        fileUrl: this.channelPartnerData[0].aadharUrl,
        varName: 'aadharUrl',
      },
      {
        fileName: 'PAN',
        fileUrl: this.channelPartnerData[0].panUrl,
        varName: 'panUrl',
      },
      {
        fileName: 'GST Certificate',
        fileUrl: this.channelPartnerData[0].gstCertificateUrl,
        varName: 'gstCertificateUrl',
      },
      {
        fileName: 'RERA Certificate',
        fileUrl: this.channelPartnerData[0].reraUrl,
        varName: 'reraUrl',
      },
      {
        fileName: 'Person Document',
        fileUrl: this.channelPartnerData[0].personUrl,
        varName: 'personUrl',
      },
    ]; // Filter out null or empty ones
  }

  triggerFileInput(index: number) {
    const input = document.getElementById(
      'fileInput' + index
    ) as HTMLInputElement;
    console.log(input);

    if (input) {
      input.click();
    }
  }
  onFileSelected(event: Event, docType: string, index: number): void {
    this.handleFileChange(event, docType, index);
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0]; // Only one file can be selected at a time
      const allowedExtensions = ['pdf']; // Only allow .pdf files
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (allowedExtensions.includes(fileExtension!)) {
        this.fileTypeError = false; // Reset error flag
        var newFileName = '';
        if (index != undefined) {
          newFileName = `${docType}_${index}_${selectedFile.name}`;
        } else {
          newFileName = `${docType}_${selectedFile.name}`;
        }
        // Create a new File with the document type added to the name

        // Create a new File object with the updated file name
        const updatedFile = new File([selectedFile], newFileName, {
          type: selectedFile.type,
        });

        // Now, add the updated file to the array
        this.selectedFiles.push(updatedFile);

        console.log(this.selectedFiles, 'Selected Files'); // Logging for debugging
      } else {
        this.fileTypeError = true; // Set error flag if file type is not allowed
      }
    } else {
      console.log('No file selected');
    }
  }
  selectedFileName: string[] = [];
  handleFileChange(event: Event, key: string, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      // Ensure the key is valid before accessing it
      console.log('Before update:', this.fileNames[key]); // This will log the current value (likely null initially)
      console.log('Selected file name:', file.name);
      this.selectedFileName[index] = file.name; // This logs the selected file's name

      this.fileNames[key] = file.name; // Update the file name for the given key
      console.log('After update:', this.fileNames[key]); // This should now log the file name
    } else {
      // If no file is selected, reset the key to null
      this.fileNames[key] = null;
      console.log('After reset:', this.fileNames[key]); // Should log null
    }
  }

  fileNames: any = {
    aadharUrl: null,
    panUrl: null,
    reraUrl: null,
    personUrl: null,
    gstCertificateUrl: null,
  };
  fileTypeError: boolean = false;
  selectedFiles: File[] = [];

  saveFile() {
    this.buildFilesToSend(this.selectedFiles);
    console.log(this.filesToSend);

    this.cpService
      .updateChannelPartner(this.channelPartnerData[0], this.filesToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.message);
          Swal.fire('Success', response.message, 'success');
          this.getDocuments();
        },
        error: (err) => {
          const errorMessage = err.error.error;
          console.log('Error:', errorMessage);
        },
      });
  }
  filesToSend: {
    ownerPanCard: File | null;
    rera: File | null;
    ownerAadhar: File | null;
    personAadhar: File | null;
    gstCertificate: File | null;
  } = {
    ownerPanCard: null,
    rera: null,
    ownerAadhar: null,
    personAadhar: null,
    gstCertificate: null,
  };
  buildFilesToSend(files: File[]): void {
    // Clear previous files if needed
    this.filesToSend = {
      ownerPanCard: null,
      rera: null,
      ownerAadhar: null,
      personAadhar: null,
      gstCertificate: null,
    };

    files.forEach((file) => {
      const nameParts = file.name.split('_'); // ex: "aadharUrl_0_file.pdf"
      const key = nameParts[0];

      switch (key) {
        case 'panUrl':
          this.filesToSend.ownerPanCard = file;
          break;
        case 'reraUrl':
          this.filesToSend.rera = file;
          break;
        case 'aadharUrl':
          this.filesToSend.ownerAadhar = file;
          break;
        case 'personUrl':
          this.filesToSend.personAadhar = file;
          break;
        case 'gstCertificateUrl':
          this.filesToSend.gstCertificate = file;
          break;
      }
    });
  }

  download(filePath: string, fileNameFromUi: string): void {
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = fileNameFromUi; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.channelPartnerService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: `The file  has been downloaded successfully!`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          console.error('Error downloading PDF:', error);
          Swal.fire({
            title: 'Error',
            text: `Failed to download the file "${fileNameFromUi}". Please try again later.`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
  private downloadFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
