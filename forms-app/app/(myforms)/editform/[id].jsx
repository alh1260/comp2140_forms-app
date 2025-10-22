import {useCallback, useState} from "react";
import {ActivityIndicator} from "react-native";
import {useLocalSearchParams, useFocusEffect} from "expo-router";
import {Text} from "react-native-paper";
import AddEditForm from "../../../components/AddEditForm";
import {apiRequest} from "../../../api/crud.js";

function EditForm()
{
    const {id} = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [err, setErr] = useState(false);
    const getForm = async function()
    {
        try {
            const res = await apiRequest(`/form?id=eq.${id}`).then(r => r.json()).then(r => r[0]);
            setData(res);
        }
        catch (error) {
            console.log("Error fetching form data from 'editform/[id].jsx':");
            console.log(error);
            setErr(true);
        }
        finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(
            () => {
                getForm();
                return () => {setLoading(true);};
            }, []));

    return (
        <>
            {loading ?
                (<ActivityIndicator />) :
                    (err ?
                        (<Text>Oops! Something went wrong</Text>) :
                        (<AddEditForm intId={id} name={data.name} description={data.description} />))}
        </>
    );
}

export {EditForm as default};
