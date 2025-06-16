
export interface IFacebookLeads {
    leadId: number;
    leadName: string | null;
    leademail: string | null;
    recordedDate: any;
    note: string | null;
    assignedToPresale: any;
    presaleMemberName: string | null;
    assignedToSale: any;
    saleMemberName: string | null;
  }
  
 export class FacebookLeads implements IFacebookLeads {
   leadId: number = 0;
   leadName: string | null = '';
   leademail: string | null = '';
   recordedDate: any;
   note: string | null = '';
   assignedToPresale: any;
   presaleMemberName: string | null = '';
   assignedToSale: any;
   saleMemberName: string | null = '';
 }
 