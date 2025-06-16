export interface IUnitType {
  id: number;
  name: string;
  typeId: number;
  isSalable: boolean;
  superArea: number;
  builtUpArea: number;
  carpetArea: number;
  udslArea: number;
  plotArea: number;
  rate: number;
  constructionCost: number;
  udslCost: number;
  areaTypeId: number;
  mesurementId: number;
  description: string;
  layout: string;
  phaseReferenceId: number;
  status: any;
  balconyArea: number;
}
export class UnitType implements IUnitType {
  id: number = 0;
  name: string = '';
  typeId: number = 0;
  isSalable: boolean = false;
  superArea: number = 0;
  builtUpArea: number = 0;
  carpetArea: number = 0;
  udslArea: number = 0;
  plotArea: number = 0;
  rate: number = 0;
  constructionCost: number = 0;
  udslCost: number = 0;
  areaTypeId: number = 0;
  mesurementId: number = 0;
  description: string = '';
  layout: string = '';
  phaseReferenceId: number = 0;
  status: any;
  balconyArea: number = 0;

}

export class AvailableUnitsDto {
  projectId: number = 0;
  projectName: string = '';
  projectAddress: string = '';
  blockId: number = 0;
  blockName: string = '';
  levelId: number = 0;
  levelName: string = '';
  unitId: number = 0;
  unitName: string = '';
  phase: string = '';
  unitTypeName: string = '';
  superArea: number = 0;
  preSalesUserName: string = '';
  salesUserName: string = '';
  leadName: string = '';
  leadPhoneNumber: string = '';
  emailId: string = '';
  unitTypeId: number = 0;
  rate: number=0;
  east:string ='';
	west: string ='';
	north: string ='';
	south:string='';
	udsArea:number =0;
  balconyArea: number =0;
	carpetArea: number =0;
}
export class Unit implements IUnit {
  id: number = 0;

  projectId: number = 0;
  blockId: number = 0;

  levelId: number = 0;

  unitTypeId: number = 0;

  unitName: string = '';

  status: string = '';

  east: string = '';

  west: string = '';

  north: string = '';

  south: string = '';
}

export interface IUnit {
  id: number ;

  projectId: number;
  blockId: number;

  levelId: number ;

  unitTypeId: number ;

  unitName: string ;

  status: string ;

  east: string ;

  west: string ;

  north: string ;

  south: string ;
}
export class UnitsDto {
   unitId:number=0;
	  projectName:string='';
	  blockName:string='';
	  levelname:string='';
	  unitName:string='';
	  status:string='';

	  unitTypeName:string='';
	  unitTypeId:number=0;
}
