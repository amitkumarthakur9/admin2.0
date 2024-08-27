import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    // panNumber: Yup.string()
    //     .required("PAN number is required")
    //     .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Please enter a valid PAN number"),
    // dateOfBirth: Yup.date().required("Date of Birth is required"),
    // gender: Yup.string().required("Gender is required"),
    addressLine1: Yup.string().required("Address Line 1 is required"),
    addressLine2: Yup.string().required("Address Line 2 is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string()
        .required("Postal Code is required")
        .matches(/^[0-9]{6}$/, "Please enter a valid Postal Code"),
});

const AddressForm = ({ initialValues, onPrevious, onNext }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (values, actions) => {
        console.log("handleSubmit");
        console.log(values);
        setIsLoading(true);
        try {
            // const response = await RemoteApi.post("/api/submitDetails", values);
            console.log("handleSubmit");
            const response = {
                data: {
                    success: true,
                    mismatchDob: false,
                    panVerified: true,
                    addressMismatch: true,
                    mismatchName: false,
                },
            };
            if (response.data.success) {
                const valuesWithFlag = {
                    ...values,
                    basicDetailSubmitted: true,
                };
                onNext(valuesWithFlag); // Include the submission flag
                // onNext(values)
            } else if (response.data.addressMismatch) {
                console.log("mismatch");
                // if (response.data.addressMismatch) {
                //     const valuesWithFlag = { ...values, basicDetailSubmitted: true };
                //     onNext(valuesWithFlag);
                // }
                if (response.data.mismatchDob) {
                    actions.setFieldError(
                        "dateOfBirth",
                        "Mismatch in Date of Birth."
                    );
                }
                if (!response.data.panVerified) {
                    actions.setFieldError(
                        "panNumber",
                        "PAN number verification failed."
                    );
                }
                if (response.data.mismatchName) {
                    actions.setFieldError(
                        "fullName",
                        "Name does not match records."
                    );
                }
                // onNext(values)
                // setStep(2);
                // setShowAddressForm(true); // Show AddressForm if there is an address mismatch
            } else {
                // actions.setErrors(response.data.errors);
            }
        } catch (error) {
            Alert.alert("Error", "Submission failed. Please try again.");
        }
        setIsLoading(false);
        actions.setSubmitting(false);
    };

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
                isValid,
                isSubmitting,
            }) => (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                PAN Number{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                onChangeText={handleChange("panNumber")}
                                onBlur={handleBlur("panNumber")}
                                value={values.panNumber}
                                editable={false} // Autofilled and disabled
                            />
                            {touched.panNumber && errors.panNumber && (
                                <Text style={styles.error}>
                                    {errors.panNumber}
                                </Text>
                            )}
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Date of Birth{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                onChangeText={handleChange("dateOfBirth")}
                                onBlur={handleBlur("dateOfBirth")}
                                value={values.dateOfBirth}
                                editable={false} // Autofilled and disabled
                            />
                            {touched.dateOfBirth && errors.dateOfBirth && (
                                <Text style={styles.error}>
                                    {errors.dateOfBirth}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Gender <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                onChangeText={handleChange("gender")}
                                onBlur={handleBlur("gender")}
                                value={values.gender}
                                editable={false} // Autofilled and disabled
                            />
                            {touched.gender && errors.gender && (
                                <Text style={styles.error}>
                                    {errors.gender}
                                </Text>
                            )}
                        </View>
                        <View style={styles.fieldContainer}></View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Address Line 1{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("addressLine1")}
                                onBlur={handleBlur("addressLine1")}
                                value={values.addressLine1}
                                maxLength={150}
                            />
                            {touched.addressLine1 && errors.addressLine1 && (
                                <Text style={styles.error}>
                                    {typeof errors.addressLine1 === "string"
                                        ? errors.addressLine1
                                        : "Invalid input"}
                                </Text>
                            )}
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Address Line 2{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("addressLine2")}
                                onBlur={handleBlur("addressLine2")}
                                value={values.addressLine2}
                                maxLength={150}
                            />
                            {touched.addressLine2 && errors.addressLine2 && (
                                <Text style={styles.error}>
                                    {errors.addressLine2}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Address Line 3 (Option)
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("addressLine3")}
                                onBlur={handleBlur("addressLine3")}
                                value={values.addressLine3}
                            />
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                City <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("city")}
                                onBlur={handleBlur("city")}
                                value={values.city}
                            />
                            {touched.city && errors.city && (
                                <Text style={styles.error}>{errors.city}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                State <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("state")}
                                onBlur={handleBlur("state")}
                                value={values.state}
                            />
                            {touched.state && errors.state && (
                                <Text style={styles.error}>{errors.state}</Text>
                            )}
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Postal Code{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("postalCode")}
                                onBlur={handleBlur("postalCode")}
                                value={values.postalCode}
                                keyboardType="numeric" // Restrict input to numeric characters
                                maxLength={6}
                            />
                            {touched.postalCode && errors.postalCode && (
                                <Text style={styles.error}>
                                    {errors.postalCode}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.skipButton,
                                { opacity: pressed ? 0.6 : 1 },
                            ]}
                            // onPress={onPrevious}
                            onPress={() => onPrevious()}
                        >
                            <Text style={styles.buttonText}>Save As Draft</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.saveButton,
                                { opacity: pressed ? 0.6 : 1 },
                                !isValid || isSubmitting
                                    ? styles.disabledButton
                                    : {},
                            ]}
                            onPress={handleSubmit}
                            disabled={!isValid || isSubmitting} // Disable the button if the form is invalid or submitting
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    !isValid || isSubmitting
                                        ? styles.disabledButtonText
                                        : {},
                                ]}
                            >
                                Save and Continue
                            </Text>
                        </Pressable>
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
    required: {
        color: "red",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        // backgroundColor: "#f5f5f5", // to represent the disabled state
    },
    error: {
        fontSize: 12,
        color: "red",
        marginTop: 5,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    skipButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "transparent",
        borderColor: "#0066cc",
        width: "48%",
    },
    saveButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#0066cc",
        width: "48%",
    },
    buttonText: {
        fontSize: 16,
        color: "#0066cc",
    },
    disabledButton: {
        backgroundColor: "#cccccc", // Grey out the button when disabled
        borderColor: "#aaaaaa",
    },
    disabledButtonText: {
        color: "#aaaaaa", // Grey out the text when disabled
    },
    disabledInput: {
        backgroundColor: "#f5f5f5", // Light grey to indicate disabled
    },
});

export default AddressForm;
