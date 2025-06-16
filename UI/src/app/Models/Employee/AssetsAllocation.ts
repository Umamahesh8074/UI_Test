
export interface IAssetAllocation {
  allocationId: number;
  employeeId: number;
  assetId: number;
  allocatedDate: Date;
  allocatedBy: number;
  returnedDate: Date;
  conditionAtReturn: string;
  allocationStatus: string;
}


export class AssetAllocation implements IAssetAllocation {
  allocationId: number = 0;
  employeeId: number = 0;
  assetId: number = 0;
  allocatedDate: Date = new Date();
  allocatedBy: number = 0;
  returnedDate: Date = new Date();
  conditionAtReturn: string = '';
  allocationStatus: string = '';
}


export class AssetAllocationDto  {
  allocationId: number = 0;
  employeeId: number = 0;
  assetId: number = 0;
  employeeNumber: string = '';
  assetName: string = '';
  allocatedDate: Date = new Date();
  allocatedBy: number = 0;               // Maps to allocatedBy (ID) from AssetAllocationDto
  userName: string = '';                 // Maps to userName (Name of allocatedBy) from AssetAllocationDto
  returnedDate: Date = new Date();       // Maps to returnedDate from AssetAllocationDto
  conditionAtReturn: string = '';        // Maps to conditionAtReturn from AssetAllocationDto
  allocationStatus: string = '';         // Maps to allocationStatus from AssetAllocationDto
}

