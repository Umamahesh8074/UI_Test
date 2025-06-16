export interface IPrimeActivityCode {
  id: number;
  primeActivityNumber: string;
  primeActivityDescription: string;
  primeActivityUomId: number;
  status: string;
  padCode: string;
}
export class PrimeActivityCode implements IPrimeActivityCode {
  id: number = 0;
  primeActivityNumber: string = '';
  primeActivityDescription: string = '';
  primeActivityUomId: number = 0;
  status: string = '';
  padCode: string = '';
}

export interface IPrimeActivityCodeDto {
  primeActivityId: number;
  primeActivityNumber: string;
  primeActivityDescription: string;
  primeActivityUom: string;
  status: string;
  padCode: string;
}

export class PrimeActivityCodeDto implements IPrimeActivityCodeDto {
  primeActivityId: number = 0;
  primeActivityNumber: string = '';
  primeActivityDescription: string = '';
  primeActivityUom: string = '';
  status: string = '';
  padCode: string = '';
}
