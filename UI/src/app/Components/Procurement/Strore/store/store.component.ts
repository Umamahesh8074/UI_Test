import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  INDENT_CREATOR_ROLE,
  PURCHASE_ORDER_ROLE,
  QUOTATION_CREATOR_ROLE,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { IStore, Store } from 'src/app/Models/Procurement/store';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IUser, User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { StoreService } from 'src/app/Services/ProcurementService/Store/store.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit, OnDestroy {
  isAdding?: boolean;
  projectFc: FormControl = new FormControl(
    [] as Project[],
    Validators.required
  );
  userFc: FormControl = new FormControl([] as IUser[], Validators.required);
  projectName: string = '';
  formData!: FormGroup;
  private destroy$ = new Subject<void>();
  selectedProject: IProject = new Project();
  project: Project[] = [];
  users: IUser[] = [];
  selectedInCharges: IUser[] = [];
  selectedIndentCreator: IUser[] = [];
  selectedQuotationCreator: IUser[] = [];
  selectedPoCreators: IUser[] = [];
  store: IStore = new Store();
  organizationId: number = 0;
  public user: User = new User();
  displayPageData: any;
  recivedIndentCreators: User[] = [];
  recivedQuotationCreators: User[] = [];
  recivedPoCreators: User[] = [];

  indentCreatorFc: FormControl = new FormControl(
    [] as IUser[],
    Validators.required
  );
  quotationCreatorFc: FormControl = new FormControl(
    [] as IUser[],
    Validators.required
  );
  poCreatorFc: FormControl = new FormControl(
    [] as IUser[],
    Validators.required
  );
  indentCreatorSearchControl = new FormControl('');
  quotationCreatorSearchControl = new FormControl('');
  poCreatorSearchControl = new FormControl('');
  indentCreatorName: string = '';
  quotationCreatorName: string = '';
  poCreatorName: string = '';
  filteredIndentCreators: IUser[] = [];
  filteredQuotationCreators: IUser[] = [];
  filteredPoCreators: IUser[] = [];
  isEditMode: boolean = false;
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private storeService: StoreService,
    private router: Router,
    private builder: FormBuilder,
    private commanService: CommanService,
    protected route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setUserFromLocalStorage();
    this.getProjects();
    this.getAllUsers();
    this.getDataFromState();
    this.getIndentCreatorUsers();
    this.getQuotationCreatorUsers();
    this.getPoCreatorUsers();
  }
  getPoCreatorUsers() {
    this.userService;
    this.userService
      .fetchAllUsers(this.poCreatorName, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.recivedPoCreators = users;
          this.filteredPoCreators = this.recivedPoCreators;
        },
        error: (error: Error) => {
          console.error('Error fetching Users:', error);
        },
      });
  }
  getIndentCreatorUsers() {
    this.userService
      .fetchAllUsers(this.indentCreatorName, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.recivedIndentCreators = users;
          this.filteredIndentCreators = this.recivedIndentCreators;

          // this.selectedIndentCreator = this.selectedIndentCreator?.filter(
          //   (id) =>
          //     this.filteredIndentCreators.some((users) => users.userId === id)
          // );
        },
        error: (error: Error) => {
          console.error('Error fetching Users:', error);
        },
      });
  }
  getQuotationCreatorUsers() {
    this.userService
      .fetchAllUsers(this.indentCreatorName, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.recivedQuotationCreators = users;
          this.filteredQuotationCreators = this.recivedQuotationCreators;
        },
        error: (error: Error) => {
          console.error('Error fetching Users:', error);
        },
      });
  }

  getDataFromState() {
    const { store, isAdding, displayPage } = history.state;
    console.log(history.state);

    this.isAdding = isAdding;
    this.store = store || this.store;
    if (!this.isAdding) {
      this.isEditMode = true;
      this.patchFormDataWithStoreData();
    }
    if (displayPage) {
      this.displayPageData = displayPage;
    }
  }

  private initializeForm(): void {
    this.formData = this.builder.group({
      storeId: [0],
      storeName: ['', Validators.required],
      contactNumber: [''],
      isActive: [''],
      billingAddress: [''],
      billingGstNumber: [''],
      projectId: ['', Validators.required],
      selectedInChargesId: [[], Validators.required],
      selectedIndentCreator: [[], Validators.required],
      selectedQuotationCreator: [[], Validators.required],
      selectedPoCreator: [[], Validators.required],
    });
  }

  patchFormDataWithStoreData(): void {
    this.store.selectedInChargesId?.map((inChargerId) => {
      this.userService.getUserById(inChargerId).subscribe((inCharger) => {
        this.selectedInCharges.push(inCharger);
        this.userFc.setValue(this.selectedInCharges);
      });
    });

    this.store.selectedIndentCreator?.map((userId) => {
      this.userService.getUserById(userId).subscribe((user) => {
        this.selectedIndentCreator.push(user);
        this.indentCreatorFc.setValue(this.selectedIndentCreator);
      });
    });

    this.store.selectedQuotationCreator?.map((userId) => {
      this.userService.getUserById(userId).subscribe((user) => {
        this.selectedQuotationCreator.push(user);
        this.quotationCreatorFc.setValue(this.selectedQuotationCreator);
      });
    });

    this.store.selectedPoCreator?.map((userId) => {
      this.userService.getUserById(userId).subscribe((user) => {
        this.selectedPoCreators.push(user);
        this.quotationCreatorFc.setValue(this.selectedPoCreators);
      });
    });
    this.fetchProjectById(this.store.projectId);
    this.formData.patchValue(this.store);
  }

  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
          this.formData.patchValue({ projectId: data.projectId });
          this.projectFc.setValue(this.selectedProject);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  getProjects() {
    this.projectService
      .getProjectsForStore(this.projectName, this.organizationId)
      .subscribe({
        next: (data) => {
          this.project = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  getAllUsers(): void {
    this.userService.getAllUser().subscribe((users) => {
      this.users = users;
    });
  }

  onProjectSelect(event: any): void {
    const selectedProject = event.option.value;
    this.formData.patchValue({ projectId: selectedProject.projectId });
  }

  onInChargesSelect(): void {
    this.selectedInCharges = this.userFc.value || [];
    this.formData.patchValue({
      selectedInChargesId: this.selectedInCharges.map((user) => user.userId),
    });
  }

  getSelectedInchargesNames(): string {
    const selectedIncharges = this.userFc.value || [];
    return selectedIncharges.map((user: IUser) => user.userName).join(', ');
  }

  gotoStore(): void {
    this.router.navigate(['layout/procurement/store'], {
      state: {
        displayPageData: this.displayPageData,
      },
    });
  }

  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.getProjects();
    }
  }

  compareInCharger(inCharger1: IUser, inCharger2: IUser): boolean {
    return inCharger1?.userId === inCharger2?.userId;
  }

  // compareProjects(project1: Project, project2: Project): boolean {
  //   return project1?.projectId === project2?.projectId;
  // }

  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.organizationId = this.user.organizationId;
    }
  }

  onSubmit(): void {
    if (this.formData.valid) {
      const formDataValue = this.formData.value;
      const saveOrUpdateObservable = this.isAdding
        ? this.storeService.saveStore(formDataValue)
        : this.storeService.editStore(formDataValue);

      saveOrUpdateObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (resp) => {
          const navigateExtras = {
            relativeTo: this.route.parent,
          };
          this.handleSuccessResponse(resp);
          this.router.navigate(['./procurement/store'], navigateExtras);
        },
        error: (err) => {
          this.handleErrorResponse(err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success',
      text: response.message,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
    }).then(() => {});
  }

  handleErrorResponse(error: any): void {
    Swal.fire({
      title: 'Error',
      text: error?.error?.message || 'An unknown error occurred',
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
      }
    });
  }

  clearForm(): void {
    this.userFc.reset();
    this.formData.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // searchIndentCreator(event: any): void {
  //   const query = (event.target as HTMLInputElement).value.toLowerCase();
  //   if (query.length >= 2 || query.length === 0) {
  //     this.filteredIndentCreators = this.recivedIndentCreators.filter((user) =>
  //       user.userName.toLowerCase().includes(query)
  //     );
  //     this.indentCreatorName = query;
  //     this.getIndentCreatorUsers();
  //   }
  // }
  searchIndentCreator(event: any): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    // this.filteredIndentCreators = this.recivedIndentCreators.filter((user) =>
    //   user.userName.toLowerCase().includes(query)
    // );
    // Filter based on query
    const matchingUsers = this.recivedIndentCreators.filter((user) =>
      user.userName.toLowerCase().includes(query)
    );

    // Separate selected from unselected
    const selected = matchingUsers.filter((user) =>
      this.selectedIndentCreator.some((sel) => sel.userId === user.userId)
    );

    const unselected = matchingUsers.filter(
      (user) =>
        !this.selectedIndentCreator.some((sel) => sel.userId === user.userId)
    );

    // Combine: selected on top
    this.filteredIndentCreators = [...selected, ...unselected];
  }

  // if (this.sourceSubsourceMap[sourceId]) {
  //   this.sourceSubsourceMap[sourceId]?.push(selectedSubSourceId);
  // }

  // if (!this.selectedSubSourcesIds) {
  //   this.selectedSubSourcesIds = [];
  // }
  // this.selectedSubSourcesIds?.push(selectedSubSourceId);

  onIndentCreatorChange(user: IUser, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedIndentCreator.push(user);
    } else {
      this.selectedIndentCreator = this.selectedIndentCreator.filter(
        (u) => u.userId !== user.userId
      );
    }
    const names = this.selectedIndentCreator.map((u) => u.userName).join(', ');
    this.indentCreatorSearchControl.setValue(names);
    this.indentCreatorFc.setValue(this.selectedIndentCreator);
    this.formData.patchValue({
      selectedIndentCreator: this.selectedIndentCreator.map((u) => u.userId),
    });

    console.log('Selected:', this.selectedIndentCreator);
    console.log('FormData:', this.formData.value);
  }

  isIndentCreatorSelected(userId?: number): boolean {
    return this.selectedIndentCreator.some((user) => user.userId === userId);
  }
  compareIndentCreator(indtCrtr1: IUser, indtCrtr2: IUser): boolean {
    return indtCrtr1?.userId === indtCrtr2?.userId;
  }
  getSelectedIndentCreator(): string {
    return this.selectedIndentCreator.map((user) => user.userName).join(', ');
  }

  searchQuotationCreator(event: any): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    const matchingUsers = this.recivedQuotationCreators.filter((user) =>
      user.userName.toLowerCase().includes(query)
    );

    const selected = matchingUsers.filter((user) =>
      this.selectedQuotationCreator.some((sel) => sel.userId === user.userId)
    );

    const unselected = matchingUsers.filter(
      (user) =>
        !this.selectedQuotationCreator.some((sel) => sel.userId === user.userId)
    );

    this.filteredQuotationCreators = [...selected, ...unselected];
  }
  onQuotationCreatorChange(user: IUser, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedQuotationCreator.push(user);
    } else {
      this.selectedQuotationCreator = this.selectedQuotationCreator.filter(
        (u) => u.userId !== user.userId
      );
    }
    const names = this.selectedQuotationCreator
      .map((u) => u.userName)
      .join(', ');
    this.quotationCreatorSearchControl.setValue(names);

    this.quotationCreatorFc.setValue(this.selectedQuotationCreator);
    this.formData.patchValue({
      selectedQuotationCreator: this.selectedQuotationCreator.map(
        (u) => u.userId
      ),
    });
  }
  isQuotationCreatorSelected(userId?: number): boolean {
    return this.selectedQuotationCreator.some((user) => user.userId === userId);
  }

  compareQuotationCreator = (a: IUser, b: IUser) => a?.userId === b?.userId;

  getSelectedQuotationCreator(): string {
    return (this.quotationCreatorFc.value || [])
      .map((user: IUser) => user.userName)
      .join(', ');
  }

  searchPoCreator(event: any): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    const matchingUsers = this.recivedPoCreators.filter((user) =>
      user.userName.toLowerCase().includes(query)
    );

    const selected = matchingUsers.filter((user) =>
      this.selectedPoCreators.some((sel) => sel.userId === user.userId)
    );

    const unselected = matchingUsers.filter(
      (user) =>
        !this.selectedPoCreators.some((sel) => sel.userId === user.userId)
    );

    this.filteredPoCreators = [...selected, ...unselected];
  }

  onPoCreatorChange(user: IUser, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedPoCreators.push(user);
    } else {
      this.selectedPoCreators = this.selectedPoCreators.filter(
        (u) => u.userId !== user.userId
      );
    }
    const names = this.selectedPoCreators.map((u) => u.userName).join(', ');
    this.poCreatorSearchControl.setValue(names);

    this.poCreatorFc.setValue(this.selectedPoCreators);
    this.formData.patchValue({
      selectedPoCreator: this.selectedPoCreators.map((u) => u.userId),
    });
  }

  isPoCreatorSelected(userId?: number): boolean {
    return this.selectedPoCreators.some((user) => user.userId === userId);
  }

  comparePoCreator = (a: IUser, b: IUser) => a?.userId === b?.userId;

  getSelectedPoCreator(): string {
    return (this.poCreatorFc.value || [])
      .map((user: IUser) => user.userName)
      .join(', ');
  }
  onInputFocus(): void {
    this.indentCreatorSearchControl.setValue('');
  }
}
