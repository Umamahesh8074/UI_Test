export interface IFeildOfficerpatrol {
      fieldOfficerPatrolId:number;

	  inTime:string;

	  outTime:string;

	  userId:number;

	  userName:string;

	  phoneNumber:string;

	  locationId:number;

	  location:string;

	  projectId:number;

	  projectName:string;

	  orgId:number;

	  organizationName:string;

	  status:string;

	  qrTypeId:number;

	  qrType:string;

	  inImageUrl:string;

	  outImageUrl:string;

	  createdDate:string;
}

export class FeildOfficerpatrolDto implements IFeildOfficerpatrol {
    fieldOfficerPatrolId:number=0;

    inTime:string='';

    outTime:string='';

    userId:number=0;

    userName:string='';

    phoneNumber:string='';

    locationId:number=0;

    location:string='';

    projectId:number=0;

    projectName:string='';

    orgId:number=0;

    organizationName:string='';

    status:string='';

    qrTypeId:number=0;

    qrType:string='';

    inImageUrl:string='';

    outImageUrl:string='';

    createdDate:string='';
}