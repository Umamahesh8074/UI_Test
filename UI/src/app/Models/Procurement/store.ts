export interface IStore {
  storeId: number | null;
  storeName: string | null;
  address: string | null;
  contactNumber: string | null;
  isActive: string | null;
  billingAddress: string | null;
  billingGstNumber: string | null;
  projectId: number;
  selectedInChargesId: any[];
  selectedIndentCreator: any[];
  selectedQuotationCreator: any[];
  selectedPoCreator: any[];
}

export class Store implements IStore {
  storeId = 0;
  storeName = '';
  address = '';
  contactNumber = '';
  isActive = '';
  billingAddress = '';
  billingGstNumber = '';
  projectId = 0;
  selectedInChargesId = [];
  selectedIndentCreator = [];
  selectedQuotationCreator = [];
  selectedPoCreator = [];
}

export class StoreDto {
  storeId = 0;
  storeName = '';
  address = '';
  contactNumber = '';
  isActive = '';
  billingAddress = '';
  billingGstNumber = '';
  projectId = 0;
  projectName = '';
  selectedInChargesId = 0;
}
