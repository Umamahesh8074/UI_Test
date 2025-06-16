//WORK ORDER COMMAN REFERANCE CONSTANTS
export const UNIT_OF_MEASUREMENT = 'Unit_Of_Measurement';
export const SERVICE_GROUP_CATEGORY = 'Service_Group_Category';
export const SERVICE__GROUP_TYPE = 'Service_Group_Type';
export const SERVICE_CODE_UOM = 'Service_Code_Uom';
export const VENDOR_TYPE = 'Vendor_Type';
export const SAC_CODES = 'SAC_Code';
export const QUANTITY_CHECK = 'Quantity_Check';
export const GST = 'WorkOrder_GST';
export const CGST_OR_SGST = 'WORKORDER_SGST_OR_CGST';
export const WO_BILLLING_RETENSION = 'RETENSION';
export const WOB_CHECKED_BY = 'WOB_CHECKED_BY';
export const WORK_TYPE = 'WorkType';
export const NAVIGATE_ADD_WO_QUANTITY = 'layout/workorder/addwoquantity';
export const NAVIGATE_TO_ADD_STAND_IN_USER = 'layout/workorder/addstandinuser';
export const NAVIGATE_TO_DISPLAY_STAND_IN_USER = 'layout/workorder/standinuser';

// status.enum.ts
export enum WorkOrderStatus {
  REWORK = 'rework',
  PENDING = 'pending',
  APPROVED = 'approved',
  CREATE = 'create',
  REJAPPROVED = 'RejApproved',
  CANCEL = 'cancel',
}

//PRIME ACTIVITY NAVIGATIONS
export const NAVIGATE_TO_DISPLAY_PRIME_ACTIVITY =
  'layout/workorder/displayprimeactivitycode';
export const NAVIGATE_TO_ADD_PRIME_ACTIVITY =
  'layout/workorder/addprimeactivitycode';

//SERVICE GROUP NAVIGATIONS
export const NAVIGATE_TO_ADD_SERVICE_GROUP = 'layout/workorder/addservicegroup';
export const NAVIGATE_TO_DISPLAY_SERVICE_GROUP =
  'layout/workorder/displayservicegroup';

//SERVICE CODE NAVIGATION
export const NAVIGATE_TO_ADD_SERVICE_CODE = 'layout/workorder/addservicecode';
export const NAVIGATE_TO_DISPLAY_SERVICE_CODE =
  'layout/workorder/displayservicecode';

//VENDOR NAVIGATION
export const NAVIGATE_TO_ADD_VENDOR = 'layout/workorder/addvendor';
export const NAVIGATE_TO_DISPLAY_VENDOR = 'layout/workorder/vendor';

//SAC CODE NAVIATION
export const NAVIGATE_TO_DISPLAY_SAC_CODE = 'layout/workorder/displaysaccode';
export const NAVIGATE_TO_ADD_SAC_CODE = 'layout/workorder/addsaccode';

//HEADER NAVIGATION
export const NAVIGATE_TO_DISPLAY_WORK_ORDER_HEADER =
  'layout/workorder/displayworkorderheader';
export const NAVIGATE_TO_ADD_WORK_ORDER_HEADER =
  'layout/workorder/addworkorderheader';

//WORK ORDER NAVIGATIONS
export const NAVIGATE_TO_ADD_WORK_ORDER_CREATION =
  'layout/workorder/addworkordercreation';
export const NAVIGATE_TO_WORK_ORDER_CREATION =
  'layout/workorder/work/order/create';

export const NAVIGATE_TO_REWORK_WORK_ORDER =
  'layout/workorder/work/order/rework';
export const NAVIGATE_TO_WORK_ORDER_APPROVALS_VIEW =
  'layout/workorder/view/approvals';
export const NAVIGATE_TO_WORK_ORDER_APPROVALS_PENDING =
  'layout/workorder/wo/pending';
export const NAVIGATE_TO_WORK_ORDER_APPROVALS_APPROVEDORREJECTED =
  'layout/workorder/wo/RejApproved';

export const NAVIGATE_TO_WORK_ORDER_DETAILS =
  'layout/workorder/view/wo/details';

export const NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER =
  'layout/workorder/addandeditworkordercreation';

export const NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER_Header =
  'layout/workorder/addandeditworkorderheader';

export const NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER_Header_CREATION =
  'layout/workorder/addandeditworkorderheadercreation';

//WORK ORDER BILLING NAVIGATIONS

export const NAVIGATE_TO_ADD_WORK_ORDER_BILLING =
  'layout/workorder/addworkorderbilling';

export const NAVIGATE_TO_WORK_ORDER_BILLING =
  'layout/workorder/work/order/billng/create';

export const NAVIGATE_TO_WORK_ORDER_BILLING_APPROVALS_VIEW =
  'layout/workorder/billing/view/approvals';

export const NAVIGATE_TO_PENDING_WORK_ORDER_BILLING =
  'layout/workorder/wo/billings/pending';

export const NAVIGATE_TO_WORK_ORDER_BILLING_APPROVALS_APPROVEDORREJECTED =
  'layout/workorder/wo/billings/RejApproved';

export const NAVIGATE_TO_REWORK_WORK_ORDER_BILLING =
  'layout/workorder/work/order/billng/rework';

export const NAVIGATE_TO_WORK_ORDER_BILLINGS =
  'layout/workorder/work/order/billng/create';

export const NAVIGATE_TO_WORK_ORDER_BILLING_DETAILS =
  'layout/workorder/view/wo/billing/details';

export const WO_REJECTED = 'Rejected';

export enum WorkOrderStatusConstants {
  REWORK = 'Rework',
  REWORKING = 'Reworking',
  APPROVED = 'Approved',
  AMENDMENT = 'Amendment',
  REJECTED = 'Rejected',
}
