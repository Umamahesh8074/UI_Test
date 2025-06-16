// eoi-bean.interface.ts
export interface IEoi {
    id: number;
    firstApplName: string;
    firstApplPhoneNumber: string;
    firstApplEmail: string;
    firstApplPanNumber: string;
    firstApplAadharNumber: string;
    firstApplAddress: string;
    secondApplName: string;
    secondApplPhoneNumber: string;
    secondApplEmail: string;
    secondApplPanNumber: string;
    secondAppAadharNumber: string;
    secondApplAddress: string;
    panSubmitted: string;
    aadharSubmitted: string;
    chequeDdNumber: string;
    amountPaid: number;
    unitTypeId: number;
    salesManagerId: number;
    projectHeadId: number;
    cpId: number;
    projectId: number;
    leadSourceId: number;
    status: string;
  }



export class Eoi implements IEoi {
  id: number = 0;
  firstApplName: string = '';
  firstApplPhoneNumber: string = '';
  firstApplEmail: string = '';
  firstApplPanNumber: string = '';
  firstApplAadharNumber: string = '';
  firstApplAddress: string = '';
  secondApplName: string = '';
  secondApplPhoneNumber: string = '';
  secondApplEmail: string = '';
  secondApplPanNumber: string = '';
  secondAppAadharNumber: string = '';
  secondApplAddress: string = '';
  panSubmitted: string = '';
  aadharSubmitted: string = '';
  chequeDdNumber: string = '';
  amountPaid: number = 0;
  unitTypeId: number = 0;
  salesManagerId: number = 0;
  projectHeadId: number = 0;
  cpId: number = 0;
  projectId: number = 0;
  leadSourceId: number = 0;
  status: string = '';

 
}
 
export class EoiDto {
    id: number = 0; // Example default value
    firstApplName: string = '';
    firstApplPhoneNumber: string = '';
    firstApplEmail: string = '';
    firstApplPanNumber: string = '';
    firstApplAadharNumber: string = '';
    firstApplAddress: string = '';
    secondApplName: string = '';
    secondApplPhoneNumber: string = '';
    secondApplEmail: string = '';
    secondApplPanNumber: string = '';
    secondAppAadharNumber: string = '';
    secondApplAddress: string = '';
    panSubmitted: string = 'No'; // Example default value
    aadharSubmitted: string = 'No'; // Example default value
    chequeDdNumber: string = '';
    amountPaid: number = 0; // Example default value
    unitTypeId: number = 0; // Example default value
    salesManagerId: number = 0; // Example default value
    projectHeadId: number = 0; // Example default value
    cpId: number = 0; // Example default value
    projectId: number = 0; // Example default value
    leadSourceId: number = 0; // Example default value
    status: string = '';
    unitTypeName: string = '';
    projectName: string = '';
  }
  