import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  GetInventoryReceivablesDto,
} from 'src/app/Models/Procurement/inventory-receivable';
import {
  IPurcahseOrder,
  PurchaseOrder,
} from 'src/app/Models/Procurement/purchaseorder';
import { IUser, User } from 'src/app/Models/User/User';
import { IUserDto, UserDto } from 'src/app/Models/User/UserDto';
import { InventoryReceivableService } from 'src/app/Services/ProcurementService/InventoryReceivable/inventory-receivable.service';
import { PurchaseOrderService } from 'src/app/Services/ProcurementService/PurchaseOrder/purchaseorder.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-edit-inventory-receivables',
  templateUrl: './edit-inventory-receivables.component.html',
  styleUrls: ['./edit-inventory-receivables.component.css'],
})
export class EditInventoryReceivablesComponent implements OnInit {
  users: User[] = [];
  user: User = new User();
  formData!: FormGroup;
  isAdding: boolean = true;
  receivedDate: any;
  receivedBy: any;
  private destroy$ = new Subject<void>();
  organizationId: any;
  purchaseOrderFc: FormControl = new FormControl([] as PurchaseOrder[]);
  userFc: FormControl = new FormControl([] as User[]);
  selectedUser: IUserDto = new UserDto();
  purchaseOrder: PurchaseOrder[] = [];
  selectedPo: IPurcahseOrder = new PurchaseOrder();
  userName: string = '';
  code: any;
  poId: any;
  itemCategoryName: string = '';
  quantityRecivedCheck: boolean = true;
  data: GetInventoryReceivablesDto = new GetInventoryReceivablesDto();
  dataSelected: any;
  stateInventoryReceivable: any;

  ngOnInit(): void {
    this.initializeFormData();
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }

    this.patchFormData();
    this.fetchUsers();
    this.getAllPurchaseOrder();
  }
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private userService: UserService,
    private purchaseOrderService: PurchaseOrderService,
    private inventoryReceivableService: InventoryReceivableService
  ) {}
  private initializeFormData(): void {
    const group = this.builder.group({
      irId: [0],
      poId: ['', Validators.required],
      receivedBy: ['', Validators.required],
      receivedDate: [new Date().toISOString(), Validators.required],
      quantities: this.builder.array([]),
      categoryId: [''],
      subCategoryId: [''],
      inventoryUnitId: [''],
      quantityReceived: [''],
      quantityExceed: [''],
      storeId: [''],
      unitId: [''],
    });
    this.formData = group;
  }
  save() {
    if (this.quantityRecivedCheck === false) {
      return;
    }
    this.inventoryReceivableService
      .updateInventoryReceivableHistory(this.formData.value)
      .subscribe({
        next: () => {
          this.router.navigate(['layout/procurement/goodsreceived']);
        },
        error: (error) => {
          console.error('Error saving data', error);
        },
      });
  }

  searchPurchaseOrder(event: any): void {
    const query = event.target.value;
    this.code = query;
    this.getAllPurchaseOrder();
  }
  getAllPurchaseOrder() {
    this.purchaseOrderService
      .fetchAllPurchaseOrders(this.code, this.organizationId, this.user.userId)
      .subscribe({
        next: (purchaseOrder) => {
          this.purchaseOrder = purchaseOrder;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  displayPurchaseOrder(purchaseOrder: PurchaseOrder): string {
    return purchaseOrder && purchaseOrder.poCode ? purchaseOrder.poCode : '';
  }

  onPurchaseOrderSelect(event: any): void {
    this.poId = event.option.value.id;
    this.formData.patchValue({ poId: this.poId });
  }

  private fetchPOById(poId: number) {
    this.purchaseOrderService
      .getPOById(poId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedPo = data;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  patchFormData() {
    const { inventoryReceivableData, inventory } = history.state;
    this.dataSelected = history.state.displayPage;
    this.data = inventoryReceivableData;
    this.stateInventoryReceivable = inventory;
    const data = inventoryReceivableData[0];
    if (data) {
      this.formData.patchValue({
        irId: data.irId,
        poId: data.poId,
        specification: data.specificationId,
        receivedBy: data.receivedBy,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        inventoryUnitId: data.inventoryUnitId,
        quantityReceived: data.quantityReceived,
        quantityExceed: data.quantityExceed,
        storeId: data.storeId,
        unitId: data.unitId,
      });
      this.fetchPOById(data.poId);
      this.fetchUserById(data.receivedBy);
    }
  }
  searchUser(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.userName = query;
      this.fetchUsers();
    } else if (query.length == 0) {
      this.userName = '';
      this.fetchUsers();
    }
  }

  private fetchUserById(userId: number) {
    this.userService
      .getUserDtoByUserId(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedUser = data;
        },
        error: (error: Error) => {},
      });
  }
  fetchUsers() {
    this.userService
      .fetchAllUsers(this.userName, this.organizationId)
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  displayUser(user: IUser): string {
    return user && user.userName ? user.userName : '';
  }
  onUserSelect(event: any) {
    this.receivedBy = event.option.value.userId;
    this.formData.patchValue({ receivedBy: this.receivedBy });
  }
  checkQuantity(event: any): void {
    const quantityReceived = event.target.value;
    if (quantityReceived == null || quantityReceived <= 0) {
      return;
    }
    const poId = this.data.poId;
    const quotationItemId = this.data.quotationItemId;
    const itemUnitId = this.data.inventoryUnitId;
    const irId = this.data.irId;
    this.inventoryReceivableService
      .validateQuantity(
        poId,
        quotationItemId,
        itemUnitId,
        quantityReceived,
        irId
      )
      .subscribe({
        next: (response: any) => {
          this.quantityRecivedCheck = response;
        },
        error: (error) => {
          console.error('Error during add operation:', error);
        },
      });
  }

  gotoInventoryReceivables() {
    this.router.navigate(['layout/procurement/goodsreceived'], {
      state: {
        displaypage: this.dataSelected,
      },
    });
  }

  clearForm() {}
}
