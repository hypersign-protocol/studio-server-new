export enum SERVICE_TYPES {
  SSI_API = 'SSI_API',
  CAVACH_API = 'CAVACH_API',
}
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
