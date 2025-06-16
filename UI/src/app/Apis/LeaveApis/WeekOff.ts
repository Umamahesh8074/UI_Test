import { ControllerPaths } from '../ControllerPaths/ControllerPaths';
 export const GETALLWEEKOFFREQUEST = ControllerPaths.WEEKOFF + '/leaverequests';
export const SAVEWEEKOFF = ControllerPaths.WEEKOFF + '/save';
export const UPDATEWEEKOFF = ControllerPaths.WEEKOFF + '/update';
export const DELETEWEEKOFF = ControllerPaths.WEEKOFF;
export const FETCHALLWEEKOFF= ControllerPaths.WEEKOFF +'/fetchall'; 

export const GETALLWEEKOFFBYID= ControllerPaths.WEEKOFF; 
export const GETALLWEEKOFFBYUSERID= ControllerPaths.WEEKOFF+'/getallbyuserid';
export const GETALLWEEKOFFBYMANAGERID = ControllerPaths.WEEKOFF + '/getallbymanagerid';
export const GETTEAMWEEKOFFBYMANAGERID = ControllerPaths.WEEKOFF + '/getteamweekoffbymanagerid'

export const GETTEAMWEEKOFFMANAGERID = ControllerPaths.WEEKOFF + '/getteamweekoff'