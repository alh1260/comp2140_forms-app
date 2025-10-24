import {Button, Card, Text} from "react-native-paper";
import {View} from "react-native";
import * as Clipboard from "expo-clipboard";

function RecordListItemCard({record, fieldData, deleteAction})
{
    const prettyPrintRecordData = function(data, fieldData)
    {
        switch (fieldData.field_type) {
            case "location":
                return (<Text variant="bodyMedium">{JSON.stringify(data)}</Text>);
	    case "text":
            case "multiline":
            case "dropdown":
            default:
                return (<Text variant="bodyMedium">{data}</Text>)
        }
    };

    const copyToClipboard = async function()
    {
        await Clipboard.setStringAsync(JSON.stringify(record.values));
    };

    return (
        <Card>
            <Card.Content>
                {Object.entries(record.values).map((ent, idx) => (
                    <View key={`${record.id}_${idx}`} style={{flexDirection: "row"}}>
                        <Text variant="labelLarge">{ent[0]}:</Text>
                        {prettyPrintRecordData(ent[1],
                                (fieldData.filter(e => e.name === ent[0]))[0])}
                    </View>
                ))}
            </Card.Content>
            <Card.Actions>
                <Button
                 icon="file-document-edit-outline"
                 mode="outlined"
                 compact="true"
                 onPress={copyToClipboard}>
                    Copy
                </Button>
                <Button
                 icon="delete"
                 mode="contained"
                 buttonColor="#F00"
                 compact="true"
                 onPress={deleteAction}>
                    Delete
                </Button>
            </Card.Actions>
        </Card>
    );
}

export default RecordListItemCard;
