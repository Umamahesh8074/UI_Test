export interface IAddress {
    addressId: number;
    gstinUin: string;
    pan: string;
    address1: string;
    code: string;
    pincode: string;
    state: string;
    address2: string;
    city: string;


} export class Address implements IAddress {
    addressId: number=0;
    gstinUin: string='';
    pan: string='';
    address1: string='';
    code: string='';
    pincode: string='';
    state: string='';
    address2: string='';
    city: string='';


}

export class Page<T> {
    pageNo: number = 0;
    pageSize: number = 0;
    last: boolean = false;
    first: boolean = false;
    totalPages: number = 0;
    records: any;
    totalRecords: number = 0;
}

