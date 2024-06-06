import { Linking, Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import an icon library of your choice
import DashboardCard from "./cards/DashboardCard";
import CourseCard from "./cards/CourseCard";
import { ArrowForwardIcon, ArrowBackIcon, Button } from "native-base";
import { List } from "react-native-paper";
import { Link, router } from "expo-router";
import { useState } from "react";
import stockMarketBasicsChapters from "../../../assets/data/nsme_chapters.json";

const ModuleLearningManagement = () => {
    const [showMore, setShowMore] = useState(false);
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
    const [currentModule, setCurrentModule] = useState([0]);

    const handlePress = async () => {
        const url =
            "https://www.nism.ac.in/wp-content/uploads/2020/12/Registration_Guidelines-NISM-and-CPE.pdf";
        // Check if the link can be opened
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            // Open the link in the device's default web browser
            await Linking.openURL(url);
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    };

    return (
        <View className="h-full">
            <View className="">
                <View className="bg-[#ecf6e9] p-[35px] md:p-[20px]">
                    <Pressable
                        className=""
                        onPress={() => router.push(`/learning-center`)}
                    >
                        <ArrowBackIcon size={3} />
                    </Pressable>
                    <View className="flex flex-col items-start mt-[20px]">
                        <View className="flex flex-row items-center">
                            <Text className="font-semibold text-[#6b6b6b] text-[14px] mr-[10px]">
                                Module:
                            </Text>
                            <Text className="font-bold text-[20px]">01</Text>
                        </View>
                        <View className="flex flex-row items-center mb-[8px] mt-[20px]">
                            <Text className="font-bold text-[20px]">
                                {ifaModules[0].name}
                            </Text>
                        </View>

                        <View className="flex flex-col">
                            <Text
                                style={{
                                    marginVertical: 10,
                                    marginBottom: 10,
                                }}
                            >
                                Welcome to the School for Certification of
                                Intermediaries (SCI) at NISM! NISM is dedicated
                                to developing and administering Certification
                                Examinations and Continuing Professional
                                Education (CPE) Programs for professionals
                                working in various segments of the Indian
                                securities markets. These certifications and
                                programs are essential as mandated under the
                                Securities and Exchange Board of India
                                (Certification of Associated Persons in the
                                Securities Markets) Regulations, 2007.
                            </Text>
                            {!showMore && (
                                <Text
                                    className="underline"
                                    onPress={() => setShowMore(!showMore)}
                                >
                                    Read More
                                </Text>
                            )}
                        </View>
                        {showMore && (
                            <View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            marginVertical: 10,
                                        }}
                                    >
                                        Why are these certifications important?
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        The skills, expertise, and ethics of
                                        professionals in the securities markets
                                        play a vital role in providing effective
                                        intermediation to investors and
                                        increasing confidence in market systems
                                        and processes. Through our Certification
                                        Examinations and CPE Programs, we aim to
                                        ensure that market intermediaries meet
                                        defined minimum common benchmarks of
                                        required functional knowledge.
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        Our certification programs cover various
                                        topics including Mutual Funds, Equities,
                                        Derivatives Securities Operations,
                                        Compliance, Research Analysis,
                                        Investment Advice, and more.
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        Certification enhances the quality of
                                        market professionals and encourages
                                        greater investor participation in the
                                        markets. It provides structured career
                                        paths for students and job aspirants in
                                        the securities markets.
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            marginVertical: 10,
                                        }}
                                    >
                                        About the Certification Examination for
                                        Mutual Fund Distributors
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        Are you involved in selling and
                                        distributing mutual funds? If so, our
                                        Certification Examination for Mutual
                                        Fund Distributors is designed for you!
                                        This examination establishes a common
                                        minimum knowledge benchmark for:
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        - Individual Mutual Fund Distributors
                                        {"\n"}- Employees of organizations
                                        engaged in sales and distribution of
                                        Mutual Funds{"\n"}- Employees of Asset
                                        Management Companies, especially those
                                        involved in sales and distribution
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            marginVertical: 10,
                                        }}
                                    >
                                        Examination Objectives
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        Upon successful completion of the
                                        examination, you will:
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        - Understand the basics of mutual funds,
                                        their role, structure, and different
                                        types of schemes.
                                        {"\n"}- Gain insights into mutual fund
                                        distribution in the market, how to
                                        evaluate schemes, and recommend suitable
                                        products and services to investors.
                                        {"\n"}- Familiarize yourself with the
                                        legal, accounting, valuation, and
                                        taxation aspects of mutual funds and
                                        their distribution.
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            marginVertical: 10,
                                        }}
                                    >
                                        Assessment Structure
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        The examination comprises 100 questions,
                                        each carrying 1 mark. You have 2 hours
                                        to complete it, with a passing score of
                                        50 percent. There's no negative marking,
                                        so feel free to answer every question!
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            marginVertical: 10,
                                        }}
                                    >
                                        How to Register and Take the Examination
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        Ready to take the next step in your
                                        career?
                                    </Text>
                                    <Text style={{ marginVertical: 10 }}>
                                        Follow the steps below to become an ARN
                                        holder and start Mutual Fund
                                        Distribution.
                                    </Text>

                                    <View
                                        className="flex flex-row"
                                        style={{ marginVertical: 10 }}
                                    >
                                        <Text>
                                            Steps to register for the exam -{" "}
                                        </Text>
                                        <Text
                                            className="ml-2 underline"
                                            onPress={handlePress}
                                        >
                                            View
                                        </Text>
                                    </View>

                                    <Text style={{ marginVertical: 10 }}>
                                        Get certified and unlock new
                                        opportunities in the mutual fund
                                        industry with NISM!
                                    </Text>
                                    {showMore && (
                                        <Text
                                            className="underline"
                                            onPress={() =>
                                                setShowMore(!showMore)
                                            }
                                        >
                                            Read Less
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
                <View className="mt-[30px]"></View>
                <View className="px-[5px] md:px-[20px] mb-[30px]">
                    <View className="">
                        <View className="pl-[10px]">
                            <List.AccordionGroup>
                                {stockMarketBasicsChapters.map(
                                    (stockMarketBasicsChapter, i) => (
                                        <Pressable
                                            className=""
                                            key={i}
                                            onPress={() => {
                                                if (currentModule.includes(i)) {
                                                    setCurrentModule(
                                                        currentModule.filter(
                                                            (module) =>
                                                                module !== i
                                                        )
                                                    );
                                                } else {
                                                    setCurrentModule([
                                                        ...currentModule,
                                                        i,
                                                    ]);
                                                }
                                            }}
                                        >
                                            <View
                                                className="flex flex-row items-center justify-between px-[20px]"
                                                style={{ marginVertical: 10 }}
                                            >
                                                <View className="flex flex-row items-center">
                                                    <View className="h-[10px] w-[10px] bg-[#4db374] rounded-full"></View>
                                                    <Text className="text-[18px] ml-[5px] font-semibold text-black">
                                                        {
                                                            stockMarketBasicsChapter.level
                                                        }
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Icon
                                                        name={
                                                            currentModule.includes(
                                                                i
                                                            )
                                                                ? "minus"
                                                                : "plus"
                                                        }
                                                        size={18}
                                                        // color={"black"}
                                                    />
                                                    {/* <MaterialCommunityIcons
                                                        name={
                                                            currentModule == i
                                                                ? "arrow-up"
                                                                : "arrow-down"
                                                        }
                                                        size={20}
                                                        // color="#ffc700"
                                                    /> */}
                                                </View>
                                            </View>
                                            {currentModule.includes(i) && (
                                                <View
                                                    className="ml-[25px] border-l-[1px] border-dashed"
                                                    style={{
                                                        borderLeftColor:
                                                            "#373737",
                                                        // i + 1 <
                                                        // stockMarketBasicsChapters.length
                                                        //     ? "#373737"
                                                        //     : "transparent",
                                                    }}
                                                >
                                                    {stockMarketBasicsChapter.chapters.map(
                                                        (chapter, j) => (
                                                            <List.Accordion
                                                                title={
                                                                    <View className="flex flex-row items-center">
                                                                        <Text className="font-bold text-[#000000]">
                                                                            0
                                                                            {j +
                                                                                1}
                                                                        </Text>
                                                                        <View className="h-[18px] w-[2px] bg-black mx-[10px]"></View>
                                                                        <Text className="font-bold text-[#6e6e6e]">
                                                                            {
                                                                                chapter.name
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                }
                                                                id={
                                                                    j.toString() +
                                                                    i.toString()
                                                                }
                                                            >
                                                                <View className="flex flex-col pl-[20px]">
                                                                    <View className="flex flex-row items-center mb-[10px]">
                                                                        <Text className="text-[#6b6b6b] text-[14px] mr-2">
                                                                            Level
                                                                            Progress:
                                                                        </Text>
                                                                        <Text className="text-[18px] font-semibold">
                                                                            0%
                                                                        </Text>
                                                                    </View>
                                                                    <View className="w-[65%] md:w-[15%] h-[6px] rounded-[5px] bg-[#cfeecf] mb-[10px]">
                                                                        <View className="w-[0%] bg-[#05c005] rounded-[5px] h-[6px]"></View>
                                                                    </View>
                                                                    <View className="w-[28%] md:w-[8%] mt-[10px] mb-[20px] ">
                                                                        <Button
                                                                            on
                                                                            backgroundColor="#ffffff00"
                                                                            borderColor="#05c005"
                                                                            borderWidth={
                                                                                1
                                                                            }
                                                                            borderRadius={
                                                                                20
                                                                            }
                                                                            _text={{
                                                                                color: "#05c005",
                                                                            }}
                                                                            py={
                                                                                1
                                                                            }
                                                                            onPress={() =>
                                                                                router.push(
                                                                                    `/learning-center/${stockMarketBasicsChapter.level}/${chapter.name}`
                                                                                )
                                                                            }
                                                                        >
                                                                            Explore
                                                                        </Button>
                                                                    </View>
                                                                </View>
                                                            </List.Accordion>
                                                        )
                                                    )}
                                                </View>
                                            )}
                                        </Pressable>
                                    )
                                )}
                            </List.AccordionGroup>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ModuleLearningManagement;
