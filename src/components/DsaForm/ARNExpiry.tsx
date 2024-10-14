import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "src/redux/store";
import RemoteApi from "src/services/RemoteApi";

const ARNExpiry = ({ arnDate }: { arnDate: string }) => {
    const expiryDate = new Date(arnDate);
    const currentDate = new Date();
    const threeMonthsLater = new Date(currentDate);
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);
    const [isLoading, setIsLoading] = useState(false);
    const isExpired = expiryDate.getTime() < currentDate.getTime();

    const daysBetween = (date1: Date, date2: Date) => {
        const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
        return Math.round((date1.getTime() - date2.getTime()) / oneDay);
    };
    const userDetails = useSelector(
        (state: RootState) => state.user.userDetails
    );

    const handleSubmit = async () => {
        const data = {
            isArnHolder: true,
            arnNumber: userDetails.arn,
            euin: userDetails.euin,
            maritalStatusId: userDetails.maritalStatus.id,
        };

        const newErrors = {
            euinNumber: "",
            arnNumber: "",
        };

        try {
            const response: any = await RemoteApi.post(
                "user/update-personal-details",
                data
            );

            if (response.success === 200) {
            } else {
                if (
                    response.message ===
                    "Wrong EUIN Number provided for the given ARN Number."
                ) {
                    newErrors.euinNumber = response.message;
                } else if (response.message === "ARN Number does not exist.") {
                    newErrors.arnNumber = response.message;
                } else if (
                    response.message === "Name mismatch with Arn Holder Name. "
                ) {
                    newErrors.arnNumber = response.message;
                } else {
                    newErrors.arnNumber = response.message;
                }
            }
        } catch (error) {}
    };

    if (isExpired) {
        return (
            <>
                <View className="flex-1 justify-center items-center bg-gray-100">
                    <View className="w-1/3 p-5 bg-white rounded-lg items-center ">
                        <Text className="text-red-700 font-bold text-lg p-2">
                            Renew your ARN to continue to operate.
                        </Text>
                        <Text className="text-red-700 text-lg font-bold pb-2">
                            ARN Expired on {arnDate}
                        </Text>
                        {/* <Text className=" font-bold p-4">
                            If you have renewed your ARN, click to verify
                        </Text> */}
                        {/* <View className="flex-row justify-between w-full">
                            <Pressable
                                className="flex-1 bg-blue-600 py-2 rounded items-center"
                                onPress={handleSubmit}
                            >
                                <Text className="text-white font-bold">
                                    Verify ARN
                                </Text>
                            </Pressable>
                        </View> */}
                    </View>
                </View>
            </>
        );
    }

    if (expiryDate.getTime() < threeMonthsLater.getTime()) {
        const daysLeft = daysBetween(expiryDate, currentDate);

        return (
            <View className="p-4 bg-yellow-100  w-full">
                <Text className="text-yellow-700 font-bold">
                    ARN will expire in {daysLeft} days, on{" "}
                    {expiryDate.toISOString().split("T")[0]}.
                </Text>
                <Text className="text-yellow-700">Please renew it.</Text>
            </View>
        );
    }

    // return (
    //     <View className="p-4 bg-green-100 border-l-4 border-green-500">
    //         <Text className="text-green-700 font-bold">
    //             {/* Your ARN is valid until {expiryDate.toISOString().split("T")[0]} */}
    //             .
    //         </Text>
    //     </View>
    // );
};

export default ARNExpiry;
