import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    ScrollView,
    ActivityIndicator,
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

const emailRegexRFC5322 =
    /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])$/;

const panRegex = /^([A-Z]){3}([ABCFGHJLPT])([A-Z]){1}([0-9]){4}([A-Z]){1}?$/;

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
    nomieeRelationship: Yup.string().required("Relationship is required"),
    guadianRelationship: Yup.string().required("Relationship is required"),
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
    nomineeEmail: Yup.string()
        .matches(emailRegexRFC5322, "Invalid email address")
        .required("Email is required"),
    guardianEmail: Yup.string()
        .matches(emailRegexRFC5322, "Invalid email address")
        .required("Email is required"),
    nomineePhone: Yup.string()
        .matches(/^(?!00)(?!.*(\d)\1{9}$)\d{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
    guardianPhone: Yup.string()
        .matches(/^(?!00)(?!.*(\d)\1{9}$)\d{10}$/, "Invalid mobile number")
        .required("Mobile number is required"),
    nomineePanNumber: Yup.string()
        .required("PAN number is required")
        .matches(panRegex, "Please enter a valid PAN number. Ex: AAAPZ1234C"),
    nomineeAddress: Yup.string().required("Address Line is required"),
    nomineePincode: Yup.string()
        .required("Postal Code is required")
        .matches(/^[0-9]{6}$/, "Please enter a valid Postal Code"),
    guardianAddress: Yup.string().required("Address Line is required"),
    guardianPincode: Yup.string()
        .required("Postal Code is required")
        .matches(/^[0-9]{6}$/, "Please enter a valid Postal Code"),
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

const AddNominee = ({ onNext, onPrevious, initialValues }) => {
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [nomieePincodeId, setNomieePincodeId] = React.useState({
        state: "",
        district: "",
        pincodeId: "",
    });
    const [guardianPincodeId, setGuardianPincodeId] = React.useState({
        state: "",
        district: "",
        pincodeId: "",
    });

    const fetchPincodeDetails = async (pincode, setFieldError, key) => {
        setPincodeLoading(true);
        try {
            const response: any = await RemoteApi.get(
                `pincode/details?pincode=${pincode}`
            );

            if (response.code === 200) {
                const { bankBranch, pincode, district, state } = response.data;
                const address = `${bankBranch}, ${district}, ${state}, ${pincode}`;

                if (key === "nomieePincodeId") {
                    setNomieePincodeId({
                        state: response.data.state.name,
                        district: response.data.district.name,
                        pincodeId: response.data.pincodeId,
                    });
                } else {
                    setGuardianPincodeId({
                        state: response.data.state.name,
                        district: response.data.district.name,
                        pincodeId: response.data.pincodeId,
                    });
                }
            } else {
                if (key === "nomieePincodeId") {
                    setFieldError("nomineePincode", response?.message);
                } else {
                    setFieldError("guardianPincode", response?.message);
                }
            }
        } catch (error) {
            setFieldError(
                "nomieePincode",
                error?.message
                    ? error?.message
                    : "Failed to fetch pincode Details"
            );
        } finally {
            setPincodeLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        console.log("nomieevalues", values);

        setIsLoading(true);

        let data = null;

        if (guardianPincodeId.pincodeId) {
            console.log("IFNomieedata", data);
            data = {
                name: values?.nomineeName,
                dob: values?.nomineeDateOfBirth,
                address: values?.nomineeAddress,
                pincodeId: nomieePincodeId?.pincodeId,
                mobileNumber: values?.nomineePhone,
                email: values?.nomineeEmail,
                panNumber: values?.nomineePanNumber,
                isMinor: true,
                relationshipId: Number(values?.nomieeRelationship),
                guardianDetails: {
                    guardianName: values?.guardianName,
                    guardianDob: values?.guardianDateOfBirth,
                    guardianAddress: values?.guardianAddress,
                    guardianPincodeId: guardianPincodeId?.pincodeId,
                    guardianRelationshipId: Number(values?.guadianRelationship),
                    guardianMobile: values?.guardianPhone,
                    guardianEmail: values?.guardianEmail,
                },
            };

            console.log("IFNomieedata", data);
        } else {
            data = {
                name: values?.nomineeName,
                dob: values?.nomineeDateOfBirth,
                address: values?.nomineeAddress,
                pincodeId: nomieePincodeId?.pincodeId,
                mobileNumber: values?.nomineePhone,
                email: values?.nomineeEmail,
                panNumber: values?.nomineePanNumber,
                isMinor: false,
                relationshipId: Number(values?.nomieeRelationship),
            };
            console.log("elseNomieedata", data);
        }

        console.log("Nomieedata", data);

        try {
            const response: any = await RemoteApi.post(
                "distributor-onboard/add-nominee",
                data
            );

            // const response = {
            //     code: 200,
            //     data: {
            //         token: "nomieeToken",
            //     },
            // };

            console.log("response");
            console.log(response);

            if (response.code === 200) {
                // setIsVerifing(false); // Stop loading
                // const valuesWithToken = {
                //     ...values,
                //     token: response.data.token,
                //     currentStep: 6,
                // };
                onNext();
            } else {
                // setIsVerifing(false); // Stop loading
                console.log("ElseError");
            }
        } catch (error) {}
        setIsLoading(false);
    };

    // Function to fetch dropdown options
    const getOptions = async (endpoint, setter) => {
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
        }
    };

    useEffect(() => {
        getOptions("relationship/list", setRelationshipOptions);
    }, []);

    if (isLoading) {
        return (
            <View className="h-[100px]  w-full flex flex-col justify-center items-center">
                <ActivityIndicator size={50} color="#0000ff" />
                <Text className="text-bold text-lg pt-8">
                    Verifying Details
                </Text>
            </View>
        );
    }

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
                setFieldError,
            }) => (
                <>
                    <View className="w-full gap-y-2">
                        <View className="flex flex-row justify-between items-center">
                            <Text className="text-[18px] font-bold">
                                Add Nominee Details
                            </Text>
                        </View>

                        <Text className="text-[12px]">
                            Please complete all mandatory fields to successfully
                            add a nominee.
                        </Text>
                    </View>
                    <ScrollView className="pt-4">
                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Name <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("nomineeName")}
                                    onBlur={handleBlur("nomineeName")}
                                    value={values.nomineeName}
                                />
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomineeName &&
                                        errors.nomineeName && (
                                            <Text style={styles.errorText}>
                                                {errors.nomineeName}
                                            </Text>
                                        )}
                                </View>
                            </View>
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Pan Number{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange(
                                        "nomineePanNumber"
                                    )}
                                    onBlur={handleBlur("nomineePanNumber")}
                                    value={values.nomineePanNumber}
                                />
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomineePanNumber &&
                                        errors.nomineePanNumber && (
                                            <Text style={styles.errorText}>
                                                {errors.nomineePanNumber}
                                            </Text>
                                        )}
                                </View>
                            </View>
                        </View>
                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Relationship with the Nomiee{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <DropdownComponent
                                    label="Relationship"
                                    data={relationshipOptions}
                                    value={values.nomieeRelationship}
                                    setValue={(value) =>
                                        setFieldValue(
                                            "nomieeRelationship",
                                            value
                                        )
                                    }
                                    // containerStyle={styles.dropdown}
                                    noIcon={true}
                                />
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomieeRelationship &&
                                        errors.nomieeRelationship && (
                                            <Text style={styles.errorText}>
                                                {errors.nomieeRelationship}
                                            </Text>
                                        )}
                                </View>
                            </View>
                            <View className="w-[48%]">
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
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomineeDateOfBirth &&
                                        errors.nomineeDateOfBirth && (
                                            <Text style={styles.errorText}>
                                                {errors.nomineeDateOfBirth}
                                            </Text>
                                        )}
                                </View>
                            </View>
                        </View>
                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Phone Number{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("nomineePhone")}
                                    onBlur={handleBlur("nomineePhone")}
                                    value={values.nomineePhone}
                                />
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomineePhone &&
                                        errors.nomineePhone && (
                                            <Text style={styles.errorText}>
                                                {errors.nomineePhone}
                                            </Text>
                                        )}
                                </View>
                            </View>
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Email <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("nomineeEmail")}
                                    onBlur={handleBlur("nomineeEmail")}
                                    value={values.nomineeEmail}
                                />
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomineeEmail &&
                                        errors.nomineeEmail && (
                                            <Text style={styles.errorText}>
                                                {errors.nomineeEmail}
                                            </Text>
                                        )}
                                </View>
                            </View>
                        </View>
                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Pincode{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    // onChangeText={handleChange("postalCode")}
                                    onChangeText={(value) => {
                                        handleChange("nomineePincode")(value);
                                        console.log("postal");
                                        console.log(value);
                                        if (value.length === 6) {
                                            fetchPincodeDetails(
                                                value,
                                                setFieldError,
                                                "nomieePincodeId"
                                            );
                                        } else {
                                            setNomieePincodeId({
                                                district: "",
                                                state: "",
                                                pincodeId: "",
                                            });
                                        }
                                    }}
                                    onBlur={handleBlur("nomineePincode")}
                                    value={values.nomineePincode}
                                    keyboardType="numeric" // Restrict input to numeric characters
                                    maxLength={6}
                                />
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomineePincode &&
                                        errors.nomineePincode && (
                                            <Text style={styles.errorText}>
                                                {errors.nomineePincode}
                                            </Text>
                                        )}
                                </View>
                            </View>
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Address{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange(
                                        "nomineeAddress"
                                    )}
                                    onBlur={handleBlur("nomineeAddress")}
                                    value={values.nomineeAddress}
                                />
                                <View style={{ minHeight: 20 }}>
                                    {touched.nomineeAddress &&
                                        errors.nomineeAddress && (
                                            <Text style={styles.errorText}>
                                                {errors.nomineeAddress}
                                            </Text>
                                        )}
                                </View>
                            </View>
                        </View>
                        {isLoading && (
                            <View className="flex flex-row justify-between items-center w-full  mb-4">
                                <ActivityIndicator />
                            </View>
                        )}
                        {nomieePincodeId.state &&
                            nomieePincodeId.district &&
                            !isLoading && (
                                <View className="flex flex-row justify-between items-center w-full  mb-4">
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            District{" "}
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
                                                "district"
                                            )}
                                            // onBlur={handleBlur("city")}
                                            value={nomieePincodeId.district}
                                        />
                                        {/* {touched.city && errors.city && (
                                <Text style={styles.error}>{errors.city}</Text>
                            )} */}
                                    </View>
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            State{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                styles.disabledInput,
                                            ]}
                                            onChangeText={handleChange("state")}
                                            // onBlur={handleBlur("state")}
                                            value={nomieePincodeId.state}
                                        />
                                        {/* {touched.state && errors.state && (
                                <Text style={styles.error}>{errors.state}</Text>
                            )} */}
                                    </View>
                                </View>
                            )}
                        {/* Conditional rendering for Guardian's fields */}
                        {new Date(values.nomineeDateOfBirth) >
                            eighteenYearsAgo && (
                            <>
                                <View className="flex flex-row justify-between items-center w-full  mb-4">
                                    <Text className="text-[12px]">
                                        Nominee is minor, please enter
                                        Guardian’s details
                                    </Text>
                                </View>
                                <View className="flex flex-row justify-between items-center w-full  mb-4">
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Guardian’s Name{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange(
                                                "guardianName"
                                            )}
                                            onBlur={handleBlur("guardianName")}
                                            value={values.guardianName}
                                        />
                                        <View style={{ minHeight: 20 }}>
                                            {touched.guardianName &&
                                                errors.guardianName && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.guardianName}
                                                    </Text>
                                                )}
                                        </View>
                                    </View>
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Guardian’s Date of Birth{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
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
                                        <View style={{ minHeight: 20 }}>
                                            {touched.guardianDateOfBirth &&
                                                errors.guardianDateOfBirth && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {
                                                            errors.guardianDateOfBirth
                                                        }
                                                    </Text>
                                                )}
                                        </View>
                                    </View>
                                </View>
                                <View className="flex flex-row justify-between items-center w-full  mb-4">
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Guardian’s Phone{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange(
                                                "guardianPhone"
                                            )}
                                            onBlur={handleBlur("guardianPhone")}
                                            value={values.guardianPhone}
                                        />
                                        <View style={{ minHeight: 20 }}>
                                            {touched.guardianPhone &&
                                                errors.guardianPhone && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.guardianPhone}
                                                    </Text>
                                                )}
                                        </View>
                                    </View>
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Guardian’s Email{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange(
                                                "guardianEmail"
                                            )}
                                            onBlur={handleBlur("guardianEmail")}
                                            value={values.guardianEmail}
                                        />
                                        <View style={{ minHeight: 20 }}>
                                            {touched.guardianEmail &&
                                                errors.guardianEmail && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.guardianEmail}
                                                    </Text>
                                                )}
                                        </View>
                                    </View>
                                </View>
                                <View className="flex flex-row justify-between items-center w-full  mb-4">
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Guadian Relationship with the Nomiee{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <DropdownComponent
                                            label="Relationship"
                                            data={relationshipOptions}
                                            value={values.relationship}
                                            setValue={(value) =>
                                                setFieldValue(
                                                    "guadianRelationship",
                                                    value
                                                )
                                            }
                                            // containerStyle={styles.dropdown}
                                            noIcon={true}
                                        />
                                        <View style={{ minHeight: 20 }}>
                                            {touched.guadianRelationship &&
                                                errors.guadianRelationship && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {
                                                            errors.guadianRelationship
                                                        }
                                                    </Text>
                                                )}
                                        </View>
                                    </View>
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Guardian’s Pincode{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            // onChangeText={handleChange("postalCode")}
                                            onChangeText={(value) => {
                                                handleChange("guardianPincode")(
                                                    value
                                                );
                                                console.log("postal");
                                                console.log(value);
                                                if (value.length === 6) {
                                                    fetchPincodeDetails(
                                                        value,
                                                        setFieldError,
                                                        "guardianPincodeId"
                                                    );
                                                } else {
                                                    setGuardianPincodeId({
                                                        district: "",
                                                        state: "",
                                                        pincodeId: "",
                                                    });
                                                }
                                            }}
                                            onBlur={handleBlur(
                                                "guardianPincode"
                                            )}
                                            value={values.guardianPincode}
                                            keyboardType="numeric" // Restrict input to numeric characters
                                            maxLength={6}
                                        />
                                        <View style={{ minHeight: 20 }}>
                                            {touched.guardianPincode &&
                                                errors.guardianPincode && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.guardianPincode}
                                                    </Text>
                                                )}
                                        </View>
                                    </View>
                                </View>
                                <View className="flex flex-row justify-between items-center w-full  mb-4">
                                    <View className="w-[48%]">
                                        <Text style={styles.label}>
                                            Guardian’s Address{" "}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={handleChange(
                                                "guardianAddress"
                                            )}
                                            onBlur={handleBlur(
                                                "guardianAddress"
                                            )}
                                            value={values.guardianAddress}
                                        />
                                        <View style={{ minHeight: 20 }}>
                                            {touched.guardianAddress &&
                                                errors.guardianAddress && (
                                                    <Text
                                                        style={styles.errorText}
                                                    >
                                                        {errors.guardianAddress}
                                                    </Text>
                                                )}
                                        </View>
                                    </View>
                                </View>
                                {isLoading && (
                                    <View className="flex flex-row justify-between items-center w-full  mb-4">
                                        <ActivityIndicator />
                                    </View>
                                )}
                                {guardianPincodeId.state &&
                                    guardianPincodeId.district &&
                                    !isLoading && (
                                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                                            <View className="w-[48%]">
                                                <Text style={styles.label}>
                                                    District{" "}
                                                    <Text
                                                        style={styles.required}
                                                    >
                                                        *
                                                    </Text>
                                                </Text>
                                                <TextInput
                                                    style={[
                                                        styles.input,
                                                        styles.disabledInput,
                                                    ]}
                                                    onChangeText={handleChange(
                                                        "district"
                                                    )}
                                                    // onBlur={handleBlur("city")}
                                                    value={
                                                        guardianPincodeId.district
                                                    }
                                                />
                                                {/* {touched.city && errors.city && (
                                <Text style={styles.error}>{errors.city}</Text>
                            )} */}
                                            </View>
                                            <View className="w-[48%]">
                                                <Text style={styles.label}>
                                                    State{" "}
                                                    <Text
                                                        style={styles.required}
                                                    >
                                                        *
                                                    </Text>
                                                </Text>
                                                <TextInput
                                                    style={[
                                                        styles.input,
                                                        styles.disabledInput,
                                                    ]}
                                                    onChangeText={handleChange(
                                                        "state"
                                                    )}
                                                    // onBlur={handleBlur("state")}
                                                    value={
                                                        guardianPincodeId.state
                                                    }
                                                />
                                                {/* {touched.state && errors.state && (
                                <Text style={styles.error}>{errors.state}</Text>
                            )} */}
                                            </View>
                                        </View>
                                    )}
                            </>
                        )}
                    </ScrollView>
                    <View className="flex flex-row justify-between w-full ">
                        <View className="w-[48%]">
                            <CustomButton
                                onPress={onPrevious}
                                title="Back"
                                disabled={false}
                                buttonStyle={"outline"}
                            />
                        </View>
                        <View className="w-[48%]">
                            <CustomButton
                                onPress={() => {
                                    console.log("pressed habdle");
                                    handleSubmit();
                                }}
                                title="Save Nominee"
                                // disabled={isVerifing === true}
                                buttonStyle={"full"}
                            />
                        </View>
                    </View>
                </>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
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
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    disabledInput: {
        backgroundColor: "#f5f5f5", // Light grey to indicate disabled
    },
});

export default AddNominee;
