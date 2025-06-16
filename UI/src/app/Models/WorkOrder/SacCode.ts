export interface ISacCode {
  id: number;
  status: string;
  sacCodeDescription: string;
  sacCode: string;
}

export class SacCode implements ISacCode {
  id: number = 0;
  sacCode: string = '';
  sacCodeDescription: string = '';
  status: string = '';
}
