import { apiCall } from "../helpers/api-manager.helper";
import { ENDPOINTS } from "../constants/endpoints.constant";
import { CalendarApiResponse } from "../types/calendar.type";

const calendarApi = {
  getCalendarList: (params: URLSearchParams): Promise<CalendarApiResponse> => {
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
