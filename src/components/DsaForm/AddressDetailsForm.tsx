import React from "react";
import {
    View,
    Text,
    TextInput,
    Button,
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

const validationSchema = Yup.object().shape({
    addressLine1: Yup.string()
        .max(300, "Address line 1 cannot exceed 300 characters")
        .required("Address line 1 is required"),
    addressLine2: Yup.string()
        .max(300, "Address line 2 cannot exceed 300 characters")
        .required("Address line 2 is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    pincode: Yup.string()
        .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
        .required("Pincode is required"),
});

const AddressDetailsForm = ({ onNext, onPrevious, initialValues }) => {
    const [isLoadingState, setIsLoadingState] = React.useState(false);
    const [isLoadingDistrict, setIsLoadingDistrict] = React.useState(false);
    const [stateOptions, setStateOptions] = React.useState([]);
    const [districtOptions, setDistrictOptions] = React.useState([]);

    async function getStateList() {
        setIsLoadingState(true);
        try {
            const response: DropdownResponse = await RemoteApi.get("state/");
            if (response.code === 200) {
                setStateOptions(
                    response.data.map((state) => ({
                        label: state.name,
                        value: state.id,
                    }))
                );
            } else {
                alert("Failed to fetch state list");
            }
        } catch (error) {
            alert("An error occurred while fetching the state list");
        } finally {
            setIsLoadingState(false);
        }
    }

    async function getDistrictList(stateId) {
        setIsLoadingDistrict(true);
        try {
            const response: DropdownResponse = await RemoteApi.get(
                `district/${stateId}`
            );
            console.log("District API Response:", response); // Debugging line
            if (response.code === 200) {
                const mappedDistricts = response.data.map((district) => ({
                    label: district.name,
                    value: district.id,
                }));
                console.log("Mapped Districts:", mappedDistricts); // Debugging line
                setDistrictOptions(mappedDistricts);
            } else {
                alert("Failed to fetch district list");
            }
        } catch (error) {
            alert("An error occurred while fetching the district list");
        } finally {
            setIsLoadingDistrict(false);
        }
    }

    React.useEffect(() => {
        getStateList();
    }, []);

    const handleSubmit = async (values) => {
        const data = {
            addressDetails: {
                pincode: values.pincode,
                districtId: values.district,
                addressLine1: values.addressLine1,
                addressLine2: values.addressLine2,
                // addressLine3: values.addressLine3 || "", // Optional field
            },
        };

        // onNext(values);

        try {
            const response: DropdownResponse = await RemoteApi.post(
                "address/add-address",
                data
            );

            // const response = {
            //     code: 200,
            // };

            console.log("response")

            if (response.code === 200) {
              console.log("200")
                onNext(values);
            } else {
                Alert.alert(
                    "Error",
                    response.message || "Failed to submit the address"
                );
            }
        } catch (error) {
            Alert.alert(
                "Error",
                error.message ||
                    "An error occurred while submitting the address"
            );
        }
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
            }) => (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Address line 1</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("addressLine1")}
                                onBlur={handleBlur("addressLine1")}
                                value={values.addressLine1}
                                maxLength={300}
                            />
                            {touched.addressLine1 &&
                                typeof errors.addressLine1 === "string" && (
                                    <Text style={styles.error}>
                                        {errors.addressLine1}
                                    </Text>
                                )}
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Address line 2</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("addressLine2")}
                                onBlur={handleBlur("addressLine2")}
                                value={values.addressLine2}
                                maxLength={300}
                            />
                            {touched.addressLine2 &&
                                typeof errors.addressLine2 === "string" && (
                                    <Text style={styles.error}>
                                        {errors.addressLine2}
                                    </Text>
                                )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>State</Text>
                            {isLoadingState ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                />
                            ) : (
                                <DropdownComponent
                                    label="State"
                                    data={stateOptions}
                                    value={values.state}
                                    setValue={(value) => {
                                        setFieldValue("state", value);
                                        setFieldValue("district", ""); // Reset district when state changes
                                        getDistrictList(value);
                                    }}
                                    containerStyle={styles.dropdown}
                                />
                            )}
                            {touched.state &&
                                typeof errors.state === "string" && (
                                    <Text style={styles.error}>
                                        {errors.state}
                                    </Text>
                                )}
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>City</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("city")}
                                onBlur={handleBlur("city")}
                                value={values.city}
                            />
                            {touched.city &&
                                typeof errors.city === "string" && (
                                    <Text style={styles.error}>
                                        {errors.city}
                                    </Text>
                                )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>District</Text>
                            {isLoadingDistrict ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                />
                            ) : (
                                <DropdownComponent
                                    label="District"
                                    data={districtOptions}
                                    value={values.district}
                                    setValue={(value) =>
                                        setFieldValue("district", value)
                                    }
                                    containerStyle={styles.dropdown}
                                />
                            )}
                            {touched.district &&
                                typeof errors.district === "string" && (
                                    <Text style={styles.error}>
                                        {errors.district}
                                    </Text>
                                )}
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Enter Pincode</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("pincode")}
                                onBlur={handleBlur("pincode")}
                                value={values.pincode}
                                keyboardType="numeric"
                            />
                            {touched.pincode &&
                                typeof errors.pincode === "string" && (
                                    <Text style={styles.error}>
                                        {errors.pincode}
                                    </Text>
                                )}
                        </View>
                    </View>
                    <View className="flex flex-row justify-center gap-2">
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
});

export default AddressDetailsForm;
