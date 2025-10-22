import {useCallback, useState} from "react";
import {ActivityIndicator, ScrollView, View} from "react-native";
import {Button, HelperText, Text, TextInput} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {apiRequest} from "../../../../../api/crud.js";


function FormInput(props)
{
    let formInput;
    switch (props.field.field_type) {
        case "text":
            formInput = (
                <TextInput
                 mode="outlined"
                 label={props.field.name}
                 value={props.value}
                 onChangeText={props.setterFn} />
            );
            break;
        case "mulitline":
            formInput = (
                <TextInput
                 mode="outlined"
                 label={props.field.name}
                 value={props.value}
                 onChangeText={props.setterFn}
                 multiline />
            );
            break;
        case "dropdown":
            formInput = (
                <Picker
                 selectedValue={props.value}
                 onValueChange={(val, idx) => props.setterFn(val)}>
                    {props.field.options.nameofdropdown.map((opt, idx) => (
                        <Picker.Item key={`${props.field.id}_${idx}`} label={opt} value={opt} />
                    ))}
                </Picker>
            );
            break;
        case "location":
        default:
            formInput = (<Text>Unsupported input type</Text>);
    }

    return (
        <>
            {formInput}
        </>
    );
}

function ViewForm()
{
    const {id} = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [fields, setFields] = useState([]);
    const [fetchErr, setFetchErr] = useState(false);
    const [subErr, setSubErr] = useState(false);
    const [rec, setRec] = useState({});
    const [savingRec, setSavingRec] = useState(false);

    const getFields = async function()
    {
        try {
            const res = await apiRequest(`/field?form_id=eq.${id}`).then(r => r.json());
            setFields(res);
        }
        catch (error) {
            console.log("Error fetching form data from 'viewform/[id]/form.jsx': ");
            console.log(error);
            setFetchErr(true);
        }
        finally {
            setLoading(false);
        }
    };

    const submitRecord = async function()
    {
        try {
            setSavingRec(true);
            if (subErr) {
                setSubErr(false);
            }
            await apiRequest("/record", "POST", {form_id: id, values: rec});
        }
        catch (error) {
            console.log("Error submitting record from 'viewform/[id]/form.jsx'");
            console.log(error);
            setSubErr(true);
        }
        finally {
            setSavingRec(false);
        }
    };

    useFocusEffect(useCallback(
            () => {
                getFields();
                return () => {setLoading(true); setSubErr(false);};
            }, []));

    return (
        <View>
            {loading ?
                (<ActivityIndicator />):
                (fetchErr ? 
                    <Text>Oops! Something went wrong.</Text> :
                    <ScrollView>
                        {fields.map(fld => (
                            <FormInput
                             key={fld.id}
                             field={fld}
                             value={rec[fld.name] ?? ""}
                             setterFn={val => setRec({...rec, [fld.name]: val})} />
                        ))}
                        <Button
                         mode="contained"
                         icon="content-save-outline"
                         disabled={savingRec}
                         onPress={() => submitRecord()}>
                            {savingRec ? (<ActivityIndicator />) : <Text>Add Record</Text>}
                        </Button>
                        <HelperText type="error" visible={subErr}>There was an error submitting the record</HelperText>
                    </ScrollView>)}
        </View>
    );
}

export {ViewForm as default};
