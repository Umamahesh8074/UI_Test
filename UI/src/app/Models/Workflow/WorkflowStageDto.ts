export interface IWorkflowStageDto {
    id?: number;
    workflowTypeId?:number;
    workflowStageName?: string;
    description?:string;
    orderIndex?:number;
    name?:string;
   
  }
  export class WorkflowStageDto implements IWorkflowStageDto{

    public id: number=0;
    public workflowTypeId: number=0;
    public workflowStageName: string='';
    public description:string='';
    public menorderIndexuId:number=0;
    public name:string='';
    
   
  }
  export class Page<T> {
    pageNo: number = 0;
    pageSize: number = 0;
    last: boolean = false;
    first: boolean = false;
    totalPages: number = 0;
    records: any;
    totalRecords:number=0;
  }