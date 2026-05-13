export interface IErrorReporterPayload {
  type: string;
  message: string;
  name: string;
  stack: any[];
  lineno?: number;
  colno?: number;
  source?: string;
}

export type TReportErrorFunc = (payload: IErrorReporterPayload) => void;

export type TListener = (cb: any) => void;
