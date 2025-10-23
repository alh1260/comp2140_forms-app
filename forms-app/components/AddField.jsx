import {useState} from "react";
import {View} from "react-native";
import {Button, Card, IconButton, Switch, Text, TextInput} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import {apiRequest} from "../api/crud.js";

function AddField({fId, orderIndex, onSubmit})
{
    const [isCreating, setIsCreating] = useState(false);
    const [fldName, setFldName] = useState("");
    const [fldType, setFldType] = useState("text");
    const [ddOpts, setDDOpts] = useState([]);
    const [ddName, setDDName] = useState("");
    const [reqField, setReqField] = useState(false);
    const [numField, setNumField] = useState(false);
    const [err, setErr] = useState(false);

    const submitField = async function()
    {
        try {
            if (err) {
                setErr(false);
            }
	    const opts = (fldType === "dropdown") ? {"nameofdropdown": ddOpts} : null;
            await apiRequest("/field", "POST",
                    {
                        form_id: fId,
                        name: fldName,
                        field_type: fldType,
			options: opts,
                        required: reqField,
                        is_num: numField,
                        order_index: orderIndex
                    });
            onSubmit();
        }
        catch (error) {
            console.log("Error submitting data from 'AddField.jsx':");
            console.log(error);
            setErr(true);
        }
    };

    const resetField = function()
    {
	setFldName("");
        setFldType("text");
        setDDOpts([]);
        setReqField(false);
        setNumField(false);
    };

    return (
        <Card>
            <Card.Content>
                {isCreating ? 
                        (<>
                             <Button
                              mode="outlined"
                              textColor="#F00"
                              onPress={() => {resetField(); setIsCreating(false);}}>
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
                                     {(fldType === "dropdown") &&
                                             (<View>
                                                  <Text variant="titleMedium">Add Drop-down Option</Text>
                                                  <TextInput
                                                   mode="outlined"
                                                   label="Option name"
                                                   onChangeText={txt => setDDName(txt)}/>
                                                  <IconButton
                                                   icon="plus"
                                                   onPress={() => setDDOpts([...ddOpts, ddName])} />
                                                  <Text variant="titleMedium">Drop-down Options:</Text>
                                                  {ddOpts.map((opt, idx) => (
                                                      <View
                                                       key={`dd_${idx}`}
                                                       style={{flexDirection:"row"}}>
                                                          <Text variant="labelLarge">{`${idx}`}</Text>
                                                          <Text variant="bodyMedium">{opt}</Text>
                                                      </View>
                                                  ))}
                                              </View>)}
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
                                     <Button mode="contained" icon="plus" onPress={() => submitField()}>Save Field</Button>
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

