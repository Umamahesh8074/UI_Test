export interface ICharges {
    id: number,
    chargeType: string,
    quotationId: number,
    cost: number

}

export class Charges implements ICharges {
    id: number=0;
    chargeType: string='';
    quotationId: number=0;
    cost: number=0;

}