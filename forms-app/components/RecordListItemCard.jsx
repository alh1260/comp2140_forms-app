import {Button, Card, Text} from "react-native-paper";
import {View} from "react-native";

function RecordListItemCard({record, deleteAction})
{
    return (
        <Card>
            <Card.Content>
                {Object.entries(record.values).map((ent, idx) => (
                    <View key={`${record.id}_${idx}`} style={{flexDirection: "row"}}>
                        <Text variant="labelLarge">{ent[0]}:</Text>
                        <Text variant="bodyMedium">{ent[1]}</Text>
                    </View>
                ))}
            </Card.Content>
            <Card.Actions>
                <Button
                 icon="file-document-edit-outline"
                 mode="outlined"
                 compact="true">
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
