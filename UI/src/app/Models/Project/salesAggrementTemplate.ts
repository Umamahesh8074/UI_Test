export interface ISalesAggrementTemplate {
  salesAggrementTemplateId: number;
  salesAggrementTemplateName: string;
  projectId: number;
  templateUrl: string;

  status: string;
}

export class SalesAggrementTemplate implements ISalesAggrementTemplate {
  salesAggrementTemplateId: number = 0;
  salesAggrementTemplateName: string = '';
  projectId: number = 0;
  templateUrl: string = '';

  status: string = '';
}

export interface SalesAgreementTemplateFieldsDto {
  salesAgreementTemplateFields: Array<{
    id: number;
    projectId: number;
    templateFields: string;
    projectTemplateId: number;
    isMandatory: boolean; // Change this to boolean if necessary
    placeholder: string;
    validationMessage: string;
  }>;
}

export interface GenerateSalesAggrementTemplateDto {
  generateSalesAgreement: Array<{
    id: number;
    projectId: number;
    templateId: number;
    templateFields: string;

    templateFieldsValues: string;
    flatNo: number;
    bookingId: number;
  }>;
}

export interface ISalesAggrementTemplateDto {
  salesAggrementTemplateId: number;
  salesAggrementTemplateName: string;
  projectId: number;
  templateUrl: string;

  status: string;
}

export class ISalesAggrementTemplateDto implements ISalesAggrementTemplateDto {
  salesAggrementTemplateId: number = 0;
  salesAggrementTemplateName: string = '';
  projectId: number = 0;
  templateUrl: string = '';

  status: string = '';
}
