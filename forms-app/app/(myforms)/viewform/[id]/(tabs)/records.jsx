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

    const deleteRecord = async function(recId)
    {
	try {
            const res = await apiRequest(`/record?id=eq.${recId}`, "DELETE");
            router.replace(`/viewform/${id}/records`);
        }
        catch (error) {
            console.log("Error deleting record from 'viewform/[id]/records.jsx':");
            console.log(error);
            setErr(true);
        }
    };

    useFocusEffect(useCallback(
            () => {
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
                         deleteAction={() => deleteRecord(rec.id)}/>
                    ))))}
        </View>
    );
}

export {Records as default};
