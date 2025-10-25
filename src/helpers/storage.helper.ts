export const setItemToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItemFromStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const removeItemFromStorage = (key: string): boolean => {
  if (keyExistsInStorage(key)) {
    localStorage.removeItem(key);
    return true;
  }
  return false;
};

export const keyExistsInStorage = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
};

export const clearStorage = (): void => {
  localStorage.clear();
};
