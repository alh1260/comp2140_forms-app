import {Tabs} from "expo-router";
import {DrawerToggleButton} from "@react-navigation/drawer";
import {Icon} from "react-native-paper";

function FormViewLayout()
{
    return (
        <Tabs screenOptions={{headerLeft: () => (<DrawerToggleButton />)}}>
            <Tabs.Screen
             name="form"
             options={
                    {
                        title: "Form",
                        tabBarIcon: (opts) => (
                                <Icon
                                 source="home-outline"
                                 color={opts.color}
                                 size={opts.size} />)
                    }} />
            <Tabs.Screen
             name="records"
             options={
                    {
                        title: "Records",
                        tabBarIcon: (opts) => (
                                <Icon
                                 source="file-document-outline"
                                 color={opts.color}
                                 size={opts.size} />)
                    }} />
        </Tabs>
    );
}

export {FormViewLayout as default};
