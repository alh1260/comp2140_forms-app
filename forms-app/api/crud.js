

// Base URL for the form App RESTful API
const API_BASE_URL = "https://comp2140a3.uqcloud.net/api";

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
// From the A2 JSON Web Token column, view Feedback to show your JWT
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQzOTUwMjEifQ.Fjeb9cITqH0cXG3lO7NK2BDzrYW_uDsXaqn03xL_hRE";

// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = "s4395021";

async function apiRequest(endpoint, method = 'GET', body = null)
{
    const options = {
        method, // Set the HTTP method (GET, POST, PATCH)
        headers: {
            "Content-Type": "application/json", // Indicate that we are sending JSON data
            "Authorization": `Bearer ${JWT_TOKEN}` // Include the JWT token for authentication
        },
    };

    // If the method is POST or PATCH, we want the response to include the full representation
    if (method === "POST" || method === "PATCH") {
        options.headers["Prefer"] = "return=representation";
    }

    // check if we're making a count query instead (an endpoint that always ends in "limit=0")
    if (/limit\=0$/.test(endpoint)) {
        options.headers["Prefer"] = "count=exact";
    }

    // If a body is provided, add it to the request and include the username
    if (body) {
        options.body = JSON.stringify({ ...body, username: USERNAME });
    }

    // Make the API request and check if the response is OK
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    // Return the response as text
    // Deleting creates a response with an empty body (as per the HTTP spec)
    // so can't directly return JSON
    // see https://stackoverflow.com/questions/45696999/fetch-unexpected-end-of-input
    return response;
}

export {apiRequest};
