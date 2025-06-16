export interface IWorkflowType {
  id: number;
  name: string;
  description: string;
  status: any;
}

export class WorkflowType implements IWorkflowType {
  constructor(
  ) {}
  public id: number=0;
    public name: string='';
    public description: string=''
    public status: any
}
