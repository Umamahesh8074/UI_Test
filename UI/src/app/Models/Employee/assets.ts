// Define the interface for AssetsBean
export interface IAssets {
  assetId: number;
  assetName: string;
  assetCategory: string;
  assetSerialNumber: string;
  purchaseDate: Date;
  assetStatus: string;
  assetCondition: string;
  warrantyExpiryDate: Date;
  purchasePrice: number;
  supplierName: string;
  location: string;
  allocatedCount: number;
  damageType: string;
  organizationId: number ;
}

// Define the class implementation for AssetsBean
export class Assets implements IAssets {
  assetId: number = 0;
  assetName: string = '';
  assetCategory: string = '';
  assetSerialNumber: string = '';
  purchaseDate: Date = new Date();
  assetStatus: string = '';
  assetCondition: string = '';
  warrantyExpiryDate: Date = new Date();
  purchasePrice: number = 0.0;
  supplierName: string = '';
  location: string = '';
  allocatedCount: number = 0;
  damageType: string = '';
  organizationId: number = 0;
}
