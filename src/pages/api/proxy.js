export default async function handler(req, res) {
    const { method, query } = req;
    const { path } = query;
  
    // If the 'path' is an array, join it to form the correct endpoint path
    const pathString = Array.isArray(path) ? path.join('/') : path;

    // Construct the full URL using the environment variable BASE_URL
    const BASE_URL = process.env.BASE_URL;
    const API_KEY = process.env.AUTH_API_TOKEN;
    const TENANT_ID = process.env.TENANT_ID;

    if (pathString === '/action/data/v3/telemetry') {
      return res.status(200).json({ message: 'Mocked Success - Skipping actual API call', data: {} });
    }
  
    // Append any existing query parameters from the original request
    const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
  
    // Build target URL
    const targetUrl = `${BASE_URL}${pathString}${queryString ? `?${queryString}` : ''}`;
    console.log('Target URL:', targetUrl);  // To verify the final constructed URL
  
    try {
      // Prepare options for the proxied request
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'tenantId': TENANT_ID,
      };
  
      console.log('Request Headers ===>', headers);  // Log the headers you are passing
  
      const options = {
        method,
        headers,
      };
  
      // If the method is POST or PUT, include the body
      if (method === 'POST' || method === 'PATCH') {
        options.body = JSON.stringify(req.body); // Pass the request body
      }
  
      // Make the proxied request to the target URL
      const response = await fetch(targetUrl, options);
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        res.status(response.status).json(data);
      } else {
        const text = await response.text(); // Get the raw response in case it's HTML
        console.log('raw data ==>', text)
        res.status(response.status).send(text); // Return the HTML/text as it is
      }
    } catch (error) {
      console.error('Error in proxy:', error.message);
      res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
  }
  