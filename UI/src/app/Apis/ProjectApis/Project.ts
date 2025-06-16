import { ControllerPaths, CRMControllerPaths } from '../ControllerPaths/ControllerPaths';

//project apis
export const GET_ALL_PROJECTS_SPEC = ControllerPaths.PROJECT + '/spec';
export const SAVEPROJECT = ControllerPaths.PROJECT + '/save';
export const SAVECUSTOMERLEGALDOCUMENT =
  ControllerPaths.CUSTOMERLEGALDOCUMENT + '/save';
export const UPDATEPROJECT = ControllerPaths.PROJECT + '/update';
export const DELETEPROJECT = ControllerPaths.PROJECT;
export const UPDATE_NOTES_STATUS_AS_READ = ControllerPaths.NOTIFICATION + '/updateStatusAsRead';
export const GETBYPROJECTBYID = ControllerPaths.PROJECT;
export const GETALLPROJECTS = ControllerPaths.PROJECT + '/findAll';
export const GETALLPROJECTBYORGID = ControllerPaths.PROJECT + '/org';
export const GET_ALL_PROJECTS_FOR_SALES = ControllerPaths.PROJECT + '/sales';
export const GET_NOTIFICATIONS = ControllerPaths.NOTIFICATION + '/login/user';
export const GET_ALL_NOTIFICATIONS = ControllerPaths.NOTIFICATION + '/getallnotificationsforNavBar';

export const GETALLACTIVEPROJECTS =
  ControllerPaths.PROJECT + '/findAllActiveProjects';
export const GETALLPROJECTSBYIDS = ControllerPaths.PROJECT + '/findAllbyids';
export const GETALLPROJECTSFORSTORE =
  ControllerPaths.PROJECT + '/getprojectforstore';
//block apis
export const GETALLBLOCKS = ControllerPaths.BLOCK + '/getall';
export const SAVEBLOCK = ControllerPaths.BLOCK + '/save';
export const UPDATEBLOCK = ControllerPaths.BLOCK + '/update/blocks';
export const DELETEBLOCK = ControllerPaths.BLOCK;
export const ADDALLBLOCKS = ControllerPaths.BLOCK + '/add/blocks';
export const GETALLBLOCKSBYPROJECTID = ControllerPaths.BLOCK + '/fetch/all';
export const GETALLBLOCK = ControllerPaths.BLOCK + '/findAll';
export const GETBLOCKBYID = ControllerPaths.BLOCK;
export const GETBLOCKSBYBLOCKIDSANDPROJECTIDS = ControllerPaths.BLOCK+ '/findAllByBlockIdsAndProjectIds';

export const CHECKBLOCKS = ControllerPaths.BLOCK + '/blocks/check';

//level apis
export const GET_ALL_LEVELS_SPEC = ControllerPaths.LEVEL + '/spec';
export const GET_ALL_LEVELS = ControllerPaths.LEVEL + '/findAll';
export const ADD_ALL_LEVELS = ControllerPaths.LEVEL + '/add/level';
export const UPDATE_ALL_LEVELS = ControllerPaths.LEVEL + '/update/level';
export const GET_ALL_LEVELS_BY_BLOCK_ID = ControllerPaths.LEVEL + '/fetch/all';
export const DELETE_LEVELS = ControllerPaths.LEVEL;
export const GET_ALL_LEVEL_BY_ID = ControllerPaths.LEVEL + '/';
export const CHECKLEVELS = ControllerPaths.LEVEL + '/levels/check';

//unit apis
export const ALL_UNITS_NAME = ControllerPaths.UNIT + '/findAll/unitName';
export const GET_ALL_UNITS_SPEC = ControllerPaths.UNIT + '/units';
export const GET_ALL_UNITS = ControllerPaths.UNIT + '/findAll';
export const ADD_ALL_UNITS = ControllerPaths.UNIT + '/add/unit';
export const DELETE_UNIT = ControllerPaths.UNIT;
export const UPDATE_ALL_UNITS = ControllerPaths.UNIT + '/update/units';
export const ALL_UNITS = ControllerPaths.UNIT + '/fetch/all';
export const GET_UNIT_BY_UNIT_ID = ControllerPaths.UNIT;
export const ALL_SBA_AREA = ControllerPaths.UNIT + '/fetch/areas';
export const CHECKING_UNITS = ControllerPaths.UNIT + '/fetch/uints';
export const GET_UNIT_TYPES = ControllerPaths.UNIT + '/fetch/unit/types';
export const GET_UNITS_DATA = ControllerPaths.UNIT + '/unit/details/data';
export const UPDATE_UNIT_STATUS = ControllerPaths.UNIT + '/update/unitstatus';

//unit type apis
export const GET_ALL_UNIT_TYPE_SPEC = ControllerPaths.UNITTYPE + '/spec';
export const GET_ALL_UNIT_TYPE = ControllerPaths.UNITTYPE + '/findAll';
export const ADD_ALL_UNIT_TYPE = ControllerPaths.UNITTYPE + '/save';
export const UPDATE_ALL_UNIT_TYPE = ControllerPaths.UNITTYPE + '/update';
export const UNIT_TYPE = ControllerPaths.UNITTYPE;
export const GET_ALL_UNITS_BY_LEVEL_ID = ControllerPaths.UNIT + '/fetch/all';
export const GET_UNIT_TYPE_BY_UNIT_ID = ControllerPaths.UNIT + '/get/all';

//booking apis
export const ADD_BOOKING = ControllerPaths.UNITTYPE + '/save';

//stage apis
export const ADD_STAGE = ControllerPaths.STAGE + '/save';
export const UPDATE_STAGE = ControllerPaths.STAGE + '/update';
export const UPDATE_INITIATE_STATUS = ControllerPaths.STAGE + '/updatestatus';
export const GET_ALL_STAGES = ControllerPaths.STAGE + '/getall';
export const GET_Stage_BY_ID = ControllerPaths.STAGE;
export const GET_ALL_STAGES_WITHOUT_PAGINATION =
  ControllerPaths.STAGE + '/getallstages';

//payment plan apis
//PAYMENTPLAN
export const ADD_PAYMENT_PLAN = ControllerPaths.PAYMENTPLAN + '/save';
export const GET_ALL_PAYMENT_PLANS = ControllerPaths.PAYMENTPLAN + '/getall';
export const UPDATE_PAYMENT_PLAN = ControllerPaths.PAYMENTPLAN + '/update';
export const GET_PAYMENT_PLAN_BY_ID = ControllerPaths.PAYMENTPLAN;
export const DELETE_PAYMENT_PLAN_BY_ID = ControllerPaths.PAYMENTPLAN;
export const GET_ALL_PAYMENT_PLANS_BY_PROJECT_ID =
  ControllerPaths.PAYMENTPLAN + '/getallpaymentplans';

//Sales Aggrement Template

export const SAVE_SALES_AGGREMENT_TEMPLATES =
  ControllerPaths.SALESAGGREMENTTEMPLATE + '/save';
export const GETALLPROJECTSFORPO = ControllerPaths.PROJECT + '/findallforpo';

export const GETALLPROJECTDETAILS = CRMControllerPaths.PROJECT_DETAILS +'/getbyprojectidandtypeid';
