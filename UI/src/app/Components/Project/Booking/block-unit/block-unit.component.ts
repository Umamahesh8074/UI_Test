import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TIME_OUT } from 'src/app/Constants/CommanConstants/Comman';
import { ROLE_NAMES } from 'src/app/Constants/Crm/CrmConstants';
import { AvailableUnitsDto } from 'src/app/Models/Project/unit';
import { UserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-block-unit',
  templateUrl: './block-unit.component.html',
  styleUrls: ['./block-unit.component.css'],
})
export class BlockUnitComponent implements OnInit {
  formData!: FormGroup;
  unitsDeatilsData: AvailableUnitsDto = new AvailableUnitsDto();
  organizationId: number = 0;
  userId: number = 0;
  userName: string = '';
  usersData: UserDto[] = [];
  UserFc: any = new FormControl([] as UserDto[]);
  minDate: Date = new Date();
  constructor(
    private builder: FormBuilder,
    private unitService: UnitService,
    private toastrService: ToastrService,
    private router: Router,
    private userService: UserService,
    private commonService: CommanService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.initializeFormData();
    this.getDataFromState();
    this.setUserFromLocalStorage();
    this.getUserDetails();
  }
  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [],
      blockedBy: [, Validators.required],
      blockedDate: ['', [Validators.required]],
      remarks: [, Validators.required],
    });
  }
  getDataFromState() {
    const state = history.state;
    this.unitsDeatilsData = history.state.unitsData;
    console.log(this.unitsDeatilsData);
  }
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }
  clearForm() {
    this.formData.reset();
  }

  save() {
    this.formData.patchValue({ id: this.unitsDeatilsData.unitId });
    this.formData.value.blockedDate = this.formatDateTime(
      this.formData.value.blockedDate
    );
    if (this.formData.valid) {
      this.showLoading();
      this.unitService.updateUnitStatus(this.formData.value).subscribe({
        next: (response) => {
          this.hideLoading();
          this.handleSuccessResponse(response);
        },
        error: (error) => {
          this.hideLoading();
          this.handleErrorResponse(error);
        },
      });
    }
  }
  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.goToUnits();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }
  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-IN');
  }
  goToUnits() {
    this.router.navigate(['/layout/project/unit']);
  }
  getUserDetails() {
    this.userService
      .getUsersByRoleNamesForUnit(this.organizationId, this.userName,ROLE_NAMES)
      .subscribe({
        next: (data) => {
          this.usersData = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  displayUser(user: UserDto): string {
    return user && user.userName ? user.userName : '';
  }
  searchUser(event: any) {
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      this.userName = event.target.value;
      this.getUserDetails();
    }
  }
  onUserSelect(event: any) {
    this.userId = event?.option.value?.userId;
    this.formData.patchValue({ blockedBy: this.userId });
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
