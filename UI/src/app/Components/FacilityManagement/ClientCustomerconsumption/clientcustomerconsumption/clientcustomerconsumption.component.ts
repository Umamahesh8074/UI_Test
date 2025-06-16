import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  Client,
  ClientCustomerconsumption_Item,
  ClientFacilityDto,
  FacilityServicesDto,
  FaclityService,
  IClientCustomerconsumption_Item,
  IFaclityService,
} from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';

import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';

import { Customer } from 'src/app/Models/Customer/customer';

import {
  Customerconsumption,
  CustomerconsumptionDto,
  ICustomerconsumption,
} from 'src/app/Models/Customerconsumption/customerconsumption';
import { Role } from 'src/app/Models/User/Role';
import { User } from 'src/app/Models/User/User';
import { ClientService } from 'src/app/Services/client/client.service';
import { ClientCustomerconsumptionService } from 'src/app/Services/ClientCustomerconsumption/clientcustomerconsumption.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { CustomerconsumptionService } from 'src/app/Services/Customerconsumption/customerconsumption.service';
import { RoleService } from 'src/app/Services/UserService/role.service';

@Component({
  selector: 'app-clientcustomerconsumption',
  templateUrl: './clientcustomerconsumption.component.html',
  styleUrls: ['./clientcustomerconsumption.component.css'],
})
export class AddClientCustomerconsumptionComponent implements OnInit {
  clientArray: Client[] = [];



  faclityService: IFaclityService = new FaclityService();
  customerconsumption: FacilityServicesDto[] = [];
   Customer_Service: string = 'Customer_Service';
  clientFacilityServiceDto: ClientFacilityDto = new ClientFacilityDto();
  roles: Role[] = []; // Original list of roles
  availableRoles: Role[] = []; // Filtered list of roles
 
  CustomerServiceList: CommonReferenceType[] = [];
  isView = false;
  showAdditionalFields: any[] = [];
  formData!: FormGroup;

  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  consumptionId: any;
  //customer:Customer[]=[];
  user: User = new User();
  organizationId = 0;
  isCurrentConsumptionDisabled: boolean = false;
  ajnaCustomerconsumptionItem: IClientCustomerconsumption_Item =
    new ClientCustomerconsumption_Item();
    selectedRoles: string[] = [];  // Keep track of selected role names

  client: Client = new Client();
  clientId: any;
  location: string = '';
  serviceName: string[] = [];
  clientData: any;

  constructor(
    private router: Router,
    private clientcustomerconsumptionService: ClientCustomerconsumptionService,
    private commonService: CommanService,
    private customerService: CustomerService,
    private builder: FormBuilder,
    private clientService: ClientService,
    private fb: FormBuilder,
    private roleService: RoleService,
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
    }
    this.initialize();
    this.customerconsumption = history.state.customerconsumptionData;
    console.log(this.customerconsumption);

