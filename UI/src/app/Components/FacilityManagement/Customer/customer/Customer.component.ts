import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Block } from 'src/app/Models/Block/block';
import { Customer, ICustomer, SingleStringDto } from 'src/app/Models/Customer/customer';
import { Level } from 'src/app/Models/Project/level';
import { Project } from 'src/app/Models/Project/project';
import { AvailableUnitsDto } from 'src/app/Models/Project/unit';
import { Role } from 'src/app/Models/User/Role';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { AddressService } from 'src/app/Services/addres/address.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',

  styleUrls: ['./customer.component.css'],
})
export class AddCustomerComponent implements OnInit {
  customer: ICustomer = new Customer();
  isAdding: boolean = true;
  projectData: Project[] = [];
  projectTypeId: number = 0;
  roleData: any;
  roleId: number = 0;
  addressId: number = 0;
  userId:number=0;
  roleName: string = 'Customer';
  projectTypeData:any;
  blockData: Block[] = [];
  levelsData: Level[] = [];
  isDisplay: boolean = false;
  private residentType: string = '';
  public residentTypes: string[] = ["OWNER", "TENANT"];
  private destroy$ = new Subject<void>();
  isSave:boolean=false;
  levelId: number=0;
  blockId: number=0;
  blocks: Block[] = [];
  levels: Level[] = [];
  availableUnits: any;
  projectId: number=0;
  totalItems: number=0;
  constructor(
    private router: Router,
    private customerService: CustomerService,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private blockService: BlockService,
    private levelService: LevelService,
    private addressService: AddressService,
    private userService: UserService,
    private roleService: RoleService,
    private unitService: UnitService,
  ) { }

  ngOnInit(): void {
    this.customer = history.state.customer;
    if (history.state.customer != null) {
      this.isAdding = false;
    }

    this.getAllProjects();
    this.getAllroles();

  }

  formData = this.builder.group({
    customerId: this.builder.control(0),
    name: this.builder.control('', Validators.required),
    emailId: this.builder.control('', Validators.required),
    phoneNumber: this.builder.control('', Validators.required),
    projectId: this.builder.control('', Validators.required),
    blockId: this.builder.control('', Validators.required),
    levelId: this.builder.control('', Validators.required),
    unitId: this.builder.control('', Validators.required),
    residentType: this.builder.control('', Validators.required),
    addressId: this.builder.control(this.addressId),
    roleId: this.builder.control(this.roleId),
    password: this.builder.control(''),
    userName: this.builder.control(''),
    email: this.builder.control(''),
    userId:this.builder.control(this.userId)

  });
  addressformData = this.builder.group({
    address1: this.builder.control('', Validators.required),
    pincode: this.builder.control('', Validators.required),
    gstin: this.builder.control('', Validators.required),
    state: this.builder.control('', Validators.required),
    code: this.builder.control('', Validators.required),
    pan: this.builder.control('', Validators.required),
    address2: this.builder.control('', Validators.required),
    address3: this.builder.control('', Validators.required),
  })

  getAllroles() {
    this.roleService
      .getAllRole(this.roleName, 0, 10, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(resp.records);
          this.roleData = resp.records;
          console.log(this.roleData);
          if (this.roleData.length > 0) {
            this.roleId = this.roleData[0].roleId;
            console.log(this.roleId);
            this.formData.patchValue({ roleId: this.roleId });
          }


          // this.router.navigate(['layout/facility/management/customer']);
        },
        error: (err) => {
          console.error('Error adding Customer', err);
        },
      });

  }
  address() {
    console.log(this.addressformData.value);
    this.addressService
      .addAddress(this.addressformData.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.addressId = resp.addressId;
          console.log(this.addressId);
          this.saveAsUser();
           this.router.navigate(['layout/facility/management/customer']);
        },
        error: (err) => {
          console.error('Error adding Customer', err);
        },
      });


  }

  getAllProjects() {
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.projectData = resp;
        },
        error: (err) => {
          console.error('Erro getting projects', err);
        },
      });
  }
  getProjectType(projectTypeId: number): void {
    console.log(projectTypeId);

    this.customerService.getprojectTYpe(projectTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          this.projectTypeData = resp;
          console.log('Project Type Data:', this.projectTypeData);
          console.log(this.residentType);

        },
        error: (err) => {
          console.error('Error getting project type', err);
        }
      });
  }
  //get blocks based on project id
  getBlocksBasedOnProjectId(projectId: any) {
    console.log("asdfgh");
   this.projectId=projectId
    console.log(this.projectId);
    this.levelId = 0;
    this.blockService
      .getBlocks(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.blocks = response;
          console.log(this.blocks);

        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  //get all levels basedon blockId
  getLevelsBasedOnBlockId(blockId: any) {
    this.blockId=blockId;
    console.log(this.blockId);
    
    this.levelService
      .getLevels(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.levels = response;
          console.log(this.levels);

        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getAvailableUnits(levelId:any) {
    console.log(levelId);
    this.unitService
      .getUnitsBasedOnLevelId(levelId,"")
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.availableUnits = response;
          
          console.log(response);
          // this.flag = this.availableUnits.length > 0 ? 'available' : 'not available';
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  onResidentTypeChange(residentType: any) {
    this.residentType = residentType;
    if (this.projectTypeData.ProjectType == 'COMERTIAL' && this.residentType == 'TENANT') {
      this.isDisplay = true;
    } else {
      this.isDisplay = false;
      console.log('Is Display:', this.isDisplay);
    }
  }

  saveAsUser() {
    this.formData.patchValue({ password: this.formData.get('phoneNumber')?.value });
    this.formData.patchValue({ userName: this.formData.get('name')?.value });
    this.formData.patchValue({ email: this.formData.get('emailId')?.value });
    
    this.userService
      .addUser(this.formData.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.userId=resp.userId;
          this.save();

           this.router.navigate(['layout/facility/management/customer']);

        },
        error: (err) => {
          console.error('Error adding Customer', err);
        },
      });
  }

  save() {
    if (this.isAdding) {
      this.formData.patchValue({ addressId: this.addressId });
      this.formData.patchValue({ userId: this.userId });
      console.log(this.formData.value);
     
      this.customerService
        .addCustomer(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            console.log(resp);
             this.router.navigate(['layout/facility/management/customer']);

          },
          error: (err) => {
            console.error('Error adding Customer', err);
          },
        });
    } else {
      //updating customer
      this.customerService
        .updateCustomer(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // this.router.navigate(['layout/facility/management/customer']);
          },
          error: (err) => {
            console.error('Error updating Customer', err);
          },
        });
    }
  }
  onSubmit() {

    if (this.isDisplay) {
      console.log(this.isDisplay);
      this.address();
    }
    else {
      console.log(this.isDisplay);
      this.saveAsUser();
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoCustomers() {
    this.router.navigate(['layout/facility/management/customer']);
  }

}
