import { WorkOrderControllerPaths } from '../ControllerPaths/ControllerPaths';
export const GETALL_WORK_ORDER_CREATION_SPEC =
  WorkOrderControllerPaths.WORKORDERCREATION + '/getall';
export const SAVE_WORK_ORDER_CREATION =
  WorkOrderControllerPaths.WORKORDERCREATION + '/save/wo';
export const UPDATE_WORK_ORDER_CREATION =
  WorkOrderControllerPaths.WORKORDERCREATION + '/update';

export const GETALL_WORK_ORDER_CREATION =
  WorkOrderControllerPaths.WORKORDERCREATION + '/getallservicegroup';

export const WORK_ORDER_CREATION_BY_ID =
  WorkOrderControllerPaths.WORKORDERCREATION;

export const GET_BY_ID = WorkOrderControllerPaths.WORKORDERCREATION;

export const GETALL_WORK_ORDER_CREATION_SERVICE_CODE =
  WorkOrderControllerPaths.WORKORDERCREATION + '/getall/servicecode';

export const GETALL_WORK_ORDER =
  WorkOrderControllerPaths.WORKORDERCREATION + '/work/orders/fetch';

export const GETALL_WORK_ORDER_STAGES =
  WorkOrderControllerPaths.WORKORDERCREATION + '/stages';

export const GETALL_WORK_ORDER_BILLING_STAGES =
  WorkOrderControllerPaths.WORKORDERBILLING + '/stages';

export const SEND_TO_APPROVE =
  WorkOrderControllerPaths.WORKORDERCREATION + '/send/workflow';

export const SEND_TO_APPROVE_REWORK_AMENDAMENT =
  WorkOrderControllerPaths.WORKORDERCREATION +
  '/send/workflow/rework/amendament';

export const GETALL_PENDING_WORK_ORDERS =
  WorkOrderControllerPaths.WORKORDERCREATION + '/work/orders/pending';

export const GETALL_APPROVED_REJECTD_WORK_ORDERS =
  WorkOrderControllerPaths.WORKORDERCREATION + '/work/orders/approvereject';

export const GETALL_REWORK_WORK_ORDERS =
  WorkOrderControllerPaths.WORKORDERCREATION + '/work/orders/rework';

//work order quantities

export const DELETE_WORK_ORDER_QUANTITY =
  WorkOrderControllerPaths.WORKORDERQUANTITIES;

export const FETCH_ALL_WOC =
  WorkOrderControllerPaths.WORKORDERCREATION + '/fetchall';

export const DELETE_WORK_ORDER_TERMS_AND_CONDITIONS =
  WorkOrderControllerPaths.WORKORDERTERMSANDCONDITIONS;

export const GET_WORK_ORDER_QUANTITIES_BY_ID =
  WorkOrderControllerPaths.WORKORDERBILLING_QUANTITIES + '/fetchall';

export const GET_WORK_ORDER_QUANTITIES_DTO_BY_ID =
  WorkOrderControllerPaths.WORKORDERQUANTITIES + '/fetchall';

export const GET_PREVIOUS_WORK_ORDER_QUANTITIES_DTO_BY_ID =
  WorkOrderControllerPaths.WORKORDERQUANTITIES + '/fetchall/previous';

export const UPDATE_WORK_ORDER_QUANTITY =
  WorkOrderControllerPaths.WORKORDERCREATION + '/update/woq';

export const SAVE_WORK_ORDER_QUANTITY =
  WorkOrderControllerPaths.WORKORDERCREATION + '/save/woq';

export const SAVE_WORK_ORDER_HEADER =
  WorkOrderControllerPaths.WORKORDERCREATION + '/save/woh';
export const UPDATE_WORK_ORDER_HEADER =
  WorkOrderControllerPaths.WORKORDERCREATION + '/update/woh';

export const GENERATE_WO_PDF =
  WorkOrderControllerPaths.WORKORDERCREATION + '/watermarkpdf/wo';
