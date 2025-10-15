import {Text, View} from "react-native";
import {Text as RNPText} from "react-native-paper";

function Index()
{
    return (
        <View
         style={{
             flex: 1,
             justifyContent: "center",
             alignItems: "center"
         }}>
            <RNPText variant="titleLarge">Welcome to FormBase!</RNPText>
            <Text>TODO: Put in some graphics on the home screen</Text>
        </View>
    );
}

export {Index as default};
