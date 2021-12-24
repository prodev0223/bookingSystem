export interface APIResponse {
  success: boolean;
  message: string;
  anyData: number;
}

export interface ErrorResponse {
  errors: Errors;
  type: string;
  title: string;
  status: number;
}

export interface Errors {
  error: any;
}
