import fetch from "node-fetch";
import ps from "prompt-sync";

const prompt = ps({sigint: true});

// Base URL for the form App RESTful API
const API_BASE_URL = "https://comp2140a3.uqcloud.net/api";

// JWT token for authorization, replace with your actual token from My Grades in Blackboard
// From the A2 JSON Web Token column, view Feedback to show your JWT
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQzOTUwMjEifQ.Fjeb9cITqH0cXG3lO7NK2BDzrYW_uDsXaqn03xL_hRE";

// Your UQ student username, used for row-level security to retrieve your records
const USERNAME = "s4395021";

/**
 * Helper function to handle API requests.
 * It sets the Authorization token and optionally includes the request body.
 * 
 * @param {string} endpoint - The API endpoint to call.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, PATCH).
 * @param {object} [body=null] - The request body to send, typically for POST or PATCH.
 * @returns {Promise<object>} - The JSON response from the API.
 * @throws Will throw an error if the HTTP response is not OK.
 */
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

/**
 * Function to insert a new form into the database.
 * 
 * @param {object} project - The form data to insert.
 * @returns {Promise<object>} - The created form object returned by the API.
 */
async function createForm(form)
{
    const res = await apiRequest("/form" , "POST", form);
    return res.json();
}

async function updateForm(id, form)
{
    const res = await apiRequest(`/form?id=eq.${id}`, "PATCH", form);
    return res.json();
}

async function createQuestion(question)
{
    const res = await apiRequest("/question", "POST", question);
    return res.json();
}

async function updateQuestion(id, question)
{
    const res = await apiRequest(`/question?id=eq.${id}`, "PATCH", question);
    return res.json();
}

async function createApplicant(applicant)
{
    const res = await apiRequest("/applicant", "POST", applicant);
    return res.json();
}

async function updateApplicant(id, applicant)
{
    const res = await apiRequest(`/applicant?id=eq.${id}`, "PATCH", applicant);
    return res.json();
}


/*
 * if only JS had templates...
 *
 * template <typename T>
 * function getData() : T
 * {...}*/

function getTextData(promptStr, defVal)
{
    return prompt(`${promptStr} (${defVal}): `, defVal);
}

function getID(idPromptStr)
{
    return prompt(`${idPromptStr}? `);
}

function getBoolData(promptStr, defVal)
{
    const res = getTextData(promptStr, defVal);
    return (res === "true");
}

function getIntData(promptStr, defVal)
{
    const res = getTextData(promptStr, defVal);
    return parseInt(res);
}

async function makeForm()
{
    console.log("Create new form");
    const res = await createForm({
        name: getTextData("Name", "FooBarBaz Form"),
        description: getTextData("Description", "FooBarBazQuxFumJimZxcZotAapPog")
    });
    console.log("Created Form:", res);
    return;
}

function getQText(defVal)
{
    return prompt(`Question Text: (${defVal}) `, defVal);
}

function getDifficulty(defVal)
{
    return prompt(`Difficulty: (${defVal}) `, defVal);
}

async function makeQuestion()
{
    console.log("Create new question");
    const intIdStr = getIntID();
    if (intIdStr === "") {
        console.log("No interview ID specified");
        return;
    }
    else {
        const intId = Number(intIdStr);
        const res = await createQuestion({
            interview_id: intId,
            question: getQText("FizzBuzz?"),
            difficulty: getDifficulty("Easy")
        });
        console.log("Created Question: ", res);
    }
}

function getAppTitle(defVal)
{
    return prompt(`Applicant title: (${defVal}) `, defVal);
}

function getAppFstName(defVal)
{
    return prompt(`First name: (${defVal}) `, defVal);
}

function getAppLstName(defVal)
{
    return prompt(`Last name: (${defVal}) `, defVal);
}

function getPhNumber(defVal)
{
    return prompt(`Phone number: (${defVal}) `, defVal);
}

function getEmail(defVal)
{
    return prompt(`Email address: (${defVal}) `, defVal);
}

function getAppIntStatus(defVal)
{
    return prompt(`Completion status: (${defVal}) `, defVal);
}

