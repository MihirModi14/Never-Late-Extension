import { DATE_FORMAT } from "../constants/common.constant";
import { formatDate } from "./date.helper";

const colors = {
  Reset: "\x1b[0m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgRed: "\x1b[31m",
};

export const logger = {
  currentDateTime: () =>
    formatDate(new Date().toISOString(), DATE_FORMAT.YYYY_MM_DD_H_M_S),

  log(...args: unknown[]) {
    console.log(
      `${colors.FgGreen}[INFO]${
        colors.Reset
      } [${this.currentDateTime()}]: ${args.join(" ")}`
    );
  },
  warn(...args: unknown[]) {
    console.log(
      `${colors.FgYellow}[WARN]${
        colors.Reset
      } [${this.currentDateTime()}]: ${args.join(" ")}`
    );
  },
  error(...args: unknown[]) {
    console.log(
      `${colors.FgRed}[ERROR]${
        colors.Reset
      } [${this.currentDateTime()}]: ${args.join(" ")}`
    );
  },
};
