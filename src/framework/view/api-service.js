// framework/view/api-service.js
export default class ApiService {
  constructor(endPoint) {
    this._endPoint = endPoint;
    console.log('API Service initialized with endpoint:', endPoint);
  }

  async _load({
    url,
    method = 'GET',
    body = null,
    headers = new Headers(),
  }) {
    const fullUrl = `${this._endPoint}/${url}`;
    console.log(`Making ${method} request to:`, fullUrl);

    const response = await fetch(fullUrl, { method, body, headers });

    try {
      ApiService.checkStatus(response);
      console.log(`Request successful: ${response.status}`);
      return response;
    } catch (err) {
      console.error(`Request failed: ${method} ${fullUrl} - ${err.message}`);
      ApiService.catchError(err);
    }
  }

  static parseResponse(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError(err) {
    throw err;
  }
}