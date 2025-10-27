import { DATE_FORMAT } from "../constants/common.constant";
import { formatDate } from "../helpers/date.helper";

const colors = {
  Reset: "\x1b[0m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgRed: "\x1b[31m",
  FgBlue: "\x1b[34m",
};

export const logger = {
  currentDateTime: () =>
    formatDate(new Date().toISOString(), DATE_FORMAT.YYYY_MM_DD_H_M),

  log(...args: unknown[]) {
    console.log(
      `${colors.FgGreen}[INFO]${colors.Reset
      } [${this.currentDateTime()}]: ${args.join(" ")}`
    );
  },
  info(...args: unknown[]) {
    console.log(
      `${colors.FgBlue}[INFO]${colors.Reset
      } [${this.currentDateTime()}]: ${args.join(" ")}`
    );
  },
  warn(...args: unknown[]) {
    console.log(
      `${colors.FgYellow}[WARN]${colors.Reset
      } [${this.currentDateTime()}]: ${args.join(" ")}`
    );
  },
  error(...args: unknown[]) {
    console.log(
      `${colors.FgRed}[ERROR]${colors.Reset
      } [${this.currentDateTime()}]: ${args.join(" ")}`
    );
  },
};
