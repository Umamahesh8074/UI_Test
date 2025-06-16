import { ControllerPaths } from '../ControllerPaths/ControllerPaths';
 export const GETALLLEAVEREQUEST = ControllerPaths.LEAVEREQUEST + '/leaverequests';
export const SAVELEAVEREQUEST = ControllerPaths.LEAVEREQUEST + '/save';
export const UPDATELEAVEREQUEST = ControllerPaths.LEAVEREQUEST + '/update';
export const DELETELEAVEREQUEST = ControllerPaths.LEAVEREQUEST;
export const FETCHALLLEAVEREQUEST= ControllerPaths.LEAVEREQUEST +'/fetchall'; 

export const GETALLLEAVEREQUESTBYID= ControllerPaths.LEAVEREQUEST; 
export const GETALLLEAVEREQUESTBYUSERID= ControllerPaths.LEAVEREQUEST+'/getallbyuserid';
export const GETALLLEAVEREQUESTBYMANAGERID = ControllerPaths.LEAVEREQUEST + '/getallbymanagerid';
export const GETTEAMLEAVEREQUESTSBYMANAGERID = ControllerPaths.LEAVEREQUEST + '/getteamleavesbymanagerid'

export const GETTEAMLEAVESMANAGERID = ControllerPaths.LEAVEREQUEST + '/getteamleaves'
export const GETLEAVESBYORGANIZATIONID = ControllerPaths.LEAVEREQUEST + '/getleavesbyorganizationid'


