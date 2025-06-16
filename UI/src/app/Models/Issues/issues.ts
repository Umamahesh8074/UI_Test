export interface IIssues {
	issueId: number;

	appId: string;

	projectId: number;

	customerId: number;

	issueDescription: string;

	issueNumber: string;

	issueRequestDate: any;

	issueStatusRefCode: string;

	issueTypeId: number;

	processed: string;

	issueSubTypeId: number;
	remarks: string;
	image: File | null;

} export class Issues implements IIssues {
	issueId: number = 0;

	appId: string = '';

	projectId: number = 0;

	customerId: number = 0;

	issueDescription: string = '';

	issueNumber: string = '';

	issueRequestDate: string = '';

	issueStatusRefCode: string = '';

	issueTypeId: number = 0;

	processed: string = '';

	issueSubTypeId: number = 0;
	remarks: string = '';
	image!: File | null;

}
export class IssuesDto {

	commonRefValue: string = '';
	issueNumber: string = '';
	issueDescription: string = '';
	issueRequestDate: Date | string = '';

}


export class CustomerIssueDetailsDto {
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
	issueId: number = 0;
	issueDescription: string = '';
	issueNumber: string = '';
	issueRequestDate: string = '';
	issueSubTypeName: string = '';
	issueSubTypeId: number = 0;
	issueSubTypeRefId: number = 0;
	issueCommRefTypeId: number = 0;
	issueRefTypeId: number = 0;
	commonRefKey: string = '';
	commonRefValue: string = '';
	issueStatus: string = '';
}
export class IssuesCountDto {
	count: number = 0;
	issueStatusRefCode: number = 0;
	issueStatus: string = '';
	projectName: string = '';
}
export class IssuesCountByProjectDto {
	projectName: string = '';
	open: number = 0;
	closed: number = 0;
	inProgress: number = 0;
	waitingForApproval: number = 0;
	statusCountsByIssueType:any

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
export interface SalesData {
	volumeSales: string;
	valueSales: string;
  }
  
  export interface SalesResponse {
	[key: string]: SalesData;
  }
