export interface IAdditionalShift {
  additionalShiftId?: number;
  additionalShiftDate?: string;
  shiftTime?: number;
  userId?: number;
  projectId?: number;
  status?: string;
}

export class AdditionalShift implements IAdditionalShift {
  public additionalShiftId = 0;
  public additionalShiftDate = '';
  public shiftTime = 0;
  public projectId = 0;
  public userId = 0;
  public status = '';
}
