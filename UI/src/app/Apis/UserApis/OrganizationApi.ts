import { ControllerPaths } from '../ControllerPaths/ControllerPaths';

export enum OrganizationApi {
  SAVE = ControllerPaths.ORGANIZATION + '/save',
  UPDATE = ControllerPaths.ORGANIZATION + '/update',
  GET_ALL = ControllerPaths.ORGANIZATION + '/getall',
  FETCH_ALL = ControllerPaths.ORGANIZATION + '/fetchall',
  CHANGE_STATUS = ControllerPaths.ORGANIZATION + '/update/status',
  GET_BY_ID = ControllerPaths.ORGANIZATION + '/',
}
