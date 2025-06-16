import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  IInventoryTransfer,
  InventoryTransferDto,
} from 'src/app/Models/Procurement/InventoryTransfer';
import { ItemUnit, transferType } from 'src/app/Models/Procurement/itemunit';
import { IStore, Store } from 'src/app/Models/Procurement/store';
import { IProject, Project } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { InventoryTransferService } from 'src/app/Services/ProcurementService/Inventory-transfer/inventory-transfer.service';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';
import { StoreService } from 'src/app/Services/ProcurementService/Store/store.service';
import { StoreInventoryService } from 'src/app/Services/ProcurementService/StoreInventory/store-inventory.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-inventory-transfer',
  templateUrl: './inventory-transfer.component.html',
  styleUrls: ['./inventory-transfer.component.css'],
})
export class InventoryTransferComponent implements OnInit, OnDestroy {
  selecteditem: ItemUnit = new ItemUnit();
  selectedTransferredBy: User = new User();
  selectedReceivedBy: User = new User();
  inventoryTransfer: InventoryTransferDto = new InventoryTransferDto();
  isAdding: boolean = true;
  formData!: FormGroup;
  private destroy$ = new Subject<void>();
  itemName: string = '';
  transferedUserName: string = '';
  receivedUserName: string = '';
  itemId: number = 0;
  organizationId: number = 0;
  itemUnits: ItemUnit[] = [];
  transferredByusers: User[] = [];
  receivedByUsers: User[] = [];
  itemUnit: any = new FormControl([] as ItemUnit[]);
  transferredByUser: any = new FormControl([] as User[]);
  receivedByUser: any = new FormControl([] as User[]);
  storeFc: FormControl = new FormControl([] as Store[]);
  storeFromFc: FormControl = new FormControl([] as Store[]);
  projectFc: FormControl = new FormControl([] as Project[]);
  toStoreData: Store[] = [];
  fromStoreData: Store[] = [];
  storeName: any;
  storeId: any;
  storeFromName: any;
  storeFromId: any;
  projectName: string = '';
  project: Project[] = [];
  selectedProject: IProject = new Project();
  selectedFromStore: IStore = new Store();
  selectedToStore: IStore = new Store();
  isAvailable = true;
  isQuantityAvailable = true;
  user: User = new User();
  dataSelected: any;
  @ViewChild('remarksTextArea') remarksTextArea!: ElementRef;
  itemUnavailable: boolean = false;

  transferTypes: transferType[] = [
    {
      id: 1,
      transferType: 'Site',
    },

    {
      id: 2,
      transferType: 'Store',
    },
  ];

  constructor(
    private router: Router,
    private inventoryTransferService: InventoryTransferService,
    private builder: FormBuilder,
    private itemUnitService: ItemUnitService,
    private userService: UserService,
    private storeService: StoreService,
    private projectService: ProjectService,
    private storeInventory: StoreInventoryService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }

    this.intilizeForm();
    this.fetchTransferedUsers();
    this.fetchReceivedUsers();
    this.fetchStoreTo();
    this.fetchStoreFrom();

