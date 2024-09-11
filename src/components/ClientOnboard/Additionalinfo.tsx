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
import Success from "./Success";

const validationSchema = Yup.object().shape({
    incomeRange: Yup.number().required("Income range is required"),
    placeOfBirth: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Place of Birth must contain only alphabets")
        .required("Place of Birth is required"),
    isPoliticalExposed: Yup.boolean().required("This field is required"),
    // isTaxpayer: Yup.boolean().required("This field is required"),
    // passportNumber: Yup.string().when("isPoliticalExposed", {
    //     is: (isPoliticalExposed) => isPoliticalExposed,
    //     then: (schema) =>
    //         schema
    //             .required("PassPort Number is required")
    //             .matches(
    //                 /^[PDS][A-Z]{2}\d{4}[A-Z0-9]{2}$/,
    //                 "Invalid passport number format. Example: PAA1234AB"
    //             ),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
    // country: Yup.string().when("isTaxpayer", {
    //     is: (isTaxpayer) => isTaxpayer,
    //     then: (schema) =>
    //         schema
    //             .required("Country is required")
    //             .matches(
    //                 /^[A-Za-z\s]+$/,
    //                 "Country must contain only alphabets"
    //             ),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
});

const Additonalinfo = ({
    onNext,
    onPrevious,
    initialValues,
    onSubmitSuccess,
    setFormData
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isKYCSuccessful, setIsKYCSuccessful] = useState(false);
    const [incomeRangeOptions, setIncomeRangeOptions] = useState([]);

    async function getDropdownList(endpoint) {
        setIsLoading(true);
        try {
            const response = await RemoteApi.get(`${endpoint}`);
            if (response.code === 200) {
                if (endpoint === "income-slab") {
                    setIncomeRangeOptions(
                        response.data.data.map((state) => ({
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
        getDropdownList("income-slab");
    }, []);

    const handleSubmit = async (values) => {
        const data = {
            incomeSlabId: Number(values.incomeRange),
            placeOfBirth: values.placeOfBirth,
            isPoliticalExposed: values.isPoliticalExposed,
            token: values.token,
            // isTaxpayer: values.isTaxpayer,
            // country: values.country,
        };

        console.log(data);

        try {
            const response = await RemoteApi.post(
                "onboard/client/additional-details",
                data
            );

            // const response = {
            //     code: 200,
            // };

            if (response.code === 200) {

                setFormData((prevData) => ({
                    ...prevData,
                    token: response.data.token,
                }));
                setIsSubmitted(true);
                setIsKYCSuccessful(true);
                onSubmitSuccess(true);
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
                    {isSubmitted ? (
                        <Success
                            onNext={onNext}
                            isKYCSuccessful={isKYCSuccessful}
                        />
                    ) : (
                        <>
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
                                        noIcon={true}
                                    />
                                    {touched.incomeRange &&
                                        errors.incomeRange && (
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
                                        onChangeText={handleChange(
                                            "placeOfBirth"
                                        )}
                                        onBlur={handleBlur("placeOfBirth")}
                                        value={values.placeOfBirth}
                                    />
                                    {touched.placeOfBirth &&
                                        errors.placeOfBirth && (
                                            <Text style={styles.error}>
                                                {errors.placeOfBirth}
                                            </Text>
                                        )}
                                </View>
                            </View>

                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Is your Client a politically exposed
                                        person?{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <CustomRadioButton
                                        options={[
                                            { label: "Yes", value: 1 },
                                            { label: "No", value: 2 },
                                        ]}
                                        value={values.isPoliticalExposed}
                                        setValue={(value) =>
                                            setFieldValue(
                                                "isPoliticalExposed",
                                                value
                                            )
                                        }
                                    />
                                    {touched.isPoliticalExposed &&
                                        errors.isPoliticalExposed && (
                                            <Text style={styles.error}>
                                                {errors.isPoliticalExposed}
                                            </Text>
                                        )}
                                </View>
                                {/* {values.isPoliticalExposed && (
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
                        )} */}
                            </View>

                            {/* {values.isPoliticalExposed && (
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
                                // <View style={styles.fieldContainer}>
                                //     <Text style={styles.label}>
                                //         Country{" "}
                                //         <Text style={styles.required}>*</Text>
                                //     </Text>
                                //     <DropdownComponent
                                //         label="Country"
                                //         data={countryOptions}
                                //         value={values.country}
                                //         containerStyle={styles.dropdown}
                                //         setValue={(value) =>
                                //             setFieldValue("country", value)
                                //         }
                                //     />
                                //     {touched.country && errors.country && (
                                //         <Text style={styles.error}>
                                //             {errors.country}
                                //         </Text>
                                //     )}
                                // </View>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Country{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("country")}
                                        onBlur={handleBlur("country")}
                                        value={values.country}
                                    />
                                    {touched.country && errors.country && (
                                        <Text style={styles.error}>
                                            {errors.country}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    )} */}

                            <View style={styles.buttonRow}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.skipButton,
                                        { opacity: pressed ? 0.6 : 1 },
                                    ]}
                                    onPress={onPrevious}
                                >
                                    <Text style={styles.buttonText}>
                                    Back
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.saveButton,
                                        { opacity: pressed ? 0.6 : 1 },
                                    ]}
                                    onPress={() => handleSubmit()}
                                >
                                    <Text style={styles.confirmButtonText}>
                                        Save and Continue
                                    </Text>
                                </Pressable>
                            </View>
                        </>
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
    confirmButtonText: {
        fontSize: 16,
        color: "#fff",
    },
});

export default Additonalinfo;
