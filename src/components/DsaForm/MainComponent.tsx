import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DigioFlowComponent from "./DigioFlowComponent";
import StepThreeUpload from "./StepThreeUpload";
import Success from "./Success";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import BankDetailForm from "./BankDetailForm";
import RemoteApi from "src/services/RemoteApi";
import PersonalDetailsForm from "./PersonalDetailsForm";
import AddressDetailsForm from "./AddressDetailsForm";
import ProfessionalDetailsForm from "./ProfessionalDetailsForm";
import ProceedSign from "./ProceedSign";
import { ActivityIndicator } from "react-native-paper";
import { getResponse } from "src/helper/helper";
import { UserMeData } from "src/interfaces/DsaFormApproveInterface";
import StepProgressBar from "../AddManagementUser/StepProgressBar";

const MainComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);
    const [formDataSet, setFormDataSet] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        panNumber: "",
        pincode: "",
        country: "",
        arnNumber: "",
        euinNumber: "",
        isArnHolder: false,
        maritalStatus: null,
        incomeRange: null,
        education: null,
        occupation: null,
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: 0,
        accountNumber: "",
        accountType: "",
        ifscCode: "",
        bankName: "",
        bankAddress: "",
        district: "",
        remark: "",
        isOnBoarded: false,
        dsaCode: null,
        nameError: false,
        emailError: false,
        mobileNumberError: false,
        arnNumberError: false,
        euinNumberError: false,
        addressLineError: false,
        countryError: false,
        stateError: false,
        cityError: false,
        pinCodeError: false,
        panError: false,
        esignedDocumentError: false,
        aadharFrontDocumentError: false,
        aadharBackDocumentError: false,
        panCardDocumentError: false,
        cancelledChequeError: false,
        areDocumentsUploaded: false,
        isEsigned: false,
    });
    const [isResubmit, setIsResubmit] = useState(false);

    const [dsaData, setDsaData] = useState(null);
    const formSteps = [];

    const stepLabel = [];
    let initalStep = 1;

    const handleNext = (values) => {
        setFormData({ ...formData, ...values });
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleSuccess = () => setStep(8);

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip);
    };

    const handleSubmit = async (values) => {
        const finalData = { ...formData, ...values };
        try {
            const response = await RemoteApi.post(
                "/onboard/distributor",
                finalData
            );
            // console.log(response);
            // Handle successful submission
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const handleResubmit = () => {
        setIsResubmit(true);
        setStep(1);
    };

    async function getUserDetail() {
        setIsLoading(true);
        try {
            const response: UserMeData = await RemoteApi.get("user/me");
            // const response = await getResponse(200);

            // const response = {
            //     code: 200,
            //     message: "Success",
            //     data: {
            //         name: "Saffiulla",
            //         email: "sm@gmail.com",
            //         mobileNumber: "9778686786",
            //         maritalStatus: {
            //             id: 1,
            //             name: "Single",
            //         },
            //         panNumber: "ABCDE1234G",
            //         arn: "",
            //         euin: "E12345",
            //         dsaCode: null,
            //         remark: {
            //             id: 2,
            //             remark: "Upload pancard",
            //         },
            //         incomeSlab: {
            //             id: 0,
            //             name: null,
            //         },
            //         isOnBoarded: false,
            //         isEsigned: false,
            //         areDocumentsUploaded: false,
            //         educationalQualification: {
            //             id: null,
            //             name: null,
            //         },
            //         bankAccount: [
            //             // {
            //             //     id: "42",
            //             //     accountNumber: "45499388",
            //             //     bankAccountType: {
            //             //         id: 1,
            //             //         name: "Savings Account",
            //             //     },
            //             //     bankBranch: {
            //             //         ifscCode: "KKBK0008066",
            //             //     },
            //             //     bank: {
            //             //         id: "107",
            //             //         name: "KOTAK MAHINDRA BANK LIMITED",
            //             //     },
            //             // },
            //         ],
            //         address: [
            //             {
            //                 line1: "Bangalore",
            //                 line2: "Bangalore",
            //                 line3: null,
            //                 pincode: "560025",
            //                 district: {
            //                     id: "224",
            //                     name: "BENGALURU",
            //                 },
            //                 state: {
            //                     id: 15,
            //                     name: "KARNATAKA",
            //                 },
            //             },
            //         ],
            //         nameError: false,
            //         emailError: false,
            //         mobileNumberError: false,
            //         arnNumberError: false,
            //         euinNumberError: false,
            //         addressLineError: false,
            //         countryError: false,
            //         stateError: false,
            //         cityError: false,
            //         pinCodeError: false,
            //         panError: false,
            //         esignedDocumentError: false,
            //         aadharFrontDocumentError: true,
            //         aadharBackDocumentError: false,
            //         panCardDocumentError: false,
            //         cancelledChequeError: false,
            //     },
            //     errors: [],
            // };

            if (response.code === 200) {
                const userData = response.data;
                const alreadySet = () => {
                    console.log("setStated");

                    if (userData.arn)
                        setFormData((prevState) => ({
                            ...prevState,
                            isArnHolder: true,
                        }));

                    setFormData((prevState) => ({
                        ...prevState,
                        fullName: userData?.name || prevState.fullName,
                        email: userData?.email || prevState.email,
                        mobileNumber:
                            userData?.mobileNumber || prevState.mobileNumber,
                        panNumber: userData?.panNumber || prevState.panNumber,
                        pincode:
                            userData?.address?.[0]?.pincode ||
                            prevState.pincode,
                        arnNumber: userData?.arn || prevState.arnNumber,
                        euinNumber: userData?.euin || prevState.euinNumber,
                        maritalStatus:
                            userData?.maritalStatus?.id ||
                            prevState.maritalStatus,

                        incomeRange:
                            userData?.incomeSlab?.id || prevState.incomeRange,
                        education:
                            userData?.educationalQualification?.name ||
                            prevState.education,
                        addressLine1:
                            userData?.address?.[0]?.line1 ||
                            prevState.addressLine1,
                        addressLine2:
                            userData?.address?.[0]?.line2 ||
                            prevState.addressLine2,
                        addressLine3:
                            userData?.address?.[0]?.line3 ||
                            prevState.addressLine3,
                        city:
                            userData?.address?.[0]?.district?.name ||
                            prevState.city,
                        state:
                            userData?.address?.[0]?.state?.id ||
                            prevState.state,
                        accountNumber:
                            userData?.bankAccount?.[0]?.accountNumber ||
                            prevState.accountNumber,
                        accountType:
                            userData?.bankAccount?.[0]?.bankAccountType?.name ||
                            prevState.accountType,
                        ifscCode:
                            userData?.bankAccount?.[0]?.bankBranch?.ifscCode ||
                            prevState.ifscCode,
                        bankName:
                            userData?.bankAccount?.[0]?.bank?.name ||
                            prevState.bankName,
                        district:
                            userData?.address?.[0]?.district?.id ||
                            prevState.district,
                        dsaCode: userData?.dsaCode || prevState.dsaCode,
                        remark: userData?.remark?.remark || prevState.remark,
                        nameError: userData?.nameError || prevState.nameError,
                        emailError:
                            userData?.emailError || prevState.emailError,
                        mobileNumberError:
                            userData?.mobileNumberError ||
                            prevState.mobileNumberError,
                        arnNumberError:
                            userData?.arnNumberError ||
                            prevState.arnNumberError,
                        euinNumberError:
                            userData?.euinNumberError ||
                            prevState.euinNumberError,
                        addressLineError:
                            userData?.addressLineError ||
                            prevState.addressLineError,
                        countryError:
                            userData?.countryError || prevState.countryError,
                        stateError:
                            userData?.stateError || prevState.stateError,
                        cityError: userData?.cityError || prevState.cityError,
                        pinCodeError:
                            userData?.pinCodeError || prevState.pinCodeError,
                        panError: userData?.panError || prevState.panError,
                        esignedDocumentError:
                            userData?.esignedDocumentError ||
                            prevState.esignedDocumentError,
                        aadharFrontDocumentError:
                            userData?.aadharFrontDocumentError ||
                            prevState.aadharFrontDocumentError,
                        aadharBackDocumentError:
                            userData?.aadharBackDocumentError ||
                            prevState.aadharBackDocumentError,
                        panCardDocumentError:
                            userData?.panCardDocumentError ||
                            prevState.panCardDocumentError,
                        cancelledChequeError:
                            userData?.cancelledChequeError ||
                            prevState.cancelledChequeError,
                        isOnBoarded:
                            userData?.isOnBoarded || prevState.isOnBoarded,
                    }));
                };

                alreadySet();

                console.log("setEnd");

                setFormDataSet(true);

                // setStep(initialStep);
                console.log(formData);
            } else {
                alert("Failed to fetch user details");
            }
        } catch (error) {
            alert("An error occurred while fetching the user details");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUserDetail();
    }, []);

    useEffect(() => {
        if (formDataSet) {
            console.log("useEffect");
            console.log(formData);

            renderCurrentStep();
            // setStep(1);
            setStep(initalStep);
        }
    }, [formDataSet]);

    // Render the current step's content
    const renderCurrentStep = () => {
        const errorFlags = {
            nameError: formData.nameError,
            emailError: formData.emailError,
            mobileNumberError: formData.mobileNumberError,
            arnNumberError: formData.arnNumberError,
            euinNumberError: formData.euinNumberError,
            addressLineError: formData.addressLineError,
            countryError: formData.countryError,
            stateError: formData.stateError,
            cityError: formData.cityError,
            pinCodeError: formData.pinCodeError,
            panError: formData.panError,
            esignedDocumentError: formData.esignedDocumentError,
            aadharFrontDocumentError: formData.aadharFrontDocumentError,
            aadharBackDocumentError: formData.aadharBackDocumentError,
            panCardDocumentError: formData.panCardDocumentError,
            cancelledChequeError: formData.cancelledChequeError,
        };

        const hasNoError = Object.values(errorFlags).some((flag) => flag);

        console.log(hasNoError); // Will print true if any error flag is true, otherwise false

        if (formData.dsaCode != null || formData.isOnBoarded == true) {
            // stepLabel.push("DSA Completed");
            formSteps.push({
                key: "9",
                content: (
                    <Success
                        successMessages={[
                            "Your DSE Code is",
                            `${formData.dsaCode}`,
                        ]}
                    />
                ),
            });
        }

        if (formData.remark && formData.isOnBoarded == false) {
            stepLabel.push("Remarks");
            formSteps.push({
                key: "10",
                content: (
                    <>
                        <View className="flex flex-col items-center">
                            <Text className="text-center color-black text-lg font-bold p-4">
                                Remarks
                            </Text>
                            <Text className="text-center color-gray-700 text-lg p-4 w-1/2">
                                {formData.remark}
                            </Text>
                        </View>
                        <View className="flex flex-row justify-center gap-2">
                            {/* <View className="w-3/12">
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
                        </View> */}
                            <View className="w-3/12">
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.proceed,
                                        {
                                            borderColor: "#0066cc",
                                            opacity: pressed ? 0.6 : 1,
                                        },
                                    ]}
                                    onPress={() => handleNext("")}
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
                    </>
                ),
            });
        }

        if (
            !formData.remark ||
            (formData.remark && formData.nameError) ||
            formData.emailError ||
            formData.mobileNumberError ||
            formData.arnNumberError ||
            formData.euinNumberError
        ) {
            stepLabel.push("Personal");
            formSteps.push({
                key: "1",
                content: (
                    <View>
                        {/* {step === 1 && ( */}
                        <PersonalDetailsForm
                            onNext={handleNext}
                            initialValues={formData}
                            onPrevious={handlePrevious}
                        />
                        {/* )}  */}
                    </View>
                ),
            });
        }

        if (
            !formData.remark ||
            (formData.remark && formData.addressLineError === true) ||
            formData.countryError === true ||
            formData.stateError === true ||
            formData.cityError === true ||
            formData.pinCodeError === true ||
            formData.esignedDocumentError === true
        ) {
            stepLabel.push("Address");
            formSteps.push({
                key: "2",
                content: (
                    <View>
                        <AddressDetailsForm
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            initialValues={formData}
                        />
                    </View>
                ),
            });
        }

        if (
            !formData.remark ||
            (formData.remark && formData.panError === true) ||
            formData.esignedDocumentError === true
        ) {
            stepLabel.push("Professional");
            formSteps.push({
                key: "3",
                content: (
                    <View>
                        <ProfessionalDetailsForm
                            onSubmit={handleSubmit}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            initialValues={formData}
                        />
                    </View>
                ),
            });
        }

        if (
            !formData.remark ||
            (formData.remark && formData.esignedDocumentError === true)
        ) {
            stepLabel.push("Bank");

            formSteps.push({
                key: "4",
                content: (
                    <View>
                        <BankDetailForm
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            initialValues={formData}
                        />
                    </View>
                ),
            });
        }

        if (
            !formData.remark ||
            (formData.remark && formData.esignedDocumentError === true)
        ) {
            stepLabel.push("Proceed E-sign");

            formSteps.push({
                key: "5",
                content: (
                    <View>
                        {/* {step === 5 && ( */}
                        <ProceedSign
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                        />
                        {/* )} */}
                    </View>
                ),
            });
        }

        if (
            !formData.remark ||
            (formData.remark &&
                (formData.esignedDocumentError === true ||
                    formData.nameError === true ||
                    formData.emailError === true ||
                    formData.mobileNumberError === true ||
                    formData.arnNumberError === true ||
                    formData.euinNumberError === true ||
                    formData.addressLineError === true ||
                    formData.countryError === true ||
                    formData.stateError === true ||
                    formData.cityError === true ||
                    formData.pinCodeError === true ||
                    formData.panError === true))
        ) {
            stepLabel.push("E-sign Document");
            formSteps.push({
                key: "6",
                content: (
                    <View>
                        {/* {step === 6 &&  */}
                        <DigioFlowComponent onNext={handleNext} />
                        {/* } */}
                    </View>
                ),
            });
        }

        if (
            (!formData.remark ||
                (formData.remark &&
                    formData.aadharFrontDocumentError === true) ||
                formData.aadharBackDocumentError === true ||
                formData.panCardDocumentError === true ||
                formData.cancelledChequeError === true) &&
            formData.isOnBoarded == false
        ) {
            stepLabel.push("Upload Documents");
            formSteps.push({
                key: "7",
                content: (
                    <View>
                        {/* {step === 7 && ( */}
                        <StepThreeUpload
                            onSuccess={handleSuccess}
                            initialValues={formData}
                        />
                        {/* )} */}
                    </View>
                ),
            });
        }

        if (!formData.remark || formData.remark) {
            // stepLabel.push("Submit");
            formSteps.push({
                key: "8",
                content: (
                    <View>
                        {/* {step === 8 && ( */}
                        <Success
                            successMessages={[
                                "Application successfully submitted.",
                                "Approval Pending.",
                            ]}
                        />
                        {/* )} */}
                    </View>
                ),
            });
        }

        // let currentStep = formSteps[step - 1];
        console.log("steps");
        console.log(step);

        if (formSteps.length > 0 && !formData.remark) {
            if (
                formData?.fullName &&
                formData?.email &&
                formData?.mobileNumber &&
                formData?.maritalStatus
            ) {
                initalStep = 2;
            }
            if (
                formData?.fullName &&
                formData?.email &&
                formData?.mobileNumber &&
                formData?.addressLine1 &&
                formData?.state &&
                formData?.pincode
            ) {
                console.log(step);
                initalStep = 3;
            }
            if (
                formData?.fullName &&
                formData?.email &&
                formData?.mobileNumber &&
                formData?.addressLine1 &&
                formData?.state &&
                formData?.pincode &&
                formData?.incomeRange
            ) {
                initalStep = 4;
            }
            if (formData?.accountNumber && formData?.education) {
                initalStep = 5;
            }
            if (formData?.isEsigned == true) {
                initalStep = 6;
            }
            if (formData?.areDocumentsUploaded == true) {
                initalStep = 7;
            }
        }

        const currentStep = formSteps[step - 1];
        if (!currentStep) return null;

        console.log("uireturn");
        console.table(formSteps);
        return (
            <View>
                {currentStep.content}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 20,
                    }}
                ></View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View className="flex flex-col p-4 gap-4">
                <View className="flex flex-row items-center">
                    <Pressable
                        className="mr-3"
                        onPress={() => router.push("/dashboard")}
                    >
                        <Icon name="angle-left" size={18} color={"black"} />
                    </Pressable>
                    <Text
                        selectable
                        className="text-base flex flex-row text-center font-bold"
                    >
                        DSA Form
                    </Text>
                </View>
                <View style={styles.stepContainer}>
                    <View style={styles.stepHeader}>
                        <Text style={styles.stepText}>Steps to complete</Text>
                        <TouchableOpacity
                            onPress={toggleTooltip}
                            style={styles.tooltipIcon}
                        >
                            <FontAwesome
                                name="info"
                                size={12}
                                color="#0066cc"
                            />
                        </TouchableOpacity>
                    </View>
                    {showTooltip && (
                        <View style={styles.tooltip}>
                            <Text style={styles.tooltipText}>
                                Steps to complete your DSA Application
                            </Text>
                            <Text style={styles.tooltipText}>
                                • Fill in your Details
                            </Text>
                            <Text style={styles.tooltipText}>
                                • Generate and Sign Agreement
                            </Text>
                            <Text style={styles.tooltipText}>
                                • Upload your documents such as aadhar card
                                front, aadhar card back, PAN card, bank account
                                check copy (supported formats .PNG, JPEG, JPG &
                                PDF)
                            </Text>
                        </View>
                    )}

                    <StepProgressBar step={step} stepLabel={stepLabel} />
                    {/* <View style={styles.steps}>
                        {[
                            "Personal Details",
                            "Address",
                            "Professional Details",
                            "Bank Details",
                            "Sign Document",
                            "Upload Documents",
                        ].map((label, index) => (
                            <React.Fragment key={index}>
                                <View className="">
                                    <View className="flex flex-row w-full justify-center items-center">
                                        <View className="">
                                            {index == 0 && (
                                                <View
                                                    style={[styles.firstLine]}
                                                ></View>
                                            )}
                                            {index < 6 && index > 0 && (
                                                <View
                                                    style={[
                                                        styles.line,
                                                        step >= index + 1 &&
                                                            styles.lineActive,
                                                    ]}
                                                ></View>
                                            )}
                                        </View>
                                        <View
                                            style={[
                                                styles.step,
                                                step >= index + 1 &&
                                                    styles.stepActive,
                                                step > index + 1 &&
                                                    styles.stepCompleted,
                                            ]}
                                        >
                                            {step > index + 1 ? (
                                                <FontAwesome
                                                    name="check"
                                                    size={18}
                                                    color="#fff"
                                                />
                                            ) : (
                                                <Text
                                                    style={[
                                                        styles.stepNumber,
                                                        step >= index + 1 &&
                                                            styles.stepNumberActive,
                                                    ]}
                                                >
                                                    {`0${index + 1}`}
                                                </Text>
                                            )}
                                        </View>
                                        <View>
                                            {index < 5 && (
                                                <View
                                                    style={[
                                                        styles.line,
                                                        step >= index + 2 &&
                                                            styles.lineActive,
                                                    ]}
                                                ></View>
                                            )}
                                            {index == 5 && (
                                                <View
                                                    style={[styles.firstLine]}
                                                ></View>
                                            )}
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={styles.stepLabel}>
                                            {label}
                                        </Text>
                                    </View>
                                </View>
                            </React.Fragment>
                        ))}
                    </View> */}
                </View>
                {isLoading || step == 0 ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        {/* <View style={{ flex: 1, padding: 20 }}>
                            {formSteps.map((formStep, index) => (
                                <View key={formStep.key}>
                                    {step === index + 1 && formStep.content}
                                </View>
                            ))}
                        </View> */}

                        {renderCurrentStep()}

                        {/* <View style={{ flex: 1, padding: 20 }}>
                 
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
                            {step === 3 && (
                                <ProfessionalDetailsForm
                                    onSubmit={handleSubmit}
                                    onNext={handleNext}
                                    onPrevious={handlePrevious}
                                    initialValues={formData}
                                />
                            )}
                            {step === 4 && (
                                <BankDetailForm
                                    onPrevious={handlePrevious}
                                    onNext={handleNext}
                                    initialValues={formData}
                                />
                            )}
                            {step === 5 && (
                                <ProceedSign
                                    onPrevious={handlePrevious}
                                    onNext={handleNext}
                                />
                            )}
                            {step === 6 && (
                                <DigioFlowComponent onNext={handleNext} />
                            )}

                            {step === 7 && (
                                <StepThreeUpload onSuccess={handleSuccess} />
                            )}
                            {step === 8 && (
                                <Success
                                    successMessages={[
                                        "Application successfully submitted.",
                                        "Approval Pending.",
                                    ]}
                                />
                            )}
                            {step === 9 &&
                                (formData.dsaCode != null ? (
                                    <Success
                                        successMessages={[
                                            "Your DSE Code is",
                                            `${formData.dsaCode}`,
                                        ]}
                                    />
                                ) : (
                                    <>
                                        <View style={styles.buttonContainer}>
                                            <Pressable
                                                style={styles.proceed}
                                                onPress={handleResubmit}
                                            >
                                                <Text style={styles.buttonText}>
                                                    Resubmit
                                                </Text>
                                            </Pressable>
                                        </View>
                                        <View>
                                            <Text className="text-center color-black text-lg font-bold p-4">
                                                Remarks
                                            </Text>
                                            <Text className="text-center color-black text-lg font-bold p-4">
                                                {formData.remark}
                                            </Text>
                                        </View>
                                    </>
                                ))}
                        </View> */}
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    stepContainer: {
        padding: 20,
        position: "relative",
        zIndex: 1,
    },
    stepHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    stepText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0066cc",
        marginRight: 5,
    },
    tooltipIcon: {
        borderWidth: 2,
        borderColor: "#0066cc",
        borderRadius: 15,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    tooltip: {
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderColor: "#d3d3d3",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        zIndex: 10,
    },
    tooltipText: {
        color: "#333",
        marginBottom: 5,
    },
    steps: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    stepWrapper: {
        alignItems: "center",
    },
    step: {
        backgroundColor: "#fff",
        borderColor: "#d3d3d3",
        borderWidth: 2,
        padding: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
    },
    stepActive: {
        borderColor: "#0066cc",
    },
    stepCompleted: {
        backgroundColor: "#0066cc",
    },
    stepNumber: {
        color: "#d3d3d3",
        fontWeight: "bold",
    },
    stepNumberActive: {
        color: "#0066cc",
    },
    line: {
        backgroundColor: "#d3d3d3",
        alignSelf: "center",
        marginHorizontal: 10,
        paddingTop: 2,
        paddingBottom: 2,
        width: "100%",
        borderColor: "#d3d3d3",
        borderWidth: 1,
        padding: 10,
    },
    firstLine: {
        backgroundColor: "#ffffff",
        alignSelf: "center",
        marginHorizontal: 10,
        paddingTop: 2,
        paddingBottom: 2,
        width: "100%",
        borderColor: "#ffffff",
        borderWidth: 1,
        padding: 10,
    },
    lineActive: {
        backgroundColor: "#0066cc",
        borderColor: "#0066cc",
    },
    stepLabel: {
        marginTop: 5,
        fontSize: 12,
        color: "#333",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: 20,
    },
    buttonText: {
        fontSize: 16,
        color: "#ffffff",
    },
    proceed: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
        backgroundColor: "#0066cc",
    },
});

export default MainComponent;
