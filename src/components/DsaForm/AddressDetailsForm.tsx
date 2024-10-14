import React, { useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import RemoteApi from "src/services/RemoteApi";
import CustomButton from "../Buttons/CustomButton";

const validationSchema = Yup.object().shape({
    addressLine1: Yup.string()
        .max(300, "Address line 1 cannot exceed 300 characters")
        .required("Address line 1 is required"),
    addressLine2: Yup.string()
        .max(300, "Address line 2 cannot exceed 300 characters")
        .required("Address line 2 is required"),
    city: Yup.string().required("City is required"),
    pincode: Yup.string()
        .matches(/^[0-9]{6}$/, "Please enter a valid Pincode")
        .required("Pincode is required"),
});

const AddressDetailsForm = ({
    onNext,
    onPrevious,
    initialValues,
    setFormData,
}) => {
    const [Address, setAddress] = React.useState({
        stateId: "",
        state: initialValues?.state ? initialValues?.state : "",
        district: initialValues?.district ? initialValues?.district : "",
        districtId: "",
        pincodeId: "",
    });
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchPincodeDetails = async (pincode, setFieldError) => {
        setIsLoading(true);
        try {
            const response: any = await RemoteApi.get(
                `pincode/details?pincode=${pincode}`
            );

            if (response.code === 200) {
                const { state, district, pincodeId } = response.data;
                setAddress({
                    state: state.name,
                    stateId: state.id,
                    district: district.name,
                    districtId: district.id,
                    pincodeId: pincodeId,
                });
                // const newValues = {
                //     ...formData,
                //     state: response.data.token,
                //     currentStep: 2,
                // };
                // setFormData({ ...formData, ...newValues });
            // } else if (response.success == false) {
            //     setFieldError(
            //         "pincode",
            //         response?.message || "Pincode does not exist."
            //     );
            } else {
                setFieldError(
                    "pincode",
                    response?.message || "Pincode does not exist."
                );
            }
        } catch (error) {
            setFieldError(
                "pincode",
                "An error occurred while fetching the Pincode details"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (values, actions) => {
        const data = {
            addressDetails: {
                pincode: values.pincode,
                districtId: Number(Address.districtId),
                addressLine1: values.addressLine1,
                addressLine2: values.addressLine2,
                // addressLine3: values.addressLine3 || "", // Optional field
            },
        };

        try {
            const response = await RemoteApi.post("address/add-address", data);

            // const response = {
            //     code: 200,
            // };
            if (response.code === 200) {
                const newValues = {
                    ...values,
                    state: Address.state,
                    district: Address.district,
                    districtId: Address.districtId,
                    pincodeId: Address.pincodeId,
                };
                onNext(newValues);
            } else {
                actions.setFieldError(
                    "pincode",
                    response.message || "Please try again"
                );
            }
        } catch (error) {}
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
                setFieldValue,
                values,
                errors,
                touched,
                setFieldError,
            }) => {
                // useEffect(() => {}, [initialValues, setFieldValue]);

                return (
                    <>
                        <ScrollView className="h-[450px]">
                            <View className="flex flex-row justify-between mb-4 w-full">
                                <View className="w-[48%]">
                                    <Text style={styles.label}>
                                        Address line 1{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "addressLine1"
                                        )}
                                        onBlur={handleBlur("addressLine1")}
                                        value={values.addressLine1}
                                        maxLength={300}
                                    />
                                    <View style={{ minHeight: 20 }}>
                                        {touched.addressLine1 &&
                                            typeof errors.addressLine1 ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.addressLine1}
                                                </Text>
                                            )}
                                        {initialValues.addressLineError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <View className="w-[48%]">
                                    <Text style={styles.label}>
                                        Address line 2{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "addressLine2"
                                        )}
                                        onBlur={handleBlur("addressLine2")}
                                        value={values.addressLine2}
                                        maxLength={300}
                                    />
                                    <View style={{ minHeight: 20 }}>
                                        {touched.addressLine2 &&
                                            typeof errors.addressLine2 ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.addressLine2}
                                                </Text>
                                            )}
                                        {initialValues.addressLineError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <View className="flex flex-row justify-between mb-4 w-full">
                                <View className="w-[48%]">
                                    <Text style={styles.label}>
                                        City{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("city")}
                                        onBlur={handleBlur("city")}
                                        value={values.city}
                                    />
                                    <View style={{ minHeight: 20 }}>
                                        {touched.city &&
                                            typeof errors.city === "string" && (
                                                <Text style={styles.error}>
                                                    {errors.city}
                                                </Text>
                                            )}
                                        {initialValues.cityError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View className="w-[48%]">
                                    <Text style={styles.label}>
                                        Pincode{" "}
                                        <Text className="text-red-500">*</Text>
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        // onChangeText={handleChange("postalCode")}
                                        onChangeText={(value) => {
                                            handleChange("pincode")(value);
                                            console.log("pincode");
                                            console.log(value);
                                            if (value.length === 6) {
                                                fetchPincodeDetails(
                                                    value,
                                                    setFieldError
                                                );
                                            } else {
                                                setAddress({
                                                    districtId: "",
                                                    district: "",
                                                    stateId: "",
                                                    state: "",
                                                    pincodeId: "",
                                                });
                                            }
                                        }}
                                        onBlur={handleBlur("pincode")}
                                        value={values.pincode}
                                        keyboardType="numeric" // Restrict input to numeric characters
                                        maxLength={6}
                                    />
                                    <View style={{ minHeight: 20 }}>
                                        {touched.pincode &&
                                            typeof errors.pincode ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.pincode}
                                                </Text>
                                            )}
                                        {initialValues.pinCodeError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <View className="flex flex-row justify-between w-full"></View>
                            {isLoading && (
                                <View className="flex flex-row justify-between w-full">
                                    <ActivityIndicator />
                                </View>
                            )}
                            {Address.state &&
                                Address.district &&
                                !isLoading && (
                                    <View className="flex flex-row justify-between mb-4 w-full">
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
                                                value={Address.district}
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
                                                onChangeText={handleChange(
                                                    "state"
                                                )}
                                                // onBlur={handleBlur("state")}
                                                value={Address.state}
                                            />
                                            {/* {touched.state && errors.state && (
                                <Text style={styles.error}>{errors.state}</Text>
                            )} */}
                                        </View>
                                    </View>
                                )}
                            {/* <View className="flex flex-row justify-center gap-2">
                                <View className="w-3/12">
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.back,
                                            {
                                                borderColor: "#0066cc",
                                                opacity: pressed ? 0.6 : 1,
                                            },
                                        ]}
                                        onPress={onPrevious}
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                { color: "#0066cc" },
                                            ]}
                                        >
                                            {"Back"}
                                        </Text>
                                    </Pressable>
                                </View>
                                <View className="w-3/12">
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.proceed,
                                            {
                                                borderColor: "#0066cc",
                                                opacity: pressed ? 0.6 : 1,
                                            },
                                        ]}
                                        onPress={() => handleSubmit()}
                                    >
                                        <Text
                                            style={[
                                                styles.buttonText,
                                                { color: "#ffffff" },
                                            ]}
                                        >
                                            {"Proceed"}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View> */}
                        </ScrollView>

                        <View className="flex flex-row justify-between w-full">
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
                                    onPress={handleSubmit}
                                    title="Proceed"
                                    disabled={false}
                                    buttonStyle={"full"}
                                />
                            </View>
                        </View>
                    </>
                );
            }}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        // padding: 20,
        backgroundColor: "#ffffff",
    },
    formRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    fieldContainer: {
        flex: 1,
        width: 100,
    },
    label: {
        fontSize: 12,
        marginBottom: 5,
        color: "#97989B",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        flex: 1,
        fontSize: 12,
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
    back: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
    proceed: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#0066cc",
    },
    buttonText: {
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: "#f5f5f5", // Light grey to indicate disabled
    },
    required: {
        color: "red",
    },
});

export default AddressDetailsForm;
