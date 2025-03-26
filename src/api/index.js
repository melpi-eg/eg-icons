import axios from "axios";

class ApiRequest {
  constructor(baseURL = "") {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      // withCredentials: true, // To include credentials with requests (e.g., cookies, authentication)
    });
  }

  // GET request
  async get(endpoint, params = {}, headers = {}, authRequired = false) {
    if (authRequired) {
      this.addAuthHeader(headers);
    }
    try {
      const response = await this.axiosInstance.get(endpoint, {
        params,
        headers,
      });
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // POST request
  async post(endpoint, data = {}, headers = {}, authRequired = false) {
    if (authRequired) {
      this.addAuthHeader(headers);
    }
    try {
      const response = await this.axiosInstance.post(endpoint, data, {
        headers,
      });
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PUT request
  async put(endpoint, data = {}, headers = {}, authRequired = false) {
    if (authRequired) {
      this.addAuthHeader(headers);
    }
    try {
      const response = await this.axiosInstance.put(endpoint, data, {
        headers,
      });
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // DELETE request
  async delete(endpoint, data = {}, headers = {}, authRequired = false) {
    if (authRequired) {
      this.addAuthHeader(headers);
    }
    try {
      const response = await this.axiosInstance.delete(endpoint, {
        data,
        headers,
      });
      return this.formatResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Add Authorization header if token is available
  addAuthHeader(headers) {
    const token = localStorage.getItem("access_token"); // Get token from localStorage
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Format response data in { status, data, statusText }
  formatResponse(response) {
    return {
      status: response.status,
      data: response.data,
      statusText: response.statusText,
      error: false,
    };
  }

  // Handle errors and return in { status, data, statusText } format
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      return {
        status: error.response.status,
        data: error.response.data,
        statusText: error.response.statusText,
        error: true,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: null,
        data: error.request,
        statusText: "No Response",
        error: true,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: null,
        data: error.message,
        statusText: "Request Error",
        error: true,
      };
    }
  }
}

export default ApiRequest;
