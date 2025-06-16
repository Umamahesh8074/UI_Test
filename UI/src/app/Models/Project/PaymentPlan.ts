export interface IPaymentPlan {
  id: number;
  planName: string;
  description: string;
  projectId: number;
  blockId: number;
  status: string;
  projectCode: string;
}

export class PaymentPlan implements IPaymentPlan {
  id: number = 0;
  planName: string = '';
  description: string = '';
  projectId: number = 0;
  blockId: number = 0;
  status: string = '';
  projectCode: string = '';
}
export interface IPaymentPlanDto {
  id: number;
  planName: string;
  description: string;
  projectId: number;
  projectName: string;
  status: string;
}

export class PaymentPlanDto implements IPaymentPlanDto {
  id: number = 0;
  planName: string = '';
  description: string = '';
  projectId: number = 0;
  projectName: string = '';
  status: string = '';
}
