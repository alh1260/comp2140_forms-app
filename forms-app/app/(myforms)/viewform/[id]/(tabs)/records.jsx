import {useCallback, useState} from "react";
import {useFocusEffect, useRouter, useGlobalSearchParams} from "expo-router";
import {ActivityIndicator, View} from "react-native";
import {Text} from "react-native-paper";
import RecordListItemCard from "../../../../../components/RecordListItemCard";
import {apiRequest} from "../../../../../api/crud.js";

function Records()
{
    const {id} = useGlobalSearchParams();
    const router = useRouter();
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fields, setFields] = useState({});
    const [err, setErr] = useState(false);

    const getRecords = async function()
    {
        try {
            const res = await apiRequest(`/record?form_id=eq.${id}`).then(r => r.json());
            setRecs(res);
        }
        catch (error) {
            console.log("Error fetching form data from 'viewform/[id]/records.jsx': ");
            console.log(error);
            setErr(true);
        }
        finally {
            setLoading(false);
        }
    };

    const getFields = async function()
    {
        try {
            const res = await apiRequest(`/field?form_id=eq.${id}`).then(r => r.json());
            const resArr = Array.from(res).sort((a, b) => a.order_index - b.order_index);
            setFields(resArr);
        }
        catch (error) {
            console.log("Error fetching fields from 'viewform/[id]/records.jsx': ");
            console.log(error);
            setErr(true);
        }
        finally {
            setLoading(false);
        }
    };

    const deleteRecord = async function(recId)
    {
        try {
            const res = await apiRequest(`/record?id=eq.${recId}`, "DELETE");
            setLoading(true);
            await getRecords();
        }
        catch (error) {
            console.log("Error deleting record from 'viewform/[id]/records.jsx':");
            console.log(error);
            setErr(true);
        }
    };

    useFocusEffect(useCallback(
            () => {
                getFields();
                getRecords();
                return () => {setLoading(true);};
            }, []));

    return (
        <View>
            {loading ?
                (<ActivityIndicator />) :
                (err ?
                    <Text>Oops! Something went wrong</Text> :
                    (recs.map(rec => (
                        <RecordListItemCard
                         key={rec.id}
                         record={rec}
                         fieldData={fields}
                         deleteAction={() => deleteRecord(rec.id)}/>
                    ))))}
        </View>
    );
}

export {Records as default};
