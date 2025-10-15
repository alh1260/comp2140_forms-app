import {Text, View} from "react-native";
import {Text as RNPText} from "react-native-paper";

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
            <Text>An example forms app</Text>
        </View>
    );
}

export {About as default};
