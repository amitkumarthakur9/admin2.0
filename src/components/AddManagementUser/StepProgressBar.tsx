import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const steps = ["Personal Details", "Credentials"];

const StepProgressBar = ({ step, stepLabel }) => {
    return (
        <View style={styles.steps}>
            {stepLabel.map((label, index) => (
                <React.Fragment key={index}>
                    <View className="">
                        <View className="flex flex-row w-full justify-center items-center">
                            <View className="">
                                {index == 0 && (
                                    <View style={[styles.firstLine]}></View>
                                )}
                                {index < stepLabel.length && index > 0 && (
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
                                    step >= index + 1 && styles.stepActive,
                                    step > index + 1 && styles.stepCompleted,
                                ]}
                            >
                                {step > index + 1 ? (
                                    <FontAwesome
                                        name="check"
                                        size={6}
                                        color="#fff"
                                    />
                                ) : (
                                    <></>
                                    // <Text
                                    //     style={[
                                    //         styles.stepNumber,
                                    //         step >= index + 1 &&
                                    //             styles.stepNumberActive,
                                    //     ]}
                                    // >
                                    //     {`0${index + 1}`}
                                    // </Text>
                                )}
                            </View>
                            <View>
                                {index < stepLabel.length - 1 && (
                                    <View
                                        style={[
                                            styles.line,
                                            step >= index + 2 &&
                                                styles.lineActive,
                                        ]}
                                    ></View>
                                )}
                                {index == stepLabel.length - 1 && (
                                    <View style={[styles.firstLine]}></View>
                                )}
                            </View>
                        </View>
                        <View>
                            <Text style={styles.stepLabel}>{label}</Text>
                        </View>
                    </View>
                </React.Fragment>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 12,
        fontWeight: "bold",
        color: "#0066cc",
        marginRight: 5,
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
        backgroundColor: "#E0E0E7",
        borderColor: "#ffffff",
        borderWidth: 2,
        padding: 4,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        width: 5,
        height: 5,
    },
    stepActive: {
        borderColor: "#0066cc",
        backgroundColor: "#ffffff",
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
        marginHorizontal: 14,
        paddingTop: 0,
        paddingBottom: 0,
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
        color: "#898F8F",
        textAlign: "center",
    },
});

export default StepProgressBar;
