import { format } from "date-fns";

export const formatDate = (inputDate: string | Date, formatType: string) => {
  const dateObj = inputDate instanceof Date ? inputDate : new Date(inputDate);
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  return format(dateObj, formatType);
};
