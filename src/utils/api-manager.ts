import {
  ApiConfig,
  ApiErrorResponse,
  AxiosRequest,
} from "../types/Api.type";
import axios, { AxiosError } from "axios";
import { logger } from "../helpers/logger.helper";
import { auth } from "../helpers/auth.helper";

let loaderCount = 0;

const defaultHeaders = {
  "Content-Type": "application/json; charset=UTF-8",
};

const defaultApiConfig = {
  showLoader: true,
  showSuccessToast: true,
  showAlertToast: true,
  scrollToTop: false,
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  headers: {
    ...defaultHeaders,
  },
});

axiosInstance.interceptors.request.use(async (config: AxiosRequest) => {
  const token = await auth.getStoredToken()
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const parsedJson = JSON.parse(error?.request?.response || false);
    if (!parsedJson) {
      if (error?.message.includes("Network Error")) {
        return Promise.reject({ show: false });
      }
      return Promise.reject(error);
    }

    return Promise.reject(parsedJson);
  }
);

export const apiCall = async <ResponsePayload, RequestBody = undefined>(
  apiConfig: ApiConfig<RequestBody>
): Promise<ResponsePayload> => {
  const {
    showLoader,
    showSuccessToast,
    showAlertToast,
    scrollToTop,
    ...apiReqConfig
  } = {
    ...defaultApiConfig,
    ...apiConfig,
  };

  if (showLoader) showLoading();

  try {
    const response = await axiosInstance.request<
      ResponsePayload,
      ResponsePayload,
      RequestBody
    >(apiReqConfig);

    if (showSuccessToast) {
      // success toast here
    }

    return response;
  } catch (error: any) {
    if (error.response?.status === 401) {
      logger.warn("[auth] Token expired, attempting refresh...");

      try {
        const newToken = await auth.getAccessToken(true);

        // Inject new token into header
        const updatedConfig = {
          ...apiReqConfig,
          headers: {
            ...apiReqConfig.headers,
            Authorization: `Bearer ${newToken}`,
          },
        };

        logger.info("[auth] Retrying request with refreshed token...");
        const retryResponse = await axiosInstance.request<
          ResponsePayload,
          ResponsePayload,
          RequestBody
        >(updatedConfig);

        return retryResponse;
      } catch (refreshError) {
        logger.error("[auth] Token refresh failed:", refreshError);
        throw refreshError;
      }
    }

    logger.error("API Error:", error.message);
    if (error && showAlertToast && error.message) {
      // alert toast logic here
    }
    throw error;
  } finally {
    if (showLoader) hideLoading();
  }
};


//helper function to show/hide the loader
const showLoading = () => {
  const linearLoader = document.getElementsByClassName("showLoader");
  if (linearLoader && linearLoader.length > 0) {
    loaderCount += 1;
    linearLoader[0].classList.remove("hideLoader");
  }
};

const hideLoading = () => {
  const linearLoader = document.getElementsByClassName("showLoader");
  loaderCount -= 1;
  if (linearLoader && linearLoader.length > 0 && loaderCount <= 0) {
    linearLoader[0].classList.add("hideLoader");
  }
};
