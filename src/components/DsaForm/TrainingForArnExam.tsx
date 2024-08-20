import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Pressable,
    StyleSheet,
    Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomCheckbox from "../Checkbox/NativeCheckbox";

const TrainingForArnExam = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [arn, setArn] = useState("");
    const [steps, setSteps] = useState({
        step1: false,
        step2: false,
        step4: false,
    });

    const handleBooking = (date) => {
        setSelectedDate(date);
    };

    const handleCheckBoxChange = (step) => {
        setSteps((prevSteps) => ({ ...prevSteps, [step]: !prevSteps[step] }));
    };

    const handleSubmit = () => {
        console.log("ARN Submitted:", arn);
    };

    return (
        <ScrollView className="bg-gray-100 p-4 w-10/12">
            <View className="p-4 bg-white rounded-lg mb-4">
                <Text className="text-lg font-bold mb-4">
                    Training: Book your training session with us
                </Text>
                <View className="flex flex-row">
                    <View>
                        <Text className="text mb-4">
                            Next available classes
                        </Text>
                    </View>

                    <View>
                        <View className="flex-row flex-wrap mb-4 pl-4 w-8/12">
                            {[
                                "14/08/2024, 2 PM",
                                "15/08/2024, 2 PM",
                                "16/08/2024, 2 PM",
                                "17/08/2024, 2 PM",
                                "18/08/2024, 2 PM",
                                "19/08/2024, 2 PM",
                                "20/08/2024, 2 PM",
                                "21/08/2024, 2 PM",
                            ].map((date) => (
                                <TouchableOpacity
                                    key={date}
                                    className={`m-1 p-2 rounded-lg border ${
                                        selectedDate === date
                                            ? "bg-[#114EA8] border-[#114EA8]"
                                            : "bg-[#EFF5FF] border-[#EFF5FF]"
                                    }`}
                                    onPress={() => handleBooking(date)}
                                >
                                    <Text
                                        className={`${
                                            selectedDate === date
                                                ? "text-white"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {date}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View className="w-1/4 pl-4">
                            <TouchableOpacity className="bg-[#114EA8] p-2 rounded-lg">
                                <Text className="text-white text-center">
                                    Confirm Booking
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <Text className="text-2xl font-bold my-4 text-center">
                How It Works
            </Text>

            <View className="bg-white p-4 rounded-lg mb-4 flex flex-row w-full justify-center">
                <View className="w-1/2">
                    <Text className="text-lg font-bold mb-2">
                        1. Register on the NISM portal
                    </Text>
                    <Text className="mb-2">
                        You can register for the NISM exam by clicking on the
                        below link
                    </Text>
                    <View className="flex flex-row items-center justify-between">
                        <View className="flex-1">
                            <TouchableOpacity className="border border-[#114EA8] p-2 rounded-lg my-2">
                                <Text className="text-[#114EA8] text-center">
                                    Register Now
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 flex flex-row justify-center">
                            <CustomCheckbox
                                label="Mark as Done"
                                isChecked={steps.step1}
                                onChange={() => handleCheckBoxChange("step1")}
                            />
                        </View>
                    </View>
                </View>

                <View className="w-1/3 justify-center items-center">
                    <Image
                        style={{ width: 150, height: 150 }} // adjust width and height as needed
                        source={require("../../../assets/Frame.svg")}
                        alt="No Data Available"
                    />
                </View>
            </View>

            <View className="bg-white p-4 rounded-lg mb-4 flex flex-row justify-center ">
               {/* <View className="flex flex-row justify-center items-center"> */}
               <View className="w-1/2">
                    <Text className="text-lg font-bold mb-2">
                        2. Register for certification Exam
                    </Text>
                    <Text className="mb-2">
                        You can complete your profile by clicking on the below
                        link
                    </Text>
                    <View className="flex flex-row items-center justify-between">
                        <View className="flex-1">
                            <TouchableOpacity className="border border-[#114EA8] p-2 rounded-lg my-2">
                                <Text className="text-[#114EA8] text-center">
                                    Register for Exam
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 flex flex-row justify-center">
                            <CustomCheckbox
                                label="Mark as Done"
                                isChecked={steps.step2}
                                onChange={() => handleCheckBoxChange("step2")}
                            />
                        </View>
                    </View>
                </View>

                <View className=" w-1/3 justify-center items-center">
                    <Image
                        style={{ width: 150, height: 150 }}  // adjust width and height as needed
                        source={require("../../../assets/Layer_1.svg")}
                        alt="No Data Available"
                    />
                </View>

               {/* </View> */}
                
            </View>

            <View className="bg-white p-4 rounded-lg mb-4 justify-center items-center">
                <View className=" py-4 rounded-lg  w-10/12">
                    <Text className="text-lg font-bold mb-2">
                        3. Preparation
                    </Text>
                    <Text className="font-semibold mb-2">
                        Assessment Structure:
                    </Text>
                    <Text className="mb-2">
                        The Mutual Fund Distributors examination consists of 100
                        questions of 1 mark each and should be completed in 2
                        hours. The passing score for the examination is 50%.
                        There shall be no negative marking.
                    </Text>
                    <View className="bg-[#EFF5FF] p-4 rounded-lg my-2 flex flex-row justify-between">
                        <View className="flex-col justify-between mb-2">
                            <Text>Fee (Rs)</Text>
                            <Text>1500+</Text>
                        </View>
                        <View className="flex-col justify-between mb-2">
                            <Text>Test Duration</Text>
                            <Text>120 Mins</Text>
                        </View>
                        <View className="flex-col justify-between mb-2">
                            <Text>No. of Questions</Text>
                            <Text>100</Text>
                        </View>
                        <View className="flex-col justify-between mb-2">
                            <Text>Maximum Marks</Text>
                            <Text>100</Text>
                        </View>
                        <View className="flex-col justify-between mb-2">
                            <Text>Passing Marks(%)</Text>
                            <Text>50</Text>
                        </View>
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center w-10/12 px-1">
                    <View className="gap-4">
                        <Text className="font-bold">Suggested Tutorials</Text>
                        <Text className="text-[#114EA8]">
                            Link to the Video
                        </Text>
                    </View>

                    <View className="">
                        <Text className="text-[#114EA8]">Download E-Book</Text>
                    </View>
                </View>
            </View>

            <View className="bg-white p-4 rounded-lg mb-4 flex flex-row w-full justify-center">
                <View className="w-1/2">
                    <Text className="text-lg font-bold mb-2">
                        4. Apply for EUIN and ARN
                    </Text>
                    <Text className="mb-2">
                        After you have passed the exam, you can apply for the
                        ARN
                    </Text>
                    <View className="flex flex-row items-center justify-between">
                        <View className="flex-1">
                            <TouchableOpacity className="border border-[#114EA8] p-2 rounded-lg my-2">
                                <Text className="text-[#114EA8] text-center">
                                    Apply for ARN
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 flex flex-row justify-center">
                            <CustomCheckbox
                                label="Mark as Done"
                                isChecked={steps.step4}
                                onChange={() => handleCheckBoxChange("step4")}
                            />
                        </View>
                    </View>
                </View>

                <View className="w-1/3 justify-center items-center">
                    <Image
                        style={{ width: 150, height: 150 }} // adjust width and height as needed
                        source={require("../../../assets/Group.svg")}
                        alt="No Data Available"
                    />
                </View>
            </View>

            <View className="bg-white p-4 rounded-lg mb-4 flex flex-row w-full justify-center">
                <View className="w-1/2">
                    <Text className="text-lg font-bold mb-2">
                        5. Start your MFD journey with us
                    </Text>
                    <Text className="mb-2">Enter your ARN number here</Text>
                    <View className="flex flex-row items-center justify-between gap-2">
                        <View className="flex-1">
                            <TextInput
                                className="border-gray-400 border p-2 text-gray-400 rounded-lg my-2"
                                placeholder="Enter your ARN"
                                value={arn}
                                onChangeText={setArn}
                            />
                        </View>
                        <View className="flex-1 flex flex-row justify-center ">
                            <TouchableOpacity
                                className="bg-[#114EA8] p-2 rounded-lg w-full"
                                onPress={handleSubmit}
                            >
                                <Text className="text-white text-center">
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View className="w-1/3 justify-center items-center">
                    <Image
                        style={{ width: 150, height: 150 }}  // adjust width and height as needed
                        source={require("../../../assets/Frame_1.svg")}
                        alt="No Data Available"
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default TrainingForArnExam;
