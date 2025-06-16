export interface Iduplicateleadhistory {
  id: number ;
  name: string ;

  gender: string ;

  phoneNumber: string ;
  alternatePhoneNumber: string;
  email: string ;
  address: string ;

  location: string ;

  pincode: number ;
  designation: string ;
  typeId: number;
  budget: number ;
  sourceId: number ;
  subSourceId: number ;
  agencyId: number;

  preferredFlatType: string ;
  remarks: string ;
  campaignName: string ;

  statusId: number ;
  projectId: number;
  assignedToPreSales: number ;
  assignedToSales: number ;


}

export class Duplicateleadhistory implements Iduplicateleadhistory {
  id: number = 0;
  name: string = '';

  gender: string = '';

  phoneNumber: string = '';
  alternatePhoneNumber: string = '';
  email: string = '';
  address: string = '';

  location: string = '';

  pincode: number = 0;
  designation: string = '';
  typeId: number = 0;
  budget: number = 0;
  sourceId: number = 0;
  subSourceId: number = 0;
  agencyId: number = 0;

  preferredFlatType: string = '';
  remarks: string = '';
  campaignName: string = '';

  statusId: number = 0;
  projectId: number = 0;
  assignedToPreSales: number = 0;
  assignedToSales: number = 0;
}
