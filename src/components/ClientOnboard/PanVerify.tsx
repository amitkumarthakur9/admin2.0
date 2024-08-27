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
import CustomRadioButton from "../CustomForm/CustomRadioButton/CustomRadioButton";
import CalendarSinglePicker from "../CustomDatePicker/CalendarSinglePicker";
import AddressForm from "./AddressForm";

const validationSchema = Yup.object().shape({
    dob: Yup.date().required("Date of Birth is required"),
    changePan: Yup.boolean().required("Please select an option"),

    panNumber: Yup.string().when("changePan", {
        is: (changePan) => changePan,
        then: (schema) =>
            schema
                .required("PAN number is required")
                .matches(
                    /^[A-Z]{5}[0-9]{4}[A-Z]$/,
                    "Please enter a valid PAN number"
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const PanVerify = ({ initialValues, onPrevious, onNext }) => {
    const [mismatchName, setMismatchName] = useState(false);
    const [mismatchDob, setMismatchDob] = useState(false);
    const [panVerified, setPanVerified] = useState(false);
    const [addressMismatch, setAddressMismatch] = useState(false);

    const [genderOptions] = useState([
        {
            label: "Consider client’s name on PAN card as his/her official name",
            value: false,
        },
        { label: "Change PAN number", value: true },
    ]);

    const handleSubmit = (values) => {
        // Handle form submission
        onNext(values);
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
                    {!initialValues.panVerified && (
                        <>
                            <Text style={styles.alertText}>
                                Verification Failed!
                            </Text>
                            <Text style={styles.subText}>
                                Verification of PAN <Text style={styles.highlightedText}>BHZG256H</Text> has failed as per income tax department.
                            </Text>
                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        PAN Number <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("panNumber")}
                                        onBlur={handleBlur("panNumber")}
                                        value={values.panNumber}
                                    />
                                    {touched.panNumber && errors.panNumber && (
                                        <Text style={styles.error}>{errors.panNumber}</Text>
                                    )}
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Date of Birth <Text style={styles.required}>*</Text>
                                    </Text>
                                    <CalendarSinglePicker
                                        value={values.dateOfBirth}
                                        handleFilterChange={(value) => setFieldValue("dateOfBirth", value)}
                                    />
                                    {touched.dob && errors.dob && (
                                        <Text style={styles.error}>{errors.dob}</Text>
                                    )}
                                </View>
                            </View>
                        </>
                    )}

                    {initialValues.panVerified && initialValues.mismatchName && (
                        <>
                            <Text style={styles.alertText}>
                                PAN details not verified!
                            </Text>
                            <Text style={styles.subText}>
                                Client’s name on the PAN card{" "}
                                <Text style={styles.highlightedText}>BHZG256H</Text> is{" "}
                                <Text style={styles.highlightedText}>Sourabh Bajaj</Text>, which differs from the name you entered.
                            </Text>
                            <CustomRadioButton
                                options={genderOptions}
                                value={values.changePan}
                                setValue={(value) => setFieldValue("changePan", value)}
                            />
                            {values.changePan && (
                                <View style={styles.formRow}>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            PAN Number <Text style={styles.required}>*</Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange("panNumber")}
                                            onBlur={handleBlur("panNumber")}
                                            value={values.panNumber}
                                        />
                                        {touched.panNumber && errors.panNumber && (
                                            <Text style={styles.error}>{errors.panNumber}</Text>
                                        )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            Date of Birth <Text style={styles.required}>*</Text>
                                        </Text>
                                        <CalendarSinglePicker
                                            value={values.dateOfBirth}
                                            handleFilterChange={(value) => setFieldValue("dateOfBirth", value)}
                                        />
                                        {touched.dateOfBirth && errors.dateOfBirth && (
                                            <Text style={styles.error}>{errors.dateOfBirth}</Text>
                                        )}
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    {initialValues.panVerified && !initialValues.mismatchName && !initialValues.mismatchDob && initialValues.addressMismatch && (
                        <AddressForm
                            initialValues={initialValues}
                            onPrevious={onPrevious}
                            onNext={onNext}
                        />
                    )}

                    <View style={styles.buttonRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.skipButton,
                                { opacity: pressed ? 0.6 : 1 },
                            ]}
                            onPress={onPrevious}
                        >
                            <Text style={styles.buttonText}>Skip</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.saveButton,
                                { opacity: pressed ? 0.6 : 1 },
                            ]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Confirm</Text>
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
    alertText: {
        color: "red",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        marginBottom: 20,
        color: "#333",
    },
    highlightedText: {
        fontWeight: "bold",
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
        backgroundColor: "#fff",
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
        color: "#ffffff",
    },
});

export default PanVerify;
