// pages/api/playground.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { endpoint, method, params } = req.body;

  // Get API key from environment
  const apiKey = process.env.NEXT_PUBLIC_SNAP_JOBS_API_KEY;

  // Base URL for SJM API
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://snapjobsai.com/api/v1/test";

  try {
    // Determine the full URL based on the requested endpoint
    let apiEndpoint = "";

    switch (endpoint) {
      case "match":
        apiEndpoint = `${baseUrl}/match`;
        break;
      case "verify-skill":
        apiEndpoint = `${baseUrl}/verify-skill`;
        break;
      case "interview":
        apiEndpoint = `${baseUrl}/interview`;
        break;
      case "health":
        apiEndpoint = `${baseUrl}/health`;
        break;
      default:
        apiEndpoint = `${baseUrl}/${endpoint}`;
    }

    // Set up the request config
    const config = {
      method: method || "POST",
      url: apiEndpoint,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
    };

    // Add request body if this is a POST/PUT request and params are provided
    if ((method === "POST" || method === "PUT") && params) {
      config.data = params;
    }

    // Add query params if this is a GET request and params are provided
    if (method === "GET" && params) {
      config.params = params;
    }

    // Make the request to the SJM API
    const response = await axios(config);

    // Return the API response
    return res.status(response.status).json({
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    });
  } catch (error) {
    // Handle errors
    console.error("API playground error:", error);

    // Prepare error response
    const errorResponse = {
      error: error.message,
      status: error.response?.status || 500,
    };

    // Include the response data if available
    if (error.response?.data) {
      errorResponse.data = error.response.data;
    }

    return res.status(errorResponse.status).json(errorResponse);
  }
}
