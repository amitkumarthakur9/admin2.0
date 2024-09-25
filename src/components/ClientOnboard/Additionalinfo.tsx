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
import CustomButton from "../Buttons/CustomButton";
import { showToast } from "../Toaster/Toaster";

const validationSchema = Yup.object().shape({
    incomeRange: Yup.number().required("Income range is required"),
    placeOfBirth: Yup.string()
        .matches(/^[A-Za-z\s]+$/, "Place of Birth must contain only alphabets")
        .required("Place of Birth is required"),
    isPoliticalExposed: Yup.string().required("This field is required"),
    occupation: Yup.string().required("Occupation is required"),
});

const Additonalinfo = ({ onNext, onPrevious, initialValues, closeModal }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isKYCSuccessful, setIsKYCSuccessful] = useState(false);
    const [incomeRangeOptions, setIncomeRangeOptions] = useState([]);
    const [occupationOptions, setOccupationOptions] = useState([]);

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
        getDropdownList("income-slab");
        getOptions("occupation/list", setOccupationOptions);
    }, []);

    const handleSubmit = async (values) => {
        setIsLoading(true);
        const data = {
            incomeSlabId: Number(values.incomeRange),
            placeOfBirth: values.placeOfBirth,
            politicalExposureId: values.isPoliticalExposed,
            token: initialValues.token,
            occupationId: Number(values.occupation),
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
            //     data: {
            //         token: "additonalinfotoken",
            //         isKycDone: true,
            //     },
            // };

            if (response.code === 200) {
                // setFormData((prevData) => ({
                //     ...prevData,
                //     token: response.data.token,
                // }));
                const valuesWithToken = {
                    ...values,
                    token: response.data.token,
                    currentStep: 4,
                    isKYCSuccessful: response.data.isKycDone,
                };
                onNext(valuesWithToken);
                // if (response.data.isKycDone) {

                // }else{
                //     const valuesWithToken = {
                //         ...values,
                //         token: response.data.token,
                //         currentStep: 3,
                //     };
                //     onNext(valuesWithToken);

                // }
                // setIsSubmitted(true);

                // onSubmitSuccess(true);
            } else {
                showToast(response?.message || "Something wrong");
                // remove this code just for testing
//                 const valuesWithToken = {
//                     ...values,
//                     // token: response.data.token,
//                     currentStep: 4,
//                     isKYCSuccessful: true,
//                 };
//                 onNext(valuesWithToken);
            }
        } catch (error) {}
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View className="h-[400px]  w-full flex flex-col justify-center items-center">
                <ActivityIndicator size={100} color="#0000ff" />
                <Text className="text-bold text-lg pt-8">
                    Verifying Details
                </Text>
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
                <>
                    <ScrollView contentContainerStyle={styles.container}>
                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                            <View className="w-[48%]">
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
                                {touched.incomeRange && errors.incomeRange && (
                                    <Text style={styles.error}>
                                        {errors.incomeRange}
                                    </Text>
                                )}
                            </View>

                            <View className="w-[48%]">
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
                                {touched.placeOfBirth &&
                                    errors.placeOfBirth && (
                                        <Text style={styles.error}>
                                            {errors.placeOfBirth}
                                        </Text>
                                    )}
                            </View>
                        </View>

                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                            <View className="w-[48%]">
                                <Text style={styles.label}>
                                    Is your Client a politically exposed person?{" "}
                                    <Text style={styles.required}>*</Text>
                                </Text>
                                <CustomRadioButton
                                    options={[
                                        { label: "Yes", value: 2 },
                                        { label: "No", value: 1 },
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
                            <View className="w-[48%]">
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
                                {touched.occupation && errors.occupation && (
                                    <Text style={styles.error}>
                                        {errors.occupation}
                                    </Text>
                                )}
                            </View>
                            {/* {values.isPoliticalExposed && (
                            <View className="w-[48%]">
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
                        <View className="flex flex-row justify-between items-center w-full  mb-4">
                            <View className="w-[48%]">
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
                                // <View className="w-[48%]">
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
                                <View className="w-[48%]">
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

                        {/* )} */}
                    </ScrollView>

                    <View className="flex flex-row justify-between w-full ">
                        <View className="w-[48%]">
                            <CustomButton
                                onPress={closeModal}
                                title="Close"
                                disabled={false}
                                buttonStyle={"outline"}
                            />
                        </View>
                        <View className="w-[48%]">
                            <CustomButton
                                onPress={handleSubmit}
                                title="Save and Continue"
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
    container: {
        flexGrow: 1,
        paddingTop: 20,
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
    confirmButtonText: {
        fontSize: 16,
        color: "#fff",
    },
});

export default Additonalinfo;
