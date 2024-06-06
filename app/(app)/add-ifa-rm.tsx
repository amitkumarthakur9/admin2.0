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

export default function AddIfaRm() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <AddUser />
            {/* <AddIFA /> */}
        </ScrollView>
    );
}