async function makeApplicant()
{
    console.log("Create new applicant");
    const intIdStr = getIntID();
    if (intIdStr === "") {
        console.log("No interview ID specified");
        return;
    }
    else {
        const intId = Number(intIdStr);
        const res = await createApplicant({
            interview_id: intId,
            title: getAppTitle("Dr"),
            firstname: getAppFstName("Al"),
            surname: getAppLstName("Smith"),
            phone_number: getPhNumber("+61 412 345 678"),
            email_address: getEmail("al.smith@example.com"),
            interview_status: getAppIntStatus("Not Started")
        });
        console.log("Created applicant: ", res);
    }
}

// checkIdAndDoStuff :: String -> (String -> IO ()) -> IO ()
// checkIdAndDoStuff id stuff = do
//     if id == "" then
//         putStrLn "No ID Specified"
//     else stuff id

async function deleteForm()
{
    console.log("Delete form");
    const idStr = getID("Form ID");
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const res = await apiRequest(`/form?id=eq.${id}`, "DELETE");
        console.log("Deleted form", res);
        return;
    }
}

async function deleteQuestion()
{
    console.log("Delete question");
    const idStr = getQID();
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const res = await apiRequest(`/question?id=eq.${id}`, "DELETE");
        console.log("Deleted question", res);
        return;
    }
}

async function deleteApplicant()
{
    console.log("Delete applicant");
    const idStr = getAppID();
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const res = await apiRequest(`/applicant?id=eq.${id}`, "DELETE");
        console.log("Deleted applicant", res);
        return;
    }
}

/**
 * Function to list all projects associated with the current user.
 * 
 * @returns {Promise<Array>} - An array of project objects.
 */
async function getForms()
{
    const res = await apiRequest("/form");
    return res.json();
}

/**
 * Function to get a single project by its ID.
 * The url is slightly different from usual RESTFul ...
 * See the operators section https://docs.postgrest.org/en/v12/references/api/tables_views.html
 * @param {string} id - The ID of the project to retrieve.
 * @returns {Promise<object>} - The project object matching the ID.
 */
async function getForm(id)
{
    const res = await apiRequest(`/form?id=eq.${id}`);
    return res.json().then(r => r[0]);
}

