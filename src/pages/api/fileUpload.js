// pages/api/fileUpload.js
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios'; // Make sure to install axios

// Set up Multer with a file size limit (e.g., 2 MB)
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit
  },
});

// Create an upload handler
const uploadHandler = upload.any();

// Next.js API Route config to disable body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to wrap the upload process in a promise
const uploadPromise = (req, res) => {
  return new Promise((resolve, reject) => {
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return reject(new Error(`File too large: ${err.message}`));
        }
        return reject(new Error('Error processing form data: ' + err.message));
      }
      resolve(req);
    });
  });
};

// Main handler function for Next.js API route
export default async function handler(req, res) {
  // Handle only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Await the file upload
    await uploadPromise(req, res);

    // Prepare FormData for the request to the backend service
    const formData = new FormData();

    // Attach uploaded files and form data to FormData
    if (req.files) {
      req.files.forEach((file) => {
        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });
    }

    // Attach other body parameters if present
    for (const key in req.body) {
      formData.append(key, req.body[key]);
    }

    // Set your base URL
    const baseURL = process.env.BASE_URL; // replace with your actual base URL
    const authApiToken = process.env.AUTH_API_TOKEN; // replace with your actual API key
    const tenantId = process.env.TENANT_ID; // replace with your actual tenant ID

    // Extract the relative URL from the incoming request (after /action)
    const relativePath = req.url.replace('/api/fileUpload', '');

    // Construct the final URL using baseURL + relativePath
    const finalURL = `${baseURL}${relativePath}`;

    // Make a POST request to the backend service
    const response = await axios.post(finalURL, formData, {
      headers: {
        ...formData.getHeaders(), // Set headers for FormData
        'Authorization': `Bearer ${authApiToken}`,  // Set your API key in the headers
        'tenantId': tenantId,  // Set your tenant ID in the headers
      },
      // Pass along any query parameters from the original request
      params: req.query,
    });

    // Return the response from the backend service
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in file upload:', error);
    return res.status(500).json({ message: error.message });
  }
}
