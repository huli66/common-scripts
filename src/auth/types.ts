
export interface IUserContent {
  access_token?: string;
  expire?: number;
  gatewayToken?: string;
  userId?: string;
  username?: string;
}

export interface IRequest<T> {
  content: T;
  message?: string;
  retCode?: string;
  status?: number;
  success?: boolean;
}

