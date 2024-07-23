import {
    ScrollView,
} from "react-native";

import DistributorUserForm from "src/components/AddDistributor/DistributorUserForm";

export default function AddDistributorUserForm() {
    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            {/* <AddRMUser /> */}
            <DistributorUserForm />
        </ScrollView>
    );
}