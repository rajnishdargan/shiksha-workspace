// pages/api/composite/search.js
const ORIGINAL_API_URL = process.env.BASE_URL + '/action/composite/v3/search'; // Replace with your actual API URL

const mockResponseData = {
    "id": "api.search-service.search",
    "ver": "3.0",
    "ts": "2024-10-22T14:31:46ZZ",
    "params": {
        "resmsgid": "7313a9fc-f542-4d7d-96fe-a0b5c963c97a",
        "msgid": null,
        "err": null,
        "status": "successful",
        "errmsg": null
    },
    "responseCode": "OK",
    "result": {
        "count": 1,
        "content": [
            {
                "ownershipType": [
                    "createdBy"
                ],
                "previewUrl": "https://knowlg-public.s3-ap-south-1.amazonaws.com/content/do_214168850157117440150/artifact/do_214168850157117440150_1729596023223_sample.pdf",
                "channel": "test-k12-channel",
                "downloadUrl": "https://knowlg-public.s3-ap-south-1.amazonaws.com/content/do_214168850157117440150/test-category-pdf-content_1729596081768_do_214168850157117440150_1.ecar",
                "language": [
                    "English"
                ],
                "mimeType": "application/pdf",
                "variants": {
                    "full": {
                        "ecarUrl": "https://knowlg-public.s3-ap-south-1.amazonaws.com/content/do_214168850157117440150/test-category-pdf-content_1729596081768_do_214168850157117440150_1.ecar",
                        "size": "2103"
                    },
                    "spine": {
                        "ecarUrl": "https://knowlg-public.s3-ap-south-1.amazonaws.com/content/do_214168850157117440150/test-category-pdf-content_1729596086262_do_214168850157117440150_1_SPINE.ecar",
                        "size": "977"
                    }
                },
                "objectType": "Content",
                "primaryCategory": "Test Category",
                "contentEncoding": "identity",
                "artifactUrl": "https://knowlg-public.s3-ap-south-1.amazonaws.com/content/do_214168850157117440150/artifact/do_214168850157117440150_1729596023223_sample.pdf",
                "contentType": "Resource",
                "trackable": {
                    "enabled": "No",
                    "autoBatch": "No"
                },
                "identifier": "do_214168850157117440150",
                "audience": [
                    "Student"
                ],
                "visibility": "Default",
                "discussionForum": {
                    "enabled": "No"
                },
                "mediaType": "content",
                "osId": "org.ekstep.quiz.app",
                "languageCode": [
                    "en"
                ],
                "lastPublishedBy": "4cd4c690-eab6-4938-855a-447c7b1b8ea9",
                "version": 2,
                "pragma": [
                    "external"
                ],
                "license": "CC BY 4.0",
                "prevState": "Review",
                "size": 3028.0,
                "lastPublishedOn": "2024-10-22T11:21:21.744+0000",
                "name": "Test Category pdf Content",
                "status": "Live",
                "code": "69085ca0-445c-4c22-853e-59adb2d05e8e",
                "interceptionPoints": {},
                "credentials": {
                    "enabled": "No"
                },
                "prevStatus": "Processing",
                "idealScreenSize": "normal",
                "createdOn": "2024-10-22T11:19:26.465+0000",
                "contentDisposition": "inline",
                "lastUpdatedOn": "2024-10-22T11:21:26.880+0000",
                "dialcodeRequired": "No",
                "lastStatusChangedOn": "2024-10-22T11:21:26.880+0000",
                "os": [
                    "All"
                ],
                "cloudStorageKey": "content/do_214168850157117440150/artifact/do_214168850157117440150_1729596023223_sample.pdf",
                "se_FWIds": [
                    "NCF"
                ],
                "pkgVersion": 1,
                "versionKey": "1729596061876",
                "idealScreenDensity": "hdpi",
                "framework": "NCF",
                "s3Key": "content/do_214168850157117440150/artifact/do_214168850157117440150_1729596023223_sample.pdf",
                "lastSubmittedOn": "2024-10-22T11:21:01.827+0000",
                "compatibilityLevel": 4
            }
        ]
    }
}

export default async function handler(req: any, res: any) {
    // Check if the request method is POST
    if (req.method === 'POST') {
        const { request } = req.body;

        const primaryCategory = request?.filters?.primaryCategory;

        // Check the condition for mock data
        if (
            Array.isArray(primaryCategory) && // Ensure it's an array
            primaryCategory.includes('Test Category')
        ) {
            // Return the mock data as a response
            return res.status(200).json(mockResponseData);
        } else {
            // Forward the request to the original API service
            try {
                const response = await fetch(ORIGINAL_API_URL, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.AUTH_API_TOKEN}`,
                        tenantId: process.env.TENANT_ID || '',
                        "X-Channel-Id": "test-k12-channel",
                      },
                    body: JSON.stringify(req.body), // Forward the original request body
                });

                // Check if the response is ok
                if (!response.ok) {
                    return res.status(response.status).json({ message: 'Error fetching from original API' });
                }

                const data = await response.json(); // Parse the response data
                return res.status(200).json(data); // Return the original API response
            } catch (error) {
                console.error('Error forwarding request:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    } else {
        // If the request method is not POST, return a 405 error
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
