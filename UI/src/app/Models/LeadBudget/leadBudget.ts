export interface ILeadBudget {
  id: number;
  sourceId: number;
  subSourceId: number;
  paymentDate: any;
  organizationId: number;
  amount: any;
}

export class LeadBudget implements ILeadBudget {
  id = 0;
  sourceId = 0;
  subSourceId = 0;
  paymentDate = 0;
  organizationId = 0;
  amount: any;
}

export interface ILeadBudgetDto {
  id: number;
  sourceName: string;
  subSourceName: string;
  paymentDate: any;
  organizationId: number;
  amount: any;
}

export class LeadBudgetDto implements ILeadBudgetDto {
  constructor(
    public id: number,
    public sourceName: string,
    public subSourceName: string,
    public paymentDate: any,
    public organizationId: number,
    public amount: any
  ) {}
}
export class LeadBudgetSpentDto 
{


     id:number=0;
  
    sourceName:string='';
    
     subSourceName:string='';
    
     totalAmonut:number=0;
    
       costPerLead:number=0;
      
       costPerBooking:number=0;
      
      costPerVisit:number=0;
      
       totalLead:number=0;
      
       totalBookedLeads:number=0;
      
      totalVisitDoneLeads:number=0;
  }
  

