export interface ILeaveRequest {
    id: number;
    userId:number;
    startDate: any;
    endDate:any;
    reason: string;
    status:string
}

export class LeaveRequest implements ILeaveRequest {
    constructor(
        public id: number,
        public userId:number,
        public startDate: any,
        public endDate:any,
        public reason: string,
        public status:string,
    ) { }
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

