import { WorkOrderControllerPaths } from '../ControllerPaths/ControllerPaths';
export const GETALL_WORK_ORDER_BILLING_SPEC =
  WorkOrderControllerPaths.WORKORDERBILLING + '/getall';
export const SAVE_WORK_ORDER_BILLING =
  WorkOrderControllerPaths.WORKORDERBILLING + '/save';
export const UPDATE_WORK_ORDER_BILLING =
  WorkOrderControllerPaths.WORKORDERBILLING + '/update';

export const GETALL_WORK_ORDER_BILLING =
  WorkOrderControllerPaths.WORKORDERBILLING + '/getallservicegroup';

export const GET_WORK_ORDER_BILLING_BY_ID =
  WorkOrderControllerPaths.WORKORDERBILLING;

export const GETALL_WORK_ORDER_BILLING_SERVICE_CODE =
  WorkOrderControllerPaths.WORKORDERBILLING + '/getall/servicecode';

export const GETALL_WORK_ORDER_BILLING_DTO =
  WorkOrderControllerPaths.WORKORDERBILLING + '/fetch';

export const SEND_TO_WORK_FLOW =
  WorkOrderControllerPaths.WORKORDERBILLING + '/send/workflow';

export const SEND_WOB_TO_WORK_FLOW_AFRER_REWORK =
  WorkOrderControllerPaths.WORKORDERBILLING + '/send/workflow/rework';

//added by shiv
export const GETALL_PENDING_WORK_ORDER_BILLING =
  WorkOrderControllerPaths.WORKORDERBILLING + '/work/order/billings/pending';

export const GETALL_APPROVED_REJECTD_WORK_ORDER_BILLINGS =
  WorkOrderControllerPaths.WORKORDERBILLING + '/billing/approvereject';

export const GETALL_REWORK_WORK_ORDER_BILLINGS =
  WorkOrderControllerPaths.WORKORDERBILLING + '/billing/rework';

export const UPDATE_WORK_ORDER_BILLING_QUANTITY_STATUS =
  WorkOrderControllerPaths.WORKORDERBILLING_QUANTITIES + '/update/wob/status';

export const UPDATE_WORK_ORDER_QUANTITY_STATUS =
  WorkOrderControllerPaths.WORKORDERQUANTITIES + '/update/wq/status';

export const GET_WORK_ORDER_AMOUNT =
  WorkOrderControllerPaths.WORKORDER_AMOUNT + '/fetchall';

export const GET_WORK_ORDER_GST =
  WorkOrderControllerPaths.WORKORDER_GST + '/fetchall';

//added by shiv
