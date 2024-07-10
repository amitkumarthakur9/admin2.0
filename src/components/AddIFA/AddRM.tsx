import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Pressable,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import RemoteApi from "../../services/RemoteApi";
import { MaterialIcons } from "@expo/vector-icons";
import { RMid } from "../../helper/helper";
import { ToastAlert } from "../../helper/CustomToaster";
import CalendarSinglePicker from "../CustomDatePicker/CalendarSinglePicker";
import { useToast } from "native-base";
import { v4 as uuidv4 } from "uuid";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    mobileNumber: Yup.string()
        .matches(/^\d{10}$/, "Please enter a valid 10-digit mobile number")
        .required("Mobile number is required"),
    rm: Yup.string().required("RM is required"),
    sexId: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.string()
        .matches(
            /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
            "Please enter a valid format YYYY-MM-DD"
        )
        .required("Date of birth is required")
        .test(
            "dateOfBirth",
            "Date of birth must be after 1900-01-01",
            (value) => {
                const minDate = new Date("1900-01-01");
                const inputDate = new Date(value);
                return inputDate >= minDate;
            }
        ),
    employeeCode: Yup.string()
        .matches(/^[A-Z0-9]{6,10}$/, "Please enter a valid Employee code")
        .required("Employee code is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm the password"),
});

