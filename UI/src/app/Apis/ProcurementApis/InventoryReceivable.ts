import { ControllerPaths } from '../ControllerPaths/ControllerPaths';

// Define the necessary endpoints for Indents
export const GET_INVENTORY_RECEIVABLES =
  ControllerPaths.INVENTORY_RECEIVABLE + '/getall';
export const GETALL_INVENTORY_RECEIVABLES =
  ControllerPaths.INVENTORY_RECEIVABLE + '/getall/inventoryreceivables';
export const SAVE_INVENTORY_RECEIVABLE =
  ControllerPaths.INVENTORY_RECEIVABLE + '/save';
export const UPDATE_INVENTORY_RECEIVABLE =
  ControllerPaths.INVENTORY_RECEIVABLE + '/update';
export const DELETE_INVENTORY_RECEIVABLE =
  ControllerPaths.INVENTORY_RECEIVABLE + '/delete';
export const GET_INVENTORY_RECEIVABLE_BY_ID =
  ControllerPaths.INVENTORY_RECEIVABLE + '/id';
export const DELETE_INVENTORY_RECEIVABLE_ITEM =
  ControllerPaths.INVENTORY_RECEIVABLE + '/item/delete';
export const MOVE_INVENTORY_RECEIVABLE_TO_WORK_FLOW =
  ControllerPaths.INVENTORY_RECEIVABLE + '/send/workflow';

export const DISPLAY_PENDING_IR =
  ControllerPaths.INVENTORY_RECEIVABLE + '/dislay/ir';
export const APP_REJ_IR = ControllerPaths.INVENTORY_RECEIVABLE + '/app/rej/ir';
export const PENDING_IR = ControllerPaths.INVENTORY_RECEIVABLE + '/fetch/ir';
export const NON_PENDING_IR =
  ControllerPaths.INVENTORY_RECEIVABLE + '/fetch/ir/app/rej/rework';
export const GET_ALL = ControllerPaths.INVENTORY_RECEIVABLE + '/getall/ir';

export const GET_INVENTORY_RECEIVABLE_HISTORY =
  ControllerPaths.INVENTORY_RECEIVABLE + '/getall/irh';

export const GET_ALL_INVENTORY_RECEIVABLE_ITEM =
  ControllerPaths.INVENTORY_RECEIVABLE_ITEM + '/getall';
export const GET_ALL_INVENTORY_RECEIVABLE_STAGES =
  ControllerPaths.INVENTORY_RECEIVABLE + '/stages';

// Define the necessary endpoints for Indent Items
export const GETALL_INVENTORY_RECEIVABLE_ITEMS =
  ControllerPaths.INVENTORY_RECEIVABLE_ITEM + '/items';
export const GETALL_INVENTORY_RECEIVABLE_STAGES =
  ControllerPaths.INVENTORY_RECEIVABLE + '/stages';

// For non-pending receivables
export const GETALL_NON_PENDING_INVENTORY_RECEIVABLES =
  ControllerPaths.INVENTORY_RECEIVABLE + '/non-pending';
export const QUOTATION_ITEM_INVENTORY_RECEIVABLES =
  ControllerPaths.INVENTORY_RECEIVABLE + '/validateQuantity';
export const UPDATE_INVENTORYRECEIVABLE =
  ControllerPaths.INVENTORY_RECEIVABLE + '/updateinventory';

export const UPDATE_INVENTORYRECEIVABLE_HISTORY =
  ControllerPaths.INVENTORY_RECEIVABLE_HISTORY + '/update';
