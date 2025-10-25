import { ApiResponse } from "../types/Api.type";
import { apiCall } from "../utils/api-manager";
import { ENDPOINTS } from "../constants/endpoints.constant";

const calendarApi = {
  getCalendarList: (params: any): Promise<ApiResponse<any>> => {
    return apiCall({
      method: ENDPOINTS.CALENDAR.LIST.method,
      url: ENDPOINTS.CALENDAR.LIST.endpoint,
      params: params,
      showLoader: false,
      showSuccessToast: false,
    });
  },
};

export { calendarApi };
