import { PresalesControllerPaths } from '../ControllerPaths/ControllerPaths';

export enum LeadPaths {
  ALL = PresalesControllerPaths.LEADS + '/getall',
  LEADSBYASSIGNEETO = PresalesControllerPaths.LEADS + '/getallbyassignedto',
  SAVE = PresalesControllerPaths.LEADS + '/save',
  UPDATE = PresalesControllerPaths.LEADS + '/update',
  UPDATE_STATUS = PresalesControllerPaths.LEADS + '/update/status',
  FETCH_ALL = PresalesControllerPaths.LEADS + '/fetchall',
  FETCH_LEAD_HISTORY = PresalesControllerPaths.LEADS + '/history',
  //api for getting all leads based on logged in user
  GET_LEADS = PresalesControllerPaths.LEADS + '/getleads',
  DASHBOARD_LEADS = PresalesControllerPaths.LEADS + '/dashboard/leads',
  DASHBOARD_NONCONACTABLE_LEADS = PresalesControllerPaths.LEADS +
    '/dashboard/noncontactable/leads',
  USER_ROLE = PresalesControllerPaths.LEADS + '/usertype',
  DASHBOARD_TOTAL_LEADS = PresalesControllerPaths.LEADS +
    '/dashboard/toatlleads',
  UPLOAD_EXCEL = PresalesControllerPaths.LEADS + '/upload',
  UPDATE_MANUAL_LEAD_ASSIGN = PresalesControllerPaths.LEADS +
    '/manualleadassign',
  UPDATE_ALL_CHECK_MANUAL_LEAD_ASSIGN = PresalesControllerPaths.LEADS +
    '/allcheck/assign',
  DOWNLOAD_UPLOADED_EXCEL = PresalesControllerPaths.LEADS +
    '/download?filename=',
  DOWNLOAD_TEMPLATE_EXCEL = PresalesControllerPaths.LEADS +
    '/download-template?isCp=',

  DASHBOARD_LEADS_COUNT = PresalesControllerPaths.LEADS + '/dashboard/count',

  DASHBOARD_LEADS_DETAILS = PresalesControllerPaths.LEADS +
    '/dashboard/leads/data',
  DASHBOARD_LEADS_CURRENT_STATUS_DETAILS = PresalesControllerPaths.LEADS +
    '/dashboard/leads/current/status/data',
  DASHBOARD_LEADS_DETAILS_V1 = PresalesControllerPaths.LEADS +
    '/dashboard/leads/data/v1',
  LEADS_SOURCE_COUNT = PresalesControllerPaths.LEADS + '/leadsourcecount',
  DASHBOARD_UNASSIGNED_LEADS_DETAILS = PresalesControllerPaths.LEADS +
    '/dashboard/unassigned',
  TEAM_WISE_LEADS_DATA = PresalesControllerPaths.LEADS + '/team/details',

  CP_WISE_LEADS_DATA = PresalesControllerPaths.LEADS + '/cp/team/count',
  FETCH_DUPLICATE_LEAD_HISTORY = PresalesControllerPaths.LEADS + '/leadhistory',
  FETCH_LEAD_BY_PHONE_NUMBER = PresalesControllerPaths.LEADS +
    '/fetchLeadByMobile',
  FETCH_LEAD_BY_PHONE_NUMBER_AND_PROJECT = PresalesControllerPaths.LEADS +
    '/phonenumber/project',
  LEAD_BY_PHONE_NUMBER_AND_COUNTRY_CODE = PresalesControllerPaths.LEADS +
    '/phonenumber',
  FETCH_ADDRESS_BY_PINCODE = PresalesControllerPaths.LEADS + '/pincode',

  FETCH_ALL_LEADS_DISPLAY = PresalesControllerPaths.TOTAL_LEADS + '/getall',

  EXPIRING_LEADS_DATA = PresalesControllerPaths.LEADS + '/expiringleads',

  DASHBOARD_LEAD_COUNT = PresalesControllerPaths.LEADS +
    '/dashboard/lead/count',
  DASHBOARD_LEAD_COUNT_V1 = PresalesControllerPaths.LEADS +
    '/dashboard/lead/count/v1',
  DASHBOARD_LEAD_CURRENT_STATUS_COUNT = PresalesControllerPaths.LEADS +
    '/dashboard/lead/current/status/count',
  DASHBOARD_LEAD_CURRENT_STATUS_COUNT_NEW = PresalesControllerPaths.LEADS +
    '/dashboard/lead/current/status/count/new',
  EXTEND_LEAD_EXPIRY_DATE = PresalesControllerPaths.LEADS + '/expiryextend',
  GET_DUPLICATE_LEAD_HISTORY = PresalesControllerPaths.LEADS +
    '/duplicateleadhistory',

  FETCH_LEAD_AUDIO = PresalesControllerPaths.MCUBE_AUDIO,
  ALL_LEADS = PresalesControllerPaths.LEADS + '/allleads',
  CUSTOMER_LEADS = PresalesControllerPaths.LEADS + '/customer/leads',

