export interface IBookingCharges {
  id: number;
  bookingId: number;
  chargeName: string;
  chargeIn: number;
  amountCalculate: number;
  amount: number;
  description: string;
  discountPercentage: number;
  discountAmount: number;
  status: string;
  chargeId: number;
  phaseId: number;
}

export class BookingCharges implements IBookingCharges {
  id: number = 0;
  bookingId: number = 0;
  chargeName: string = '';
  chargeIn: number = 0;
  amountCalculate: number = 0;
  amount: number = 0;
  description: string = '';
  discountPercentage: number = 0;
  discountAmount: number = 0;
  status: string = '';
  chargeId: number = 0;
  phaseId: number = 0;
}

export interface IbookingChargesDto{
  id:number;
	bookingId:number;
	chargeName:string;
  projectId:number;
  projectName: string;
  levelId: number;
  name: string;
	firstApplicantFirstName:string;
	firstApplicantPhoneNumber: string;
	chargeIn:number;
  strChargeIn: string;
  amountCalculate: number;
	strAmountCalculate: string;
  phaseId: number;
  strPhase: string;
	amount: number;
	description: string;
	amountAfterDiscount: number;
	discountPercentage: number;
	discountAmount: number;
  status: string;
  firstApplicantMiddleName: string;
  firstApplicantLastName: string;
  unitId: number;
  unitName: string;

}

export class bookingChargesDto implements IbookingChargesDto{
  id:number=0; 
	bookingId:number=0;
	chargeName:string='';
  projectId:number=0;
  projectName: string='';
  levelId: number=0;
  name: string='';
	firstApplicantFirstName:string='';
	firstApplicantPhoneNumber: string='';
	chargeIn:number=0;
  strChargeIn: string='';
  amountCalculate: number=0;
	strAmountCalculate: string='';
  phaseId: number=0;
  strPhase: string='';
	amount: number=0;
	description: string='';
	amountAfterDiscount: number=0;
	discountPercentage: number=0;
	discountAmount: number=0;
  status: string='';
  firstApplicantMiddleName: string = '';
  firstApplicantLastName: string = '';
  unitId: number = 0; 
  unitName: string ='';

}
