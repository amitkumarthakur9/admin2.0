import React, { useState, useEffect } from "react";
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
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import CustomRadioButton from "../CustomForm/CustomRadioButton/CustomRadioButton";
import RemoteApi from "src/services/RemoteApi";

const validationSchema = Yup.object().shape({
    panNumber: Yup.string()
        .required("PAN number is required")
        .matches(
            /^[A-Z]{5}[0-9]{4}[A-Z]$/,
            "Please enter a valid PAN number. Ex: AAAPZ1234C"
        ),
    incomeRange: Yup.number().required("Income range is required"),
    placeOfBirth: Yup.string().required("Place of Birth is required"),
    isPoliticalExposed: Yup.boolean().required("This field is required"),
    isTaxpayer: Yup.boolean().required("This field is required"),
    passportNumber: Yup.string().when("isPoliticalExposed", {
        is: true,
        then: Yup.string().required("Passport number is required"),
    }),
    country: Yup.string().when("isTaxpayer", {
        is: true,
        then: Yup.string().required("Country is required"),
    }),
});

const Additonalinfo = ({ onNext, onPrevious, initialValues }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [occupationOptions, setOccupationOptions] = useState([]);
    const [incomeRangeOptions, setIncomeRangeOptions] = useState([]);
    const [educationOptions, setEducationOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);

    async function getDropdownList(endpoint) {
        setIsLoading(true);
        try {
            const response = await RemoteApi.get(`${endpoint}`);
            if (response.code === 200) {
                if (endpoint === "occupation") {
                    setOccupationOptions(
                        response.data.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                } else if (endpoint === "income-slab") {
                    setIncomeRangeOptions(
                        response.data.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                } else if (endpoint === "education") {
                    setEducationOptions(
                        response.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                } else if (endpoint === "countries") {
                    setCountryOptions(
                        response.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                }
            } else {
                alert("Failed to fetch data list");
            }
        } catch (error) {
            alert("An error occurred while fetching the data list");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getDropdownList("occupation");
        getDropdownList("income-slab");
        getDropdownList("education");
        getDropdownList("countries"); // Fetch country list
    }, []);

    const handleSubmit = async (values) => {
        const data = {
            panNumber: values.panNumber,
            incomeSlabId: values.incomeRange,
            educationId: values.education,
            occupationId: values.occupation,
            placeOfBirth: values.placeOfBirth,
            isPoliticalExposed: values.isPoliticalExposed,
            passportNumber: values.passportNumber,
            isTaxpayer: values.isTaxpayer,
            country: values.country,
        };

        try {
            const response = await RemoteApi.post(
                "user/update-professional-details",
                data
            );
            if (response.code === 200) {
                onNext(values);
            } else {
                Alert.alert(
                    "Error",
                    response.message || "Failed to submit the details"
                );
            }
        } catch (error) {
            Alert.alert(
                "Error",
                error.message ||
                    "An error occurred while submitting the details"
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
            }) => (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Income Slab{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <DropdownComponent
                                label="Income Slab"
                                data={incomeRangeOptions}
                                value={values.incomeRange}
                                containerStyle={styles.dropdown}
                                setValue={(value) =>
                                    setFieldValue("incomeRange", value)
                                }
                            />
                            {touched.incomeRange && errors.incomeRange && (
                                <Text style={styles.error}>
                                    {errors.incomeRange}
                                </Text>
                            )}
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Place of Birth{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("placeOfBirth")}
                                onBlur={handleBlur("placeOfBirth")}
                                value={values.placeOfBirth}
                            />
                            {touched.placeOfBirth && errors.placeOfBirth && (
                                <Text style={styles.error}>
                                    {errors.placeOfBirth}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Is your Client a politically exposed person?{" "}
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <CustomRadioButton
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false },
                                ]}
                                value={values.isPoliticalExposed}
                                setValue={(value) =>
                                    setFieldValue("isPoliticalExposed", value)
                                }
                            />
                            {touched.isPoliticalExposed &&
                                errors.isPoliticalExposed && (
                                    <Text style={styles.error}>
                                        {errors.isPoliticalExposed}
                                    </Text>
                                )}
                        </View>
                        {values.isPoliticalExposed && (
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    Passport Number{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange(
                                        "passportNumber"
                                    )}
                                    onBlur={handleBlur("passportNumber")}
                                    value={values.passportNumber}
                                />
                                {touched.passportNumber &&
                                    errors.passportNumber && (
                                        <Text style={styles.error}>
                                            {errors.passportNumber}
                                        </Text>
                                    )}
                            </View>
                        )}
                    </View>

                    {values.isPoliticalExposed && (
                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    Are you a taxpayer of any country, except
                                    India?{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <CustomRadioButton
                                    options={[
                                        { label: "Yes", value: true },
                                        { label: "No", value: false },
                                    ]}
                                    value={values.isTaxpayer}
                                    setValue={(value) =>
                                        setFieldValue("isTaxpayer", value)
                                    }
                                />
                                {touched.isTaxpayer && errors.isTaxpayer && (
                                    <Text style={styles.error}>
                                        {errors.isTaxpayer}
                                    </Text>
                                )}
                            </View>
                            {values.isTaxpayer && (
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Country{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <DropdownComponent
                                        label="Country"
                                        data={countryOptions}
                                        value={values.country}
                                        containerStyle={styles.dropdown}
                                        setValue={(value) =>
                                            setFieldValue("country", value)
                                        }
                                    />
                                    {touched.country && errors.country && (
                                        <Text style={styles.error}>
                                            {errors.country}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
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
                            onPress={() => onNext()}
                        >
                            <Text style={styles.buttonText}>
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
        backgroundColor: "#fff",
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
});

export default Additonalinfo;
