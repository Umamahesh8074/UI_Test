export interface IMultiLogin {
  multiLoginId: number;
  email: string;
  phonenumber: string;
  password: string;
  userName:string;
  userId: number;
}

export class MultiLogin implements IMultiLogin {
  multiLoginId: number = 0;
  email: string = '';
  phonenumber: string = '';
  password: string = '';
  userName:string='';
  userId: number = 0;
}
