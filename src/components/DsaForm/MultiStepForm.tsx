import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import PersonalDetailsForm from "./PersonalDetailsForm";
import AddressDetailsForm from "./AddressDetailsForm";
import ProfessionalDetailsForm from "./ProfessionalDetailsForm";
import RemoteApi from "src/services/RemoteApi";

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // fullName: '',
        // email: '',
        // mobileNumber: '',
        // maritalStatus: '',
        // addressLine1: '',
        // addressLine2: '',
        // addressLine3: '',
        // city: '',
        // state: '',
        // pincode: '',
        // panNumber: '',
        // country: '',
        // arn: '',
        // incomeRange: '',
        // education: '',
        // occupation: '',
        fullName: "Saffi",
        email: "saffi@test.com",
        mobileNumber: "9876543210",
        panNumber: "ASBV0897",
        pincode: "756110",
        country: "India",
        arn: "dafbldlbf",
        maritalStatus: "Married",
        incomeRange: "0-10 Lacs",
        education: "Graduation",
        occupation: "Service",
        addressLine1: "dkfd",
        addressLine2: "dfas",
        addressLine3: "dsaf",
        city: "fdsf",
        state: "Odisha",
    });

    const handleNext = (values) => {
        setFormData({ ...formData, ...values });
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (values) => {
        const finalData = { ...formData, ...values };
        try {
            const response = await RemoteApi.post(
                "/onboard/distributor",
                finalData
            );
            console.log(response);
            // Handle successful submission
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 && (
                <PersonalDetailsForm
                    onNext={handleNext}
                    initialValues={formData}
                />
            )}
            {step === 2 && (
                <AddressDetailsForm
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    initialValues={formData}
                />
            )}
            {/* {step === 3 && (
                <ProfessionalDetailsForm
                    onSubmit={handleSubmit}
                    onPrevious={handlePrevious}
                    initialValues={formData}
                />
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default MultiStepForm;