    this.getProjects();
    this.fetchItemUnits();
    this.getDataFromState();
  }

  private getDataFromState() {
    const { isAdding, displayPage } = history.state;
    this.dataSelected = displayPage;
    this.isAdding = isAdding;
    this.inventoryTransfer = history.state.inventoryTransfer;
    if (this.inventoryTransfer) {
      this.fetchItemUnit(this.inventoryTransfer.itemId);
      this.fetchUserById(this.inventoryTransfer.transferredByUserId);
      this.fetchReceivedUserById(this.inventoryTransfer.receivedByUserId);
      this.fetchProject(this.inventoryTransfer.toSiteId);
      this.fetchFromStore(this.inventoryTransfer.fromStoreId);
      this.fetchToStore(this.inventoryTransfer.toStoreId);
      this.formData.patchValue({
        transferId: this.inventoryTransfer.transferId,
        transferDate: this.inventoryTransfer.transferDate,
        itemId: this.inventoryTransfer.itemId,
        quantityTransferred: this.inventoryTransfer.quantityTransferred,
        fromLocation: this.inventoryTransfer.fromLocation,
        toLocation: this.inventoryTransfer.toLocation,
        transferredBy: this.inventoryTransfer.transferredByUserId,
        receivedBy: this.inventoryTransfer.receivedByUserId,
        transferType: this.inventoryTransfer.transferType,
        remarks: this.inventoryTransfer.remarks,
        fromStoreId: this.inventoryTransfer.fromStoreId,
        toStoreId: this.inventoryTransfer.toStoreId,
        toSiteId: this.inventoryTransfer.toSiteId,
      });
    }
  }

  intilizeForm() {
    this.formData = this.builder.group({
      transferId: [0],
      transferDate: [new Date(), Validators.required],
      itemId: ['', Validators.required],
      quantityTransferred: [0, [Validators.required, Validators.min(1)]],
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      transferredBy: [],
      receivedBy: [],
      transferType: ['', Validators.required],
      remarks: [''],
      fromStoreId: ['', Validators.required],
      toStoreId: ['', Validators.required],
      toSiteId: ['', Validators.required],
    });
  }

  save() {
    if (this.formData.valid && this.isAvailable && this.isQuantityAvailable) {
      const inventoryTransferData: IInventoryTransfer = this.formData.value;
      if (this.isAdding) {
        this.inventoryTransferService
          .addInventoryTransfer(inventoryTransferData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () =>
              this.router.navigate(['layout/procurement/inventorytransfers'], {
                state: {
                  displayPage: this.dataSelected,
                },
              }),
            error: (err) =>
              console.error('Error adding Inventory Transfer', err),
          });
      } else {
        this.inventoryTransferService
          .updateInventoryTransfer(inventoryTransferData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () =>
              this.router.navigate(['layout/procurement/inventorytransfers'], {
                state: {
                  displayPage: this.dataSelected,
                },
              }),
            error: (err) =>
              console.error('Error updating Inventory Transfer', err),
          });
      }
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoInventoryTransfers() {
    this.router.navigate(['layout/procurement/inventorytransfers'], {
      state: {
        displayPage: this.dataSelected,
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchitem(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.itemName = query;
      this.fetchItemUnits();
    } else if (query.length == 0) {
      this.itemName = '';
      this.fetchItemUnits();
    }
  }
  fetchItemUnits() {
    this.itemUnitService
      .getAll(this.itemName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemUnits) => {
          this.itemUnits = itemUnits;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onitemSelect(value: ItemUnit) {
    this.selecteditem = value;

    if (this.selecteditem) {
      this.formData.patchValue({ itemId: this.selecteditem.unitId });
    }

    // this.fetchStockInventory();
  }

  fetchStockInventory() {
    this.storeInventory
      .getStoreInventory(0, 15, this.selecteditem.unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.records || response.records.length === 0) {
            this.itemUnavailable = true;
          } else {
            this.itemUnavailable = false;
          }
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  displayitem(item: ItemUnit): string {
    return item && item.materialCode ? item.materialCode : '';
  }

  private fetchItemUnit(itemId: number): void {
    this.itemUnitService
      .getItemUnitByUnitId(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (item) => {
          this.itemUnit.patchValue(item);
          this.onitemSelect(item);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  searchTransferredBy(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.transferedUserName = query;
      this.fetchTransferedUsers();
    } else if (query.length == 0) {
      this.transferedUserName = '';
      this.fetchTransferedUsers();
    }
  }
  onTransferredBySelect(value: User) {
    this.selectedTransferredBy = value;
    if (this.selectedTransferredBy) {
      this.formData.patchValue({
        transferredBy: this.selectedTransferredBy.userId,
      });
    }
  }

  displayTransferredBy(user: User): string {
    return user && user.userName ? user.userName : '';
  }
  fetchTransferedUsers() {
    this.userService
      .fetchAllUsers(this.transferedUserName, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.transferredByusers = users;
        },
        error: (error: Error) => {
          console.error('Error fetching Users:', error);
        },
      });
  }
  private fetchUserById(userId: number): void {
    this.userService
      .getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.transferredByUser.patchValue(user);
          this.onTransferredBySelect(user);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  // ReceivedBy
  searchReceivedBy(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.receivedUserName = query;
      this.fetchReceivedUsers();
    } else if (query.length == 0) {
      this.receivedUserName = '';
      this.fetchReceivedUsers();
    }
  }
  onReceivedBySelect(value: User) {
    this.selectedReceivedBy = value;
    if (this.selectedReceivedBy) {
      this.formData.patchValue({
        receivedBy: this.selectedReceivedBy.userId,
      });
    }
  }

  displayReceivedBy(user: User): string {
    return user && user.userName ? user.userName : '';
  }
  fetchReceivedUsers() {
    this.userService
      .fetchAllUsers(this.receivedUserName, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.receivedByUsers = users;
        },
        error: (error: Error) => {
          console.error('Error fetching Users:', error);
        },
      });
  }
  private fetchReceivedUserById(userId: number): void {
    this.userService
      .getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.receivedByUser.patchValue(user);
          this.onReceivedBySelect(user);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  onSearchStore(event: any) {
    console.log(event.target.value);
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.storeName = query;
      this.fetchStoreTo();
    }
    if (query.length === searchTextZero) {
      this.storeId = 0;
      this.fetchStoreTo();
    }
  }
  onStoreChange(event: any) {
    if (event.storeId) {
      this.formData.patchValue({ toStoreId: event.storeId });
      this.formData.patchValue({ toSiteId: 0 });
    }
  }
  fetchStoreTo() {
    this.storeService
      .getAllStoreWithOutPage(this.storeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (storeData) => {
          this.toStoreData = storeData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  fetchStoreFrom() {
    this.storeService
      .getAllStoreWithOutPage(this.storeName, this.user.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (storeData) => {
          this.fromStoreData = storeData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  displayStoreFn(input: any) {
    return input && input.storeName ? input.storeName : 'All';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.getProjects();
    }
  }
  getProjects() {
    this.projectService
      .getProjects(this.projectName, this.organizationId)
      .subscribe({
        next: (data) => {
          this.project = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  displayProject(project: Project): string {
    return project && project.displayProjectName
      ? project.displayProjectName
      : 'All';
  }
  onProjectSelect(event: any) {
    if (event.projectId) {
      this.formData.patchValue({ toSiteId: event.projectId });
      this.formData.patchValue({ toStoreId: 0 });
    }
  }
  get transferTypeValue() {
    return this.formData.get('transferType')?.value;
  }

  onSearchStoreFrom(event: any) {
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.storeFromName = query;
      this.fetchStoreFrom();
    }
    if (query.length === searchTextZero) {
      this.storeFromId = 0;
      this.fetchStoreFrom();
    }
  }
  displayStoreFromFn(input: any) {
    return input && input.storeName ? input.storeName : 'All';
  }
  onStoreChangeFrom(event: any) {
    if (event.storeId) {
      this.formData.patchValue({ fromStoreId: event.storeId });
    }
    this.checkStoreStock();
  }

  checkStoreStock() {
    let quantity = this.formData.get('quantityTransferred')?.value;
    const storeId = this.formData.get('fromStoreId')?.value;
    const itemId = this.formData.get('itemId')?.value;
    if (quantity == null || quantity == undefined) {
      quantity = 0;
    }
    this.storeInventory
      .checkStockAvailable(quantity, storeId, itemId)
      .subscribe({
        next: (data) => {
          this.isAvailable = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  checkQuantity() {
    let quantity = this.formData.get('quantityTransferred')?.value;
    const storeId = this.formData.get('fromStoreId')?.value;
    const itemId = this.formData.get('itemId')?.value;
    if (quantity == null || quantity == undefined) {
      quantity = 0;
    }
    this.storeInventory
      .checkStockAvailable(quantity, storeId, itemId)
      .subscribe({
        next: (data) => {
          this.isQuantityAvailable = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  private fetchProject(projectId: number): void {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (project) => {
          this.selectedProject = project;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchFromStore(storeId: number) {
    this.storeService
      .getStore(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (store) => {
          this.selectedFromStore = store;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  private fetchToStore(storeId: number) {
    this.storeService
      .getStore(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (store) => {
          this.selectedToStore = store;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  ngAfterViewInit() {
    this.autoResizeRemarks();
  }

  autoResizeRemarks() {
    const textarea = this.remarksTextArea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
