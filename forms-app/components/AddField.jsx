import {useState} from "react";
import {View} from "react-native";
import {Button, Card, Switch, Text, TextInput} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";

function AddField()
{
    const [isCreating, setIsCreating] = useState(false);
    const [fldName, setFldName] = useState("");
    const [fldType, setFldType] = useState("text");
    const [reqField, setReqField] = useState(false);
    const [numField, setNumField] = useState(false);

    return (
        <Card>
            <Card.Content>
                {isCreating ? 
                        (<>
                             <Button
                              mode="outlined"
                              textColor="#F00"
                              onPress={() => setIsCreating(false)}>
                                 Cancel
                             </Button>
                             <Card>
                                 <Card.Title title="Add a Field" />
                                 <Card.Content>
                                     <TextInput
                                      mode="outlined"
                                      label="Field Name"
                                      placeholder="Enter a name"
                                      value={fldName}
                                      onChangeText={txt => setFldName(txt)} />
                                     <Picker
                                      selectedValue={fldType}
                                      style={{backgroundColor: "#FFFBFE"}}
                                      onValueChange={(val, idx) => setFldType(val)}>
                                         <Picker.Item label="Text" value="text" />
                                         <Picker.Item label="Multi-line Text" value="multiline" />
                                         <Picker.Item label="Drop-down" value="dropdown" />
                                     </Picker>
                                     <View style={
                                             {
                                                 flexDirection: "row",
                                                 alignItems: "center",
                                                 justifyContent: 'space-between'
                                             }}>
                                         <Text variant="bodyLarge">Required field</Text>
                                         <Switch value={reqField} onValueChange={() => setReqField(!reqField)} />
                                     </View>
                                     <View style={
                                             {
                                                 flexDirection: "row",
                                                 alignItems: "center",
                                                 justifyContent: 'space-between'
                                             }}>
                                         <Text variant="bodyLarge">Stores numeric values</Text>
                                         <Switch value={numField} onValueChange={() => setNumField(!numField)} />
                                     </View>
                                     <Button mode="contained" icon="plus">Save Field</Button>
                                 </Card.Content>
                             </Card>
                         </>) :
                        (<Button
                          mode="outlined"
                          icon="plus"
                          onPress={() => setIsCreating(true)}>
                             Add Field
                         </Button>)
                        }
            </Card.Content>
        </Card>
    );
}

export default AddField;