async function getFormCount()
{
    const res = await apiRequest("/form?limit=0");
    console.log("Result: ", res.headers.get("content-range").replace(/\*\//, ""));
}

async function listForms()
{
    console.log("All forms");
    const res = await getForms();
    console.log(res);
}

async function getQuestions(intId)
{
    const res = await apiRequest(`/question?interview_id=eq.${intId}`);
    return res.json();
}

async function getQuestion(id)
{
    const res = await apiRequest(`/question?id=eq.${id}`);
    return res.json();
}

async function getQCount()
{
    const intIdStr = getIntID();
    if (intIdStr === "") {
        console.log("No Interview ID specified");
        return;
    }
    else {
        const intId = Number(intIdStr);
        const res = await apiRequest(`/question?interview_id=eq.${intId}&limit=0`);
        console.log("Result: ", res.headers.get("content-range").replace(/\*\//, ""));
    }
}

async function listQuestions()
{
    console.log("List questions");
    const intIdStr = getIntID();
    if (intIdStr === "") {
        console.log("No Interview ID specified");
        return;
    }
    else {
        const intId = Number(intIdStr);
        const res = await getQuestions(intId);
        console.log(`Questions for interview ${intId}:`, res);
    }
}

async function getApplicants(intId)
{
    const res = await apiRequest(`/applicant?interview_id=eq.${intId}`);
    return res.json();
}

async function getApplicant(id)
{
    const res = await apiRequest(`/applicant?id=eq.${id}`);
    return res.json();
}

async function getAppCount()
{
    const intIdStr = getIntID();
    if (intIdStr === "") {
        console.log("No Interview ID specified");
        return;
    }
    else {
        const intId = Number(intIdStr);
        const res = await apiRequest(`/applicant?interview_id=eq.${intId}&limit=0`);
        console.log("Result: ", res.headers.get("content-range").replace(/\*\//, ""));
    }
}

async function listApplicants()
{
    console.log("List applicants");
    const intIdStr = getIntID();
    if (intIdStr === "") {
        console.log("No Interview ID specified");
        return;
    }
    else {
        const intId = Number(intIdStr);
        const res = await getApplicants(intId);
        console.log(`Applicants for interview ${intId}:`, res);
    }
}

async function getAnswers(appId)
{
    const res = await apiRequest(`/applicant_answer?applicant_id=eq.${appId}`);
    return res.json();
}

async function listAnswers()
{
    console.log("List answers");
    const appIdStr = getAppID();
    if (appIdStr === "") {
        console.log("No Applicant ID specified");
        return;
    }
    else {
        const appId = Number(appIdStr);
        const res = await getAnswers(appId);
        console.log(`Answers for ${appId}:`, res);
    }
}

async function deleteAnswer()
{
    console.log("Delete answer");
    const idStr = getAnsID();
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const res = await apiRequest(`/applicant_answer?id=eq.${id}`, "DELETE");
        console.log("Deleted answer", res);
        return;
    }
}

async function editForm()
{
    console.log("Edit form");
    const idStr = getID("Form ID");
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const queryRes = await getForm(id);
        console.log("Current form: ", queryRes);
        const res = await updateForm(id, {
            name: getTextData("Name", queryRes.name),
            description: getTextData("Description", queryRes.description)
        });
        console.log("Updated form:", res);
        return;
    }
}

async function editQuestion()
{
    console.log("Edit question");
    const idStr = getQID();
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const queryRes = await getQuestion(id).then(r => r[0]);
        console.log("Current question: ", queryRes);
        const res = await updateQuestion(id, {
            question: getQText(queryRes.question),
            difficulty: getDifficulty(queryRes.difficulty)
        });
        console.log("Updated question:", res);
        return;
    }
}

async function editApplicant()
{
    console.log("Edit applicant");
    const idStr = getAppID();
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const queryRes = await getApplicant(id).then(r => r[0]);
        console.log("Current applicant: ", queryRes);
        const res = await updateApplicant(id, {
            title: getAppTitle(queryRes.title),
            firstname: getAppFstName(queryRes.firstname),
            surname: getAppLstName(queryRes.surname),
            phone_number: getPhNumber(queryRes.phone_number),
            email_address: getEmail(queryRes.email_address),
            interview_status: getAppIntStatus(queryRes.interview_status)
        });
        console.log("Updated question:", res);
        return;
    }
}

function getCmd()
{
    const cmd = prompt("Tool> ", "h");
    return cmd;
}

function getHelp()
{
    return "'h'  - list all available commands\n" +
           "'cf' - create new form\n" +
           "'cc' - create new field/column for a form\n" +
           "'cr' - create new record for a form\n" +
           "'ef' - edit a form\n" +
           "'ec' - edit a field/column\n" +
           "'er' - edit a record\n" +
           "'nf' - get the number of forms\n" +
           "'nc' - get the number of fields/columns for a form\n" +
           "'nr' - get the number of records for a form\n" +
           "'lf' - list all forms in database\n" +
           "'lc' - list all fields/columns for a form\n" +
           "'lr' - list all records for a form\n" +
           "'df' - delete form\n" +
           "'dc' - delete a field/column\n" +
           "'dr' - delete a record\n" +
           "'q'  - quit API Tool";
}

/**
 * Main function to demonstrate API usage.
 * 
 * REPL to do basic CRUD and administrative functions.
 */
async function main()
{
    try {
        while (true) {
            switch (getCmd()) {
                case "h":
                    console.log(getHelp());
                    break;
                case "cf":
                    await makeForm();
                    break;
                case "ef":
                    await editForm();
                    break;
                case "lf":
                    await listForms();
                    break;
                case "df":
                    await deleteForm();
                    break;
                case "cc":
                case "cr":
                case "ec":
                case "er":
                case "nf":
                case "nc":
                case "nr":
                case "lc":
                case "lr":
                case "dc":
                case "dr":
                    console.log("TODO: implement this command");
                    break;
                case "q":
                    console.log("Bye");
                    return;
                default:
                    console.log("Unrecognised command");
                    break;
            }
        }
    }
    catch (error) {
        console.error('Error:', error.message); // Log any errors that occur
    }
}

// Execute the main function
console.log("API Tool");
console.log("(type 'h' or hit enter for list of commands)")
main();
