import { api } from "./instance";

/**
 * @typedef {Object} Response
 * @property {number} status - The HTTP status code of the response.
 * @property {Object} data - The data returned by the server.
 * @property {string} statusText - The status text of the response.
 * @property {boolean} error - Whether an error occurred.
 */

/**
 * Registers a new user.
 *
 * @async
 * @param {Object} params
 * @param {string} params.username - The username of the new user.
 * @param {string} params.email - The email address of the new user.
 * @returns {Promise<Response>} A promise that resolves with the response from the API.
 */
export const registerUser = async ({ username, email }) => {
  return await api.post("/users/register", { username, email }, {}, false);
};

/**
 * Logs in a user.
 *
 * @async
 * @param {Object} params
 * @param {string} params.username - The username of the user.
 * @param {string} params.email - The email address of the user.
 * @returns {Promise<Response>} A promise that resolves with the response from the API.
 */
export const loginUser = async ({ username, email }) => {
  return await api.post("/users/login", { username, email }, {}, false);
};

/**
 * fetches the currently logged in user.
 *
 * @async
 * @returns {Promise<Response>} A promise that resolves with the response from the API.
 */
export const getCurrentUser = async () => {
  return await api.get("/users/current-user", {}, {}, true);
};

/**
 * fetches the DB users from the server.
 * @returns {Promise<Response>} A promise that resolves with the response from the API.
 */
export const getUsers = async () => {
  return await api.get("/users/get-users", {}, {}, true);
};

/**
 * assigns a role to the users.
 * @param  {string[]} id_list the id list of the user
 * @param {"ADMIN" | "USER"} role the role to assign to the user
 * @returns {Promise<Response>} A promise that resolves with the response from the API.
 */
export const assignRole = async (id_list, role) => {
  return await api.post("/users/admin-access", { id_list, role }, {}, true);
};

/**
 * deletes multiple users
 * @param {string[]} id_list the id list of the user
 * @returns {Promise<Response>} A promise that resolves with the response from the API.
 */
export const deleteUsers = async (id_list) => {
  return await api.delete("/users", { id_list }, {}, true);
};
