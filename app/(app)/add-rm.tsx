import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import AddUser from "../../src/components/AddIFA/AddUser";
import AddIFA from "../../src/components/AddIFA/AddUser";
import AddRMUser from "../../src/components/AddIFA/AddRM";

export default function AddRMUserForm() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <AddRMUser />
        </ScrollView>
    );
}