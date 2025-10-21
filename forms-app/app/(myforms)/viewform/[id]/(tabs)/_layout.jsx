import {Tabs} from "expo-router";
import {Icon} from "react-native-paper";

function FormViewLayout()
{
    return (
        <Tabs>
            <Tabs.Screen
             name="form"
             options={{
                 title: "Form",
                 tabBarIcon: (opts) => (<Icon source="home-outline" color={opts.color} size={opts.size} />)
             }} />
            <Tabs.Screen
             name="records"
             options={{
                 title: "Records",
                 tabBarIcon: (opts) => (<Icon source="file-document-outline" color={opts.color} size={opts.size} />)
             }} />
        </Tabs>
    );
}

export {FormViewLayout as default};
