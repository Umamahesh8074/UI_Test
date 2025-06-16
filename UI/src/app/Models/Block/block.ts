export interface IBlock {
  id: number;
  projectId: number;
  noOfLevels: number;
  name: string;
  status: string;
}
export class Block implements IBlock {
  id: number = 0;
  projectId: number = 0;
  noOfLevels: number = 0;
  name: string = '';
  status: string = '';
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

export class BlockDto {
  id: number = 0;
  status: string = '';
  noOfLevels: number = 0;
  name: string = '';
  projectId: number = 0;
  projectName: string = '';
  projectCode: string = '';
}

export class ProjectBlockDto {
  projectId: number = 0;
  blocks: BlockDto[]=[];
}
