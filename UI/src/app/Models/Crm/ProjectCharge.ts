export interface IProjectChargeDto {
  id: number;
  amount: number;
  amountCalculate: number;
  strAmountCalculate: string;
  chargeIn: number;
  strChargeIn: string;
  description: string;
  name: string;
  projectId: number;
  projectName: string;
  levelId: number;
  levelName: string;
  phaseId: number;
  phaseName: string;
  status: string;
  discountAmount: number;
  discountPercentage: number;
  amountAfterDiscount: number;
  bookingId: number;
  chargeId: number;
}

export class ProjectChargeDto implements IProjectChargeDto {
  id: number = 0;
  amount: number = 0;
  amountCalculate: number = 0;
  strAmountCalculate: string = '';
  chargeIn: number = 0;
  strChargeIn: string = '';
  description: string = '';
  name: string = '';
  projectId: number = 0;
  projectName: string = '';
  levelId: number = 0;
  levelName: string = '';
  phaseId: number = 0;
  phaseName: string = '';
  status: string = '';
  discountAmount: number = 0;
  discountPercentage: number = 0;
  amountAfterDiscount: number = 0;
  bookingId: number = 0;
  chargeId: number = 0;
}

export interface IProjectCharge {
  id: number;
  name: string;
  chargeIn: number;
  amountCalculate: number;
  amount: number;
  description: string;
  projectId: number;
  levelId: number;
  phaseId: number;
  orgId: number;
  status: string;
  chargeType: string;
}
export class ProjectCharge implements IProjectCharge {
  id: number = 0;
  name: string = '';
  chargeIn: number = 0;
  amountCalculate: number = 0;
  amount: number = 0;
  description: string = '';
  projectId: number = 0;
  levelId: number = 0;
  phaseId: number = 0;
  orgId: number = 0;
  status: string = '';
  chargeType: string = '';
}
export interface ILevelsByProject {
  levelId: number;
  levelname: string;
  projectName: string;
}
export class LevelsByProject implements ILevelsByProject {
  levelId: number = 0;
  levelname: string = '';
  projectName: string = '';
}

export interface IPojectBookingChargesDto {
  bookingChargeId: number;

  chargeId: number;

  bookingId: number;

  name: string;

  chargeIn: number;

  strChargeIn: string;

  amountCalculate: number;

  strAmountCalculate: string;

  amount: number;

  description: string;

  projectId: number;

  projectName: string;

  levelId: number;

  levelName: string;

  phaseId: number;

  phaseName: string;

  orgId: number;

  discountPercentage: number;

  discountAmount: number;

  amountAfterDiscount: number;

  status: string;
  projectStatus : string ;
  chargeType: string;
}

export class ProjectBookingChargesDto implements IPojectBookingChargesDto {
  bookingChargeId: number = 0;
  chargeId: number = 0;
  bookingId: number = 0;
  name: string = '';
  chargeIn: number = 0;
  strChargeIn: string = '';
  amountCalculate: number = 0;
  strAmountCalculate: string = '';
  amount: number = 0;
  description: string = '';
  projectId: number = 0;
  projectName: string = '';
  levelId: number = 0;
  levelName: string = '';
  phaseId: number = 0;
  phaseName: string = '';
  orgId: number = 0;
  discountPercentage: number = 0;
  discountAmount: number = 0;
  amountAfterDiscount: number = 0;
  status: string = '';
  projectStatus : string =''
  chargeType : string = ''
}
