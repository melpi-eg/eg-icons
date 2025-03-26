import { api } from "./instance";

/**
 * @typedef {Object} Response
 * @property {number} status - The HTTP status code of the response.
 * @property {Object} data - The data returned by the server.
 * @property {string} statusText - The status text of the response.
 * @property {boolean} error - Whether an error occurred.
 */

/**
 * Sends a request to the backend to generate tags for a list of icon names.
 *
 * @param {Array<string>} icon_names - An array of icon names for which tags are to be generated.
 * @returns {Promise<Response>} - The response from the API containing the generated tags.
 */

export const generateTags = async (icon_names) => {
  return await api.post(
    "/tags/generate",
    {
      icon_name_list: icon_names,
    },
    {},
    true
  );
};
