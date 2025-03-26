import { api } from "./instance";

/**
 * @typedef {Object} Response
 * @property {number} status - The HTTP status code of the response.
 * @property {Object} data - The data returned by the server.
 * @property {string} statusText - The status text of the response.
 * @property {boolean} error - Whether an error occurred.
 */

/**
 * Adds a new category to the backend
 * @param {string} category_name the name of the category
 * @returns {Promise<Response>} the response from the API
 */
export const addCategory = async (category_name) => {
  return await api.post("/category", { category_name }, {}, true);
};

/**
 * Gets the categories from the server
 * @returns {Promise<Response>} the response from the API
 */

export const getCategories = async () => {
  return await api.get("/category", {}, {}, true);
};

export const deleteCategories = async (category_ids) => {
  return await api.delete("/category", { id_list: category_ids }, {}, true);
};
