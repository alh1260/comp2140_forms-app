import {Button, Card, Text} from "react-native-paper";
import {View} from "react-native";

function FormListItemCard({title, description})
{
    return (
        <Card>
            <Card.Title title={title} />
            <Card.Content>
                <Text>{description}</Text>
                    
            </Card.Content>
            <Card.Actions>
                <Button icon="eye-outline" mode="contained" buttonColor="#00F" compact="true">View</Button>
	        <Button icon="file-document-edit-outline" mode="outlined" compact="true">Edit</Button>
                <Button icon="delete" mode="contained" buttonColor="#F00" compact="true">Delete</Button>
            </Card.Actions>
        </Card>
    );
}

export default FormListItemCard;
