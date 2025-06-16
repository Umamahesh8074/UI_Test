export interface ICommonReferenceDetails {
  id: number;
  referenceTypeId: number;
  commonRefKey: string;
  commonRefValue: string;
  refValue?: string;
  refOrder?: number;
}
export class CommonReferenceDetails implements ICommonReferenceDetails {
  id: number = 0;
  referenceTypeId = 0;
  commonRefKey: string = '';
  commonRefValue: string = '';
  refValue?: string = '';
  refOrder?: number = 0;
}
