import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomRadioButton from "../CustomForm/CustomRadioButton/CustomRadioButton";
import CalendarSinglePicker from "../CustomDatePicker/CalendarSinglePicker";
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import RemoteApi from "src/services/RemoteApi";
import AddressForm from "./AddressForm";

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    dateOfBirth: Yup.string().required("Date of Birth is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.number()
        .typeError("Gender is required")
        .required("Gender is required"),
    // mobileNumber: Yup.string()
    //     .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    //     .required("Mobile number is required"),
    panNumber: Yup.string()
        .required("PAN number is required")
        .matches(panRegex, "Please enter a valid PAN number. Ex: AAAPZ1234C"),
    // occupation: Yup.string().required("Occupation is required"),
    // isResidentIndian: Yup.boolean().required("Resident status is required"),
    // country: Yup.string().when("isResidentIndian", {
    //     is: (isResidentIndian) => isResidentIndian,
    //     then: (schema) =>
    //         schema.required(
    //             "Country is required when not a resident of India."
    //         ),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
});


const BasicDetails = ({ onNext, initialValues, onSaveDraft }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [occupationOptions, setOccupationOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Function to fetch dropdown options
    const getOptions = async (endpoint, setter) => {
        setIsLoading(true);
        try {
            const response: DropdownResponse = await RemoteApi.get(
                `${endpoint}`
            );

            if (response.code === 200) {
                if (endpoint === "occupation") {
                    setOccupationOptions(
                        response.data.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                    setCountryOptions(
                        response.data.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                } else if (endpoint === "countries") {
                    setCountryOptions(
                        response.data.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                } else if (endpoint === "education") {
                    // setEducationOptions(
                    //     response.data.map((state) => ({
                    //         label: state.name,
                    //         value: state.id,
                    //     }))
                    // );
                }
            } else {
                alert("Failed to fetch data list");
            }
        } catch (error) {
            console.error(`Failed to fetch ${endpoint} options`, error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // getOptions("occupation", setOccupationOptions);
        // getOptions("countries", setCountryOptions);
    }, []);

    const genderOptions = [
        { label: "Male", value: 1 },
        { label: "Female", value: 2 },
        { label: "Other", value: 4 },
    ];

    const residentOptions = [
        { label: "Yes", value: true },
        { label: "No", value: false },
    ];

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
                const valuesWithFlag = { ...values, basicDetailSubmitted: true };
                onNext(valuesWithFlag); // Include the submission flag
                // onNext(values)
            } else if (response.data.addressMismatch) {
                console.log("mismatch");
                // if (response.data.addressMismatch) {
                //     const valuesWithFlag = { ...values, basicDetailSubmitted: true };
                //     onNext(valuesWithFlag); 
                // }
                if (response.data.mismatchDob) {
                    actions.setFieldError("dateOfBirth", "Mismatch in Date of Birth.");
                }
                if (!response.data.panVerified) {
                    actions.setFieldError("panNumber", "PAN number verification failed.");
                }
                if (response.data.mismatchName) {
                    actions.setFieldError("fullName", "Name does not match records.");
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
                setFieldValue,
            }) => (
                <ScrollView contentContainerStyle={styles.container}>
                    {!showAddressForm ? (
                        <>
                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Client’s Name{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("fullName")}
                                        onBlur={handleBlur("fullName")}
                                        value={values.fullName}
                                    />
                                    {touched.fullName && errors.fullName && (
                                        <Text style={styles.error}>
                                            {errors.fullName}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Email ID{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email && (
                                        <Text style={styles.error}>
                                            {errors.email}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Date of Birth{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <CalendarSinglePicker
                                        value={values.dateOfBirth}
                                        handleFilterChange={(value) =>
                                            setFieldValue("dateOfBirth", value)
                                        }
                                    />
                                    {touched.dateOfBirth &&
                                        errors.dateOfBirth && (
                                            <Text style={styles.error}>
                                                {errors.dateOfBirth}
                                            </Text>
                                        )}
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        PAN Number{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("panNumber")}
                                        onBlur={handleBlur("panNumber")}
                                        value={values.panNumber}
                                    />
                                    {touched.panNumber && errors.panNumber && (
                                        <Text style={styles.error}>
                                            {errors.panNumber}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Client’s Gender{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <CustomRadioButton
                                        options={genderOptions}
                                        value={values.gender}
                                        setValue={(value) =>
                                            setFieldValue("gender", value)
                                        }
                                    />
                                    {touched.gender && errors.gender && (
                                        <Text style={styles.error}>
                                            {errors.gender}
                                        </Text>
                                    )}
                                </View>
                                {/* <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Client’s Occupation{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <DropdownComponent
                                        label="Occupation"
                                        data={occupationOptions}
                                        value={values.occupation}
                                        setValue={(value) =>
                                            setFieldValue("occupation", value)
                                        }
                                        containerStyle={styles.dropdown}
                                        noIcon={true}
                                    />
                                    {touched.occupation &&
                                        errors.occupation && (
                                            <Text style={styles.error}>
                                                {errors.occupation}
                                            </Text>
                                        )}
                                </View> */}
                            </View>

                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Is your client a resident Indian?{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <CustomRadioButton
                                        options={residentOptions}
                                        value={values.isResidentIndian}
                                        setValue={(value) => {
                                            setFieldValue(
                                                "isResidentIndian",
                                                value
                                            );
                                            if (!value) {
                                                getOptions(
                                                    "countries",
                                                    setCountryOptions
                                                ); // Fetch countries if not resident
                                            }
                                        }}
                                    />
                                    {touched.isResidentIndian &&
                                        errors.isResidentIndian && (
                                            <Text style={styles.error}>
                                                {errors.isResidentIndian}
                                            </Text>
                                        )}
                                </View>
                                {!values.isResidentIndian && (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            Client’s Country{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <DropdownComponent
                                            label="Country"
                                            data={countryOptions}
                                            value={values.country}
                                            setValue={(value) =>
                                                setFieldValue("country", value)
                                            }
                                            containerStyle={styles.dropdown}
                                            noIcon={true}
                                        />
                                        {touched.country && errors.country && (
                                            <Text style={styles.error}>
                                                {errors.country}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                            <View style={styles.buttonRow}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.skipButton,
                                        { opacity: pressed ? 0.6 : 1 },
                                    ]}
                                    onPress={() => onSaveDraft(values)}
                                >
                                    <Text style={styles.buttonText}>
                                        Save as Draft
                                    </Text>
                                </Pressable>
                                {isLoading ? (
                                    <ActivityIndicator
                                        size="large"
                                        color="#0000ff"
                                    />
                                ) : (
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.saveButton,
                                            { opacity: pressed ? 0.6 : 1 },
                                        ]}
                                        // onPress={() => {
                                        //     handleSubmit(values);
                                        //     console.log("pressedhandle");
                                        // }}

                                        onPress={() => handleSubmit()}
                                    >
                                        <Text style={styles.savebuttonText}>
                                            Save and Continue
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        </>
                    ) : (
                        <AddressForm
                            initialValues={{ address: "" }} // Adjust according to real needs
                            onPrevious={() => setShowAddressForm(false)}
                            onNext={onNext}
                        />
                    )}
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
        width: "100%", // Full width
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        width: "100%", // Ensure rows take full width
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
        backgroundColor: "#fff",
        flex: 1, // Make input take full width of its container
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
    savebuttonText: {
        fontSize: 16,
        color: "#ffffff",
    },
    // dropdown: {
    //     borderWidth: 1,
    //     borderColor: "#ccc",
    //     padding: 10,
    //     borderRadius: 5,
    //     backgroundColor: "#fff",
    //     flex: 1, // Dropdown fills the width of its container
    // },
});

export default BasicDetails;