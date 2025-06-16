import { ControllerPaths } from '../ControllerPaths/ControllerPaths';
export enum ReportsControllerPaths {
  ALL = ControllerPaths.REPORTS + '/reports',
  SAVE = ControllerPaths.REPORTS + '/save',
  UPDATE = ControllerPaths.REPORTS + '/update',
  UPDATE_STATUS = ControllerPaths.REPORTS + '/update/status',
  GET_ALL = ControllerPaths.REPORTS + '/getall',
  GET_BY_ID = ControllerPaths.REPORTS,
}

export enum ReportFiledControllerPath {
  ALL = ControllerPaths.REPORT_FIELDS + '/all',
  SAVE = ControllerPaths.REPORT_FIELDS + '/save',
  UPDATE = ControllerPaths.REPORT_FIELDS + '/update',
  UPDATE_STATUS = ControllerPaths.REPORT_FIELDS + '/update/status',
  GET_ALL = ControllerPaths.REPORT_FIELDS + '/getall',
  GET_BY_ID = ControllerPaths.REPORT_FIELDS,
}

export enum ExcelMappingControllerPath {
  ALL = ControllerPaths.EXCEL_MAPPING + '/excelmappings',
  SAVE = ControllerPaths.EXCEL_MAPPING + '/save',
  UPDATE = ControllerPaths.EXCEL_MAPPING + '/update',
  UPDATE_STATUS = ControllerPaths.EXCEL_MAPPING + '/update/status',
  GET_ALL = ControllerPaths.EXCEL_MAPPING + '/getall',
  GET_BY_ID = ControllerPaths.EXCEL_MAPPING,
}
