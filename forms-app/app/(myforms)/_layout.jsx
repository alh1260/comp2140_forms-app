import {Stack} from "expo-router";
import {DrawerToggleButton} from "@react-navigation/drawer";

function FormsLayout()
{
    return (
        <Stack screenOptions={{headerLeft: () => (<DrawerToggleButton />)}}>
            <Stack.Screen name="myforms" options={{title: "My Forms"}} />
            <Stack.Screen name="addform" options={{title: "Add Form"}} />
            <Stack.Screen name="editform/[id]" options={{title: "Edit Form"}} />
        </Stack>
    );
}

export {FormsLayout as default};
