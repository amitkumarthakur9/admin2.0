import React from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import DropdownComponent from "../../components/Dropdowns/NewDropDown";
import RemoteApi from "src/services/RemoteApi";

const panRegex = /^([A-Z]){3}([ABCFGHJLPT])([A-Z]){1}([0-9]){4}([A-Z]){1}?$/;

const validationSchema = Yup.object().shape({
    // panNumber: Yup.string().required("PAN is required"),
    panNumber: Yup.string()
        .required("PAN number is required")
        .matches(panRegex, "Please enter a valid PAN number. Ex: AAAPZ1234C"),

    // country: Yup.string().required("Country is required"),
    // arn: Yup.string().required("ARN is required"),
    incomeRange: Yup.number().required("Income range is required"),
    education: Yup.number().required("Education is required"),
    occupation: Yup.number().required("Occupation is required"),
});

// const incomeRangeOptions = [
//   { label: "0-10 Lacs", value: "0-10 Lacs" },
//   { label: "10-15 Lacs", value: "10-15 Lacs" },
//   { label: "15+ Lacs", value: "15+ Lacs" },
// ];

// const educationOptions = [
//     { label: "10th", value: "10th" },
//     { label: "Graduation", value: "Graduation" },
//     { label: "Post Graduation", value: "Post Graduation" },
// ];

// const occupationOptions = [
//   { label: "Service", value: "Service" },
//   { label: "Business", value: "Business" },
// ];

const ProfessionalDetailsForm = ({
    onNext,
    onSubmit,
    onPrevious,
    initialValues,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [occupationOptions, setOccupationOptions] = React.useState([]);
    const [incomeRangeOptions, setIncomeRangeOptions] = React.useState([]);
    const [educationOptions, setEducationOptions] = React.useState([]);

    async function getDropdownList(endpoint) {
        setIsLoading(true);
        try {
            const response: DropdownResponse = await RemoteApi.get(
                `${endpoint}`
            );
            if (response.code === 200) {
                if (endpoint === "occupation") {
                    setOccupationOptions(
                        response.data.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                } else if (endpoint === "income-slab") {
                    setIncomeRangeOptions(
                        response.data.data.map((state) => ({
                            label: state.name,
                            value: state.id,
                        }))
                    );
                } else if (endpoint === "education") {
                    setEducationOptions(
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
            alert("An error occurred while fetching the data list");
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        getDropdownList("occupation");
        getDropdownList("income-slab");
        getDropdownList("education");
    }, []);

    const handleSubmit = async (values) => {
        const data = {
            panNumber: values.panNumber,
            incomeSlabId: values.incomeRange,
            educationId: values.education,
            occupationId: values.occupation,
        };

        console.log(data);

        try {
            const response: any = await RemoteApi.post(
                "user/update-professional-details",
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
            // onSubmit={(values) => onSubmit(values)}
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
                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Enter PAN{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange("panNumber")}
                                onBlur={handleBlur("panNumber")}
                                value={values.panNumber}
                            />
                            {touched.panNumber &&
                                errors.panNumber &&
                                typeof errors.panNumber === "string" && (
                                    <Text style={styles.error}>
                                        {errors.panNumber}
                                    </Text>
                                )}
                            {initialValues.panError && (
                                <Text style={styles.error}>
                                    Please correct it as per remarks
                                </Text>
                            )}
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Income Range{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <DropdownComponent
                                label="Income Range"
                                data={incomeRangeOptions}
                                value={values.incomeRange}
                                // setValue={handleChange("incomeRange")}
                                containerStyle={styles.dropdown}
                                noIcon={true}
                                setValue={(value) =>
                                    setFieldValue("incomeRange", value)
                                }
                            />
                            {touched.incomeRange &&
                                errors.incomeRange &&
                                typeof errors.incomeRange === "string" && (
                                    <Text style={styles.error}>
                                        {errors.incomeRange}
                                    </Text>
                                )}
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Enter Education{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <DropdownComponent
                                label="Education"
                                data={educationOptions}
                                value={values.education}
                                // setValue={handleChange("incomeRange")}
                                containerStyle={styles.dropdown}
                                noIcon={true}
                                setValue={(value) =>
                                    setFieldValue("education", value)
                                }
                            />
                            {touched.education &&
                                errors.education &&
                                typeof errors.education === "string" && (
                                    <Text style={styles.error}>
                                        {errors.education}
                                    </Text>
                                )}
                        </View>
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>
                                Enter Occupation{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <DropdownComponent
                                label="Occupation"
                                data={occupationOptions}
                                value={values.occupation}
                                // setValue={handleChange("occupation")}
                                containerStyle={styles.dropdown}
                                noIcon={true}
                                setValue={(value) =>
                                    setFieldValue("occupation", value)
                                }
                            />
                            {touched.occupation &&
                                errors.occupation &&
                                typeof errors.occupation === "string" && (
                                    <Text style={styles.error}>
                                        {errors.occupation}
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

export default ProfessionalDetailsForm;
