import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";

const nomineeValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    relationship: Yup.string().required("Relationship is required"),
    dateOfBirth: Yup.string().required("Date of Birth is required"),
});

const AddNominee = ({ onNext, onPrevious, initialValues }) => {
    const [step, setStep] = useState(1);

    const handleSaveNominee = () => {
        setStep(2);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {step === 1 ? (
                    <Formik
                        initialValues={{
                            name: "",
                            relationship: "",
                            dateOfBirth: "",
                        }}
                        validationSchema={nomineeValidationSchema}
                        onSubmit={handleSaveNominee}
                    >
                        {({
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                        }) => (
                            <>
                                <Text style={styles.title}>
                                    Add Nominee Details
                                </Text>
                                <Text style={styles.subTitle}>
                                    Please complete all mandatory fields to
                                    successfully add a nominee.
                                </Text>
                                <View style={styles.formField}>
                                    <Text style={styles.label}>
                                        Name{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("name")}
                                        onBlur={handleBlur("name")}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name && (
                                        <Text style={styles.errorText}>
                                            {errors.name}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.label}>
                                        Relationship{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "relationship"
                                        )}
                                        onBlur={handleBlur("relationship")}
                                        value={values.relationship}
                                    />
                                    {touched.relationship &&
                                        errors.relationship && (
                                            <Text style={styles.errorText}>
                                                {errors.relationship}
                                            </Text>
                                        )}
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.label}>
                                        Date of Birth{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "dateOfBirth"
                                        )}
                                        onBlur={handleBlur("dateOfBirth")}
                                        value={values.dateOfBirth}
                                    />
                                    {touched.dateOfBirth &&
                                        errors.dateOfBirth && (
                                            <Text style={styles.errorText}>
                                                {errors.dateOfBirth}
                                            </Text>
                                        )}
                                </View>

                                <View style={styles.buttonContainer}>
                                    {/* <Pressable
                                        style={styles.skipButton}
                                        onPress={onClose}
                                    >
                                        <Text style={styles.skipButtonText}>
                                            Skip
                                        </Text>
                                    </Pressable> */}
                                    <Pressable
                                        style={styles.saveButton}
                                        onPress={() => onNext()}
                                    >
                                        <Text style={styles.saveButtonText}>
                                            Save Nominee
                                        </Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </Formik>
                ) : (
                    <>
                        <Text style={styles.title}>Add Signature</Text>
                        <Text style={styles.subTitle}>
                            Please sign in the given area
                        </Text>

                        <View style={styles.uploadContainer}>
                            <Ionicons
                                name="cloud-upload-outline"
                                size={64}
                                color="#A0AEC0"
                            />
                            <Text style={styles.uploadText}>
                                Maximum file size: 2 MB (PNG/JPG format only)
                            </Text>
                            <Text style={styles.uploadText}>
                                You can also drag and drop the file
                            </Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={styles.skipButton}
                                onPress={onClose}
                            >
                                <Text style={styles.skipButtonText}>Skip</Text>
                            </Pressable>
                            <Pressable style={styles.disabledButton}>
                                <Text style={styles.disabledButtonText}>
                                    Save and Continue
                                </Text>
                            </Pressable>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
    },
    content: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        // position: "relative",
        // elevation: 3, // Add shadow on Android
        // shadowColor: "#000", // Add shadow on iOS
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
    },
    closeButton: {
        position: "absolute",
        right: 15,
        top: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 14,
        marginBottom: 20,
        color: "#718096",
    },
    formField: {
        marginBottom: 15,
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
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
    },
    buttonContainer: {
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
    skipButtonText: {
        fontSize: 16,
        color: "#0066cc",
    },
    saveButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#0066cc",
        width: "48%",
    },
    saveButtonText: {
        fontSize: 16,
        color: "#ffffff",
    },
    uploadContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#A0AEC0",
        borderRadius: 10,
        padding: 40,
        marginBottom: 20,
    },
    uploadText: {
        color: "#A0AEC0",
        textAlign: "center",
    },
    disabledButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#A0AEC0",
        width: "48%",
    },
    disabledButtonText: {
        fontSize: 16,
        color: "#FFFFFF",
    },
});

export default AddNominee;
