export interface INotifications {
  id: number;
  eventId: number;
  recipientId: number;
  messageBody: string;
  deliveryType: number;
  subject :string;
  isDocumentAttached:string ;
  attachmentUrl:string;
  recipientType: number;
  status: string;
  startDate: Date;
  endDate: Date;
}

export class AppNotification implements INotifications {
  id: number = 0;
  eventId: number = 0;
  recipientId: number = 0;
  messageBody: string = '';
  deliveryType: number = 0;
  subject :string='';
  isDocumentAttached:string ='';
  attachmentUrl:string='';
  recipientType: number = 0;
  status: string = '';
  startDate!: Date ;
  endDate!: Date ;
}

export interface INotificationsDto {
  id: number;
  eventId: number;
  recipientId: number;
  eventName: string;         // New field based on backend
  recipientName: string;     // New field based on backend
  recipientRoleName:string;
  messageBody: string;
  recipientType: number;     // Adjusted to match backend type (string)

  recipientTypeNumber: string;
  subject: string;
  isDocumentAttached: string;
  attachmentUrl: string;
  deliveryType: number;
  status: string;
  startDate: Date;
  endDate: Date;
}

export class NotificationsDto implements INotificationsDto {
  id: number = 0;
  eventId: number = 0;
  recipientId: number = 0;
  eventName: string = '';       // New field
  recipientName: string = '';   // New field
recipientRoleName:string='';
  messageBody: string = '';
  recipientType: number=0;     // Adjusted to match backend type (string)
  // projectName:string='';
  // salesProjectTeam:string='';
  recipientTypeNumber: string='';
  subject: string = '';
  isDocumentAttached: string = '';
  attachmentUrl: string = '';
  deliveryType: number = 0;
   status: string = '';
  startDate!: Date ;
  endDate!: Date ;
}

