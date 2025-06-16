export interface ICustomer {
	customerId: number;

	name: string;

	phoneNumber: string;

	unitId: number;

	residentType: string;

	welcomeMsgSent: string;

	statusRefCode: string;

	emailId: string;

	projectId: number;

	blockId: number;

	levelId: number;
	addressId: number;
	userId: number;



} export class Customer implements ICustomer {
	customerId: number = 0;
	name: string = '';
	phoneNumber: string = '';
	unitId: number = 0;
	residentType: string = '';
	welcomeMsgSent: string = '';
	statusRefCode: string = '';
	emailId: string = '';
	projectId: number = 0;
	blockId: number = 0;
	levelId: number = 0;
	addressId: number = 0;
	userId: number = 0;

}
export class CustomerDto {
	commonRefValue: string = '';
	projectName: string = '';
	name: string = '';
	phoneNumber: string = '';
}
export class CustomerProjectDto {
	projectId: number = 0;
	projectCode: string = '';
	projectName: string = '';
	projectAddress: string = '';
	projectLocation: string = '';
	blocks: number = 0;
	levels: number = 0;
	projectTypeId: number = 0;
	organizationId: number = 0;
	blockId: number = 0;
	blockName: string = '';
	levelId: number = 0;
	levelName: string = '';
	unitName: string = '';
	customerId: number = 0;
	customerName: string = '';
	phoneNo: string = '';
	emailId: string = '';
	residentType: string = '';

}
export class SingleStringDto{
	projectType:string='';
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

