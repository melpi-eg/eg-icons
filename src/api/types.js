import { api } from "./instance";

/**
 * @typedef {Object} Response
 * @property {number} status - The HTTP status code of the response.
 * @property {Object} data - The data returned by the server.
 * @property {string} statusText - The status text of the response.
 * @property {boolean} error - Whether an error occurred.
 */

/**
 * Adds a new icon type to the backend
 * @param {string} icon_type the name of the icon type
 * @returns {Promise<Response>} the response from the API
 */
export const addIconType = async (icon_type) => {
  return await api.post("/type", { type_name: icon_type }, {}, true);
};

/**
 * Gets the icon types from the backend
 * @returns {Promise<Response>} the response from the API
 *  */
export const getIconTypes = async () => {
  return await api.get("/type", {}, {}, true);
};

/**
 * Deletes the icon types with the given IDs
 * @param {Array<number>} icon_ids the IDs of the icon types to delete
 * @returns {Promise<Response>} the response from the API
 */
export const deleteIconTypes = async (icon_ids) => {
  return await api.delete("/type", { id_list: icon_ids }, {}, true);
};