    this.loadClients();
    this.fetchRoles();
    this.fetchCustomerService();
    if (this.customerconsumption) {
   const customer=  this.customerconsumption
      this.isAdding = false;
      this.patchData(customer);
    } else {
      console.warn('Customer consumption data is missing or empty');
    }
   
  }

  fetchCustomerService(): void {
    console.log(this.Customer_Service);
    this.commonService.getRefDetailsByType(this.Customer_Service).subscribe({
      next: (types) => {
        this.CustomerServiceList = types;
      },
      error: (error: any) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }
  // Example method to log service names

  private initialize(): void {
    this.formData = this.builder.group({
      clientId: [0, Validators.required],
      projectLocation: [''],
      location: [''],
      ClientCustomerconsumptionItem: this.builder.array([
        this.createClientCustomerconsumptionItemGroup(),
      ]),
    });

    this.showAdditionalFields.push({
      serviceName: '',
      manPower: 0,
      serviceSalary: 0.0,
    });

    // this.patchFormData();
  }
  private loadClients(): void {
    this.clientService.getClientDetailsByClientId().subscribe({
      next: (resp) => {
        this.clientData = resp;
        console.log(this.clientData);
        console.log(resp[0].projectLocation);
      },
      error: (err) => {
        console.error('Error loading projects', err);
      },
    });
  }
  onLocationSelect(event: any): void {
    const selectedClientId = event.value;
    this.clientId = selectedClientId;
  }
  onSelect(event: any): void {
    const selectedClientId = event.value;
    this.clientId = selectedClientId;
    this.loadClientsByLocation();
  }

  private loadClientsByLocation(): void {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (resp) => {
        this.clientId = resp;
        this.location = this.clientId?.location; // Store the location
        console.log('Client data loaded:', this.location);
        this.formData.patchValue({
          clientId: resp.clientId,
          projectLocation: resp.projectLocation,
          location: resp.location,
        });
      },
      error: (err) => {
        console.error('Error loading projects', err);
      },
    });
  }

  get ClientCustomerconsumptionItem(): FormArray {
    return this.formData.get('ClientCustomerconsumptionItem') as FormArray;
  }
  addItems(): void {
    this.showAdditionalFields.push({
      serviceName: '',
      manPower: 0,
      serviceSalary: 0,
    });

    const indentItemsArray = this.formData.get(
      'ClientCustomerconsumptionItem'
    ) as FormArray;
    indentItemsArray.push(this.createClientCustomerconsumptionItemGroup());
  }
  createClientCustomerconsumptionItemGroup(): FormGroup {
    return this.builder.group({
      serviceName: new FormControl(''),
      manPower: new FormControl(0),
      serviceSalary: new FormControl(0),
    });
  }


  fetchRoles() {
    console.log();
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  // fetchRoles() {
  //   this.roleService.fetchAllRoles('', this.organizationId).subscribe({
  //     next: (roles: Role[]) => {
  //       this.roles = roles;
  //       this.availableRoles = [...roles]; // Initially, all roles are available
  //     },
  //     error: (error: any) => {
  //       console.error(error);
  //     },
  //   });
  // }



  // private updateAvailableRoles(): void {
  //   const selectedRolesInForm = this.ClientCustomerconsumptionItem.controls.map(
  //     (control: any) => control.value.serviceName
  //   );
    
  //   this.availableRoles = this.roles.filter(
  //     (role) => !selectedRolesInForm.includes(role.roleName)
  //   );
  // }

  // // Called when a role is selected from the dropdown
  // onRoleSelect(event: any, i: number): void {
  //   const selectedRole = event.value;
    
  //   // Only add the role if it's not already selected
  //   if (selectedRole && !this.selectedRoles.includes(selectedRole)) {
  //     this.selectedRoles.push(selectedRole); // Add the role to the selected roles
  //   }
    
  //   this.updateAvailableRoles(); // Update available roles after selection
  // }
  save() {
    const formValue = this.formData.value;

    const payload: FacilityServicesDto = {
      facilityServices: formValue.ClientCustomerconsumptionItem.map(
        (item: any) => ({
          serviceName: item.serviceName,
          manPower: item.manPower,
          serviceSalary: item.serviceSalary,
          clientId: formValue.clientId,
          projectLocation: formValue.projectLocation,
          location: formValue.location,
        })
      ),
    };

    if (this.isAdding) {
      this.clientcustomerconsumptionService
        .addClientCustomerconsumption(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            console.log(resp);
            this.router.navigate(['layout/facility/management/ajnaconsumpton']);
          },
          error: (err) => {
            console.error('Error adding consumption', err);
          },
        });
    } else {
      this.clientcustomerconsumptionService
        .updateCustomerconsumption(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['layout/facility/management/ajnaconsumpton']);
          },
          error: (err) => {
            console.error('Error updating consumption', err);
          },
        });
    }
  }

  gotoCustomerconsumptions() {
    this.router.navigate(['layout/facility/management/ajnaconsumpton']);
  }

  removeIcons(index: any) {
    if (this.showAdditionalFields.length > 1) {
      this.showAdditionalFields.splice(index, 1);
      const indentItemsArray = this.formData.get(
        'ClientCustomerconsumptionItem'
      ) as FormArray;
      indentItemsArray.removeAt(index);
    } else {
      console.log('item should be at least one');
    }
  }

  clearForm() {
    this.formData.reset();
  }
  
  patchData(customer: FacilityServicesDto[]): void {
    console.log('Patching data...');
    console.log('Customer object:', JSON.stringify(customer, null, 2));
  
    // Ensure there are facility services in the customer data
    const facilityServices = customer[0]?.facilityServices || [];
  
    // Get the FormArray that holds the services
    const clientItemsArray = this.formData.get('ClientCustomerconsumptionItem') as FormArray;
  

  
    // Ensure there is data to patch
    if (facilityServices.length > 0) {
      facilityServices.forEach((service) => {
        // Create a FormGroup for each service, initializing with the service data or defaults
        const clientItemGroup = this.builder.group({
          serviceName: [service.serviceName || '', Validators.required],
          manPower: [service.manPower || 0, Validators.required],
          serviceSalary: [service.serviceSalary || 0, Validators.required],
          clientId: [service.clientId || 0],
          projectLocation: [service.projectLocation || ''],
          location: [service.location || ''],
        });
  
        // Push the new FormGroup to the FormArray
        clientItemsArray.push(clientItemGroup);
      });
    }
  
    // Log the form data to confirm it has been patched
    console.log('Patched formData:', this.formData.value);
  }
  
  

  gotoclients() {
    this.router.navigate(['layout/facility/management/ajnaconsumpton']);
  }

  // patchFormData() {
  //   console.log(this.customerconsumption);
  //   this.formData.patchValue(this.customerconsumption);
  //   console.log(this.formData.value); // Use value to see the updated form data
  // }

  // patchFormData() {
  //   //console.log(this.invoice.totalValue);
  //   this.formData.patchValue(this.customerconsumption);

  //   // this.formData.patchValue({
  //   //   serviceSalary: [this.customerconsumption],
  //   // });
  // }
}
