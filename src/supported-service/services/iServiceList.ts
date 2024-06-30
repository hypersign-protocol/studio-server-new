export enum SERVICE_TYPES {
  SSI_API = 'SSI_API',
  CAVACH_API = 'CAVACH_API',
}

export enum APP_ENVIRONMENT {
  prod = 'prod',
  dev = 'dev',
}

export const SSI_API_SERVICE_INFO = Object.freeze({
  type: SERVICE_TYPES.SSI_API,
  description: 'A SSI API service built on multi tenant architeacture',
  name: 'SSI API Service',
  swaggerAPIDocPath: '/ssi',
  baseDomain: 'https://api.entity.hypersign.id',
});

export const CAVACH_API_SERVICE_INFO = Object.freeze({
  type: SERVICE_TYPES.CAVACH_API,
  description: 'A generic service interface for kyc verification',
  name: 'KYC API Service',
  swaggerAPIDocPath: '/api',
  baseDomain: 'https://api.cavach.hypersign.id',
});

export const SERVICE_INFO = Object.freeze({
  SSI_API: SSI_API_SERVICE_INFO,
  CAVACH_API: CAVACH_API_SERVICE_INFO,
});

// eslint-disable-next-line
export namespace SERVICES {
  // eslint-disable-next-line
  export namespace SSI_API {
    export enum ACCESS_TYPES {
      ALL = 'ALL',
    }
  }

  // eslint-disable-next-line
  export namespace CAVACH_API {
    export enum ACCESS_TYPES {
      ALL = 'ALL',
      READ_USER_CONSENT = 'READ_USER_CONSENT',
      WRITE_USER_CONSENT = 'WRITE_USER_CONSENT',
      READ_SESSION = 'READ_SESSION',
      WRITE_SESSION = 'WRITE_SESSION',
      WRITE_PASSIVE_LIVELINESS = 'WRITE_PASSIVE_LIVELINESS',
      WRITE_DOC_OCR = 'WRITE_DOC_OCR',
    }
  }
}