  FETCH_LEAD_SOURCE_SUB_SOURCE_DETAILS_FOR_APPLICANT = PresalesControllerPaths.LEADS +
    '/getAllLeadSourceSubSource',
  DASHBOARD_MEMBER_REPORT = PresalesControllerPaths.LEADS +
    '/dashboard/member/report',

  DASHBOARD_UNIQUE_LEADS_DETAILS = PresalesControllerPaths.LEADS +
    '/dashboard/unique/leads/data',
  DASHBOARD_LEADS_DETAILS_NEW = PresalesControllerPaths.LEADS +
    '/dashboard/leads/data/new',
  SEARCH_LEAD = PresalesControllerPaths.LEADS + '/search',
  CP_WISE_LEADS_DATA_DOWNLOAD = PresalesControllerPaths.LEADS +
    '/cp/team/count/download',
  SEND_LEAD_TRANSFER_REQUEST = PresalesControllerPaths.LEADS + '/transfer',
  LEAD_TRANSFER_FOR_APPROVAL = PresalesControllerPaths.LEADS + '/fetch/lead/transfer/approval'
}

export enum LeadSourcePaths {
  ALL = PresalesControllerPaths.LEAD_SOURCE + '/getall',
  SAVE = PresalesControllerPaths.LEAD_SOURCE + '/save',
  UPDATE = PresalesControllerPaths.LEAD_SOURCE + '/update',
}

export enum LeadSubSourcePaths {
  ALL = PresalesControllerPaths.LEADSUBSOURCE + '/fetchall',
}

export enum LeadFollowupPaths {
  SAVE = PresalesControllerPaths.LEAD_FOLLOWUP + '/save',
  UPDATE = PresalesControllerPaths.LEAD_FOLLOWUP + '/update',
  ALL = PresalesControllerPaths.LEAD_FOLLOWUP + '/getall',
  DASHBOARD_FOLLOWUPS = PresalesControllerPaths.LEAD_FOLLOWUP +
    '/dashboard/followups',

  CP_FOLLOWUPS = PresalesControllerPaths.LEAD_FOLLOWUP + '/getall/cp/followups',
  CP_HEAD_FOLLOWUPS = PresalesControllerPaths.LEAD_FOLLOWUP +
    '/getall/head/followups',
  FETCH_LEADS_PENDING_FOLLOW = PresalesControllerPaths.LEAD_FOLLOWUP +
    '/calendar/events',
  CALENDAR_FOLLOWUPS = PresalesControllerPaths.LEAD_FOLLOWUP +
    '/getall/calendar/followups',
}

//apis for Channel patner
export const GET_ALL_CP_SPEC =
  PresalesControllerPaths.CHANNEL_PARTNER + '/spec';
export const REGISTER_CP = PresalesControllerPaths.CHANNEL_PARTNER + '/save';
export const UPDATE_CP = PresalesControllerPaths.CHANNEL_PARTNER + '/update';
export const DELETE_CP = PresalesControllerPaths.CHANNEL_PARTNER;
export const GET_APPROVAL_CP =
  PresalesControllerPaths.CHANNEL_PARTNER + '/cp/approval';
export const UPDATE_APPROVED_CP =
  PresalesControllerPaths.CHANNEL_PARTNER + '/update/cp';
export const GET_CP = PresalesControllerPaths.CHANNEL_PARTNER + '/findAll';
export const UPDATE_CP_APPROVAL =
  PresalesControllerPaths.CHANNEL_PARTNER + '/update/cp/approval/status';
export const DOWNLOAD_FILE =
  PresalesControllerPaths.CHANNEL_PARTNER + '/download-file';

//Apis for schedule visits
export const GET_ALL_SCHEDULE_VISITS_SPEC =
  PresalesControllerPaths.SCHEDULE_VISIT + '/spec';
export const SAVE_SCHEDULE_VISIT =
  PresalesControllerPaths.SCHEDULE_VISIT + '/save';
export const UPDATE_SCHEDULE_VISIT =
  PresalesControllerPaths.SCHEDULE_VISIT + '/update';
export const GET_SCHEDULE_VISIT_BY_ID = PresalesControllerPaths.SCHEDULE_VISIT;

//Apis for site visits
export const GET_ALL_SITE_VISITS_SPEC =
  PresalesControllerPaths.SITE_VISIT + '/spec';
export const SAVE_SITE_VISIT = PresalesControllerPaths.SITE_VISIT + '/save';
export const UPDATE_SITE_VISIT = PresalesControllerPaths.SITE_VISIT + '/update';
export const GET_SITE_VISIT_BY_ID = PresalesControllerPaths.SITE_VISIT;
export const GET_FACEBOOK_LEADS =
  PresalesControllerPaths.FACEBOOK_LEADS + '/getall';
export const GET_FACEBOOK_CAMPAGINNAME =
  PresalesControllerPaths.FACEBOOK_LEADS + '/campagin';
export const MCUBE = PresalesControllerPaths.MCUBE + '/outbound-call';
