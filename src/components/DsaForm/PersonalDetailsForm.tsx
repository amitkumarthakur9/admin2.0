import React from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { Checkbox } from "react-native-paper";
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import RemoteApi from "src/services/RemoteApi";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to install expo/vector-icons

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
        .required("Mobile number is required"),
    maritalStatus: Yup.number().required("Marital status is required"),
    isArnHolder: Yup.boolean(),
    arnNumber: Yup.string().when("isArnHolder", {
        is: (isArnHolder) => isArnHolder,
        then: (schema) =>
            schema
                .required("ARN Number is required")
                .matches(
                    /^\d{1,6}$/,
                    "Enter only the digits of the ARN-Number. example: ARN-123456"
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
    euinNumber: Yup.string().when("isArnHolder", {
        is: (isArnHolder) => isArnHolder,
        then: (schema) =>
            schema
                .required("EUIN Number is required")
                .matches(
                    /^E\d{1,6}$/,
                    "EUIN Number must be in the format 'E' followed by up to 6 digits"
                ),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const PersonalDetailsForm = ({ onNext, initialValues, onPrevious }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [maritalStatusOptions, setMaritalStatusOptions] = React.useState([]);

    async function getMaritalStatus() {
        setIsLoading(true);
        try {
            const response: any = await RemoteApi.get("marital-status");
            if (response.code === 200) {
                setMaritalStatusOptions(
                    response.data.data.map((status) => ({
                        label: status.name,
                        value: status.id,
                    }))
                );
            } else {
                Alert.alert("Error", "Failed to fetch marital status list");
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while fetching the marital status list"
            );
        }

        setIsLoading(false);
    }

    React.useEffect(() => {
        getMaritalStatus();
    }, []);

    const handleSubmit = async (values) => {
        console.log("handlesubmit");

        let data = {};

        {
            values.isArnHolder === true
                ? (data = {
                      isArnHolder: values.isArnHolder,
                      arnNumber: values.arnNumber,
                      euin: values.euinNumber,
                      maritalStatusId: values.maritalStatus,
                  })
                : (data = {
                      isArnHolder: values.isArnHolder,

                      maritalStatusId: values.maritalStatus,
                  });
        }

        try {
            const response: any = await RemoteApi.post(
                "user/update-personal-details",
                data
            );
            if (response.code === 200) {
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
                values,
                errors,
                touched,
                setFieldValue,
                setValues,
            }) => {
                // React.useEffect(() => {
                //     console.log("called get detail");
                //     getPersonalDetail(setValues);
                // }, []);

                if (isLoading) {
                    return (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0066cc" />
                        </View>
                    );
                }

                return (
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter your full name as per PAN
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("fullName")}
                                        onBlur={handleBlur("fullName")}
                                        value={values.fullName}
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.fullName &&
                                            errors.fullName &&
                                            typeof errors.fullName ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.fullName}
                                                </Text>
                                            )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        {initialValues.nameError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter your Email
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.email &&
                                            errors.email &&
                                            typeof errors.email ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.email}
                                                </Text>
                                            )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        {initialValues.emailError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter your Mobile number
                                    </Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "mobileNumber"
                                        )}
                                        onBlur={handleBlur("mobileNumber")}
                                        value={values.mobileNumber}
                                        keyboardType="numeric"
                                        maxLength={10} // Restrict input to 10 digits
                                    />
                                    <View style={styles.fieldContainer}>
                                        {touched.mobileNumber &&
                                            errors.mobileNumber &&
                                            typeof errors.mobileNumber ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.mobileNumber}
                                                </Text>
                                            )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        {initialValues.mobileNumberError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    Enter Marital Status
                                </Text>
                                <DropdownComponent
                                    label="Marital Status"
                                    data={maritalStatusOptions}
                                    value={values.maritalStatus}
                                    setValue={(value) =>
                                        setFieldValue("maritalStatus", value)
                                    }
                                    noIcon={true}
                                />
                                {touched.maritalStatus &&
                                    errors.maritalStatus &&
                                    typeof errors.maritalStatus ===
                                        "number" && (
                                        <Text style={styles.error}>
                                            {errors.maritalStatus}
                                        </Text>
                                    )}
                            </View>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Pressable
                                onPress={() =>
                                    setFieldValue(
                                        "isArnHolder",
                                        !values.isArnHolder
                                    )
                                }
                                style={[
                                    styles.checkboxBase,
                                    values.isArnHolder &&
                                        styles.checkboxChecked,
                                ]}
                            >
                                {values.isArnHolder && (
                                    <MaterialIcons
                                        name="check"
                                        size={18}
                                        color="white"
                                    />
                                )}
                            </Pressable>
                            <Text style={styles.checkboxLabel}>
                                I am an ARN holder
                            </Text>
                        </View>

                        {values.isArnHolder && (
                            <View style={styles.formRow}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter your ARN number
                                    </Text>
                                    <View className="flex flex-row items-center justify-center">
                                        <View className="p-[10px] bg-gray-100 border-gray-300 border-l border-t border-b rounded-l">
                                            <Text style={styles.prefix}>
                                                ARN-
                                            </Text>
                                        </View>
                                        <TextInput
                                            style={styles.inputArn}
                                            onChangeText={handleChange(
                                                "arnNumber"
                                            )}
                                            onBlur={handleBlur("arnNumber")}
                                            value={values.arnNumber}
                                        />
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        {touched.arnNumber &&
                                            errors.arnNumber &&
                                            typeof errors.arnNumber ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.arnNumber}
                                                </Text>
                                            )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        {initialValues.arnNumberError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>
                                        Enter your EUIN number
                                    </Text>

                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange(
                                            "euinNumber"
                                        )}
                                        onBlur={handleBlur("euinNumber")}
                                        value={values.euinNumber}
                                    />

                                    <View style={styles.fieldContainer}>
                                        {touched.euinNumber &&
                                            errors.euinNumber &&
                                            typeof errors.euinNumber ===
                                                "string" && (
                                                <Text style={styles.error}>
                                                    {errors.euinNumber}
                                                </Text>
                                            )}
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        {initialValues.euinNumberError && (
                                            <Text style={styles.error}>
                                                Please correct it as per remarks
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}
                        <View className="flex flex-row justify-center gap-2">
                            {initialValues.remark && (
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
                            )}

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
                        {/* <Button
                            title="Proceed"
                            onPress={() => handleSubmit()}
                            color="#0066cc"
                        /> */}
                    </ScrollView>
                );
            }}
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
        flex: 1, // Make input take full width of its container
    },
    inputArn: {
        // borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderTopRightRadius: 5, // Left side border radius
        borderBottomRightRadius: 5, // Left side border radius
        backgroundColor: "#fff",
        flex: 1, // Make input take full width of its container
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    checkboxLabel: {
        fontSize: 16,
        color: "#333",
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        // overflow: "hidden",
        flex: 1, // Ensure the input container takes the full width of its parent
    },
    prefixContainer: {
        // borderWidth: 1,
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    prefix: {
        color: "#6b7280",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: "#0066cc",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: "#0066cc",
    },
    checkboxInner: {
        width: 12,
        height: 12,
        backgroundColor: "#ffffff",
    },
    checkboxBase: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#0066cc",
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
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

export default PersonalDetailsForm;
