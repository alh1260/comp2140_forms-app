import {Text, View} from "react-native";
import {Text as RNPText, Card} from "react-native-paper";

function About()
{
    return (
        <View
         style={{
             flex: 1,
             justifyContent: "center",
             alignItems: "center"
         }}>
            <RNPText variant="titleLarge">About</RNPText>
            <Text>FormBase is an app that lets you create and fill out forms</Text>
            <Card>
                <Card.Title title="Features" />
                <Card.Content>
                    <Text>- Create and edit forms with a variety of field types</Text>
                    <Text>- Fill out forms on your phone</Text>
                    <Text>- View/search for responses with filters</Text>
                    <Text>- View location data on a map</Text>
                </Card.Content>
            </Card>
        </View>
    );
}

export {About as default};
