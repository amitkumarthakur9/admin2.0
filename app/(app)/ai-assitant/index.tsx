import {
    ScrollView,
} from "react-native";
import Assitant from "../../../src/components/AiAssitant/Assitant";

export default function AssitantScreen() {

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >            
         <Assitant />
        </ScrollView>
    );
}