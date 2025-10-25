import forge from "node-forge";

export const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return true;
  } else if (typeof value === "string" && value === "") {
    return true;
  } else if (Array.isArray(value) && value.length === 0) {
    return true;
  } else if (
    value.constructor === Object &&
    Object.entries(value).length === 0
  ) {
    return true;
  }
  return false;
};

export const ENCRYPT = (value: string | null): string | null => {
  return value
    ? forge.util.encode64(forge.util.encodeUtf8(JSON.stringify(value)))
    : null;
};

export const DECRYPT = <T>(value: string | null): T | null => {
  return value
    ? JSON.parse(forge.util.decodeUtf8(forge.util.decode64(value.toString())))
    : null;
};
