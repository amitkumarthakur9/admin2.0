import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import an icon library of your choice
import DashboardCard from "./cards/DashboardCard";
import CourseCard from "./cards/CourseCard";
import { router } from "expo-router";

const LearningManagement = () => {
    const ifaModules = [
        { name: "NISM Certifications Program", color: "#FFDAB9" }, // PeachPuff
        // { name: "Types of Mutual Funds", color: "#dec398" }, // PapayaWhip
        // { name: "Advantages of Investing in Mutual Funds", color: "#e3dc97" }, // LemonChiffon
        // { name: "Risks Associated with Mutual Funds", color: "#bfcebf" }, // Honeydew
        // { name: "How Mutual Funds Work", color: "#a7e3e3" }, // LightCyan
        // { name: "Net Asset Value (NAV)", color: "#b4d7d7" }, // Azure
        // { name: "Expense Ratio and Fees", color: "#bfbfd7" }, // Lavender
        // { name: "Choosing the Right Mutual Fund", color: "#e0e0b9" }, // Beige
        // { name: "Mutual Fund Performance Metrics", color: "#dfcec3" }, // Seashell
        // { name: "Mutual Fund Investment Strategies", color: "#c5c5d5" }, // GhostWhite
        // { name: "Exchange-Traded Funds (ETFs)", color: "#ccdfd5" }, // MintCream
        // { name: "Differences Between Mutual Funds and ETFs", color: "#c3cce0" }, // LightGoldenRodYellow
        // { name: "Benefits of Investing in ETFs", color: "#dcc8cf" }, // LavenderBlush
        // { name: "Risks Associated with ETFs", color: "#e1c1bd" }, // MistyRose
        // { name: "How to Invest in Mutual Funds and ETFs", color: "#ebe1b9" }, // Cornsilk
        // { name: "Cryptocurrency and Blockchain Technology", color: "#b2c6d8" }, // AliceBlue
    ];

    return (
        <View className="h-full">
            <View className="bg-[#f7f7f7]">
                <Text className="px-[20px] pt-[40px] mb-[10px] text-[#6e6e6e] text-xl">
                    Welcome to Learning Center ✌️
                    {/* <Text className="font-bold">Sourabh Bajaj ✌️</Text> */}
                </Text>
                <View className="flex flex-row justify-start px-[20px] mb-[30px]">
                    <DashboardCard
                        icon={
                            <MaterialCommunityIcons
                                name="book-open-page-variant"
                                size={30}
                                color="#ffc700"
                            />
                        }
                        count={1}
                        label={"Ongoing Lessons"}
                    />
                    <DashboardCard
                        icon={
                            <MaterialCommunityIcons
                                name="book-check"
                                size={30}
                                color="#00AC4F"
                            />
                        }
                        count={0}
                        label={"Completed Lessons"}
                    />
                </View>

                <View className="px-[20px] py-[10px]">
                    <Text className="text-[#6e6e6e] text-xl font-bold">
                        Continue Learning
                    </Text>
                </View>

                <View className="flex flex-row justify-center md:justify-start pl-[20px] pr-[20px] mb-[30px]">
                    <Pressable
                        onPress={() =>
                            router.push(
                                `/learning-center/${ifaModules[0].name}`
                            )
                        }
                        className="w-[98%] md:w-[28%] border-[#dbdbdb] border-[0.1px] p-[30px] rounded-[40px] bg-white"
                    >
                        <View className="flex flex-col items-start">
                            <Text className="font-semibold text-[#6b6b6b] text-[12px] mb-[10px]">
                                Module:
                            </Text>
                            <View className="flex flex-row items-center mb-[15px]">
                                <Text className="font-bold text-[18px]">
                                    01
                                </Text>
                                <View className="h-[20px] mx-[10px] w-[2px] bg-[#05c005]"></View>
                                <Text className="font-bold text-[14px]">
                                    {ifaModules[0].name}
                                </Text>
                            </View>
                            <View className="flex flex-row justify-between w-[100%] mb-[12px]">
                                <View className="flex flex-row items-center">
                                    <Text className="font-semibold text-[#6b6b6b] text-[10px] mr-2">
                                        Level:
                                    </Text>
                                    <Text className="font-bold text-[14px]">
                                        Beginner
                                    </Text>
                                </View>
                                <View className="flex flex-row items-center">
                                    <Text className="font-semibold text-[#6b6b6b] text-[10px] mr-2">
                                        Chapter:
                                    </Text>
                                    <Text className="font-bold text-[14px]">
                                        01
                                    </Text>
                                </View>
                            </View>
                            <View className="w-[100%] h-[6px] rounded-[5px] bg-[#cfeecf] mb-[10px]">
                                <View className="w-[20%] bg-[#05c005] rounded-[5px] h-[6px]"></View>
                            </View>
                        </View>
                    </Pressable>
                </View>

                <View className="px-[20px] py-[10px]">
                    <Text className="text-[#6e6e6e] text-xl font-bold">
                        Modules
                    </Text>
                </View>
                {/* <View className="h-[1px] bg-[#dfdfdf]"></View> */}
                <View className="flex flex-row px-[20px] w-full flex-wrap justify-start">
                    {ifaModules.map((module, i) => {
                        return (
                            <CourseCard
                                key={i}
                                index={i}
                                author={"Hari Swaminathan"}
                                label={module.name}
                                color={module.color}
                                imageUrl={
                                    i % 2 == 0
                                        ? "https://img-c.udemycdn.com/course/480x270/2762_231c_20.jpg"
                                        : "https://img-c.udemycdn.com/course/240x135/43319_36fd_6.jpg"
                                }
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

export default LearningManagement;
