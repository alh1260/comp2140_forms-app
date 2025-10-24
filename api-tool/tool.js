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

const range = (i) => Array.from(Array(i).keys());

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

async function createField(field)
{
    const res = await apiRequest("/field", "POST", field);
    return res.json();
}

async function updateField(id, field)
{
    const res = await apiRequest(`/field?id=eq.${id}`, "PATCH", field);
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
    return (res === "true" || res === true);
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

function makeEditFieldHelper(curField)
{
    const getFieldType = function(defVal)
    {
        const curOpt = ((d) => {
            switch (d) {
		case "multiline":
                    return '2';
		case "dropdown":
                    return '3';
		case "location":
                    return '4';
		case "text":
                default:
                    return '1';
            }
        })(defVal);
        const typePrompt = "Field data type:\n" +
                "1 - text\n" +
                "2 - multiline\n" +
                "3 - dropdown\n" +
                "4 - location\n" +
                "5 - image";
	console.log(typePrompt);
	const opt = prompt(`selection? (default ${curOpt}) `, curOpt);
        switch(opt) {
            case '2':
                return "multiline";
            case '3':
                return "dropdown";
            case '4':
                return "location";
            case '5':
                return "image";
            case '1':
            default:
                return "text";
        }
    };
    const getDDOptions = function()
    {
        console.log("Creating dropdown.");
        const numOpts = getIntData("How many options? ", "1");
        const dropDowns = range(numOpts).map((e) => getTextData(`Option ${e}? `, `${e}`));
	return dropDowns;
    };
    if (!curField) { // creating new field
        const nuName = getTextData("Field name", "Foo");
        const nuType = getFieldType("text");
        const nuOpts = (nuType === "dropdown") ? {"nameofdropdown": getDDOptions()} : null;
        const isReqd = getBoolData("Required field [true | false]?", true);
        const isNum = getBoolData("Is numeric [true | false]?", false);
        const ordIdx = getIntData("Order index", 1);
	//const nuFld =
        return {
            name: nuName,
            field_type: nuType,
            options: nuOpts,
            required: isReqd,
            is_num: isNum,
            order_index: ordIdx
        };
        //return (!nuOpts) ? nuFld : {...nuFld, options: nuOpts};
    }
    else { // editing
        const nuName = getTextData("Field name", curField.name);
        const nuType = getFieldType(curField.field_type);
        const nuOpts = (nuType === "dropdown") ? {"nameofdropdown": getDDOptions()} : null;
        const isReqd = getBoolData("Required field [true | false]?", curField.required);
        const isNum = getBoolData("Is numeric [true | false]?", curField.is_num);
        const ordIdx = getIntData("Order index", curField.order_index);
        return {
            name: nuName,
            field_type: nuType,
            options: nuOpts,
            required: isReqd,
            is_num: isNum,
            order_index: ordIdx
        };
        //return (!nuOpts) ? nuFld : {...nuFld, options: nuOpts};
    }
}

async function makeField()
{
    console.log("Create new field");
    const fIdStr = getID("Form ID");
    if (fIdStr === "") {
        console.log("No interview ID specified");
        return;
    }
    else {
        const fId = Number(fIdStr);
	const nuField = makeEditFieldHelper(null);
        const res = await createField({
            form_id: fId,
            ...nuField
        });
        console.log("Created Field: ", res);
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

async function deleteField()
{
    console.log("Delete field");
    const idStr = getID("Field ID");
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const res = await apiRequest(`/field?id=eq.${id}`, "DELETE");
        console.log("Deleted field", res);
        return;
    }
}

async function deleteRecord()
{
    console.log("Delete record");
    const idStr = getID("Record Id");
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const res = await apiRequest(`/record?id=eq.${id}`, "DELETE");
        console.log("Deleted record", res);
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

async function getFields(fId)
{
    const res = await apiRequest(`/field?form_id=eq.${fId}`);
    return res.json();
}

async function getField(id)
{
    const res = await apiRequest(`/field?id=eq.${id}`);
    return res.json().then(r => r[0]);
}

async function getFieldCount()
{
    const fIdStr = getID("Form ID");
    if (fIdStr === "") {
        console.log("No Form ID specified");
        return;
    }
    else {
        const fId = Number(fIdStr);
        const res = await apiRequest(`/field?form_id=eq.${fId}&limit=0`);
        console.log("Result: ", res.headers.get("content-range").replace(/\*\//, ""));
    }
}

async function listFields()
{
    console.log("List fields");
    const fIdStr = getID("Form ID");
    if (fIdStr === "") {
        console.log("No Form ID specified");
        return;
    }
    else {
        const fId = Number(fIdStr);
        const res = await getFields(fId);
        console.log(`Fields for form ${fId}:`);
	console.dir(res, {depth: 5});
    }
}

async function getRecords(fId)
{
    const res = await apiRequest(`/record?form_id=eq.${fId}`);
    return res.json();
}

async function getRecord(id)
{
    const res = await apiRequest(`/record?id=eq.${id}`);
    return res.json().then(r => r[0]);
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

async function listRecords()
{
    console.log("List records");
    const fIdStr = getID("Form ID");
    if (fIdStr === "") {
        console.log("No Form ID specified");
        return;
    }
    else {
        const fId = Number(fIdStr);
        const res = await getRecords(fId);
        console.log(`Records for form ${fId}:`);
	console.dir(res, {depth: 5});
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

async function editField()
{
    console.log("Edit field");
    const idStr = getID("Field ID");
    if (idStr === "") {
        console.log("No ID specified");
        return;
    }
    else {
        const id = Number(idStr);
        const queryRes = await getField(id);
        console.log("Current field: ", queryRes);
        const res = await updateField(id, makeEditFieldHelper(queryRes));
        console.log("Updated field:", res);
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
                case "cc":
                    await makeField();
                    break;
                case "ef":
                    await editForm();
                    break;
                case "ec":
                    await editField();
                    break;
                case "lf":
                    await listForms();
                    break;
                case "lc":
                    await listFields();
                    break;
                case "lr":
                    await listRecords();
                    break;
                case "df":
                    await deleteForm();
                    break;
                case "dc":
                    await deleteField();
                    break;
                case "dr":
                    await deleteRecord();
                    break;
                case "cr":
                case "er":
                case "nf":
                case "nc":
                case "nr":
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
