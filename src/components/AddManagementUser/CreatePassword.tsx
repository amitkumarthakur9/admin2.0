import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DropdownComponent from "../Dropdowns/NewDropDown";
import RemoteApi from "src/services/RemoteApi";
import { Ionicons } from "@expo/vector-icons";

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must be at most 16 characters")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required("Confirm Password is required"),
    assignedRole: Yup.number().required("Role Assign is required"),
});

const dummyRolesOptions = [
    { label: "RelationShip Manager", value: "1" },
    { label: "Operation Manager", value: "2" },
    { label: "Senior Manager", value: "3" },
];

const CreatePassword = ({ onNext, onPrevious, initialValues }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [rolesOptions, setRolesOptions] = useState(dummyRolesOptions);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const handleSubmit = async (values) => {
        const data = {
            name: values.fullName,
            employeeId: values.employeeCode,
            email: values.email,
            mobileNumber: values.mobileNumber,
            password: values.password,
            // passwordConfirm: values.passwordConfirm,
            roleId: values.assignedRole,
        };

        console.log(data);

        try {
            const response = await RemoteApi.post(
                "onboard/rm",
                data
            );
            // const response = {
            //     code: 200,
            // };
            if (response.code === 200) {
                onNext(values);
            } else {
                Alert.alert(
                    "Error",
                    response.message || "Failed to submit the address"
                );
            }
        } catch (error) {
            Alert.alert(
                "Error",
                error.message ||
                    "An error occurred while submitting the address"
            );
        }
    };

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        );
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
                isValid,
            }) => (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Enter Password{" "}
                            <Text className="text-red-500">*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    value={values.password}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="pl-2"
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off" : "eye"}
                                        size={24}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>
                            {touched.password &&
                                errors.password &&
                                typeof errors.password === "string" && (
                                    <Text style={styles.error}>
                                        {errors.password}
                                    </Text>
                                )}
                            <Text style={styles.helperText}>
                                Password must be 8-16 characters long, include letters, numbers, and at least one special character.
                            </Text>
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Confirm Password{" "}
                            <Text className="text-red-500">*</Text></Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("passwordConfirm")}
                                    onBlur={handleBlur("passwordConfirm")}
                                    value={values.passwordConfirm}
                                    secureTextEntry={!showPasswordConfirm}
                                />
                                <TouchableOpacity
                                 className="pl-2"
                                    onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                >
                                    <Ionicons
                                        name={showPasswordConfirm ? "eye-off" : "eye"}
                                        size={24}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>
                            {touched.passwordConfirm &&
                                errors.passwordConfirm &&
                                typeof errors.passwordConfirm === "string" && (
                                    <Text style={styles.error}>
                                        {errors.passwordConfirm}
                                    </Text>
                                )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Assign Role{" "}
                            <Text className="text-red-500">*</Text></Text>
                            <DropdownComponent
                                label="select role"
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
                                    {"Submit"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            )}
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
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
        paddingRight: 10,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    error: {
        fontSize: 12,
        color: "red",
        marginTop: 5,
    },
    helperText: {
        fontSize: 12,
        color: "#666",
        marginTop: 5,
    },
    back: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
    proceed: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#0066cc",
    },
    buttonText: {
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default CreatePassword;
