import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PresalesControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import { DOWNLOAD_DEMAND_LETTER_PDF } from 'src/app/Apis/CrmApis/PaymentDetailsApis';
import {
  DELETE_CP,
  DOWNLOAD_FILE,
  GET_ALL_CP_SPEC,
  GET_APPROVAL_CP,
  GET_CP,
  REGISTER_CP,
  UPDATE_APPROVED_CP,
  UPDATE_CP,
} from 'src/app/Apis/Presales/presales';
import { Page } from 'src/app/Models/CommanModel/Page';
import {
  ChannelPartnerRegisterBean,
  IChannelPartnerRegisterBean,
} from 'src/app/Models/Presales/channelPartner';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChannelPartnerRegisterService {
  constructor(private http: HttpClient) {}

  //get all cps
  //get all cps
  getChannelPartnerRegisterDetails(
    cpName: any,
    page: number,
    size: number,
    phoneNumber: number
  ): Observable<Page<ChannelPartnerRegisterBean>> {
    return this.http.get<Page<ChannelPartnerRegisterBean>>(
      `${environment.leadBaseUrl}${GET_ALL_CP_SPEC}?cpName=${cpName}&page=${page}&size=${size}&phoneNumber=${phoneNumber}`
    );
  }

  //register cp
  registerChannelPartner(
    channelPartner: any,
    files?: {
      ownerPanCard: any;
      rera: any;
      ownerAadhar: any;
      personAadhar: any;
      gstCertificate: any;
    }
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('channelPartner', JSON.stringify(channelPartner));
    console.log(formData);

    console.log(files?.ownerAadhar);
    // Append files to formData
    if (files) {
      if (files.ownerPanCard) {
        formData.append('ownerPanCard', files.ownerPanCard);
      }
      if (files.rera) {
        formData.append('rera', files.rera);
      }
      if (files.ownerAadhar) {
        formData.append('ownerAadhar', files.ownerAadhar);
      }
      if (files.personAadhar) {
        formData.append('personAadhar', files.personAadhar);
      }
      if (files.gstCertificate) {
        formData.append('gstCertificate', files.gstCertificate);
      }
    }

    // Send the formData with the POST request
    return this.http.post<any>(
      `${environment.leadBaseUrl}${REGISTER_CP}`,
      formData
    );
  }

  //update cp
  updateChannelPartner(
    channelPartner: any,
    files?: {
      ownerPanCard: any;
      rera: any;
      ownerAadhar: any;
      personAadhar: any;
      gstCertificate: any;
    }
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('channelPartner', JSON.stringify(channelPartner));
    // Append files to formData
    if (files) {
      if (files.ownerPanCard) {
        formData.append('ownerPanCard', files.ownerPanCard);
      }
      if (files.rera) {
        formData.append('rera', files.rera);
      }
      if (files.ownerAadhar) {
        formData.append('ownerAadhar', files.ownerAadhar);
      }
      if (files.personAadhar) {
        formData.append('personAadhar', files.personAadhar);
      }
      if (files.gstCertificate) {
        formData.append('gstCertificate', files.gstCertificate);
      }
    }
    return this.http.put<any>(
      `${environment.leadBaseUrl}${UPDATE_CP}`,
      formData
    );
  }
  //update approved cp
  updateApprovedChannelPartner(channelPartner: IChannelPartnerRegisterBean) {
    console.log(channelPartner);
    return this.http.put<any>(
      `${environment.leadBaseUrl}${UPDATE_APPROVED_CP}`,
      channelPartner
    );
  }

  //delete cp
  deleteChannelPartner(cpId: any) {
    console.log(cpId);
    return this.http.delete<any>(
      `${environment.leadBaseUrl}${DELETE_CP}/${cpId}`
    );
  }

  //get channel partner
  getChannelPartner(id: any): Observable<any> {
    return this.http.get<any>(`${environment.leadBaseUrl}${GET_CP}?id=${id}`);
  }

  //get cp for approval
  getApprovalChannelPartners(
    page: number,
    size: number,
    isApproval: Boolean,
    name: string,
    userId: number,
    statusName: any,
    cpId?: number
  ): Observable<any> {
    cpId = cpId ?? 0;
    return this.http.get<any>(
      `${environment.leadBaseUrl}${GET_APPROVAL_CP}?page=${page}&size=${size}&isApproval=${isApproval}&name=${name}&userId=${userId}&statusName=${statusName}&cpId=${cpId}`
    );
  }
  downloadFileName(
    phoneNumber: string,
    name: string,
    url: string
  ): Observable<Blob> {
    return this.http.get<Blob>(
      `${environment.leadBaseUrl}${DOWNLOAD_FILE}?phoneNumber=${phoneNumber}&name=${name}&url=${url}`,
      { responseType: 'blob' as 'json' }
    );
  }

  //update cp bulk upload limit and bulk upload permission
  updateApprovedCp(channelPartner: IChannelPartnerRegisterBean) {
    console.log(channelPartner);
    return this.http.put<any>(
      `${environment.leadBaseUrl}${UPDATE_CP}`,
      channelPartner
    );
  }

  //update cp bulk upload limit and bulk upload permission
  getCpById(cpId: number) {
    console.log('getCpById => ' + cpId);
    return this.http.get<any>(
      `${environment.leadBaseUrl}${PresalesControllerPaths.CHANNEL_PARTNER}/${cpId}`
    );
  }
  generateDemandLetterPdf(filePath: string): Observable<Blob> {
    // Ensure the filePath is properly encoded for a URL
    const encodedFilePath = encodeURIComponent(filePath);

    return this.http.get<Blob>(
      `${environment.projectBaseUrl}${DOWNLOAD_DEMAND_LETTER_PDF}?filePath=${encodedFilePath}`,
      { responseType: 'blob' as 'json' }
    );
  }
  getChannelPartnerByCpId(id: any): Observable<ChannelPartnerRegisterBean[]> {
    return this.http.get<ChannelPartnerRegisterBean[]>(
      `${environment.leadBaseUrl}${GET_CP}?id=${id}`
    );
  }
}
