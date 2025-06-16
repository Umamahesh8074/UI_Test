export interface IFileUploadResponse {
  successCount: number;
  failureCount: number;
  fileName: string;
}

export class FileUploadResponse implements IFileUploadResponse {
  successCount: number = 0;
  failureCount: number = 0;
  fileName: string = '';
}
