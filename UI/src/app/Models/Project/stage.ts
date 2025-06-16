export interface IStage {
  stageId: number;
  stageName: string;
  stageOrder: number;
  description: string;
  planId: number;
  status: string;
  percentage: number;
  days: number;
  initiated: string;
  dueDate: any;
  demandDate: any;
}

export class Stage implements IStage {
  stageId: number = 0;
  stageName: string = '';
  stageOrder: number = 0;
  description: string = '';
  planId: number = 0;
  status: string = '';
  percentage: number = 0;
  days: number = 0;
  initiated: string = '';
  dueDate: any;
  demandDate: any;
}

export interface IStageDto {
  stageId: number;
  stageName: string;
  stageOrder: number;
  description: string;
  planId: number;
  planName: string;
  projectId: number;
  projectName: string;
  status: string;
  percentage: number;
  days: number;
  initiated: string;
  dueDate: any;
  demandDate: any;
  expectedAmount: number;
  bookingId: number;
  planCode: string;
}

export class StageDto implements IStageDto {
  stageId: number = 0;
  stageName: string = '';
  stageOrder: number = 0;
  description: string = '';
  planId: number = 0;
  planName: string = '';
  projectId: number = 0;
  projectName: string = '';
  status: string = '';
  percentage: number = 0;
  days: number = 0;
  initiated: string = '';
  dueDate: any;
  demandDate: any;
  expectedAmount: number = 0;
  bookingId: number = 0;
  planCode: string = '';
}
