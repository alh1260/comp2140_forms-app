import {useState, useCallback} from "react";
import {useRouter, useFocusEffect} from "expo-router";
import {ActivityIndicator, View, ScrollView} from "react-native";
import {Button, Card, Text} from "react-native-paper";
import FormListItemCard from "../../components/FormListItemCard";
import {apiRequest} from "../../api/crud.js";

function ItemErrorCard()
{
    return (
        <Card>
            <Card.Content>
                <Text variant="bodyMedium">Oops! Something went wrong</Text>
            </Card.Content>
        </Card>
    );
}

function MyForms()
{
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [errState, setErrState] = useState(false);

    const getForms = async function()
    {
        try {
            const res = await apiRequest("/form").then(r => r.json());
	    setData(res);
        }
        catch (err) {
            setErrState(true);
        } 
        finally {
            setLoading(false);
        }
    };

    const deleteForm = async function(formId)
    {
        try {
            const res = await apiRequest(`/form?id=eq.${formId}`, "DELETE");
            router.replace("myforms");
        }
        catch (err) {
            setErrState(true);
        }
    };

    useFocusEffect(useCallback(
            () => {
                getForms();
                return () => {setLoading(true);};
            }, []));

    return (
        <View>
            <Button
             mode="contained"
             icon="plus"
             onPress={() => router.push("addform")}>Add Form</Button>
            {loading ?
                    (<ActivityIndicator />) :
                    (errState ?
                            (<ItemErrorCard />) :
                            (<ScrollView>
                                {data.map(frm => (
                                    <FormListItemCard
                                     key={frm.id}
                                     title={frm.name}
                                     description={frm.description}
                                     deleteAction={() => deleteForm(frm.id)}/>
                                ))}
                            </ScrollView>) 
                    )}
        </View>
    );
}

export {MyForms as default};
