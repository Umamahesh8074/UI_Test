import { ControllerPaths } from '../ControllerPaths/ControllerPaths';

// Define the necessary endpoints for Store Inventories
export const GET_STORE_INVENTORIES =
  ControllerPaths.STORE_INVENTORY + '/getall';
export const GETALL_STORE_INVENTORIES =
  ControllerPaths.STORE_INVENTORY + '/getall/storeinventories';
export const SAVE_STORE_INVENTORY = ControllerPaths.STORE_INVENTORY + '/save';
export const UPDATE_STORE_INVENTORY =
  ControllerPaths.STORE_INVENTORY + '/update';
export const DELETE_STORE_INVENTORY =
  ControllerPaths.STORE_INVENTORY + '/delete';
export const GET_STORE_INVENTORY_BY_ID =
  ControllerPaths.STORE_INVENTORY + '/id';
export const DELETE_STORE_INVENTORY_ITEM =
  ControllerPaths.STORE_INVENTORY + '/item/delete';
export const MOVE_STORE_INVENTORY_TO_WORK_FLOW =
  ControllerPaths.STORE_INVENTORY + '/send/workflow';
export const GET_AVAILABLE_STOCK =
  ControllerPaths.STORE_INVENTORY + '/getbystoreid';
