import { api } from "./instance";

/**
 * @typedef {Object} Response
 * @property {number} status - The HTTP status code of the response.
 * @property {Object} data - The data returned by the server.
 * @property {string} statusText - The status text of the response.
 * @property {boolean} error - Whether an error occurred.
 */

/**
 * Gets the download counts of the icons category wise eg: {"brands": 20, "animals": 10}
 * @returns {Promise<Response>} the response from the API
 */
export const getCatergoryWiseDownloadCounts = async () => {
  return await api.get("/dashboard/category-downloads", {}, {}, true);
};

/**
 * Gets the top icons from the server based on downloads eg: {"Dollar": 20, "Heart": 10}
 * @returns {Promise<Response>} the response from the API
 */
export const getTopIcons = async () => {
  return await api.get("/dashboard/top-icons", {}, {}, true);
};

/**
 * gets the datewise downloads of the icons eg: {"2021-09-01": 10, "2021-09-02": 20}
 * @returns {Promise<Response>} the response from the API
 */
export const getDatewiseDownloads = async () => {
  return await api.get("/dashboard/date-trends", {}, {}, true);
};

/**
 * gets the total info of the icons eg: {
    "total_users": 2,
    "total_downloads": 4,
    "total_icons": 14,
    "total_published_icons": 4
}
 * @returns {Promise<Response>} the response from the API
 */
export const getTotalInfo = async () => {
  return await api.get("/dashboard/total-info", {}, {}, true);
};
