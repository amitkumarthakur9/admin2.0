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
} from "react-native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { Checkbox } from "react-native-paper";
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import RemoteApi from "src/services/RemoteApi";

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
        then: (schema) => schema.required("ARN Number is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    euinNumber: Yup.string().when("isArnHolder", {
        is: (isArnHolder) => isArnHolder,
        then: (schema) => schema.required("EUIN Number is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    // arnNumber: Yup.string().test(
    //     "arnNumber",
    //     "ARN Number is required",
    //     function (value) {
    //         return (
    //             !this.parent.isArnHolder || (this.parent.isArnHolder && value)
    //         );
    //     }
    // ),
});

const PersonalDetailsForm = ({ onNext, initialValues }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [maritalStatusOptions, setMaritalStatusOptions] = React.useState([]);

    async function getMaritalStatus() {
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
    }

    async function getPersonalDetail(setValues) {
        try {
            const response: any = await RemoteApi.get("user/me");

            if (response.message === "Success") {
                const { name, email, mobileNumber } = response.data;

                const setPersonal = () => {
                    setValues({
                        fullName: name || "",
                        email: email || "",
                        mobileNumber: mobileNumber || "",
                        isArnHolder: false,
                        arnNumber: "",
                        // maritalStatus: initialValues.maritalStatus || "",
                    });

                    console.log("settingpersonal");
                };

                // setPersonal();

                console.log("setpersonal");
            } else {
                Alert.alert("Error", "Failed to fetch personal details");
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while fetching the personal details"
            );
        } finally {
            setIsLoading(false);
        }
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
            // const response = {
            //     code: 200,
            // };
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
            initialValues={{
                ...initialValues,
                isArnHolder: false,
                arnNumber: "",
                euinNumber: "",
            }}
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
                React.useEffect(() => {
                    console.log("called get detail");
                    getPersonalDetail(setValues);
                }, []);

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
                                <Text style={styles.label}>
                                    Enter your full name as per PAN
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("fullName")}
                                    onBlur={handleBlur("fullName")}
                                    value={values.fullName}
                                />
                                {touched.fullName &&
                                    errors.fullName &&
                                    typeof errors.fullName === "string" && (
                                        <Text style={styles.error}>
                                            {errors.fullName}
                                        </Text>
                                    )}
                            </View>

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
                                {touched.email &&
                                    errors.email &&
                                    typeof errors.email === "string" && (
                                        <Text style={styles.error}>
                                            {errors.email}
                                        </Text>
                                    )}
                            </View>
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>
                                    Enter your Mobile number
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange("mobileNumber")}
                                    onBlur={handleBlur("mobileNumber")}
                                    value={values.mobileNumber}
                                    keyboardType="numeric"
                                />
                                {touched.mobileNumber &&
                                    errors.mobileNumber &&
                                    typeof errors.mobileNumber === "string" && (
                                        <Text style={styles.error}>
                                            {errors.mobileNumber}
                                        </Text>
                                    )}
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
                            <Checkbox
                                status={
                                    values.isArnHolder ? "checked" : "unchecked"
                                }
                                onPress={() =>
                                    setFieldValue(
                                        "isArnHolder",
                                        !values.isArnHolder
                                    )
                                }
                                color="#0066cc"
                            />
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
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange("arnNumber")}
                                        onBlur={handleBlur("arnNumber")}
                                        value={values.arnNumber}
                                    />
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
                                    {touched.euinNumber &&
                                        errors.euinNumber &&
                                        typeof errors.euinNumber ===
                                            "string" && (
                                            <Text style={styles.error}>
                                                {errors.euinNumber}
                                            </Text>
                                        )}
                                </View>
                            </View>
                        )}
                        <Button
                            title="Proceed"
                            onPress={() => handleSubmit()}
                            color="#0066cc"
                        />
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
        marginLeft: 8,
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
});

export default PersonalDetailsForm;
