import {
    ScrollView,
} from "react-native";
import Assitant from "../../../src/components/AiAssitant/Assitant";
import MainComponent from "src/components/DsaForm/MainComponent";

export default function DsaFormScreen() {

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >            
         <MainComponent />
        </ScrollView>
    );
}