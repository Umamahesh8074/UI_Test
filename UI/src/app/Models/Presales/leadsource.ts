export interface ILeadSource {
  leadSourceId: number;
  name: string;
  status: string;
}

export class LeadSource implements ILeadSource {
  constructor(
    public leadSourceId: number,
    public name: string,
    public status: string
  ) {}
}
