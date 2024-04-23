import React, { useEffect, useState } from "react";
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
    Image,
} from "native-base";
import { router } from "expo-router";
import { useMutation, useQuery } from "react-query";
import { DateTime } from "luxon";

import { RupeeSymbol } from "../../../src/helper/helper";
import DataTable from "../DataTable/DataTable";
import DonutPieChart from "../Chart/DonutPieChart";
import { BarChart } from "../Chart/BarChart";
import IconCard from "../Card/IconCard";
import DropdownComponent from "../Dropdowns/NewDropDown";
import RemoteApi from "../../../src/services/RemoteApi";

export const Brokerage = () => {
    const now = DateTime.now();
    const timePeriodDrop = [
        {
            label: "last month",
            value: now.minus({ months: 1 }).toFormat("yyyy-MM-dd"),
        },
        {
            label: "last 3 months",
            value: now.minus({ months: 3 }).toFormat("yyyy-MM-dd"),
        },
        {
            label: "last 6 months",
            value: now.minus({ months: 6 }).toFormat("yyyy-MM-dd"),
        },
        { label: "all time", value: "" },
    ];
    const [duration, setDuration] = useState(
        now.minus({ months: 1 }).toFormat("yyyy-MM-dd")
    );

    const changeDuration = (text) => {
        setDuration(text);
    };

    const fetchBrokerage = async () => {
        try {
            const response: ApiResponse<BrokerageResponse> =
                await RemoteApi.get(
                    `dashboard/brokerage${
                        duration.length > 1 ? `?from=${duration}` : ``
                    }`
                );
            return response;
        } catch (error) {
            throw error;
        }
    };

    const fetchTopClients = async () => {
        try {
            const response: ApiResponse<BrokerageTopClientsResponse[]> =
                await RemoteApi.get(`dashboard/brokerage/top-clients`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const postBrokerageTransactions = async () => {
        try {
            const response: ApiResponse<ClientBrokerageTransaction[]> =
                await RemoteApi.post(`dashboard/brokerage/transactions`);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const { data: brokerage, isLoading } = useQuery({
        queryKey: ["brokerage", duration],
        queryFn: fetchBrokerage,
        enabled: true,
    });

    const { data: brokerageTopClients, isLoading: topClientsLoading } =
        useQuery({
            queryKey: ["brokerage-top-clients"],
            queryFn: fetchTopClients,
            enabled: true,
        });

    const { data: brokerageTransactions, mutate } = useMutation({
        mutationFn: postBrokerageTransactions,
        mutationKey: ["brokerage-transactions"],
    });

    useEffect(() => {
        mutate();
    }, []);

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
                                        value={duration}
                                        setValue={changeDuration}
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
                                                        `${
                                                            brokerage?.data
                                                                ?.totalAmount
                                                                ? brokerage
                                                                      ?.data
                                                                      ?.totalAmount
                                                                : "0"
                                                        }`
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
                                                        `${
                                                            brokerage?.data
                                                                ?.subBrokerAmount
                                                                ? brokerage
                                                                      ?.data
                                                                      ?.subBrokerAmount
                                                                : "0"
                                                        }`
                                                    }
                                                />
                                                <Divider orientation="vertical" />
                                            </View>
                                            {/* <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                <IconCard
                                                    icon="percent-outline"
                                                    title="Commission rate"
                                                    description={"80%"}
                                                />
                                            </View> */}
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

                                                        {brokerage?.data
                                                            ?.totalAmount >
                                                        0 ? (
                                                            <DonutPieChart
                                                                pieData={[
                                                                    {
                                                                        x: "SIP",
                                                                        y:
                                                                            brokerage
                                                                                ?.data
                                                                                ?.sipTotal /
                                                                            brokerage
                                                                                ?.data
                                                                                ?.totalAmount,
                                                                    },
                                                                    {
                                                                        x: "One Time",
                                                                        y:
                                                                            brokerage
                                                                                ?.data
                                                                                ?.oneTimeTotal /
                                                                            brokerage
                                                                                ?.data
                                                                                ?.totalAmount,
                                                                    },
                                                                ]}
                                                            />
                                                        ) : (
                                                            <View className="h-full flex flex-col items-center justify-center gap-8">
                                                                <Image
                                                                    width="72px"
                                                                    height="72px"
                                                                    source={require("../../../assets/images/noData.png")}
                                                                />
                                                                <Text className="text-md font-bold">
                                                                    No Data
                                                                    Available
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Divider orientation="vertical" />
                                                </View>
                                                <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                    <View className="w-[99%] flex">
                                                        <BarChart
                                                            title={
                                                                "By Top AMCs"
                                                            }
                                                            data={brokerage?.data?.topFundhouse?.map(
                                                                (el) => {
                                                                    return {
                                                                        label: el.fundhouse,
                                                                        value: el.subBrokerAmount,
                                                                    };
                                                                }
                                                            )}
                                                        />
                                                    </View>
                                                    <Divider orientation="vertical" />
                                                </View>
                                                <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                    <View className="w-[99%] flex">
                                                        <BarChart
                                                            title={
                                                                "By Top 3 Clients (All time)"
                                                            }
                                                            data={brokerageTopClients?.data?.map(
                                                                (el) => {
                                                                    return {
                                                                        label: el
                                                                            ?.account
                                                                            ?.name,
                                                                        value: el?.subBrokerAmount,
                                                                    };
                                                                }
                                                            )}
                                                            loading={
                                                                topClientsLoading
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="p-2 rounded bg-white w-full mt-4">
                                            <DataTable
                                                rows={brokerageTransactions?.data?.map(
                                                    (transaction) => {
                                                        return [
                                                            {
                                                                key: "client",
                                                                content: (
                                                                    <View>
                                                                        <Text
                                                                            selectable
                                                                            className="text-xs text-gray-500"
                                                                        >
                                                                            {
                                                                                transaction
                                                                                    ?.account
                                                                                    ?.name
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            },
                                                            {
                                                                key: "scheme",
                                                                content: (
                                                                    <View className="flex flex-row items-center gap-2">
                                                                        <Image
                                                                            alt="fundHouse"
                                                                            className="mr-2"
                                                                            style={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                objectFit:
                                                                                    "contain",
                                                                            }}
                                                                            source={{
                                                                                uri: transaction
                                                                                    ?.mutualfund
                                                                                    ?.logoUrl,
                                                                            }}
                                                                        />
                                                                        <View>
                                                                            <Text className="text-xs">
                                                                                {
                                                                                    transaction
                                                                                        ?.mutualfund
                                                                                        ?.name
                                                                                }
                                                                            </Text>
                                                                            <Text className="text-xs text-gray-400">
                                                                                {
                                                                                    transaction
                                                                                        ?.mutualfund
                                                                                        ?.category
                                                                                }{" "}
                                                                                |{" "}
                                                                                {
                                                                                    transaction
                                                                                        ?.mutualfund
                                                                                        ?.subCategory
                                                                                }
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                ),
                                                            },
                                                            {
                                                                key: "folio",
                                                                content: (
                                                                    <View>
                                                                        <Text
                                                                            selectable
                                                                            className="text-xs text-black"
                                                                        >
                                                                            -
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            },
                                                            {
                                                                key: "transactionDate",
                                                                content: (
                                                                    <View>
                                                                        <Text
                                                                            selectable
                                                                            className="text-xs text-gray-500"
                                                                        >
                                                                            -
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            },
                                                            {
                                                                key: "brokerageAmount",
                                                                content: (
                                                                    <View>
                                                                        <Text
                                                                            selectable
                                                                            className="text-xs text-gray-500"
                                                                        >
                                                                            {
                                                                                RupeeSymbol
                                                                            }{" "}
                                                                            {
                                                                                transaction?.subBrokerAmount
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            },
                                                            {
                                                                key: "TransactionType",
                                                                content: (
                                                                    <View>
                                                                        <Text
                                                                            selectable
                                                                            className="text-xs text-gray-500"
                                                                        >
                                                                            -
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            },
                                                            {
                                                                key: "units",
                                                                content: (
                                                                    <View>
                                                                        <Text
                                                                            selectable
                                                                            className="text-xs text-gray-500"
                                                                        >
                                                                            -
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            },
                                                            {
                                                                key: "amount",
                                                                content: (
                                                                    <View>
                                                                        <Text
                                                                            selectable
                                                                            className="text-xs text-gray-500"
                                                                        >
                                                                            {
                                                                                RupeeSymbol
                                                                            }{" "}
                                                                            {
                                                                                transaction?.amount
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                ),
                                                            },
                                                        ];
                                                    }
                                                )}
                                                headers={[
                                                    "Client",
                                                    "Scheme",
                                                    "Folio Number",
                                                    "Transaction Date",
                                                    "Brokerage Amount",
                                                    "Transaction Type",
                                                    "Units",
                                                    "Amount",
                                                ]}
                                                cellSize={[
                                                    2, 2, 2, 2, 1, 1, 1, 1,
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
