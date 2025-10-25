import {
  ApiConfig,
  ApiErrorResponse,
  ApiResponse,
  AxiosRequest,
} from "../types/Api.type";
import axios, { AxiosError } from "axios";
import { ACCESS_TOKEN_KEY } from "../constants/storage.constant";
import { getItemFromStorage } from "../helpers/storage.helper";
import { DECRYPT } from "../helpers/common.helper";
import { logger } from "../helpers/logger.helper";

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
  headers: {
    ...defaultHeaders,
  },
});

axiosInstance.interceptors.request.use((config: AxiosRequest) => {
  const token = DECRYPT(getItemFromStorage(ACCESS_TOKEN_KEY));
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

  if (showLoader) {
    showLoading();
  }
  return axiosInstance
    .request<ResponsePayload, ResponsePayload, RequestBody>(apiReqConfig)
    .then((response) => {
      const { show, message } = response as ApiResponse<unknown>;
      if (show && showSuccessToast && message) {
        //success toast
      }
      if (scrollToTop) {
        //scroll to top
      }
      return response;
    })
    .catch((error) => {
      if (error && showAlertToast && error.message) {
        logger.error("API Error: ", error.message);
      }
      throw error;
    })
    .finally(() => {
      if (showLoader) {
        hideLoading();
      }
    });
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
