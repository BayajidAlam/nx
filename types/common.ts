// types/common.ts - Updated to include token
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMeta {
  limit: number;
  page: number;
  total: number;
}

export type ResponseSuccessType<T = any> = {
  success: boolean;
  data: T;
  meta?: IMeta;
  message: string;
  token?: string; // FIX: Add token field
  refreshToken?: string; // FIX: Add refreshToken field
  error?: {
    message: string;
  };
};

export interface IQueryFeatures {
  page?: number | string;
  limit?: number | string;
  fields?: string;
  populate?: string;
  sort?: string;
  search?: string;
}

export type IQuery = IQueryFeatures & { [key: string]: any };

export type IGenericErrorResponse = {
  error: IGenericErrorMessage;
  success: boolean;
};

export type IGenericErrorMessage = {
  path?: string | number;
  message: string;
};

export interface ILoginCredentials {
  phone: string;
  password: string;
}