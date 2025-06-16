export class FingerprintUserMappingBean {
    constructor(
      public fingerprintUserId: number,
      public locationId:number,
      public userId: number,
      public  employeeId:number,
      public fingerprintNumber:number,
        public status:string,
        public orgId:number
    
    ) {}
  }