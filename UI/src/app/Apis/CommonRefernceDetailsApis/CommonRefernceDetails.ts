import {
  ControllerPaths,
  PresalesControllerPaths,
} from '../ControllerPaths/ControllerPaths';

export enum CommonRefernceDetailsPath {
  GETREFERENCEDETAILSID = PresalesControllerPaths.COMMON_REFERNCE_DETAILS,
  GET_LEAD_STATUS_DETAILS_BY_REF_TYPE = ControllerPaths.COMMONREFERENCEDETAILS +
    '/lead/status',
}

export const GET_REF_DETAILS_BY_REF_TYPE =
  ControllerPaths.COMMONREFERENCEDETAILS + '/types';
export const GET_REF_DETAILS_ID_BY_REF_TYPE_AND_KEY =
  ControllerPaths.COMMONREFERENCEDETAILS + '/refdetailsid';

export const GET_REF_DETAILS_WITH_FILTERS =
  ControllerPaths.COMMONREFERENCEDETAILS + '/refdetails';

  
