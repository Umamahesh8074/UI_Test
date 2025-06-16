import { ControllerPaths } from '../ControllerPaths/ControllerPaths';
export const GETALLINDENT = ControllerPaths.INDENT + '/pending/indents';
export const SAVEINDENT = ControllerPaths.INDENT + '/save/indent';
export const UPDATEINDENT = ControllerPaths.INDENT + '/update';
export const DELETEINDENT = ControllerPaths.INDENT;
export const GETBYINDENTID = ControllerPaths.INDENT;
export const DELETEINDENTITEM = ControllerPaths.INDENT + '/item/delete';
export const MOVE_INDENT_TO_WORK_FLOW =
  ControllerPaths.INDENT + '/send/workflow';

export const MOVE_INDENT_TO_WORK_FLOW_AFTER_REWORK =
  ControllerPaths.INDENT + '/send/workflow/rework';

export const GETALL_INDENT_ITEMS = ControllerPaths.INDENT_ITEM;
export const GETALL_STAGES = ControllerPaths.INDENT + '/stages';
export const GETALL_NON_PENDING_INDENT = ControllerPaths.INDENT + '/indents';
export const GETALL_PREVIOUS_INDENT_ITEMS =
  ControllerPaths.INDENT_ITEM + '/pre/indent/items';

export const DELETE_INDENT_ITEM =ControllerPaths.INDENT_ITEM; 
