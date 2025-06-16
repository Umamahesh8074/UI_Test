import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, tap } from 'rxjs';
import { ControllerPaths } from 'src/app/Apis/ControllerPaths/ControllerPaths';
import {
  Employee,
  EmployeeDto,
  EmployeeSaveDto,
} from 'src/app/Models/Employee/employee';
import { Page } from 'src/app/Models/User/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}
  private _refreshRequired = new Subject<void>();

  addEmployee(Employee: any): Observable<any> {
    console.log(Employee);
    return this.http.post<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/save`,
      Employee
    );
  }
  updateEmployee(employeeSaveDto: any, selectedFiles: File[]): Observable<any> {
    console.log(employeeSaveDto.employeeBean.projectAssigned);
    const formData = new FormData();

    // const employeeSaveData = {
    //   employeeBean: { ...employeeSaveDto.employeeBean }, // Shallow copy
    //   employeeFamilyBeanList: [...employeeSaveDto.employeeFamilyBeanList],
    //   addressBeanList: [...employeeSaveDto.addressBeanList],
    //   employeeEducationBeanList: [...employeeSaveDto.employeeEducationBeanList],
    //   employeeBankDetails: [...employeeSaveDto.employeeBankDetails],
    // };
    // this.employeeBasicDetails.controls['formStatus'].setValue(
    //   employeeSaveDto.employeeBean.formStatus
    // );

    console.log('Employee Save Data:', employeeSaveDto);
    const valu = employeeSaveDto.employeeBean;
    console.log(valu.formStatusOne, valu.status);

    console.log(employeeSaveDto.employeeBean);

    // Append employee data to FormData
    formData.append('employeeSaveDto', JSON.stringify(employeeSaveDto));

    // Loop through selected files and append each one individually to FormData
    selectedFiles.forEach((file: File) => {
      console.log('Appending file:', file.name); // Log the file name
      formData.append('employeeDocuments', file); // This should be the correct key
    });

    // Debugging: Log FormData contents (optional)
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Retrieve the authentication token (assuming it's stored in localStorage)
    const token = localStorage.getItem('authToken'); // Replace with your token storage method

    // Set headers including Authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/update`,
      formData,
      { headers }
    );
  }

  getAllEmployees(
    projectAssigned: any,
    employeeRoleId: any,
    reportingManager: any,
    employeeId: string,
    status: string,
    organizationId: number,
    firstName: string,
    shiftId: any,
    page: number,
    size: number
  ) {
    console.log(projectAssigned, employeeRoleId, employeeId, page, size);

    if (projectAssigned == undefined || 0) projectAssigned = '';
    if (employeeRoleId == undefined || 0) employeeRoleId = '';
    if (reportingManager == undefined || 0) reportingManager = '';
    if (employeeId == undefined || 0) employeeId = '';
    if (status == undefined || 0) status = '';
    if (organizationId == undefined || 0) status = '';
    if (firstName == undefined || 0) firstName = '';
    if (shiftId == undefined || 0) shiftId = '';

    return this.http.get<Page<EmployeeDto>>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/getall?projectAssigned=${projectAssigned}&employeeRoleId=${employeeRoleId}&reportingManager=${reportingManager}&employeeId=${employeeId}&status=${status}&organizationId=${organizationId}&firstName=${firstName}&shiftId=${shiftId}&page=${page}&size=${size}`
    );
  }

  getAllResignedEmployees(
    projectAssigned: any,
    employeeRoleId: any,
    reportingManager: any,
    employeeId: string,
    status: string,
    organizationId: number,
    firstName: string,
    shiftId: any,
    page: number,
    size: number
  ) {
    console.log(projectAssigned, employeeRoleId, employeeId, page, size);

    if (projectAssigned == undefined || 0) projectAssigned = '';
    if (employeeRoleId == undefined || 0) employeeRoleId = '';
    if (reportingManager == undefined || 0) reportingManager = '';
    if (employeeId == undefined || 0) employeeId = '';
    if (status == undefined || 0) status = '';
    if (organizationId == undefined || 0) status = '';
    if (firstName == undefined || 0) firstName = '';
    if (shiftId == undefined || 0) shiftId = '';

    return this.http.get<Page<EmployeeDto>>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/getall/resigned?projectAssigned=${projectAssigned}&employeeRoleId=${employeeRoleId}&reportingManager=${reportingManager}&employeeId=${employeeId}&status=${status}&organizationId=${organizationId}&firstName=${firstName}&shiftId=${shiftId}&page=${page}&size=${size}`
    );
  }
  getAllEmployeesByOrg(organizationId: any, firstName: any) {
    if (organizationId == undefined || 0) organizationId = '';
    if (firstName == undefined || 0) firstName = '';
    return this.http.get<Page<EmployeeDto>>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/getall/org?organizationId=${organizationId}&firstName=${firstName}`
    );
  }

  deleteEmployee(id: number): Observable<string> {
    console.log(id);
    return this.http
      .delete<string>(
        `${environment.hrmBaseUrl}${ControllerPaths.Employee}/${id}`
      )
      .pipe(
        tap(() => {
          this._refreshRequired.next(); // Emit refresh event
        })
      );
  }

  getEmployeesById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/${id}`
    );
  }

  getEmployeeForSelectedShift(
    organizationId: any,
    projectId: any,
    shiftId: any
  ): Observable<any> {
    if (organizationId == undefined || 0) organizationId = '';
    if (projectId == undefined || 0) projectId = '';
    if (shiftId == undefined || 0) shiftId = '';
    return this.http.get<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/getemployeetoassignshift?organizationId=${organizationId}&projectId=${projectId}&shiftId=${shiftId}`
    );
  }

  updateShifts(
    rotationalShiftDto: any,
    organizationId: any,
    selectedShiftRefKey: any,
    projectId: any
  ): Observable<any> {
    console.log(rotationalShiftDto);
    const shiftData = {
      rotationalShiftDtoList: rotationalShiftDto,
      selectedShiftRefKey: selectedShiftRefKey,
      organizationId: organizationId,
      projectId: projectId,
    };
    return this.http.put(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/updateshiftmanually`,
      shiftData
    );
  }

  //   submitEmployee(employeeFormDetails: any,selectedFile:File[]) {
  //     console.log(employeeFormDetails);
  //
  //     console.log(employeeSaveData);

  //     return this.http.post<any>(
  //       `${environment.hrmBaseUrl}${ControllerPaths.Employee}/submitEmployee`,
  //       employeeSaveData
  //     );
  //   }

  submitEmployee(employeeFormDetails: any, selectedFiles: File[]) {
    const formData = new FormData();
    console.log(employeeFormDetails);

    // Prepare employee form data
    const employeeSaveData = {
      employeeBean: employeeFormDetails.employeeBean,
      employeeFamilyBeanList:
        employeeFormDetails.employeeFamilyBeanList.familyDetails,
      addressBeanList: employeeFormDetails.addressBeanList.addresses,
      employeeEducationBeanList:
        employeeFormDetails.employeeEducationBeanList.education,
      employeeBankDetails: employeeFormDetails.employeeBankDetails,
    };

    // Append employee data to FormData
    formData.append('employeeSaveDto', JSON.stringify(employeeSaveData));

    // Loop through selected files and append each one individually to FormData
    selectedFiles.forEach((file: File) => {
      console.log('Appending file:', file.name); // Log the file name
      formData.append('employeeDocuments', file); // This should be the correct key
    });

    // Debugging: Log FormData contents (optional)
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Retrieve the authentication token (assuming it's stored in localStorage)
    const token = localStorage.getItem('authToken'); // Replace with your token storage method

    // Set headers including Authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Send FormData to backend with authentication header
    return this.http.post<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/submitEmployee`,
      formData,
      { headers }
    );
  }

  getEmployeesDetailsByEmployeeId(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/getbyemployeeid?employeeId=${id}`
    );
  }

  getEmploveeForApproval(
    fileName?: string,
    page?: number,
    size?: number,
  ): Observable<any> {
    if (fileName == undefined || 0) fileName = '';
    return this.http.get<Page<EmployeeSaveDto>>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/getemployeeapproval?employeeName=${fileName}&page=${page}&size=${size}`
    );
  }

  updateEmployeeApprove(employeeSaveDto: any): Observable<any> {
    console.log(employeeSaveDto.employeeBean.projectAssigned);
    const formData = new FormData();

    // const employeeSaveData = {
    //   employeeBean: { ...employeeSaveDto.employeeBean }, // Shallow copy
    //   employeeFamilyBeanList: [...employeeSaveDto.employeeFamilyBeanList],
    //   addressBeanList: [...employeeSaveDto.addressBeanList],
    //   employeeEducationBeanList: [...employeeSaveDto.employeeEducationBeanList],
    //   employeeBankDetails: [...employeeSaveDto.employeeBankDetails],
    // };
    // this.employeeBasicDetails.controls['formStatus'].setValue(
    //   employeeSaveDto.employeeBean.formStatus
    // );

    console.log('Employee Save Data:', employeeSaveDto);
    const valu = employeeSaveDto.employeeBean;
    console.log(valu.formStatusOne, valu.status);

    console.log(employeeSaveDto.employeeBean);

    // Append employee data to FormData
    formData.append('employeeSaveDto', JSON.stringify(employeeSaveDto));

    // Debugging: Log FormData contents (optional)
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Retrieve the authentication token (assuming it's stored in localStorage)
    const token = localStorage.getItem('authToken'); // Replace with your token storage method

    // Set headers including Authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(
      `${environment.hrmBaseUrl}${ControllerPaths.Employee}/update`,
      formData,
      { headers }
    );
  }
}
