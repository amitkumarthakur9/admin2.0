import {
    Platform,
    ScrollView,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import GoogleContactInvite from "../../src/components/SendInvite/GoogleContactInvite";

export default function SendInvite() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <GoogleContactInvite />
        </ScrollView>
    );
}