import {useState} from "react";
import {View} from "react-native";
import {Button, HelperText, TextInput} from "react-native-paper";
import {useRouter} from "expo-router";
import {apiRequest} from "../api/crud.js";

function AddEditForm(props)
{
    const router = useRouter();
    const [formName, setFormName] = useState(props.name);
    const [desc, setDesc] = useState(props.description);
    const [err, setErr] = useState(false);

    const isNameEmpty = function()
    {
        return (formName === "");
    };

    const submitForm = async function()
    {
        try {
            if (err) {
                setErr(false);
            }
            if (isNameEmpty()) {
                return;
            }
	    // TODO: change the endpoint depending whether we're creating a new form or updating,
	    // and the HTTP method
            if (!props.intId) { // should be creating a new form
                await apiRequest("/form", "POST", {name: formName, description: desc});
            }
            else { // update form
                await apiRequest(`/form?id=eq.${props.intId}`, "PATCH", {name: formName, description: desc});
            }
            router.dismissTo("myforms");
        }
        catch (error) {
            console.log("Error submitting data from 'AddEditForm.jsx':");
            console.log(error);
            setErr(true);
        }
    };

    return (
        <View>
            <TextInput
             mode="outlined"
             label="Form name"
             placeholder="Enter a name"
             value={formName}
             onChangeText={txt => setFormName(txt)} />
            <HelperText type="error" visible={isNameEmpty()}>
                Form name is required!
            </HelperText>
            <TextInput
             mode="outlined"
             label="Description"
             placeholder="Enter a description"
             value={desc}
             onChangeText={txt => setDesc(txt)}
             multiline 
             numberOfLines={3} /> 
            <Button
             mode="outlined"
             icon="content-save-outline"
             onPress={() => submitForm()}>
                Save
            </Button>
        </View>
    );
}

export default AddEditForm;
