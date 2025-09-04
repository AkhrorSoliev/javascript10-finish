import { showLoader, hideLoader } from "./loader.js";

export const getData = async (url) => {
  if (!url.trim()) {
    return Promise.reject(new Error("URL is empty"));
  }
  try {
    showLoader();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return Promise.reject(new Error("Failed to fetch data"));
  } finally {
    hideLoader();
  }
};
