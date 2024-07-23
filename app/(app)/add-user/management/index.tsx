import {
    ScrollView,
} from "react-native";

import ManagementUserForm from "src/components/AddManagementUser/ManagementUserForm";

export default function AddManagementUserForm() {
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
            <ManagementUserForm />
        </ScrollView>
    );
}