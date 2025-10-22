import {useCallback, useState} from "react";
import {ActivityIndicator, ScrollView, View} from "react-native";
import {Text, TextInput} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import {useFocusEffect, useLocalSearchParams} from "expo-router";
import {apiRequest} from "../../../../../api/crud.js";

/*
 * Idea on how to deal with record state:
 *
 * set it as an Object, I.e.
 *     const [rec, setRec] = useState({});
 * 
 * then to update the state, we use Object.defineProperty
 *     setRec(Object.defineProperty({...rec}, prop, {
 *                         value: <new value>,
 *                         writable: true,
 *                         enumerable: true,
 *                         configurable: true
 *                     }));
 */

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
    const [err, setErr] = useState(false);
    const [rec, setRec] = useState({});

    const getFields = async function()
    {
        try{
            const res = await apiRequest(`/field?form_id=eq.${id}`).then(r => r.json());
            setFields(res);
        }
        catch (error) {
            console.log("Error fetching form data from 'viewform/[id]/form.jsx': ");
            console.log(error);
            setErr(true);
        }
        finally {
            setLoading(false);
	}
    };

    useFocusEffect(useCallback(
            () => {
                getFields();
                return () => {setLoading(true);};
            }, []));

    return (
        <View>
            <Text>TODO: Put the forms view here!</Text>
            {loading ?
            (<ActivityIndicator />):
                (err ? 
                <Text>Oops! Something went wrong.</Text> :
                <ScrollView>
                    {fields.map(fld => (
                        <FormInput
                         key={fld.id}
                         field={fld}
                         value={rec[fld.name] ?? ""}
                         setterFn={val => setRec({...rec, [fld.name]: val})} />
                    ))}
                </ScrollView>)}
        </View>
    );
}

export {ViewForm as default};
