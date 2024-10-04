import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

// Multer configuration to handle file uploads in memory
const upload = multer({ dest: '/tmp' }); // You can use memoryStorage if you don't want to use disk

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle multipart form-data
  },
};

// Middleware to handle form-data uploads
const uploadMiddleware = upload.single('file'); // Assumes the file input field is named 'file'

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        reject(res.status(500).json({ message: 'File upload failed', error: err.message }));
        return;
      }

      const formData = new FormData();
      // Append the uploaded file to form-data
      if (req.file) {
        formData.append('file', req.file.buffer, req.file.originalname);
      }

      // Append additional fields required for the API call
      formData.append('fileUrl', req.body.fileUrl || '');
      formData.append('mimeType', req.body.mimeType || '');

      try {
        // Forward the request to the actual middleware API
        const targetUrl = `${process.env.BASE_URL}/action/asset/v1/upload/${req.query.path}`;
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${process.env.AUTH_API_TOKEN}`,
            tenantId: process.env.TENANT_ID,
          },
          body: formData,
        });

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          resolve(res.status(response.status).json(data));
        } else {
          const text = await response.text();
          resolve(res.status(response.status).send(text));
        }
      } catch (error) {
        console.error('Error forwarding file upload:', error.message);
        reject(res.status(500).json({ message: 'Error forwarding request', error: error.message }));
      }
    });
  });
}
