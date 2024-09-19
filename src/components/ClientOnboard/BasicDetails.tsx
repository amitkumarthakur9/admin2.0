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
import { Box, Toast } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../Buttons/CustomButton";

const panRegex = /^([A-Z]){3}([ABCFGHJLPT])([A-Z]){1}([0-9]){4}([A-Z]){1}?$/;
const today = new Date();

const validationSchema = Yup.object().shape({
    fullName: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Full Name should contain only alphabets")
        .min(3, "Full Name should contain at least 3 alphabets")
        .required("Full Name is required"),

    dateOfBirth: Yup.date()
        .max(today, "Date of birth cannot be in the future")
        .required("Date of birth is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.number()
        .typeError("Gender is required")
        .required("Gender is required"),
    mobileNumber: Yup.string()
        .matches(/^(?!00)(?!.*(\d)\1{9}$)\d{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
    panNumber: Yup.string()
        .required("PAN number is required")
        .matches(panRegex, "Please enter a valid PAN number. Ex: AAAPZ1234C"),
    // occupation: Yup.string().required("Occupation is required"),
    isResidentIndian: Yup.boolean().required("Resident status is required"),
    // serverError: Yup.boolean().required("serverError"),
    // country: Yup.string().when("isResidentIndian", {
    //     is: (isResidentIndian) => isResidentIndian,
    //     then: (schema) =>
    //         schema.required(
    //             "Country is required when not a resident of India."
    //         ),
    //     otherwise: (schema) => schema.notRequired(),
    // }),
});

const BasicDetails = ({
    onNext,
    initialValues,
    onSaveDraft,
    onPrevious,
    closeModal,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [occupationOptions, setOccupationOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressToken, setAddressToken] = useState("");

    // Function to fetch dropdown options
    const getOptions = async (endpoint, setter) => {
        setIsLoading(true);
        try {
            const response: DropdownResponse = await RemoteApi.get(
                `${endpoint}`
            );

            if (response.code === 200) {
                if (endpoint === "occupation/list") {
                    setOccupationOptions(
                        response.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                    // setCountryOptions(
                    //     response.data.data.map((state) => ({
                    //         label: state.name,
                    //         value: state.id,
                    //     }))
                    // );
                }

                // else if (endpoint === "countries") {
                //     setCountryOptions(
                //         response.data.data.map((state) => ({
                //             label: state.name,
                //             value: state.id,
                //         }))
                //     );
                // } else if (endpoint === "education") {
                // setEducationOptions(
                //     response.data.map((state) => ({
                //         label: state.name,
                //         value: state.id,
                //     }))
                // );
                // }
            } else {
                alert("Failed to fetch data list");
            }
        } catch (error) {
            console.error(`Failed to fetch ${endpoint} options`, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setShowAddressForm(false);
    };

    useEffect(() => {
        getOptions("occupation/list", setOccupationOptions);
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

        const data = {
            name: values.fullName,
            email: values.email,
            mobileNumber: values.mobileNumber,
            panNumber: values.panNumber,
            dob: values.dateOfBirth,
            sexId: values.gender,
            // occupationId: values.occupation,
            isIndianResident: values.isResidentIndian,
        };
        try {
            console.log("basicsubmit");
            console.log(data);
            // const response: any = await RemoteApi.post(
            //     "/onboard/client/basic-details",
            //     data
            // );

            function sendResponse() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            code: 200,
                            message: "success",
                            data: {
                                isNameMissMatch: false,
                                isDOBMissMatch: false,
                                isAddressPresent: false,
                                // token: "BasicTokene",
                                token: "null",
                            },
                            errors: [],
                        });
                    }, 2000);
                });
            }

            const response: any = await sendResponse();
            if (
                response.code === 200 &&
                !response.data.isNameMissMatch &&
                !response.data.isDOBMissMatch &&
                response.data.isAddressPresent &&
                response.data.token
            ) {
                const valuesWithToken = {
                    ...values,
                    token: response.data.token,
                };
                onNext(valuesWithToken); // Include the submission flag
                // onNext(values)
            } else if (response.code === 200) {
                // setAddressToken(() => response?.data?.token);
                if (response.data.isDOBMissMatch) {
                    actions.setFieldError(
                        "dateOfBirth",
                        "Please Enter Date of Birth as per PAN Card"
                    );
                }
                if (response.data.isNameMissMatch) {
                    actions.setFieldError(
                        "fullName",
                        "Please Enter Name as per PAN Card"
                    );
                }

                if (
                    !response.data.isAddressPresent &&
                    !response.data.isNameMissMatch &&
                    !response.data.isDOBMissMatch &&
                    response.data.token
                ) {
                    const valuesWithToken = {
                        ...values,
                        token: response.data.token,
                        isAddressNeeded: true,
                    };
                    onNext(valuesWithToken);
                    // setShowAddressForm(true); // Show AddressForm if there is an address mismatch
                }
            } else {
                // actions.setFieldError("serverError", response.message);
                actions.setFieldError("panNumber", response.message);
            }
        } catch (error) {
            // actions.setFieldError(
            //     "fullName",
            //     error.message
            // );
            // actions.setFieldError(
            //     "fullName",
            //     error.data.message
            // );
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
                <>
                    <ScrollView contentContainerStyle={styles.container}>
                        {/* {!showAddressForm ? ( */}
                        <>
                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Name as per PAN Card{" "}
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
                                        Date of Birth as per PAN Card{" "}
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
                                        Mobile Number{" "}
                                        <Text style={styles.required}>*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "mobileNumber"
                                        )}
                                        onBlur={handleBlur("mobileNumber")}
                                        value={values.mobileNumber}
                                        keyboardType="numeric" // Restrict input to numeric characters
                                        maxLength={10}
                                    />
                                    {touched.mobileNumber &&
                                        errors.mobileNumber && (
                                            <Text style={styles.error}>
                                                {errors.mobileNumber}
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
                                        // containerStyle={styles.dropdown}
                                        noIcon={true}
                                    />
                                    {touched.occupation &&
                                        errors.occupation && (
                                            <Text style={styles.error}>
                                                {errors.occupation}
                                            </Text>
                                        )}
                                </View> */}
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
                                            // if (!value) {
                                            //     getOptions(
                                            //         "countries",
                                            //         setCountryOptions
                                            //     ); // Fetch countries if not resident
                                            // }
                                        }}
                                    />
                                    {touched.isResidentIndian &&
                                        errors.isResidentIndian && (
                                            <Text style={styles.error}>
                                                {errors.isResidentIndian}
                                            </Text>
                                        )}
                                </View>
                                {values.isResidentIndian === false && (
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>
                                            Tax Status{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                styles.disabledInput,
                                            ]}
                                            onChangeText={handleChange(
                                                "taxStatus"
                                            )}
                                            onBlur={handleBlur("taxStatus")}
                                            value={values.taxStatus}
                                            editable={false}
                                        />

                                        {touched.country &&
                                            errors.country &&
                                            typeof errors.country ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.country}
                                                </Text>
                                            )}
                                        {touched.country && errors.country && (
                                            <Text style={styles.error}>
                                                {errors.country}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* {errors.serverError && (
                                       <>
                                        <ErrorToaster message={"serverErrorNew"} />
                                        </>
                                    )} */}
                        </>
                        {/* ) : (
                        <AddressForm
                            initialValues={initialValues}
                            formValues={values}
                            onPrevious={onPrevious}
                            onNext={onNext}
                            handleBack={handleBack}
                            addressToken={addressToken}
                        />
                    )} */}
                    </ScrollView>
                    <View style={styles.buttonRow}>
                        {/* <Pressable
                                    style={({ pressed }) => [
                                        styles.skipButton,
                                        { opacity: pressed ? 0.6 : 1 },
                                    ]}
                                    onPress={() => onSaveDraft(values)}
                                >
                                    <Text style={styles.buttonText}>
                                        Save as Draft
                                    </Text>
                                </Pressable> */}

                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
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
                                        onPress={handleSubmit}
                                        title="Save and Continue"
                                        disabled={false}
                                        buttonStyle={"full"}
                                    />
                                </View>
                            </View>
                            // <Pressable
                            //     style={({ pressed }) => [
                            //         styles.saveButton,
                            //         { opacity: pressed ? 0.6 : 1 },
                            //     ]}
                            //     // onPress={() => {
                            //     //     handleSubmit(values);
                            //     //     console.log("pressedhandle");
                            //     // }}

                            //     onPress={() => handleSubmit()}
                            // >
                            //     <Text style={styles.savebuttonText}>
                            //         Save and Continue
                            //     </Text>
                            // </Pressable>
                        )}
                    </View>
                </>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: 20,
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
        fontSize: 12,
        marginBottom: 5,
        color: "#97989B",
    },
    required: {
        color: "red",
    },
    input: {
        color: "#404249",
        fontSize: 12,
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
        justifyContent: "center",
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
    disabledInput: {
        backgroundColor: "#f5f5f5", // Light grey to indicate disabled
    },
});

const ErrorToaster = ({ message }) => {
    return (
        <Box bg="red.400" p="2" color="white" rounded="sm" mb={5}>
            <Text className="text-white">{message}</Text>
        </Box>
    );
};
export default BasicDetails;
