import {useState, useEffect} from "react";
import {ActivityIndicator, View, ScrollView} from "react-native";
import {Text, Card} from "react-native-paper";
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

    useEffect(() => {getForms();}, []);

    return (
        <View>
            {loading ?
                    (<ActivityIndicator />) :
                    (errState ?
                            (<ItemErrorCard />) :
                            (<ScrollView>
                                {data.map(frm => (
                                    <FormListItemCard key={frm.id} title={frm.name} description={frm.description} />
                                ))}
                            </ScrollView>) 
                    )}
        </View>
    );
}

export {MyForms as default};
