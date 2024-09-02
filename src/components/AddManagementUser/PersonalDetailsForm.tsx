import React from "react";
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

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const emailRegexRFC5322 =
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/;

const validationSchema = Yup.object().shape({
    fullName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Full Name should contain only alphabets")
        .required("Full Name is required"),
    email: Yup.string()
        .matches(emailRegexRFC5322, "Invalid email address")
        .required("Email is required"),
    mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),
        employeeCode: Yup.string()
        .min(3, "Employee Code must be at least 3 characters long")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
            "Employee Code must contain both letters and numbers"
        )
        .required("Employee Code is required"),
});

const PersonalDetailsForm = ({ onNext, initialValues }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    return (
        <Formik
            initialValues={{
                ...initialValues,
                isArnHolder: false,
                arnNumber: "",
                euinNumber: "",
            }}
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
                                        Enter full name{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("fullName")}
                                        onBlur={handleBlur("fullName")}
                                        value={values.fullName}
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.fullName &&
                                            errors.fullName &&
                                            typeof errors.fullName ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.fullName}
                                                </Text>
                                            )}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter Email{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.email &&
                                            errors.email &&
                                            typeof errors.email ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.email}
                                                </Text>
                                            )}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter Mobile number{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "mobileNumber"
                                        )}
                                        onBlur={handleBlur("mobileNumber")}
                                        value={values.mobileNumber}
                                        maxLength={10} // Restrict input to 10 digits
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.mobileNumber &&
                                            errors.mobileNumber &&
                                            typeof errors.mobileNumber ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.mobileNumber}
                                                </Text>
                                            )}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter Employee Code{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "employeeCode"
                                        )}
                                        onBlur={handleBlur("employeeCode")}
                                        value={values.employeeCode}
                                        maxLength={10} // Restrict input to 10 digits
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.employeeCode &&
                                            errors.employeeCode &&
                                            typeof errors.employeeCode ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.employeeCode}
                                                </Text>
                                            )}
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* <Button
                            title="Proceed"
                            onPress={() => handleSubmit()}
                            color="#0066cc"
                        /> */}
                        <View className="flex flex-row justify-center">
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
        padding: 10,
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
        width: "33%",
    },
});

export default PersonalDetailsForm;
