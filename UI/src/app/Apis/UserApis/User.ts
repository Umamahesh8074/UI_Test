import { ControllerPaths } from '../ControllerPaths/ControllerPaths';
export const GETALLUSERS = ControllerPaths.USER + '/all';
export const SAVEUSER = ControllerPaths.USER + '/signUp';
export const UPDATEUSER = ControllerPaths.USER;
export const DELETEUSER = ControllerPaths.USER;
export const GETBYUSERID = ControllerPaths.USER;
export const GETUSERDTOBYUSER = ControllerPaths.USER + '/userdto/getbyid';

export const GETALLUSERDTO = ControllerPaths.USER + '/getall';
export const FETCHALLUSERS = ControllerPaths.USER + '/fetchall';
export const UPDATEPASSWORD = ControllerPaths.USER + '/updatepassword/';
export const LOGIN = ControllerPaths.USER + '/login';
export const FORGOTPASSWORD = ControllerPaths.USER + '/generateotp/';
export const VERIFYOTP = ControllerPaths.USER + '/verify/';
export const RESETPASSWORD = ControllerPaths.USER + '/reset/';
export const REFRESHTOKEN = ControllerPaths.USER + '/refreshToken';
export const ORGANIZATIONCHART = ControllerPaths.USER + '/organizationchart';
export const SAVE_CP_USER = ControllerPaths.USER + '/cp/user/signUp';
export const FETCH_CP_USER = ControllerPaths.USER + '/cp/users';
export const Getuserdetailsbymanagerid =
  ControllerPaths.USER + '/getuserdetailsbymanagerid';
export const GetMultiLoginsByUserid = ControllerPaths.MULTILOGIN + '/userId';
export const GetCacheKeys = ControllerPaths.CACHE + '/all-keys';
export const ClearEachKey = ControllerPaths.CACHE + '/clear-cache?key=';
export const ClearAllKeys = ControllerPaths.CACHE + '/clear-all-cache';
export const GetValue = ControllerPaths.CACHE + '/get-value?key=';
export const GET_SUPERSET_TOKEN = ControllerPaths.USER + '/superset-token';
