export interface ILeadSubSourceDto {
  leadSubSourceId?: number;
  name: string;
  leadSourceId: number;
  sourceName: string;
  status: string;
}

export class LeadSubSourceDto {
  constructor(
    public leadSubSourceId: number,
    public name: string,
    public leadSourceId: number,
    public sourceName: string,
    public status: string
  ) {}
}

export class LeadSubSource {
  [x: string]: any;
  constructor(
    public leadSubSourceId: number,
    public name: string,
    public sourceId: number,
    public status: string,
    public refName: string
  ) {}
}
