import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import RemoteApi from "src/services/RemoteApi";
import CustomRadioButton from "../CustomForm/CustomRadioButton/CustomRadioButton";
import CalendarSinglePicker from "../CustomDatePicker/CalendarSinglePicker";
import DropdownComponent from "../Dropdowns/NewDropDown";

const panRegex = /^([A-Z]){3}([ABCFGHJLPT])([A-Z]){1}([0-9]){4}([A-Z]){1}?$/;

const validationSchema = Yup.object().shape({
    arnNumber: Yup.string()
        .matches(
            /^\d{1,6}$/,
            "ARN Number must be in the format 'ARN-' followed by up to 6 digits"
        )
        .required("ARN Number is required"),
    euinNumber: Yup.string()
        .matches(
            /^E\d{1,6}$/,
            "EUIN Number must be in the format 'E' followed by up to 6 digits"
        )
        .required("EUIN Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),
    panNumber: Yup.string()
        .required("PAN number is required")
        .matches(panRegex, "Please enter a valid PAN number. Ex: AAAPZ1234C"),
    assignedRole: Yup.string().required("Role Assign is required"),
});
// const dummyRolesOptions = [
//     { label: "RelationShip Manager", value: "1" },
//     { label: "Operation Manager", value: "2" },
//     { label: "Senior Manager", value: "3" },
// ];

const Professional = ({ onNext, initialValues, onPrevious }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [rolesOptions, setRolesOptions] = useState([]);

    const options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
    ];

    async function getRoles() {
        setIsLoading(true);
        try {
            const response = await RemoteApi.get("user/juniorManagementUser");
            if (response.message === "Success") {
                setRolesOptions(
                    response.data.map((status) => ({
                        label: status.name,
                        value: status.id,
                    }))
                );

                setIsLoading(false);
            } else {
                Alert.alert("Error", "Failed to fetch marital status list");
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while fetching the marital status list"
            );
        }
    }

    React.useEffect(() => {
        getRoles();
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                setIsLoading(true);
                onNext(values);
                setIsLoading(false);
            }}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
                setValues,
            }) => {
                if (isLoading) {
                    return (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0066cc" />
                        </View>
                    );
                }

                return (
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter ARN Number{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="flex flex-row items-center justify-center">
                                        <View className="p-[10px] bg-gray-100 border-gray-300 border-l border-t border-b rounded-l">
                                            <Text style={styles.prefix}>
                                                ARN-
                                            </Text>
                                        </View>
                                        <TextInput
                                            style={styles.inputArn}
                                            onChangeText={handleChange(
                                                "arnNumber"
                                            )}
                                            onBlur={handleBlur("arnNumber")}
                                            value={values.arnNumber}
                                        />
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        {touched.arnNumber &&
                                            errors.arnNumber &&
                                            typeof errors.arnNumber ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.arnNumber}
                                                </Text>
                                            )}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter EUIN Number{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "euinNumber"
                                        )}
                                        onBlur={handleBlur("euinNumber")}
                                        value={values.euinNumber}
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.euinNumber &&
                                            errors.euinNumber &&
                                            typeof errors.euinNumber ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.euinNumber}
                                                </Text>
                                            )}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Assign Relationship Manager{" "}
                                <Text className="text-red-500">*</Text></Text>
                                <DropdownComponent
                                    label="Select Relationship Manager"
                                    data={rolesOptions}
                                    value={values.assignedRole}
                                    setValue={(value) =>
                                        setFieldValue("assignedRole", value)
                                    }
                                    containerStyle={styles.dropdown}
                                    noIcon={true}
                                />
                                {touched.assignedRole &&
                                    errors.assignedRole &&
                                    typeof errors.assignedRole === "string" && (
                                        <Text style={styles.error}>
                                            {errors.assignedRole}
                                        </Text>
                                    )}
                            </View>
                            <View style={styles.fieldContainer}></View>
                        </View>
                        <View className="flex flex-row justify-center gap-2">
                            <View className="w-3/12">
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.back,
                                        {
                                            borderColor: "#0066cc",
                                            opacity: pressed ? 0.6 : 1,
                                        },
                                    ]}
                                    onPress={onPrevious}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            { color: "#0066cc" },
                                        ]}
                                    >
                                        {"Back"}
                                    </Text>
                                </Pressable>
                            </View>
                            <View className="w-3/12">
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.proceed,
                                        {
                                            borderColor: "#0066cc",
                                            opacity: pressed ? 0.6 : 1,
                                        },
                                    ]}
                                    onPress={() => handleSubmit()}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            { color: "#ffffff" },
                                        ]}
                                    >
                                        {"Proceed"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                );
            }}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#ffffff",
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    fieldContainer: {
        flex: 1,
        marginRight: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        flex: 1, // Make input take full width of its container
    },
    inputArn: {
        // borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderTopRightRadius: 5, // Left side border radius
        borderBottomRightRadius: 5, // Left side border radius
        backgroundColor: "#fff",
        flex: 1, // Make input take full width of its container
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    checkboxLabel: {
        fontSize: 16,
        color: "#333",
    },
    error: {
        fontSize: 12,
        color: "red",
        marginTop: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        // overflow: "hidden",
        flex: 1, // Ensure the input container takes the full width of its parent
    },
    prefixContainer: {
        // borderWidth: 1,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    prefix: {
        color: "#6b7280",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: "#0066cc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: "#0066cc",
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: "#ffffff",
    },
    checkboxBase: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#0066cc",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        color: "#ffffff",
    },
    proceed: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#0066cc",
    },
    back: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
});

export default Professional;
