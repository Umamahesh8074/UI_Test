import { ProcurementControllerPaths } from '../ControllerPaths/ControllerPaths';

export const SAVE_PURCHASE_ORDER =
  ProcurementControllerPaths.PURCHASE_ORDER + '/save';

export const GET_SPEC = ProcurementControllerPaths.PURCHASE_ORDER + '/getAll';
export const PO_SEND_TO_WORKFLOW =
  ProcurementControllerPaths.PURCHASE_ORDER + '/send/workflow';

export const GET_APPROVAL_PURCHASE_ORDERS =
  ProcurementControllerPaths.PURCHASE_ORDER + '/get/purchaseorders';

export const GET_APPROVED_PURCHASE_ORDERS =
  ProcurementControllerPaths.PURCHASE_ORDER + '/fetch/po/app/rej/rework';

export const GET_NON_PENDING_PURCHASE_ORDERS =
  ProcurementControllerPaths.PURCHASE_ORDER + '/purchaseorders';

export const GET_PO =
  ProcurementControllerPaths.PURCHASE_ORDER + '/approval/po';
export const FETCH_PO =
  ProcurementControllerPaths.PURCHASE_ORDER + '/getAll/purchaseorder';
export const UPDATE_PURCHASE_ORDER =
  ProcurementControllerPaths.PURCHASE_ORDER + '/update/po';
export const GET_PURCHASE_ORDER_BY_ID =
  ProcurementControllerPaths.PURCHASE_ORDER;

export const SAVE = ProcurementControllerPaths.PURCHASE_ORDER + '/save';

export const PO_PDF_GENERATE = ProcurementControllerPaths.PURCHASE_ORDER + '/popdf';
