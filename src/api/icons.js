import { api } from "./instance";

/**
 * @typedef {Object} Response
 * @property {number} status - The HTTP status code of the response.
 * @property {Object} data - The data returned by the server.
 * @property {string} statusText - The status text of the response.
 * @property {boolean} error - Whether an error occurred.
 */

/**
 * Uploads the icons to the server
 * @typedef {Object} data the data to upload the icons with
 * @property {string} data.categories the category of the icons in the format "1,2,3"
 * @property {string} data.iconType the types of the icon in the format "1,2,3"
 * @property {string} data.tags the tags of the icon
 * @property {File} data.file the file to upload
 *
 * @param {Array<data>} data_list
 * @returns {Promise<Response>} the response from the API
 */
export const uploadIcons = async (data_list) => {
  const formData = new FormData();

  // update the keys of the data_list :
  const updated_data_list = data_list.map((data) => ({
    files: data.file,
    categories: data.categories,
    types: data.iconType,
    tags: data.tags,
  }));

  // append the data to the formData :
  updated_data_list.forEach((data, index) => {
    formData.append(`files`, data.files);
    formData.append(`categories`, data.categories);
    formData.append(`types`, data.types);
    formData.append(`tags`, data.tags);
  });
  for (var pair of formData.entries()) {
    console.log(pair[0] + ", " + pair[1]);
  }

  return await api.post(
    `/icons/upload?multiple_icons=${updated_data_list.length > 1}`,
    formData,
    {},
    true
  );
};

/**
 * Gets the icons from the server
 * @param {number} page_no the page number to get the icons from
 * @param {number} limit the number of icons to get
 * @returns {Promise<Response>} the response from the API
 */
export const getIcons = async (page_no, limit, icon_status = "PUBLISHED") => {
  return await api.get(`/icons/${page_no}?limit=${limit}&icon_status=${icon_status}`, {}, {}, true);
};

/**
 * Deletes the icons with the given IDs
 * @param {Array<string>} icon_ids the IDs of the icons to delete
 * @returns {Promise<Response>} the response from the API
 */
export const deleteIcons = async (icon_ids) => {
  return await api.delete("/icons", { id_list: icon_ids }, {}, true);
};

/**
 * Updates the icon with the given ID
 * @param {string} icon_id the ID of the icon
 * @param {Object} data the data to update the icon with
 * @param {string} data.category the category of the icon
 * @param {string} data.icon_name the name of the icon
 * @param {string} data.type the type of the icon
 * @param {string} data.tags the tags of the icon
 * @param {boolean} data.replace_file whether to replace the file
 * @param {File} data.file the file to replace the icon with
 * @returns {Promise<Response>} the response from the API
 */
export const updateIcon = async (icon_id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return await api.put(`/icons/update/${icon_id}`, formData, {}, true);
};

/**
 *
 * @param {string} icon_id unique id of the icon
 * @returns {Promise<Response>} return the response of details of the single icon
 */
export const getSingleIcon = async (icon_id) => {
  return await api.get(`/icons/get-icon/${icon_id}`, {}, {}, true);
};

/**
 *
 * @param {string} query the query to search for
 * @param {number} limit the number of suggestions to return
 * @returns {Promise<Response>} return the response of the search query
 */
export const searchIcons = async (query, limit) => {
  return await api.get(
    `/icons/search?query=${query}&limit=${limit}`,
    {},
    {},
    true
  );
};

/**
 *
 * @param {string[]} icon_ids
 * @param {'PUBLISHED'| 'UNPUBLISHED'} status
 * @returns {Promise<Response>} return the response of the publish request
 */
export const publishIcons = async (icon_ids, status) => {
  return await api.post(
    "/icons/publish",
    { id_list: icon_ids, status: status },
    {},
    true
  );
};

/**
 * Schedules the icons with the given IDs to be published at the specified date and time
 * @param {string[]} icon_ids the IDs of the icons to schedule
 * @param {string} schedule_time the date and time to schedule the icons, in the format "YYYY-MM-DD HH:mm:ss"
 * @returns {Promise<Response>} the response from the API
 */

export const scheduleIcons = async (icon_ids, schedule_time) => {
  return await api.post(
    "/icons/schedule",
    { id_list: icon_ids, schedule_time },
    {},
    true
  );
};
