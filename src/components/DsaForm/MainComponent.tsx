import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
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

const MainComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [formData, setFormData] = useState({
        fullName: null,
        email: "",
        mobileNumber: "",
        panNumber: "",
        pincode: "",
        country: "",
        arn: "",
        maritalStatus: null,
        incomeRange: null,
        education: null,
        occupation: null,
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        city: "",
        state: "",
        accountNumber: "",
        accountType: "",
        ifscCode: "",
        bankName: "",
        bankAddress: "",
        district: "",
        remark: null,
        dsaCode: null,
    });
    const [isResubmit, setIsResubmit] = useState(false);

    const [dsaData, setDsaData] = useState(null);

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
            console.log(response);
            // Handle successful submission
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const handleResubmit = () =>{
        setIsResubmit(true);
        setStep(1);
    }

    async function getUserDetail() {
        setIsLoading(true);
        try {
            // const response: any = await RemoteApi.get("user/me");
            // const response = await getResponse(200);

            const response = {
                code: 200,
                message: "Success",
                data: {
                    name: "Saffiulla Muhammad",
                    email: "saffiulla@fundexpertfintech.com",
                    mobileNumber: "9778686786",
                    maritalStatus: {
                        id:1,
                        name: "single"
                    },
                    panNumber: "AAAPZ1234C",
                    arn: "ARN-ARN123456",
                    euin: "E123456",
                    dsaCode: null,
                    remark: [
                        { id: 30, remark: null },
                        { id: 31, remark: null },
                        { id: 34, remark: null },
                        { id: 35, remark: null },
                        { id: 36, remark: null },
                        { id: 37, remark: null },
                        { id: 38, remark: null },
                        { id: 39, remark: null },
                        { id: 40, remark: null },
                        { id: 41, remark: null },
                        { id: 42, remark: null },
                        { id: 43, remark: null },
                        { id: 44, remark: null },
                        { id: 45, remark: null },
                        { id: 46, remark: null },
                        { id: 47, remark: null },
                        { id: 48, remark: null },
                        { id: 49, remark: null },
                        { id: 50, remark: null },
                        { id: 51, remark: null },
                        { id: 52, remark: null },
                        { id: 53, remark: null },
                        { id: 54, remark: null },
                        { id: 55, remark: null },
                        { id: 56, remark: null },
                        { id: 57, remark: null },
                        { id: 58, remark: null },
                        { id: 59, remark: null },
                        { id: 60, remark: null },
                        { id: 61, remark: null },
                        { id: 62, remark: null },
                        { id: 63, remark: null },
                        { id: 64, remark: null },
                        { id: 65, remark: null },
                        { id: 66, remark: null },
                        { id: 67, remark: null },
                        { id: 68, remark: null },
                        { id: 69, remark: null },
                        { id: 70, remark: null },
                        { id: 71, remark: null },
                        { id: 72, remark: null },
                        { id: 73, remark: null },
                        { id: 74, remark: null },
                        { id: 75, remark: "Change Aadhar" },
                    ],
                    incomeSlab: "null",
                    isOnBoarded: false,
                    isEsigned: false,
                    areDocumentsUploaded: true,
                    educationalQualification: "null",
                    bankAccount: [
                        {
                            id: "42",
                            accountNumber: "4549938886",
                            bankAccountType: {
                                id: 1,
                                name: "Savings Account",
                            },
                            bankBranch: {
                                ifscCode: "KKBK0008066",
                            },
                            bank: {
                                id: "107",
                                name: "KOTAK MAHINDRA BANK LIMITED",
                            },
                        },
                        {
                            id: "43",
                            accountNumber: "20278353143",
                            bankAccountType: {
                                id: 1,
                                name: "Savings Account",
                            },
                            bankBranch: {
                                ifscCode: "SBIN0007047",
                            },
                            bank: {
                                id: "168",
                                name: "STATE BANK OF INDIA",
                            },
                        },
                    ],
                    address: [
                        {
                            line1: "Bangalore",
                            line2: "Bangalore",
                            line3: null,
                            pincode: "null",
                            district: {
                                id: "224",
                                name: "BENGALURU",
                            },
                            state: {
                                id: 15,
                                name: "KARNATAKA",
                            },
                        },
                    ],
                },
                errors: [],
            };

            if (response.code === 200) {
                const userData = response.data;
                const alreadySet = () => {
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
                        arn: userData?.arn || prevState.arn,
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
                            userData?.address?.[0]?.state?.name ||
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
                            userData?.address?.[0]?.district?.name ||
                            prevState.district,
                        dsaCode: userData?.dsaCode || prevState.dsaCode,
                        remark:
                            userData?.remark?.[length - 1]?.remark ||
                            prevState.remark,
                    }));
                };

                alreadySet();

                let initialStep = 1;
                if (
                    userData?.name &&
                    userData?.email &&
                    userData?.mobileNumber &&
                    userData?.maritalStatus
                ) {
                    initialStep = 2;
                }
                if (
                    userData?.name &&
                    userData?.email &&
                    userData?.mobileNumber &&
                    userData?.address?.[0]?.state?.id &&
                    userData?.address?.[0]?.district?.id &&
                    userData?.address?.[0]?.pincode
                ) {
                    initialStep = 3;
                }
                if (
                    userData?.name &&
                    userData?.email &&
                    userData?.mobileNumber &&
                    userData?.address?.[0]?.state?.id &&
                    userData?.address?.[0]?.district?.id &&
                    userData?.address?.[0]?.pincode &&
                    userData?.incomeSlab
                ) {
                    initialStep = 4;
                }
                if (
                    userData?.bankAccount?.[0]?.accountNumber &&
                    userData?.educationalQualification
                ) {
                    initialStep = 5;
                }
                if (userData?.isEsigned == true) {
                    initialStep = 7;
                }
                if (userData?.areDocumentsUploaded == true) {
                    initialStep = 8;
                }
                if (
                    userData?.remark?.[userData.remark.length - 1]?.remark !=
                    null
                ) {
                    initialStep = 9;
                }

                setStep(initialStep);
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

    // if (isLoading || step == 0) {
    //     return (
    //         <View>
    //             <Text>Loading.....</Text>
    //         </View>
    //     );
    // }

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
                    <View style={styles.steps}>
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
                    </View>
                </View>
                {isLoading || step == 0 ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <View style={{ flex: 1, padding: 20 }}>
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
                                    <View
                                                style={styles.buttonContainer}
                                            >
                                                <Pressable
                                                    style={styles.proceed}
                                                    onPress={
                                                        handleResubmit
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.buttonText
                                                        }
                                                    >
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
                        </View>
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
