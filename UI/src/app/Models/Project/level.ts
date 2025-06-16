export interface ILevel {
  levelId: number;
  projectId: number;
  blockId: number;
  noOfUnits: number;
  name: string;
  status: string;
}
export class Level implements ILevel {
  levelId: number = 0;
  projectId: number = 0;
  blockId: number = 0;
  noOfUnits: number = 0;
  name: string = '';
  status: string = '';
}

export interface IProjectLevelDto {
  projectId: number;
  blockId: number;
  levels: LevelDto[];
}

export class ProjectLevelDto implements IProjectLevelDto {
  projectId: number = 0;
  blockId: number = 0;
  levels: LevelDto[] = [];
}

export interface ILevelDto {
  id: number;
  noOfUnits: number;
  name: string;
  status: string;
}

export class LevelDto implements ILevelDto {
  id: number = 0;
  noOfUnits: number = 0;
  name: string = '';
  status: string = '';
}
