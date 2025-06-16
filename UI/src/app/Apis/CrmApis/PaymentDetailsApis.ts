import {
  ControllerPaths,
  CRMControllerPaths,
} from '../ControllerPaths/ControllerPaths';

export const SAVE_PAYMENT_DETAILS =
  CRMControllerPaths.PAYMENT_DETAILS + '/savepaymentledger';
export const GET_ALL_PAYMENT_DETAILS =
  CRMControllerPaths.PAYMENT_DETAILS + '/getall';
export const GET_ALL_PAYMENT_LEDGER =
  CRMControllerPaths.PAYMENT_DETAILS + '/getall/paymentledger';
export const PAYMENT_DETAILS_BY_ID = CRMControllerPaths.PAYMENT_DETAILS + '/';
export const UPDATE_PAYMENT_DETAILS =
  CRMControllerPaths.PAYMENT_DETAILS + '/updatepaymentledger';
export const UPDATE_APPROVAL_STATUS =
  CRMControllerPaths.PAYMENT_DETAILS + '/update/approval/status';
export const DOWNLOAD_DEMAND_LETTER_PDF =
  CRMControllerPaths.PAYMENT_DETAILS + '/dmnpdf';
export const GENERATE_DEMAND_LETTER =
  CRMControllerPaths.PAYMENT_DETAILS + '/demandLetter';

export const GET_DEMANDLETTER_BY_BOOKINGID =
  CRMControllerPaths.CUSTOMER_STAGE + '/send';

//customer payments
export const GET_ALL_CUSTOMER_PAYMENTS =
  CRMControllerPaths.CUSTOMER_PAYMENTS + '/getall';

export const GET_ALL_CUSTOMER_PAYMENT_UNITS =
  ControllerPaths.UNIT + '/fetch/customer/units';

export const SAVE_CUSTOMER_PAYMENT =
  CRMControllerPaths.CUSTOMER_PAYMENTS + '/save';

export const PAYMENT_DETAILS_BY_STAGE_ID =
  CRMControllerPaths.PAYMENT_DETAILS + '/getby/stageid/applicantid';

export const GET_PAID_AMOUNT = CRMControllerPaths.DASH_BOARD + '/padiamount';

export const UPDATE_CUSTOMER_PAYMENT =
  CRMControllerPaths.CUSTOMER_PAYMENTS + '/update';

export const GET_APPROVAL_CUSTOMER_PAYMENTS =
  CRMControllerPaths.CUSTOMER_PAYMENTS + '/customer/payments/pending';

export const GET_CUSTOMER_PAYMENT_BY_ID = CRMControllerPaths.CUSTOMER_PAYMENTS;
export const GET_PENDING_AMOUNT =
  CRMControllerPaths.DASH_BOARD + '/pendingamount';
export const GET_TOTAL_AMOUNT = CRMControllerPaths.DASH_BOARD + '/totalamount';
export const GENERATE_PAYMENT_RECEIPT =
  CRMControllerPaths.PAYMENT_DETAILS + '/paymentreceipt';
export const GET_TRANSACTION_TYPE =
  CRMControllerPaths.PAYMENT_DETAILS + '/transactionType';

export const GENERATE_PAYMENT_SOA = CRMControllerPaths.PAYMENT_DETAILS + '/soa';
export const GET_SOA_DOCUMENTS =
  CRMControllerPaths.CRM_DOCUMENTS + '/soa/documents';
export const GET_PAYMENT_LEDGER_BY_PAYMENT_LEDGER_BY_ID =
  CRMControllerPaths.PAYMENT_DETAILS + '/paymentledgerbyid/';
export const GET_PAYMENT_LEDGER_BY_PAYMENT_LEDGER_BY_APPLICANT_ID =
  CRMControllerPaths.PAYMENT_DETAILS + '/paymentledgerbyapplicantid/';

export const GET_APPROVED_AMOUNT =
  CRMControllerPaths.PAYMENT_DETAILS + '/approval-amounts';
export const GET_PENDING_SALE_AGREEMENTS =
  CRMControllerPaths.DASH_BOARD + '/pending/saleagreements';
export const GET_UNITS_COUNT = CRMControllerPaths.DASH_BOARD + '/units/count';
export const GET_WAITINGFORAPPROVAL_AMOUNT =
  CRMControllerPaths.DASH_BOARD + '/waitingforapprovalamount';

export const SAVE_CRM_FOLLOWUP = CRMControllerPaths.CRM_FOLLOWUP + '/save';
export const FETCH_CRM_FOLLOWUPS = CRMControllerPaths.CRM_FOLLOWUP + '/fetch';
export const GET_FOLLOWUPS_PAYMENTS_AND_APPLICANT_DETAILS =
  CRMControllerPaths.APPLICANT_INFO + '/getfollowuppaymentsandapplicantdetails';
