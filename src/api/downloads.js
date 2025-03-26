import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
});

/**
 * @typedef {Object} Response
 * @property {number} status - The HTTP status code of the response.
 * @property {Object} data - The data returned by the server.
 * @property {string} statusText - The status text of the response.
 * @property {boolean} error - Whether an error occurred.
 */

/**
 * @param {string} icon_content the text svg content of the icon
 * @param {'svg' | 'png'} file_type the type of the icon
 * @param {string} icon_name the name of the icon
 * @param {string} icon_id the id of the icon
 * @returns {Promise<Response>} the response from the API
 */
export const downloadIcon = async (
  icon_content,
  file_type,
  icon_name,
  icon_id
) => {
  const response = await instance.post(
    `/icons/download?filetype=${file_type}`,
    { icon_content, icon_name, icon_id },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      responseType: "blob",
    }
  );

  // Set a default file name if needed (can be dynamic or from response headers)
  const filename = `${icon_name}.${file_type}`; // Default to ".bin" if no extension

  // Create a URL for the file data
  const url = window.URL.createObjectURL(new Blob([response.data]));

  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename); // Use the dynamic filename

  // Append the link to the body
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up by removing the link
  link.remove();

  return {};
};
