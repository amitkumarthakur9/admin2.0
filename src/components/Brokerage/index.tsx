import React from "react";
import { View } from "react-native";
import {
    Center,
    HStack,
    Heading,
    ScrollView,
    Spinner,
    Text,
    Divider,
    Button,
} from "native-base";
import { router } from "expo-router";
import { RupeeSymbol } from "../../../src/helper/helper";
import DataTable from "../DataTable/DataTable";
import DonutPieChart from "../Chart/DonutPieChart";
import { BarChart } from "../Chart/BarChart";
import IconCard from "../Card/IconCard";
import DropdownComponent from "../Dropdowns/NewDropDown";

const timePeriodDrop = [
    { label: "last 3 months", value: "3m" },
    { label: "last 6 months", value: "6m" },
    { label: "all time", value: "all" },
];

export const Brokerage = () => {
    let isLoading = false;
    return (
        <>
            {isLoading ? (
                <Center>
                    <HStack
                        space={2}
                        marginTop={20}
                        marginBottom={20}
                        justifyContent="center"
                    >
                        <Spinner
                            color={"black"}
                            accessibilityLabel="Loading order"
                        />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                </Center>
            ) : (
                <ScrollView
                    className={`bg-white`}
                    showsVerticalScrollIndicator={true}
                >
                    <View className="bg-[#eaf3fe]">
                        <View className="flex flex-col p-4 gap-4">
                            <View className="flex flex-row items-center justify-between">
                                <View className="flex flex-row items-center">
                                    <View className="mr-4">
                                        <Text
                                            selectable
                                            className="text-base flex flex-row text-center font-bold"
                                        >
                                            Brokerage
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-xs font-normal flex flex-row text-center"
                                        >
                                            Choose time period
                                        </Text>
                                    </View>
                                    <DropdownComponent
                                        label=""
                                        data={timePeriodDrop}
                                        containerStyle={{ width: "100%" }}
                                        noIcon
                                        value={"3m"}
                                        setValue={(op) => console.log(op)}
                                    />
                                </View>
                                <Button
                                    borderColor={"#013974"}
                                    bgColor={"#fff"}
                                    _text={{ color: "#013974" }}
                                    variant="outline"
                                    className="rounded-lg"
                                    onPress={() => router.push(`dashboard`)}
                                >
                                    Go to Overall Dashboard
                                </Button>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-[#eaf3fe] pr-2 ">
                                <View className="flex flex-row w-full gap-2">
                                    <View className="flex flex-col w-full rounded bg-[#eaf3fe] h-auto ">
                                        <View className="flex flex-row rounded-full bg-white w-full">
                                            <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                <IconCard
                                                    icon="credit-card-outline"
                                                    title="Actual Commission"
                                                    description={
                                                        RupeeSymbol +
                                                        "34,00,000"
                                                    }
                                                />
                                                <Divider orientation="vertical" />
                                            </View>
                                            <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                <IconCard
                                                    icon="reiterate"
                                                    title="Payable Commission"
                                                    description={
                                                        RupeeSymbol +
                                                        "24,00,000"
                                                    }
                                                />
                                                <Divider orientation="vertical" />
                                            </View>
                                            <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                <IconCard
                                                    icon="percent-outline"
                                                    title="Commission rate"
                                                    description={"80%"}
                                                />
                                            </View>
                                        </View>
                                        <View className="flex flex-col rounded-3xl bg-white w-full mt-4">
                                            <Text className="p-4 text-lg font-bold">
                                                Brokerage Split
                                            </Text>
                                            <Divider />
                                            <View className="flex flex-row w-full rounded h-auto">
                                                <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                    <View className="w-full flex flex-col">
                                                        <Text className="text-md font-bold">
                                                            By Investment Type
                                                        </Text>

                                                        <DonutPieChart
                                                            pieData={[
                                                                {
                                                                    x: "SIP",
                                                                    y: 54.2,
                                                                },
                                                                {
                                                                    x: "One Time",
                                                                    y: 45.8,
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                    <Divider orientation="vertical" />
                                                </View>
                                                <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                    <View className="w-[99%] flex">
                                                        <BarChart
                                                            title={
                                                                "By Top 3 AMCs"
                                                            }
                                                            data={[
                                                                {
                                                                    label: "Axis MF",
                                                                    value: 120000,
                                                                },
                                                                {
                                                                    label: "Nippon India MF",
                                                                    value: 80000,
                                                                },
                                                                {
                                                                    label: "Aditya Birla",
                                                                    value: 70000,
                                                                },
                                                                {
                                                                    label: "Others",
                                                                    value: 50000,
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                    <Divider orientation="vertical" />
                                                </View>
                                                <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                    <View className="w-[99%] flex">
                                                        <BarChart
                                                            title={
                                                                "By Top 3 Clients"
                                                            }
                                                            data={[
                                                                {
                                                                    label: "Karan",
                                                                    value: 120000,
                                                                },
                                                                {
                                                                    label: "Arjun",
                                                                    value: 80000,
                                                                },
                                                                {
                                                                    label: "Sonia",
                                                                    value: 70000,
                                                                },
                                                                {
                                                                    label: "Others",
                                                                    value: 50000,
                                                                },
                                                            ]}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="p-2 rounded bg-white w-full mt-4">
                                            <DataTable
                                                rows={[]}
                                                headers={[
                                                    "Client",
                                                    "Scheme",
                                                    "Folio Number",
                                                    "Transaction Date",
                                                    "Brokerage Amount",
                                                    "Brokerage Type",
                                                    "Transaction Type",
                                                    "Units",
                                                    "Amount",
                                                ]}
                                                cellSize={[
                                                    2, 2, 1, 1, 1, 2, 1, 1,
                                                ]}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="bg-[#eaf3fe]"></View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
};

export default Brokerage;
