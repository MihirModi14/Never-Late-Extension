import { AxiosRequestConfig, AxiosHeaders, Method } from 'axios';

export type ApiErrorResponse = {
    payload: Record<string, string | boolean> | null;
};

export type AxiosRequest = AxiosRequestConfig & {
    headers: AxiosHeaders;
};

export type ApiConfig<D> = AxiosRequestConfig<D> & {
    method: Method;
    showLoader?: boolean;
    showSuccessToast?: boolean;
    showAlertToast?: boolean;
    scrollToTop?: boolean;
};
