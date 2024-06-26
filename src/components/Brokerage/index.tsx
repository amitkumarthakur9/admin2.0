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
import ComingSoon from "../Others/ComingSoon";
import NoDataAvailable from "../Others/NoDataAvailable";

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

    // brokerageTopClients?.data?.map(
    //     (el) => {
    //         return {
    //             label: el
    //                 ?.account
    //                 ?.name,
    //             value: el?.subBrokerAmount,
    //         };

    const DummyDate = {
        amc: {
            total: 12500,
            breakDown: [
                {
                    category: "ICICI mutual fund",
                    currentValue: 3000,
                },
                {
                    category: "Axis mutual fund",
                    currentValue: 2500,
                },
                {
                    category: "SBI mutual fund",
                    currentValue: 2200,
                },

                {
                    category: "Tata mutual fund",
                    currentValue: 1900,
                },
            ],
        },
        clientCount: 3,
        transaction: {
            purchase: 1000,
            redemption: 100,
            totalSipTransactions: 2,
            totalSipTransactionsFailed: 1,
        },
        client: {
            lumpsum: {
                total: 2000,
            },
            sip: {
                monthlySipAmount: 7500,
                sipCount: 5,
                breakDown: [
                    {
                        category: "Anand Raj",
                        count: 2000,
                    },
                    {
                        category: "Deepti ",
                        count: 1800,
                    },
                    {
                        category: "Ashish",
                        count: 1500,
                    },
                    {
                        category: "Sourabh",
                        count: 1000,
                    },
                    // {
                    //     category: "Solution Oriented",
                    //     count: 2500,
                    // },
                ],
                newSip: 1,
            },
        },
    };

    const topClientData = [
        {
            name: "Anand Gupta",
            sip: "2",
            investment: 3000,
        },
        {
            name: "Deepti Shasil Namoshi",
            sip: "5",
            investment: 4000,
        },
        {
            name: "AnandRaj Sangappa Malagi  ",
            sip: "1",
            investment: 4500,
        },
        {
            name: "Rashmi Ranjan Sahoo",
            sip: "8",
            investment: 1500,
        },
        {
            name: "Priyanshu Jain",
            sip: "4",
            investment: 5000,
        },
    ];

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
                                <View className="flex flex-row gap-2">
                                    {/* <Button
                                    borderColor={"#013974"}
                                    bgColor={"#fff"}
                                    _text={{ color: "#013974" }}
                                    variant="outline"
                                    className="rounded-lg"
                                    onPress={() => router.push(`brokerage`)}
                                >
                                    Brokerage Reconcilation
                                </Button> */}
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
                            </View>
                            <View className="flex flex-row justify-between rounded bg-[#eaf3fe] pr-2 ">
                                <View className="flex flex-row w-full gap-2">
                                    <View className="flex flex-col w-full rounded bg-[#eaf3fe] h-auto ">
                                        <View className="flex flex-row rounded bg-white w-full">
                                            <View className="w-1/3 flex-row justify-between rounded bg-white p-4">
                                                <IconCard
                                                    icon="credit-card-outline"
                                                    title="Actual Commission"
                                                    description={
                                                        RupeeSymbol +
                                                        `${
                                                            brokerage?.data
                                                                ?.totalAmount
                                                                ? brokerage?.data?.totalAmount.toFixed(
                                                                      2
                                                                  )
                                                                : "0.00"
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
                                                                ? brokerage?.data?.subBrokerAmount.toFixed(
                                                                      2
                                                                  )
                                                                : "0.00"
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
                                        <View className="flex flex-col rounded bg-white w-full mt-4">
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

                                                                //     pieData={[
                                                                //         {
                                                                //             x: "SIP",
                                                                //             y: 65,
                                                                //         },
                                                                //         {
                                                                //             x: "One Time",
                                                                //             y: 35,
                                                                //         },
                                                                //     ]}
                                                                //     totalValue={"19.3k"}
                                                            />
                                                        ) : (
                                                            <View className="">
                                                                <View className="h-[300px] z-[-4] w-11/12">
                                                                    <View
                                                                        style={{
                                                                            flex: 1,
                                                                            justifyContent:
                                                                                "center",
                                                                            alignItems:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <Image
                                                                            // style={{ width: 100, height: 100 }} // adjust width and height as needed
                                                                            source={require("../../../assets/images/noDataAvailable.png")}
                                                                            alt="No Data Available"
                                                                        />
                                                                        <Text
                                                                            style={{
                                                                                paddingTop: 10,
                                                                                fontSize: 16,
                                                                                fontWeight:
                                                                                    "bold",
                                                                            }}
                                                                        >
                                                                            No
                                                                            Data
                                                                            Available
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Divider orientation="vertical" />
                                                </View>
                                                <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                    <View className="w-[99%] flex">
                                                        {brokerage?.data
                                                            ?.topFundhouse
                                                            ?.length > 0 ? (
                                                            <View className="h-full flex flex-col items-center justify-center gap-8">
                                                                <BarChart
                                                                    title={
                                                                        "By Top AMCs"
                                                                    }
                                                                    data={brokerage?.data?.topFundhouse?.map(
                                                                        (
                                                                            el
                                                                        ) => {
                                                                            return {
                                                                                label: el.fundhouse,
                                                                                value: el.subBrokerAmount,
                                                                            };
                                                                        }
                                                                    )}

                                                                    // data={DummyDate?.amc?.breakDown?.map(
                                                                    //     (el) => {
                                                                    //         return {
                                                                    //             label: el.category,
                                                                    //             value: el.currentValue,
                                                                    //         };
                                                                    //     }
                                                                    // )}
                                                                />
                                                                {/* <NoDataAvailable /> */}
                                                            </View>
                                                        ) : (
                                                            <>
                                                                <View className="">
                                                                    <View className="flex flex-row justify-start items-start ">
                                                                        <Text className="text-md font-bold text-start">
                                                                            By
                                                                            Top
                                                                            AMCs
                                                                        </Text>
                                                                    </View>
                                                                    <View className="">
                                                                        <View className="h-[300px] z-[-4] w-11/12">
                                                                            <View
                                                                                style={{
                                                                                    flex: 1,
                                                                                    justifyContent:
                                                                                        "center",
                                                                                    alignItems:
                                                                                        "center",
                                                                                }}
                                                                            >
                                                                                <Image
                                                                                    // style={{ width: 100, height: 100 }} // adjust width and height as needed
                                                                                    source={require("../../../assets/images/noDataAvailable.png")}
                                                                                    alt="No Data Available"
                                                                                />
                                                                                <Text
                                                                                    style={{
                                                                                        paddingTop: 10,
                                                                                        fontSize: 16,
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                    }}
                                                                                >
                                                                                    No
                                                                                    Data
                                                                                    Available
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </>
                                                        )}
                                                    </View>
                                                    <Divider orientation="vertical" />
                                                </View>
                                                <View className="w-1/3 flex-row justify-between rounded-3xl bg-white p-4">
                                                    <View className="w-[99%] flex">
                                                        {brokerageTopClients
                                                            ?.data.length ? (
                                                            <BarChart
                                                                title={
                                                                    "By Top Clients (All time)"
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
                                                                // data={DummyDate?.client?.sip?.breakDown.map(
                                                                //     (el) => {
                                                                //         return {
                                                                //             label: el?.category,
                                                                //             value: el?.count,
                                                                //         };
                                                                //     }
                                                                // )}

                                                                loading={
                                                                    topClientsLoading
                                                                }
                                                            />
                                                        ) : (
                                                            <>
                                                                <View className="flex flex-row justify-start items-start ">
                                                                    <Text className="text-md font-bold text-start">
                                                                        By Top 3
                                                                        Clients
                                                                        (All
                                                                        time)
                                                                    </Text>
                                                                </View>

                                                                <View className="">
                                                                    <View className="h-[300px] z-[-4] w-11/12">
                                                                        <View
                                                                            style={{
                                                                                flex: 1,
                                                                                justifyContent:
                                                                                    "center",
                                                                                alignItems:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            <Image
                                                                                // style={{ width: 100, height: 100 }} // adjust width and height as needed
                                                                                source={require("../../../assets/images/noDataAvailable.png")}
                                                                                alt="No Data Available"
                                                                            />
                                                                            <Text
                                                                                style={{
                                                                                    paddingTop: 10,
                                                                                    fontSize: 16,
                                                                                    fontWeight:
                                                                                        "bold",
                                                                                }}
                                                                            >
                                                                                No
                                                                                Data
                                                                                Available
                                                                            </Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="flex flex-row w-full ">
                                            <View className="p-2 rounded bg-white w-[49%] mt-4 pl-4">
                                                {brokerageTransactions?.data
                                                    ?.length ? (
                                                    <DataTable
                                                        rows={brokerageTransactions?.data?.map(
                                                            (transaction) => {
                                                                return [
                                                                    {
                                                                        key: "client",
                                                                        content:
                                                                            (
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
                                                                        content:
                                                                            (
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
                                                                        content:
                                                                            (
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
                                                                        content:
                                                                            (
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
                                                                        content:
                                                                            (
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
                                                                        content:
                                                                            (
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
                                                                        content:
                                                                            (
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
                                                                        content:
                                                                            (
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
                                                            2, 2, 2, 2, 1, 1, 1,
                                                            1,
                                                        ]}
                                                    />
                                                ) : (
                                                    <>
                                                        <View className="flex flex-col justify-start items-start ">
                                                            <Text className="py-4 text-lg font-bold">
                                                                Brokerage Table
                                                            </Text>
                                                            <Divider />
                                                        </View>

                                                        <NoDataAvailable />
                                                    </>
                                                )}
                                            </View>
                                            <View className="w-[1%] p-2"></View>
                                            <View className="p-2 rounded bg-white w-[50%] mt-4 ">
                                                <View className="flex flex-col justify-start items-start ">
                                                    <Text className="py-4 px-2 text-lg font-bold">
                                                        Brokerage Reconcilation
                                                    </Text>
                                                    <Divider />
                                                </View>

                                                <NoDataAvailable />
                                            </View>
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
