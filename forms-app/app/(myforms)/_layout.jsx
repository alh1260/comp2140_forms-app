import {Stack} from "expo-router";
import {DrawerToggleButton} from "@react-navigation/drawer";

function FormsLayout()
{
    return (
        <Stack 
         screenOptions={
                {
                    headerLeft: () => (<DrawerToggleButton />),
                    headerShown: false
                }}>
            <Stack.Screen
             name="myforms"
             options={
                    {
                        title: "My Forms",
                        headerShown: true
                    }} />
            <Stack.Screen
             name="addform"
             options={
                    {
                        title: "Add Form",
                        headerShown: true
                    }} />
            <Stack.Screen
             name="editform/[id]"
             options={
                    {
                        title: "Edit Form",
                        headerShown: true
                    }} />
        </Stack>
    );
}

export {FormsLayout as default};