const AddRMUser = () => {
    const role = RMid();
    const [options, setOptions] = useState([{ name: "Self", id: role }]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const [toasts, setToasts] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        async function getRM() {
            const response = await RemoteApi.post("aum/management-user/list");
            setOptions(response.data);
        }
        getRM();
        setIsLoading(false);
    }, []);

    useEffect(() => {
        toast.closeAll();
        if (toasts.length > 0) {
            const latestToast = toasts[toasts.length - 1];
            toast.show({
                render: () => (
                    <ToastAlert
                        id={latestToast.id}
                        variant={latestToast.variant}
                        title={latestToast.title}
                        description=""
                        isClosable={false}
                        toast={toast}
                        status={latestToast.status}
                        onClose={() => removeToast(latestToast.id)}
                    />
                ),
                placement: "top",
            });
        }
    }, [toasts]);

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const initialValues = {
        name: "",
        email: "",
        mobileNumber: "",
        rm: "",
        sexId: "",
        dateOfBirth: "",
        employeeCode: "",
        password: "",
        confirmPassword: "",
    };

    const handleSubmit = async (values, { resetForm }) => {
        const data = {
            name: values.name,
            employeeCode: values.employeeCode,
            dateOfBirth: values.dateOfBirth,
            sexId: parseInt(values.sexId),
            email: values.email,
            password: values.password,
            mobileNumber: values.mobileNumber,
            assignedTo: parseInt(values.rm),
        };

        try {
            const response = await RemoteApi.post("/onboard/distributor", data);

            if (response?.message === "Success") {
                const uniqueId = uuidv4();
                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: `RM added successfully`,
                        status: "success",
                    },
                ]);
            } else if (
                response?.message === "Error in Adding User." ||
                response?.code === 425
            ) {
                const uniqueId = uuidv4();
                const errorMessage = response?.errors[0]?.message;
                const fieldsToCheck = ["email", "mobileNumber", "employeeCode"];

                let message;

                if (errorMessage) {
                    const mentionedField = fieldsToCheck.find((field) =>
                        errorMessage.includes(field)
                    );

                    if (mentionedField) {
                        message = mentionedField;
                    } else {
                        message = "Unknown error";
                    }
                } else {
                    message = "No error message";
                }

                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: `${message} already in Database`,
                        status: "error",
                    },
                ]);
            }
        } catch (error) {
            console.error(error);
        }

        resetForm();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        );
    }

    return (
        <ScrollView
            className=""
            style={{
                backgroundColor: "white",
                height: "100%",
                overflow: "scroll",
            }}
        >
            <View className="bg-white">
                <View className="">
                    <TableBreadCrumb name={"Add Distributor"} />
                </View>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View className="w-full flex items-center">
                        <View className="flex flex-row justify-center items-center w-[50%]">
                            <View
                                style={{
                                    flex: 1,
                                    // justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
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
                                        <ScrollView
                                            contentContainerStyle={
                                                styles.container
                                            }
                                        >
                                            <View style={styles.formRow}>
                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Enter your full name as
                                                        per PAN
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        onChangeText={handleChange(
                                                            "name"
                                                        )}
                                                        onBlur={handleBlur(
                                                            "name"
                                                        )}
                                                        value={values.name}
                                                    />
                                                    {touched.name &&
                                                        errors.name && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {errors.name}
                                                            </Text>
                                                        )}
                                                </View>

                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Enter your Email
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        onChangeText={handleChange(
                                                            "email"
                                                        )}
                                                        onBlur={handleBlur(
                                                            "email"
                                                        )}
                                                        value={values.email}
                                                    />
                                                    {touched.email &&
                                                        errors.email && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {errors.email}
                                                            </Text>
                                                        )}
                                                </View>
                                            </View>

                                            <View style={styles.formRow}>
                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Enter your Mobile number
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        onChangeText={handleChange(
                                                            "mobileNumber"
                                                        )}
                                                        onBlur={handleBlur(
                                                            "mobileNumber"
                                                        )}
                                                        value={
                                                            values.mobileNumber
                                                        }
                                                        keyboardType="numeric"
                                                        maxLength={10}
                                                    />
                                                    {touched.mobileNumber &&
                                                        errors.mobileNumber && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {
                                                                    errors.mobileNumber
                                                                }
                                                            </Text>
                                                        )}
                                                </View>

                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Gender
                                                    </Text>
                                                    <View
                                                        style={
                                                            styles.radioGroup
                                                        }
                                                    >
                                                        <Pressable
                                                            onPress={() =>
                                                                setFieldValue(
                                                                    "sexId",
                                                                    "1"
                                                                )
                                                            }
                                                            style={[
                                                                styles.radioButton,
                                                                values.sexId ===
                                                                    "1" &&
                                                                    styles.radioSelected,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.radioText
                                                                }
                                                            >
                                                                Male
                                                            </Text>
                                                        </Pressable>
                                                        <Pressable
                                                            onPress={() =>
                                                                setFieldValue(
                                                                    "sexId",
                                                                    "2"
                                                                )
                                                            }
                                                            style={[
                                                                styles.radioButton,
                                                                values.sexId ===
                                                                    "2" &&
                                                                    styles.radioSelected,
                                                            ]}
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.radioText
                                                                }
                                                            >
                                                                Female
                                                            </Text>
                                                        </Pressable>
                                                    </View>
                                                    {touched.sexId &&
                                                        errors.sexId && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {errors.sexId}
                                                            </Text>
                                                        )}
                                                </View>
                                            </View>

                                            <View style={styles.formRow}>
                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Employee Code
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        onChangeText={handleChange(
                                                            "employeeCode"
                                                        )}
                                                        onBlur={handleBlur(
                                                            "employeeCode"
                                                        )}
                                                        value={
                                                            values.employeeCode
                                                        }
                                                    />
                                                    {touched.employeeCode &&
                                                        errors.employeeCode && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {
                                                                    errors.employeeCode
                                                                }
                                                            </Text>
                                                        )}
                                                </View>

                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Date of Birth
                                                    </Text>
                                                    <CalendarSinglePicker
                                                        value={
                                                            values.dateOfBirth
                                                        }
                                                        handleFilterChange={(
                                                            value
                                                        ) =>
                                                            setFieldValue(
                                                                "dateOfBirth",
                                                                value
                                                            )
                                                        }
                                                    />
                                                    {touched.dateOfBirth &&
                                                        errors.dateOfBirth && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {
                                                                    errors.dateOfBirth
                                                                }
                                                            </Text>
                                                        )}
                                                </View>
                                            </View>

                                            <View style={styles.formRow}>
                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Password
                                                    </Text>
                                                    <View className="flex flex-row justify-center items-center">
                                                        <TextInput
                                                            style={styles.input}
                                                            onChangeText={handleChange(
                                                                "password"
                                                            )}
                                                            onBlur={handleBlur(
                                                                "password"
                                                            )}
                                                            value={
                                                                values.password
                                                            }
                                                            secureTextEntry={
                                                                !passwordVisible
                                                            }
                                                        />
                                                        <MaterialIcons
                                                            name={
                                                                passwordVisible
                                                                    ? "visibility"
                                                                    : "visibility-off"
                                                            }
                                                            size={20}
                                                            color="#484848"
                                                            onPress={() =>
                                                                setPasswordVisible(
                                                                    !passwordVisible
                                                                )
                                                            }
                                                            className="p-4"
                                                        />
                                                    </View>

                                                    {touched.password &&
                                                        errors.password && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {
                                                                    errors.password
                                                                }
                                                            </Text>
                                                        )}
                                                </View>

                                                <View
                                                    style={
                                                        styles.fieldContainer
                                                    }
                                                >
                                                    <Text style={styles.label}>
                                                        Confirm Password
                                                    </Text>
                                                    <TextInput
                                                        style={styles.input}
                                                        onChangeText={handleChange(
                                                            "confirmPassword"
                                                        )}
                                                        onBlur={handleBlur(
                                                            "confirmPassword"
                                                        )}
                                                        value={
                                                            values.confirmPassword
                                                        }
                                                        secureTextEntry={
                                                            !passwordVisible
                                                        }
                                                    />
                                                    {touched.confirmPassword &&
                                                        errors.confirmPassword && (
                                                            <Text
                                                                style={
                                                                    styles.error
                                                                }
                                                            >
                                                                {
                                                                    errors.confirmPassword
                                                                }
                                                            </Text>
                                                        )}
                                                </View>
                                            </View>

                                            <Button
                                                title="Submit"
                                                onPress={() => handleSubmit()}
                                                color="#0066cc"
                                            />
                                        </ScrollView>
                                    )}
                                </Formik>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
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
        flex: 1,
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
    radioGroup: {
        flexDirection: "row",
    },
    radioButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: "#b3d9ff",
    },
    radioText: {
        marginLeft: 5,
    },
});

export default AddRMUser;
