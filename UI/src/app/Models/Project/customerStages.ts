export interface ICustomerStages {
  id: number;
  bookingId: number;
  stageName: string;
  stageOrder: number;
  description: string;
  percentage: number;
  days: number;
  initiated: string;
  expectedDate: any;
  actualDate: any;
  expectedAmount: number;
  planId: number;
  status: string;
  tds: number;
  stageId: number;
}

export class CustomerStages implements ICustomerStages {
  id: number = 0;
  bookingId: number = 0;
  stageName: string = '';
  stageOrder: number = 0;
  description: string = '';
  percentage: number = 0;
  days: number = 0;
  initiated: string = '';
  expectedDate: any;
  actualDate: any;
  expectedAmount: number = 0;
  planId: number = 0;
  status: string = '';
  tds: number=0;
  stageId: number=0;
}

export interface ICustomerStagesDto {
  customerStages: number;
  bookingId: number;
  bookingName: string;
  finalPrice: number;
  stageName: string;
  stageOrder: number;
  description: string;
  percentage: number;
  days: number;
  initiated: string;
  expectedDate: any;
  actualDate: any;
  expectedAmount: number;
  planId: number;
  planName: string;
  status: string;
  tds: number;
  paymentStatus: string;
  demandLetter: string;
  firstApplicantMiddleName: string;
  firstApplicantLastName: string;
  unitName: string;
  isLastInitiated: string;
  landOwnerOrBuilder:string;
  formattedExpectedAmount:string;
  formattedTdsAmount:string;
  formattedNetPayableAmount:string;
}

export class CustomerStagesDto implements ICustomerStagesDto {
  customerStages: number = 0;
  bookingId: number = 0;
  bookingName: string = '';
  finalPrice: number = 0;
  stageName: string = '';
  stageOrder: number = 0;
  description: string = '';
  percentage: number = 0;
  days: number = 0;
  initiated: string = '';
  expectedDate: any;
  actualDate: any;
  expectedAmount: number = 0;
  planId: number = 0;
  planName: string = '';
  status: string = '';
  tds: number = 0;
  paymentStatus: string = '';
  demandLetter: string =''
  firstApplicantMiddleName: string='';
  firstApplicantLastName: string='';
  unitName: string=''
  isLastInitiated: string =''
  landOwnerOrBuilder: string ='';
  formattedExpectedAmount:string='';
  formattedTdsAmount:string='';
  formattedNetPayableAmount:string=''
}

export class CustomerStagesDtoWithAmount{
  customerStagesDto:[]=[];
  totalExpectedAmount:number=0
  totalTds:number=0;
  totalNetPayableAmount:number=0
  totalPercentage:number =0;
  formattedTotalExpectedAmount:string='';
  formattedTotalTds:string='';
  formattedTotalNetPayableAmount:string='';

}


