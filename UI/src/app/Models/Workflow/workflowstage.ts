export interface IWorkflowStage {
  id: number;
  workflowTypeId: number;
  workflowStageName: string;
  description: string;
  orderIndex: number;
  status: any;
}

export class WorkflowStage implements IWorkflowStage {
  id: number = 0;
  workflowTypeId: number = 0;
  workflowStageName: string = '';
  description: string = '';
  orderIndex: number = 0;
  status: any;
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
