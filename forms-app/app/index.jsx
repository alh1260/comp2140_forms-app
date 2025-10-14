import {Text, View} from "react-native";

function Index()
{
    return (
        <View
         style={{
             flex: 1,
             justifyContent: "center",
             alignItems: "center"
         }}>
            <Text>Welcome to FormBase!</Text>
            <Text>TODO: Put in some graphics on the home screen</Text>
        </View>
    );
}

export {Index as default};
