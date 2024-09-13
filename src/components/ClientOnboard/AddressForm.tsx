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
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import RemoteApi from "src/services/RemoteApi";

const validationSchema = Yup.object().shape({
    // panNumber: Yup.string()
    //     .required("PAN number is required")
    //     .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Please enter a valid PAN number"),
    // dateOfBirth: Yup.date().required("Date of Birth is required"),
    // gender: Yup.string().required("Gender is required"),
    addressLine1: Yup.string().required("Address Line 1 is required"),
    addressLine2: Yup.string().required("Address Line 2 is required"),
    // city: Yup.string().required("City is required"),
    // state: Yup.string().required("State is required"),
    postalCode: Yup.string()
        .required("Postal Code is required")
        .matches(/^[0-9]{6}$/, "Please enter a valid Postal Code"),
});

const AddressForm = ({
    initialValues,
    onPrevious,
    onNext,
    formValues,
    cookieToken,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [Address, setAddress] = React.useState({
        state: "",
        district: "",
        pincodeId: "",
    });
    console.log("cookieToken");
    console.log(cookieToken);
    const handleSubmit = async (values, actions) => {
        console.log("handleSubmit");
        console.log(values);
        setIsLoading(true);

        const data = {
            line_1: values.addressLine1,
            line_2: values.addressLine2,
            pincodeId: Address.pincodeId,
            token: cookieToken,
        };
        try {
            const response = await RemoteApi.post(
                "/onboard/client/address",
                data,
                cookieToken
            );

            // const response = await RemoteApi.setCookieWithAxios(
            //     "/onboard/client//address",
            //     data,
            //     cookieToken
            // );

            // console.log(response);
            // const response = {
            //     code: 200,
            //     data: {
            //         message: "invalid address",
            //         success: false,
            //         mismatchDob: false,
            //         panVerified: true,
            //         addressMismatch: true,
            //         mismatchName: false,
            //         token: "AddressTokeneyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwOSwiY3JlZGVudGlhbHNJZCI6MTk5LCJhY2NvdW50SWQiOjI3NiwiYWRkcmVzc0lkIjo3MiwiaWF0IjoxNzI1NjA2Mzg0LCJleHAiOjE3MjU2OTI3ODR9.PwJeEbsj84Frxu-z6AKdGSvEMh7bjyKeE_AgSFtxsZk",
            //     },
            // };
            if (response.code == 200) {
                const valuesWithFlag = {
                    ...values,
                    basicDetailSubmitted: true,
                    token: response.data.token,
                };
                onNext(valuesWithFlag); // Include the submission flag
                // onNext(values)
            } else if (!response.data.success) {
                console.log("mismatch");
                actions.setFieldError("postalCode", response.data.message);
            } else {
                actions.setFieldError("postalCode", response.data.message);
            }
        } catch (error) {
            Alert.alert("Error", "Submission failed. Please try again.");
        }
        setIsLoading(false);
        actions.setSubmitting(false);
    };

    const fetchPincodeDetails = async (pincode, setFieldError) => {
        setIsLoading(true);
        try {
            const response: any = await RemoteApi.get(
                `pincode/details?pincode=${pincode}`
            );

            if (response.code === 200) {
                const { bankBranch, pincode, district, state } = response.data;
                const address = `${bankBranch}, ${district}, ${state}, ${pincode}`;

                setAddress({
                    state: response.data.state.name,
                    district: response.data.district.name,
                    pincodeId: response.data.pincodeId,
                });
            } else if (response.code === 254) {
                setFieldError("pincode", "Pincode does not exist.");
            } else {
                alert("Failed to fetch pincode details");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
        } finally {
            setIsLoading(false);
        }
    };

    const genderOptions = [
        { label: "Male", value: 1 },
        { label: "Female", value: 2 },
        { label: "Other", value: 4 },
    ];

    // Function to get the label based on value
    const getGenderLabel = (value) => {
        const gender = genderOptions.find((option) => option.value === value);
        return gender ? gender.label : "";
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
                setFieldError,
            }) => (
                <View contentContainerStyle={styles.container}>
                    <View className="py-4">
                        <Text style={styles.modalTitle}>
                            Address Confirmation
                        </Text>
                        <Text>Please add client’s Address</Text>
                    </View>
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
                                value={initialValues.panNumber}
                                editable={false} // Autofilled and disabled
                            />
                            {/* {touched.panNumber && errors.panNumber && (
                                <Text style={styles.error}>
                                    {errors.panNumber}
                                </Text>
                            )} */}
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
                                value={initialValues.dateOfBirth}
                                editable={false} // Autofilled and disabled
                            />
                            {/* {touched.dateOfBirth && errors.dateOfBirth && (
                                <Text style={styles.error}>
                                    {errors.dateOfBirth}
                                </Text>
                            )} */}
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
                                value={getGenderLabel(formValues.gender)} // Show label instead of value
                                editable={false} // Autofilled and disabled
                            />
                            {/* {touched.gender && errors.gender && (
                                <Text style={styles.error}>
                                    {errors.gender}
                                </Text>
                            )} */}
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
                            {/* {touched.addressLine1 && errors.addressLine1 && (
                                        <Text style={styles.error}>
                                            {errors.addressLine1}
                                        </Text>
                                    )} */}
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
                                    {typeof errors.addressLine2 === "string"
                                        ? errors.addressLine2
                                        : "Invalid input"}
                                </Text>
                            )}
                            {/* {errors.addressLine2 && (
                                <Text style={styles.error}>
                                    {errors.addressLine2}
                                </Text>
                            )} */}
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
                                Postal Code{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>

                            <TextInput
                                style={styles.input}
                                // onChangeText={handleChange("postalCode")}
                                onChangeText={(value) => {
                                    handleChange("postalCode")(value);
                                    console.log("postal");
                                    console.log(value);
                                    if (value.length === 6) {
                                        fetchPincodeDetails(
                                            value,
                                            setFieldError
                                        );
                                    } else {
                                        setAddress({
                                            district: "",
                                            state: "",
                                            pincodeId: "",
                                        });
                                    }
                                }}
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
                    {isLoading && (
                        <View style={styles.formRow}>
                            <ActivityIndicator />
                        </View>
                    )}
                    {Address.state && Address.district && !isLoading && (
                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    District{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, styles.disabledInput]}
                                    onChangeText={handleChange("district")}
                                    // onBlur={handleBlur("city")}
                                    value={Address.district}
                                />
                                {/* {touched.city && errors.city && (
                                <Text style={styles.error}>{errors.city}</Text>
                            )} */}
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    State <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, styles.disabledInput]}
                                    onChangeText={handleChange("state")}
                                    // onBlur={handleBlur("state")}
                                    value={Address.state}
                                />
                                {/* {touched.state && errors.state && (
                                <Text style={styles.error}>{errors.state}</Text>
                            )} */}
                            </View>
                        </View>
                    )}

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
                            onPress={() => handleSubmit()}
                            disabled={!isValid || isSubmitting} // Disable the button if the form is invalid or submitting
                        >
                            <Text
                                style={[
                                    styles.saveButtonText,
                                    !isValid || isSubmitting
                                        ? styles.disabledButtonText
                                        : {},
                                ]}
                            >
                                Save and Continue
                            </Text>
                        </Pressable>
                    </View>
                </View>
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
        fontSize: 12,
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
    saveButtonText: {
        fontSize: 16,
        color: "#ffffff",
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
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
});

export default AddressForm;
