import { apiCall } from "@NeverLate/utils/helpers/api-manager.helper";
import { ENDPOINTS } from "@NeverLate/utils/constants/endpoints.constant";
import { CalendarApiResponse } from "@NeverLate/types/calendar.type";

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
