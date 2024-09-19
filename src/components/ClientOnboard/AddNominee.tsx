import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import CalendarSinglePicker from "../CustomDatePicker/CalendarSinglePicker";
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import RemoteApi from "src/services/RemoteApi";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../Buttons/CustomButton";
const today = new Date();
const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
);

const nomineeValidationSchema = Yup.object().shape({
    nomineeName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Full Name should contain only alphabets")
        .min(3, "Full Name should contain at least 3 alphabets")
        .required("Full Name is required"),
    nomineeDateOfBirth: Yup.date()
        .max(today, "Date of birth cannot be in the future")
        .test(
            "age-check",
            "Nominee is minor, provide guardian's details",
            function (value) {
                const nomineeDob = new Date(value);
                return (
                    nomineeDob <= eighteenYearsAgo || this.parent.guardianName
                );
            }
        )
        .required("Date of birth is required"),
    relationship: Yup.string().required("Relationship is required"),
    guardianName: Yup.string().when("nomineeDateOfBirth", {
        is: (nomineeDateOfBirth) => {
            const nomineeDob = new Date(nomineeDateOfBirth);
            return nomineeDob > eighteenYearsAgo; // Nominee is younger than 18
        },
        then: (schema) =>
            schema
                .matches(
                    /^[A-Za-z\s]+$/,
                    "Full Name should contain only alphabets"
                )
                .min(3, "Full Name should contain at least 3 alphabets")
                .required("Full Name is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    guardianDateOfBirth: Yup.date().when("nomineeDateOfBirth", {
        is: (nomineeDateOfBirth) => {
            const nomineeDob = new Date(nomineeDateOfBirth);
            return nomineeDob > eighteenYearsAgo; // Nominee is younger than 18
        },
        then: (schema) =>
            schema
                .required("Guardian's Date of birth is required")
                .max(today, "Date of birth cannot be in the future")
                .test(
                    "guardian-age-check",
                    "Guardian must be at least 18 years old",
                    function (value) {
                        const guardianDob = new Date(value);
                        return guardianDob <= eighteenYearsAgo;
                    }
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
    country: Yup.string().when("isTaxpayer", {
        is: (isTaxpayer) => isTaxpayer,
        then: (schema) =>
            schema
                .required("Country is required")
                .matches(
                    /^[A-Za-z\s]+$/,
                    "Country must contain only alphabets"
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const AddNominee = ({ onNext, onPrevious, initialValues, closeModal }) => {
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values) => {
        console.log(values);
        console.log(JSON.stringify(values));
        // setIsVerifing(true); // Start loading before the API call
        // const data = {
        //     name: values.nomineeName,
        //     guardianName: values.guardianName,
        //     relationId: values.relationship,
        //     dob: values.nomineeDateOfBirth,
        //     guardianDateOfBirth: values.guardianDateOfBirth,
        // };

        const data = {
            name: values.nomineeName,
            dob: values.nomineeDateOfBirth,
            relationId: 2,
            guardian: {
                name: values.guardianName,
                dob: values.guardianDateOfBirth,
                relationId: values.relationship,
            },
            token: values.token,
        };

        console.log(data);

        // onNext(values);

        // setIsVerifing(true);
        // setIsModalVisible(true);

        try {
            // const response: any = await RemoteApi.post(
            //     "onboard/client/add-nominee",
            //     data
            // );

            const response = {
                code: 200,
                data: {
                    token: "nomieeToken",
                },
            };

            console.log("response");
            console.log(response);

            if (response.code === 200) {
                // setIsVerifing(false); // Stop loading
                const valuesWithToken = {
                    ...values,
                    token: response.data.token,
                    currentStep: 6,
                };
                onNext(valuesWithToken);
            } else {
                // setIsVerifing(false); // Stop loading
                console.log("ElseError");
                // getdocumentType();
                // setShowDocumentUpload(true);
                // setMessage(
                //     "Verification Failed. Please upload supporting document for the verification."
                // );
            }
        } catch (error) {
            // setIsVerifing(false); // Stop loading
            // getdocumentType();
            // setShowDocumentUpload(true);
            // setMessage(
            //     "Verification Failed. Please upload supporting document for the verification."
            // );
        }
    };

    // Function to fetch dropdown options
    const getOptions = async (endpoint, setter) => {
        setIsLoading(true);
        try {
            const response: DropdownResponse = await RemoteApi.get(
                `${endpoint}`
            );

            if (response.code === 200) {
                if (endpoint === "relationship/list") {
                    setRelationshipOptions(
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
            console.error(`Failed to fetch ${endpoint} options`, error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getOptions("relationship/list", setRelationshipOptions);
        // getOptions("countries", setCountryOptions);
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={nomineeValidationSchema}
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
                <>
                    <View className="w-full gap-y-2">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[18px] font-bold">
                                Add Nominee Details
                            </Text>

                            <Pressable onPress={closeModal}>
                                <Icon name="close" size={14} color="#000" />
                            </Pressable>
                        </View>

                        <Text className="text-[12px]">
                            Please complete all mandatory fields to successfully
                            add a nominee.
                        </Text>
                    </View>
                    <ScrollView className="pt-4">
                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    Name <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("nomineeName")}
                                    onBlur={handleBlur("nomineeName")}
                                    value={values.nomineeName}
                                />
                                {touched.nomineeName && errors.nomineeName && (
                                    <Text style={styles.errorText}>
                                        {errors.nomineeName}
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    Relationship{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <DropdownComponent
                                    label="Relationship"
                                    data={relationshipOptions}
                                    value={values.relationship}
                                    setValue={(value) =>
                                        setFieldValue("relationship", value)
                                    }
                                    // containerStyle={styles.dropdown}
                                    noIcon={true}
                                />
                                {touched.relationship &&
                                    errors.relationship && (
                                        <Text style={styles.errorText}>
                                            {errors.relationship}
                                        </Text>
                                    )}
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    Date of Birth{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <CalendarSinglePicker
                                    value={values.nomineeDateOfBirth}
                                    handleFilterChange={(value) =>
                                        setFieldValue(
                                            "nomineeDateOfBirth",
                                            value
                                        )
                                    }
                                />
                                {touched.nomineeDateOfBirth &&
                                    errors.nomineeDateOfBirth && (
                                        <Text style={styles.errorText}>
                                            {errors.nomineeDateOfBirth}
                                        </Text>
                                    )}
                            </View>
                        </View>
                        {/* Conditional rendering for Guardian's fields */}
                        {new Date(values.nomineeDateOfBirth) >
                            eighteenYearsAgo && (
                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Guardian’s Name{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "guardianName"
                                        )}
                                        onBlur={handleBlur("guardianName")}
                                        value={values.guardianName}
                                    />
                                    {touched.guardianName &&
                                        errors.guardianName && (
                                            <Text style={styles.errorText}>
                                                {errors.guardianName}
                                            </Text>
                                        )}
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Guardian’s Date of Birth{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <CalendarSinglePicker
                                        value={values.guardianDateOfBirth}
                                        handleFilterChange={(value) =>
                                            setFieldValue(
                                                "guardianDateOfBirth",
                                                value
                                            )
                                        }
                                    />
                                    {touched.guardianDateOfBirth &&
                                        errors.guardianDateOfBirth && (
                                            <Text style={styles.errorText}>
                                                {errors.guardianDateOfBirth}
                                            </Text>
                                        )}
                                </View>
                            </View>
                        )}
                        <View className="flex flex-row justify-center w-full ">
                            {/* <View className="w-[48%]">
                                    <CustomButton
                                        onPress={handleSubmit}
                                        title="Save and Continue"
                                        disabled={false}
                                        buttonStyle={"outline"}
                                    />
                                </View> */}
                            <View className="w-[48%]">
                                <CustomButton
                                    onPress={() => handleSubmit()}
                                    title="Save Nominee"
                                    // disabled={isVerifing === true}
                                    buttonStyle={"full"}
                                />
                            </View>
                        </View>
                        {/* <View style={styles.buttonContainer}>
                            
                            <Pressable
                                style={styles.saveButton}
                                onPress={() => handleSubmit()}
                            >
                                <Text style={styles.saveButtonText}>
                                    Save Nominee
                                </Text>
                            </Pressable>
                        </View> */}
                    </ScrollView>
                </>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    // container: {
    //     flexGrow: 1,
    //     width:"100%"
    //     // padding: 20,
    //     // backgroundColor: "#ffffff",
    // },
    // content: {
    //     width: "100%",
    //     backgroundColor: "white",
    //     borderRadius: 10,
    //     padding: 20,
    //     // position: "relative",
    //     // elevation: 3, // Add shadow on Android
    //     // shadowColor: "#000", // Add shadow on iOS
    //     // shadowOffset: { width: 0, height: 2 },
    //     // shadowOpacity: 0.25,
    //     // shadowRadius: 3.84,
    // },
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
        fontSize: 12,
        marginBottom: 5,
        color: "#97989B",
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
        fontSize: 12,
        color: "#404249",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
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
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    fieldContainer: {
        flex: 1,
        marginRight: 10,
        paddingBottom: 10,
        // paddingLeft: 20,
        // paddingRight: 20,
    },
});

export default AddNominee;
