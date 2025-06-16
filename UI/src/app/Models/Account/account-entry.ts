export interface IAccountEntry {
  id: number;
  date: string;
  remiterName: string;
  remiterBankName: string;
  beneficiaryName: string;
  beneficiaryBankName: string;
  creditAmount: number;
  deditAmount: number;
  chequeNo: string;
  transactionType: string;
  remarks: string;
}

export class AccountEntry implements IAccountEntry {
  id: number = 0;
  date: string = '';
  remiterName: string = '';
  remiterBankName: string = '';
  beneficiaryName: string = '';
  beneficiaryBankName: string = '';
  creditAmount: number = 0;
  deditAmount: number = 0;
  chequeNo: string = '';
  transactionType: string = '';
  remarks: string = '';
}

export class transactionType {
  id: number = 0;
  traType: string = '';
}

export interface IAccountEntryDto {
  id: number;
  remiterName: string;
  date: any;
  remiterBankName: string;
  beneficiaryName: string;
  beneficiaryBankName: string;
  chequeNo: string;
  transactionType: string;
  remarks: string;
  creditAmount: number;
  deditAmount: number;
  formattedCreditAmount:string;
  formattedDebitAmount:string
}

export class AccountEntryDto implements IAccountEntryDto {
  id: number = 0;
  remiterName: string = '';
  date: any;
  remiterBankName: string = '';
  beneficiaryName: string = '';
  beneficiaryBankName: string = '';
  chequeNo: string = '';
  transactionType: string = '';
  remarks: string = '';
  creditAmount: number = 0;
  deditAmount: number = 0;
 formattedCreditAmount:string='';
 formattedDebitAmount:string=''
}

export interface FileProcessingResult {
  fileName: string;
  success: boolean;
  errorMessage?: string;
  filePath: string;
}

export class AmountsDto{
  formattedCreditTotal: string = '';
  formattedDebitTotal: string = '';
  formattedGrandTotal: string = '';
}
export class Amounts {
  id: string = '';
  value: string = '';
}