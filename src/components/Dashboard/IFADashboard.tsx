import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
    Center,
    HStack,
    Heading,
    ScrollView,
    Spinner,
    Text,
    Image,
    Button,
    Divider,
} from "native-base";
import { router } from "expo-router";
import IconCard from "../Card/IconCard";
import {
    RupeeSymbol,
    aumChartPercentage,
    sipChartPercentage,
} from "../../../src/helper/helper";
import BorderCard from "../Card/BorderCard";
import DonutPieChart from "../Chart/DonutPieChart";
import DynamicMenu from "./DynamicMenu";
import {
    DashboardData,
    DashboardResponse,
} from "../../../src/interfaces/DashboardInterface";
import RemoteApi from "../../../src/services/RemoteApi";
import { useUserRole } from "../../../src/context/useRoleContext";
import AvatarCard from "../Card/AvatarCard";
import NoDataAvailable from "../Others/NoDataAvailable";

const IFADashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [receivedData1, setReceivedData1] = useState(null);
    const [receivedData2, setReceivedData2] = useState(null);
    const [aumPercentage, setAumPercentage] = useState([]);
    const [sipPercentage, setSipPercentage] = useState([]);
    const [data, setData] = useState<DashboardData>();

    const { roleId } = useUserRole();
    const DummyDate = {
        aum: {
            total: 12500,
            breakDown: [
                {
                    category: "Equity",
                    currentValue: 5000,
                },
                {
                    category: "Debt",
                    currentValue: 4000,
                },
                {
                    category: "Other",
                    currentValue: 1500,
                },
                {
                    category: "Hybrid",
                    currentValue: 3000,
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
        order: {
            lumpsum: {
                total: 2000,
            },
            sip: {
                monthlySipAmount: 7500,
                sipCount: 5,
                breakDown: [
                    {
                        category: "Debt",
                        count: 1000,
                    },
                    {
                        category: "Equity",
                        count: 2000,
                    },
                    {
                        category: "Hybrid",
                        count: 1500,
                    },
                    {
                        category: "Other",
                        count: 500,
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
            sip: "5",
            investment: 8000,
        },
        {
            name: "Deepti Shasil Namoshi",
            sip: "3",
            investment: 6000,
        },
        {
            name: "AnandRaj Sangappa Malagi  ",
            sip: "2",
            investment: 5500,
        },
        {
            name: "Rashmi Ranjan Sahoo",
            sip: "2",
            investment: 4500,
        },
        {
            name: "Priyanshu Jain",
            sip: "1",
            investment: 2000,
        },
    ];
    const sipBreakdownChart = (sip) => {
        const totalValue = sip?.reduce(
            (accumulator, count) => accumulator + count.count,
            0
        );

        console.log(totalValue);

        // If totalValue is 0, return an array with 0% for all items to avoid division by zero
        if (totalValue === 0) {
            return sip?.map((item) => ({
                x: item.category,
                y: 0, // Set percentage to 0 because there's no value to calculate percentage from
            }));
        }

        return sip?.map((item) => ({
            x: item.category,
            y: (item.count / totalValue) * 100, // Calculate the percentage as normal
        }));
    };

    const aumBreakdownChart = (aum) => {
        const totalValue = aum?.reduce(
            (accumulator, currentValue) =>
                accumulator + currentValue.currentValue,
            0
        );

        if (totalValue === 0) {
            return aum?.map((item) => ({
                x: item.category,
                y: 0, // Set percentage to 0 because there's no value to calculate percentage from
            }));
        }

        return aum?.map((item) => ({
            x: item.category,
            y: (item.currentValue / totalValue) * 100,
        }));
    };

    function pieTotalValue(totalValue) {
        // let totalValue = 0;

        // if (!value.currentValue) {
        //     totalValue = total?.reduce(
        //         (accumulator, currentValue) =>
        //             accumulator + currentValue.currentValue,
        //         0
        //     );
        // } else {
        //     totalValue = breakdown?.reduce(
        //         (accumulator, count) => accumulator + count.count,
        //         0
        //     );
        // }

        if (totalValue >= 10000000) {
            // If the total value is in crores (10,000,000 or more)
            return (totalValue / 10000000).toFixed(1) + " cr";
        } else if (totalValue >= 100000) {
            // If the total value is in lakhs (100,000 or more)
            return (totalValue / 100000).toFixed(1) + " lac";
        } else if (totalValue >= 1000) {
            // If the total value is in thousands (1,000 or more)
            return (totalValue / 1000).toFixed(1) + " k";
        } else {
            // If the total value is less than 1,000
            return totalValue;
        }
    }

    function pieTotalAum(value) {
        const totalValue = value?.reduce(
            (accumulator, currentValue) =>
                accumulator + currentValue.currentValue,
            0
        );

        if (totalValue == 0) {
            return "0";
        }

        if (totalValue >= 10000000) {
            // If the total value is in crores (10,000,000 or more)
            return (totalValue / 10000000).toFixed(1) + " cr";
        } else if (totalValue >= 100000) {
            // If the total value is in lakhs (100,000 or more)
            return (totalValue / 100000).toFixed(1) + " lac";
        } else if (totalValue >= 1000) {
            // If the total value is in thousands (1,000 or more)
            return (totalValue / 1000).toFixed(1) + " k";
        } else {
            // If the total value is less than 1,000
            return totalValue;
        }
    }

    function pieTotalSip(value) {
        const totalValue = value?.reduce(
            (accumulator, count) => accumulator + count.count,
            0
        );

        if (totalValue == 0) {
            return "0";
        }

        if (totalValue >= 10000000) {
            // If the total value is in crores (10,000,000 or more)
            return (totalValue / 10000000).toFixed(1) + " cr";
        } else if (totalValue >= 100000) {
            // If the total value is in lakhs (100,000 or more)
            return (totalValue / 100000).toFixed(1) + " lac";
        } else if (totalValue >= 1000) {
            // If the total value is in thousands (1,000 or more)
            return (totalValue / 1000).toFixed(1) + " k";
        } else {
            // If the total value is less than 1,000
            return totalValue;
        }
    }

    function convertToWord(totalValue) {
        if (totalValue >= 10000000) {
            // If the total value is in crores (10,000,000 or more)
            return (totalValue / 10000000).toFixed(1) + " cr";
        } else if (totalValue >= 100000) {
            // If the total value is in lakhs (100,000 or more)
            return (totalValue / 100000).toFixed(1) + " lac";
        } else if (totalValue >= 1000) {
            // If the total value is in thousands (1,000 or more)
            return (totalValue / 1000).toFixed(1) + " k";
        } else {
            // If the total value is less than 1,000
            return totalValue;
        }
    }

    useEffect(() => {
        setIsLoading(true);
        async function getDetails() {
            const response: DashboardResponse = await RemoteApi.get(
                `dashboard/?d=2`
            );

            // const response: any = {
            //     data: DummyDate,
            // };

            if (response) {
                setData(response?.data);
                setAumPercentage(
                    aumChartPercentage(response?.data?.aum?.breakDown)
                );
                setSipPercentage(
                    sipChartPercentage(response?.data?.order?.sip?.breakDown)
                );
                setIsLoading(false);
            }
        }

        getDetails();
    }, []);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        // Here you can trigger your API call using the selected option
        // Example: fetch(`your-api-endpoint/${option}`)
        // Add your API call logic here
        console.log(`API call triggered with option: ${option}`);
    };

    const handleDataReceived = (data) => {
        // Handle the received data here
        console.log("Data received:", data);
    };

    const handleDataReceived1 = (data) => {
        // Handle the received data here, such as updating state in the parent component
        setReceivedData1(data);
        console.log("Data received from notification:", data);
    };

    const handleDataReceived2 = (data) => {
        // Handle the received data here, such as updating state in the parent component
        setReceivedData2(data);
        console.log("Data received from YourComponent2:", data);
    };

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
                    className={`bg-[#eaf3fe] p-4 gap-4`}
                    showsVerticalScrollIndicator={true}
                >
                    {/* <View className="bg-[#eaf3fe] border-2"> */}
                    {/* <View className="flex flex-col p-4  gap-4 border-2 w-full"> */}
                    <View className="flex flex-col md:flex-row items-center justify-between">
                        <View className="flex flex-row items-center">
                            <Text
                                selectable
                                className="text-base flex flex-row text-center font-bold"
                            >
                                Dashboard
                            </Text>
                        </View>
                        <Button
                            borderColor={"#013974"}
                            bgColor={"#fff"}
                            _text={{ color: "#013974" }}
                            variant="outline"
                            className="rounded-lg"
                            onPress={() => router.push(`brokerage`)}
                        >
                            Go to Brokerage Dashboard
                        </Button>
                    </View>
                    {/* <View className="flex flex-col md:flex-row  justify-between rounded bg-[#eaf3fe] w-8/12 border-2 "> */}
                    <View className=" flex flex-col md:flex-row">
                        {/* outer Card */}
                        <View className="flex flex-col md:w-full rounded h-auto ">
                            <View className="flex flex-col md:flex-row rounded  flex-wrap  md:w-full gap-1 pb-2">
                                <View className="flex flex-col md:w-[20%]  rounded bg-[#0769D0] h-auto items-between gap-2 mr-1">
                                    <Text className="text-[#D2CFCF]  ">
                                        Total Aum
                                    </Text>
                                    <Text className="text-white font-bold text-3xl ">
                                        {data?.aum?.total
                                            ? RupeeSymbol +
                                              convertToWord(data?.aum?.total)
                                            : RupeeSymbol + "0"}
                                    </Text>
                                    {/* <Text className="text-[#00AC4F] text-xs inline-block align-text-bottom text-right">
                                                    <MaterialCommunityIcons
                                                        name="arrow-up"
                                                        size={14}
                                                        color="#00AC4F"
                                                    />
                                                    37.8%{" "}
                                                    <Text className="text-white">
                                                        this month
                                                    </Text>{" "}
                                                </Text> */}
                                </View>

                                <View className="flex flex-col md:flex-row md:w-[39%] rounded bg-white h-auto gap-2 mr-1">
                                    <View className="flex flex-col md:w-6/12  rounded bg-white h-auto gap-1">
                                        <IconCard
                                            icon="account-outline"
                                            title="Number of Clients"
                                            description={data?.clientCount}
                                        />
                                        <IconCard
                                            icon="account-cash-outline"
                                            title="Ready to Invest"
                                            description="7"
                                        />
                                    </View>
                                    <View className="flex flex-col md:w-5/12  rounded bg-white h-auto gap-1">
                                        <IconCard
                                            icon="account-group-outline"
                                            title="Transacted user"
                                            description="2"
                                        />
                                        {roleId == 2 && (
                                            <IconCard
                                                icon="account-box-multiple-outline"
                                                title="Clients Activated"
                                                description="4"
                                            />
                                        )}
                                        {roleId > 2 && (
                                            <IconCard
                                                icon="account-box-multiple-outline"
                                                title="Distributors Activated"
                                                description="4"
                                            />
                                        )}
                                    </View>
                                </View>
                                <View className="flex flex-col md:flex-row md:w-[39%] rounded bg-white h-auto gap-2">
                                    <View className="flex flex-col md:w-6/12  rounded bg-white h-auto gap-1">
                                        <IconCard
                                            icon="wallet-outline"
                                            title="Total Lumpsum Investment"
                                            description={
                                                data?.order?.lumpsum?.total
                                                    ? RupeeSymbol +
                                                      data?.order?.lumpsum?.total.toFixed(
                                                          2
                                                      )
                                                    : RupeeSymbol + "0"
                                            }
                                        />

                                        {roleId == 2 && (
                                            <IconCard
                                                icon="account-check-outline"
                                                title="Empanelled Clients"
                                                description="10"
                                            />
                                        )}
                                        {roleId > 2 && (
                                            <IconCard
                                                icon="account-box-multiple-outline"
                                                title="Empanelled Distributors"
                                                description="10"
                                            />
                                        )}
                                    </View>
                                    <View className="flex flex-col md:w-5/12  rounded bg-white h-auto gap-1">
                                        <IconCard
                                            icon="chart-timeline-variant"
                                            title="Total Running SIPs"
                                            description={
                                                data?.order?.sip?.sipCount
                                            }
                                        />
                                        <IconCard
                                            icon="shopping-outline"
                                            title="Total SIP Amount"
                                            description={
                                                
                                                data?.order?.sip?.monthlySipAmount == null ? 0 : RupeeSymbol + data?.order?.sip?.monthlySipAmount.toFixed(1)
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                             {/* Breakdown card starts here */}
                            <View className="flex flex-col md:flex-row rounded w-full">
                                <View
                                    className="md:w-[33%]  rounded bg-white p-4"
                                    // style={{
                                    //     borderColor: "none",

                                    //     borderRightWidth:
                                    //         StyleSheet.hairlineWidth,
                                    // }}
                                >
                                    <View className="flex flex-col justify-between">
                                        <Text className="text-black font-bold text-lg">
                                            AUM Breakdown
                                        </Text>
                                    </View>

                                    <View>
                                        {data?.aum?.breakDown.length === 0 ? (
                                            <>
                                                <View className="">
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
                                                            width={20}
                                                            height={20}
                                                        />
                                                        <Text
                                                            style={{
                                                                paddingTop: 10,
                                                                fontSize: 16,
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            No Data Available
                                                        </Text>
                                                    </View>
                                                </View>
                                            </>
                                        ) : (
                                            <DonutPieChart
                                                pieData={aumBreakdownChart(
                                                    data?.aum?.breakDown
                                                )}
                                                totalValue={pieTotalAum(
                                                    data?.aum?.breakDown
                                                )}
                                                children={
                                                    <>
                                                        <View className="w-full">
                                                            <Text
                                                                className="text-bold text-xs font-medium text-gray-500"
                                                                selectable
                                                            >
                                                                Total AUM
                                                            </Text>
                                                        </View>
                                                        <View className="">
                                                            <Text
                                                                selectable
                                                                className="font-medium text-xs text-start text-blue-900"
                                                            >
                                                                {RupeeSymbol +
                                                                    pieTotalAum(
                                                                        data
                                                                            ?.aum
                                                                            ?.breakDown
                                                                    )}
                                                            </Text>
                                                        </View>
                                                    </>
                                                }
                                            />
                                        )}
                                    </View>
                                </View>
                                <View className="bg-white py-4">
                                    <Divider orientation="vertical" mr="2" />
                                </View>
                                <View className="md:w-[33%] rounded bg-white p-4">
                                    <View className="flex flex-col justify-between">
                                        <Text className="text-black font-bold text-lg">
                                            SIP Breakdown
                                        </Text>
                                    </View>
                                    {data?.order?.sip?.breakDown.length ===
                                    0 ? (
                                        <>
                                            <View className="">
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Image
                                                        // style={{ width: 100, height: 100 }} // adjust width and height as needed
                                                        source={require("../../../assets/images/noDataAvailable.png")}
                                                        alt="No Data Available"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <Text
                                                        style={{
                                                            paddingTop: 10,
                                                            fontSize: 16,
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        No Data Available
                                                    </Text>
                                                </View>
                                            </View>
                                        </>
                                    ) : (
                                        <DonutPieChart
                                            pieData={sipBreakdownChart(
                                                data?.order?.sip?.breakDown
                                            )}
                                            totalValue={pieTotalSip(
                                                data?.order?.sip?.breakDown
                                            )}
                                            children={
                                                <>
                                                    <View className="w-full">
                                                        <Text
                                                            className="text-bold text-xs font-medium text-gray-500"
                                                            selectable
                                                        >
                                                            Total SIP
                                                        </Text>
                                                    </View>
                                                    <View className="">
                                                        <Text
                                                            selectable
                                                            className="font-medium text-xs text-start text-blue-900"
                                                        >
                                                            {pieTotalSip(
                                                                data?.order?.sip
                                                                    ?.breakDown
                                                            ) == ""
                                                                ? RupeeSymbol +
                                                                  "0"
                                                                : RupeeSymbol +
                                                                  pieTotalSip(
                                                                      data
                                                                          ?.order
                                                                          ?.sip
                                                                          ?.breakDown
                                                                  )}
                                                        </Text>
                                                    </View>
                                                </>
                                            }
                                        />
                                    )}
                                </View>
                                <View className="w-[8px]"></View>
                                <View className="md:w-[32%] rounded bg-white p-4">
                                    <View className="flex flex-row justify-between items-center gap-4">
                                        <View className="flex flex-col justify-between">
                                            <Text className="text-black font-bold text-lg">
                                                External Portfolio
                                            </Text>
                                        </View>
                                        <View className="w-full flex flex-col justify-between items-start p-2"></View>
                                    </View>

                                    {data?.aum?.breakDown.length === 0 ? (
                                        <>
                                            <View className="">
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Image
                                                        // style={{ width: 100, height: 100 }} // adjust width and height as needed
                                                        source={require("../../../assets/images/noDataAvailable.png")}
                                                        alt="No Data Available"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <Text
                                                        style={{
                                                            paddingTop: 10,
                                                            fontSize: 16,
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        No Data Available
                                                    </Text>
                                                </View>
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <DonutPieChart
                                                pieData={aumBreakdownChart(
                                                    data?.aum?.breakDown
                                                )}
                                                totalValue={pieTotalValue(
                                                    19348
                                                )}
                                                width={500}
                                                children={
                                                    <>
                                                        <View className="w-full">
                                                            <Text
                                                                className="text-bold text-xs font-medium text-gray-500"
                                                                selectable
                                                            >
                                                                Current Holding
                                                            </Text>
                                                        </View>
                                                        <View className="">
                                                            <Text
                                                                selectable
                                                                className="font-medium text-xs text-start text-blue-900"
                                                            >
                                                                {RupeeSymbol +
                                                                    "19348.00"}
                                                            </Text>
                                                        </View>
                                                    </>
                                                }
                                            />
                                            <Button
                                                width="100%"
                                                bgColor={"#013974"}
                                                // marginBottom={1}
                                                marginTop={2}
                                                onPress={() =>
                                                    router.push(`clients`)
                                                }
                                            >
                                                Transfer Portfolio
                                            </Button>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>
                        {/* <View className="md:w-4/12 rounded bg-white p-4">
                                        <View className="flex flex-row justify-between">
                                            <View className="">
                                                <Text className="text-black font-bold">
                                                    Notification
                                                </Text>
                                            </View>

                                            <DynamicMenu
                                                onDataReceived={
                                                    handleDataReceived1
                                                }
                                                options={[
                                                    {
                                                        option: "All",
                                                        value: "4322",
                                                    },
                                                    {
                                                        option: "last 24 hour",
                                                        value: "4321",
                                                    },
                                                    {
                                                        option: "last 1 hour",
                                                        value: "4320",
                                                    },
                                                ]}
                                                apiUrl="sip"
                                            />
                                        </View>
                                        <View className="flex flex-col justify-center items-center h-full">
                                            <View className="h-[350px] overflow-scroll">
                                                {notificationData.map(
                                                    (item, index) => (
                                                        <AvatarCard
                                                            key={index} 
                                                            imageUrl={
                                                                item.imageUrl
                                                            }
                                                            title={item.title}
                                                            description={
                                                                item.description
                                                            }
                                                        />
                                                    )
                                                )}
                                            </View> 
                                            <Image
                                                className=""
                                                alt="ico"
                                                source={require("../../../assets/images/comingsoon.png")}
                                                style={
                                                    {
                                                        flex: 1,
                                                        justifyContent: 'end',
                                                    }
                                                }
                                            />

                                            <Text className="py-4 text-lg font-bold">
                                                Coming Soon
                                            </Text>
                                        </View>
                                    </View> */}
                    </View>
                    {/* </View> */}
                    <View className="bg-[#eaf3fe]">
                        <View className="flex flex-row items-center">
                            <Text className="text-base text-slate-500 font-bold text-medium pr-4">
                                Time Period:
                            </Text>
                            <DynamicMenu
                                onDataReceived={handleDataReceived}
                                options={[
                                    {
                                        option: "last 3 month",
                                        value: "70",
                                    },
                                    {
                                        option: "last 6 month",
                                        value: "77",
                                    },
                                    {
                                        option: "last 12 month",
                                        value: "71",
                                    },
                                ]}
                                apiUrl="folio"
                            />
                            <View
                                style={{
                                    borderBottomColor: "gray",
                                    borderBottomWidth: 1,
                                    flex: 1,
                                    alignSelf: "center",
                                    width: "100%",
                                    marginLeft: 10,
                                }}
                            />
                        </View>
                    </View>
                    {roleId == 2 && (
                        <View className="flex flex-col md:flex-row justify-between rounded bg-white h-auto gap-2 pb-4 mr-2">
                            <View
                                className="flex flex-col md:flex-row md:w-[45%] md:h-full rounded gap-2"
                                style={{
                                    borderColor: "#e4e4e4", // Grey border color

                                    borderRightWidth: StyleSheet.hairlineWidth, // Hairline right border width
                                }}
                            >
                                <View className="flex flex-col md:w-[49%]">
                                    <BorderCard
                                        title="Investment"
                                        description={
                                            data?.transaction?.purchase
                                                ? RupeeSymbol +
                                                  data?.transaction?.purchase.toFixed(
                                                      2
                                                  )
                                                : RupeeSymbol + "0"
                                        }
                                    />
                                    <BorderCard
                                        title="Redemption"
                                        description={
                                            data?.transaction?.redemption
                                                ? RupeeSymbol +
                                                  data?.transaction?.redemption.toFixed(
                                                      2
                                                  )
                                                : RupeeSymbol + "0"
                                        }
                                    />
                                    <BorderCard
                                        title="Inactive/Cancelled SIPs"
                                        description="0" // Data Not available in API
                                    />
                                </View>
                                <View className="flex flex-col md:w-[49%]">
                                    <BorderCard
                                        title="New SIPs"
                                        description={
                                            data?.order?.sip?.newSip
                                                ? data?.order?.sip?.newSip
                                                : "0"
                                        }
                                    />

                                    <BorderCard
                                        title="No. of successful SIPs"
                                        description={
                                            data?.transaction
                                                ?.totalSipTransactions
                                                ? data?.transaction
                                                      ?.totalSipTransactions
                                                : "0"
                                        }
                                    />
                                    <BorderCard
                                        title="No. of SIP Bounce"
                                        description={
                                            data?.transaction
                                                ?.totalSipTransactionsFailed
                                                ? data?.transaction
                                                      ?.totalSipTransactionsFailed
                                                : "0"
                                        }
                                    />
                                </View>
                            </View>
                            <View
                                className="md:w-[55%] md:h-128 rounded px-4"
                                style={{
                                    borderColor: "#e4e4e4", // Grey border color

                                    borderRightWidth: StyleSheet.hairlineWidth, // Hairline right border width
                                }}
                            >
                                <Text className="font-bold text-start">
                                    Top 5 Clients
                                </Text>
                                {/* <View className="flex flex-col h-auto justify-center items-center pt-4">
                                            <Image
                                                className=""
                                                alt="ico"
                                                source={require("../../../assets/images/comingsoon.png")}
                                                style={{
                                                    // flex: 1,
                                                    // justifyContent: 'end',
                                                    width: 100, // specify the desired width
                                                    height: 100,
                                                }}
                                            />
                                            <Text className="py-4 text-lg font-bold text-center">
                                                Coming Soon
                                            </Text>
                                        </View> */}
                                <View className="flex flex-row py-2">
                                    <View className="w-6/12">
                                        <Text className="text-black text-start">
                                            Name
                                        </Text>
                                    </View>
                                    <View className="w-2/12">
                                        <Text className="text-start">SIPs</Text>
                                    </View>
                                    <View className="w-4/12">
                                        <Text>Investment</Text>
                                    </View>
                                </View>
                                <View className=" h-48 overflow-scroll">
                                    {topClientData.map((item, index) => (
                                        <View
                                            key={index}
                                            className="flex flex-row items-center"
                                        >
                                            <View className="w-6/12">
                                                <AvatarCard
                                                    imageUrl={item.imageUrl}
                                                    title={item.name}
                                                    description=""
                                                />
                                            </View>
                                            <View className="w-2/12">
                                                <Text
                                                    selectable
                                                    className="text-[#686868] font-semibold text-start"
                                                >
                                                    {item.sip}
                                                </Text>
                                            </View>
                                            <View className="w-4/12">
                                                <Text
                                                    selectable
                                                    className="text-[#686868] font-semibold"
                                                >
                                                    {RupeeSymbol}{" "}
                                                    {item.investment}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            {/* <View className="md:w-[16%] rounded pl-1">
                                        <Text className="font-bold text-start ">
                                            Inactive Client
                                        </Text>
                                        <View className="flex flex-col h-full md:h-auto justify-center items-center pt-5">
                                            <Image
                                                className=""
                                                alt="ico"
                                                source={require("../../../assets/images/comingsoon.png")}
                                                style={{
                                                    // flex: 1,
                                                    // justifyContent: 'end',
                                                    width: 100, // specify the desired width
                                                    height: 100,
                                                }}
                                            />
                                            <Text className="py-4 text-base font-bold text-center">
                                                Coming Soon
                                            </Text>
                                        </View>
                                        <View className="">
                                            <View className=" h-56 overflow-scroll">
                                                {topClientData.map(
                                                    (item, index) => (
                                                        <AvatarCard
                                                            key={index}
                                                            imageUrl="account"
                                                            title="Natali Craig"
                                                            description=""
                                                        />
                                                    )
                                                )}
                                            </View>
                                        </View>
                                    </View> */}
                        </View>
                    )}

                    {(roleId == 3 || roleId == 4) && (
                        <View className="flex flex-row justify-between rounded bg-white h-auto gap-2 pb-4  mr-2">
                            <View
                                className="flex flex-row w-[45%] h-full rounded gap-2"
                                style={{
                                    borderColor: "#e4e4e4", // Grey border color

                                    borderRightWidth: StyleSheet.hairlineWidth, // Hairline right border width
                                }}
                            >
                                {/* <Text>Card</Text> */}
                                <View className="flex flex-col w-[49%]">
                                    <BorderCard
                                        title="Investment"
                                        description={
                                            data?.transaction?.purchase
                                                ? RupeeSymbol +
                                                  data?.transaction?.purchase.toFixed(
                                                      2
                                                  )
                                                : RupeeSymbol + "0"
                                        }
                                    />
                                    <BorderCard
                                        title="Redemption"
                                        description={
                                            data?.transaction?.redemption
                                                ? RupeeSymbol +
                                                  data?.transaction?.redemption.toFixed(
                                                      2
                                                  )
                                                : RupeeSymbol + "0"
                                        }
                                    />
                                    <BorderCard
                                        title="Inactive/Cancelled SIPs"
                                        description="0" // Data Not available in API
                                    />
                                </View>
                                <View className="flex flex-col w-[49%]">
                                    <BorderCard
                                        title="New SIPs"
                                        description={
                                            data?.order?.sip?.newSip
                                                ? data?.order?.sip?.newSip
                                                : "0"
                                        }
                                    />
                                    <BorderCard
                                        title="No. of successful SIPs"
                                        description={
                                            data?.transaction
                                                ?.totalSipTransactions
                                                ? data?.transaction
                                                      ?.totalSipTransactions
                                                : "0"
                                        }
                                    />
                                    <BorderCard
                                        title="No. of SIP Bounce"
                                        description={
                                            data?.transaction
                                                ?.totalSipTransactionsFailed
                                                ? data?.transaction
                                                      ?.totalSipTransactionsFailed
                                                : "0"
                                        }
                                    />
                                </View>
                            </View>
                            <View
                                className="w-[65%] h-128 rounded px-4"
                                style={{
                                    borderColor: "#e4e4e4", // Grey border color

                                    borderRightWidth: StyleSheet.hairlineWidth, // Hairline right border width
                                }}
                            >
                                <Text className="font-bold ">
                                    Top 5 distributor
                                </Text>
                                {/* <View className="flex flex-col h-auto justify-center items-center pt-4">
                                            <Image
                                                className=""
                                                alt="ico"
                                                source={require("../../../assets/images/comingsoon.png")}
                                                style={{
                                                    // flex: 1,
                                                    // justifyContent: 'end',
                                                    width: 100, // specify the desired width
                                                    height: 100,
                                                }}
                                            />
                                            <Text className="py-4 text-lg font-bold text-center">
                                                Coming Soon
                                            </Text>
                                        </View> */}
                                <View className="flex flex-row py-2">
                                    <View className="w-6/12">
                                        <Text className="text-black">Name</Text>
                                    </View>
                                    <View className="w-2/12">
                                        <Text>SIPs</Text>
                                    </View>
                                    <View className="w-4/12">
                                        <Text>Investment</Text>
                                    </View>
                                </View>
                                <View className=" h-48 overflow-scroll">
                                    {topClientData.map((item, index) => (
                                        <View
                                            key={index}
                                            className="flex flex-row items-center"
                                        >
                                            <View className="w-6/12">
                                                <AvatarCard
                                                    imageUrl={item.imageUrl}
                                                    title={item.name}
                                                    description=""
                                                />
                                            </View>
                                            <View className="w-2/12">
                                                <Text
                                                    selectable
                                                    className="text-[#686868] font-semibold"
                                                >
                                                    {item.sip}
                                                </Text>
                                            </View>
                                            <View className="w-4/12">
                                                <Text
                                                    selectable
                                                    className="text-[#686868] font-semibold"
                                                >
                                                    {RupeeSymbol}{" "}
                                                    {item.investment}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            {/* <View className="w-[16%] rounded pl-1">
                                        <Text className="font-bold ">
                                            Inactive distributor
                                        </Text>
                                        <View className="flex flex-col h-auto justify-center items-center pt-5">
                                            <Image
                                                className=""
                                                alt="ico"
                                                source={require("../../../assets/images/comingsoon.png")}
                                                style={{
                                                    // flex: 1,
                                                    // justifyContent: 'end',
                                                    width: 100, // specify the desired width
                                                    height: 100,
                                                }}
                                            />
                                            <Text className="py-4 text-base font-bold text-center">
                                                Coming Soon
                                            </Text>
                                        </View>
                                     <View className=" h-56 overflow-scroll">
                                            {topClientData.map(
                                                (item, index) => (
                                                    <AvatarCard
                                                        key={index}
                                                        imageUrl="account"
                                                        title="Natali Craig"
                                                        description=""
                                                    />
                                                )
                                            )}
                                        </View>
                                    </View> */}
                        </View>
                    )}

                    {/* {role == 4 && (

                                <View className="flex flex-row justify-between rounded bg-white h-auto gap-2 pb-4">
                                    <View
                                        className="flex flex-row w-[45%] h-full rounded gap-2"
                                        style={{
                                            borderColor: "#e4e4e4", // Grey border color

                                            borderRightWidth:
                                                StyleSheet.hairlineWidth, // Hairline right border width
                                        }}
                                    >
                                     
                                        <View className="flex flex-col w-[49%]">
                                            <BorderCard
                                                title="Investment"
                                                description={
                                                    RupeeSymbol + "10,87,899"
                                                }
                                            />
                                            <BorderCard
                                                title="Redemption"
                                                description={
                                                    data?.transaction
                                                        ?.redemption
                                                        ? RupeeSymbol +
                                                          data?.transaction
                                                              ?.redemption
                                                        : RupeeSymbol + "0"
                                                }
                                            />
                                            <BorderCard
                                                title="Inactive/Cancelled SIPs"
                                                description={
                                                    data?.transaction
                                                        ?.totalSipTransactionsFailed
                                                        ? data?.transaction
                                                              ?.totalSipTransactionsFailed
                                                        : "0"
                                                }
                                            />
                                        </View>
                                        <View className="flex flex-col w-[49%]">
                                            <BorderCard
                                                title="New SIPs"
                                                description={
                                                    data?.order?.sip?.newSip
                                                        ? data?.order?.sip
                                                              ?.newSip
                                                        : "0"
                                                }
                                            />
                                            <BorderCard
                                                title="No. of successful SIPs"
                                                description={
                                                    data?.transaction
                                                        ?.totalSipTransactionsFailed &&
                                                    data?.transaction
                                                        ?.totalSipTransactions
                                                        ? data?.transaction
                                                              ?.totalSipTransactions -
                                                          data?.transaction
                                                              ?.totalSipTransactionsFailed
                                                        : "0"
                                                }
                                            />
                                            <BorderCard
                                                title="No. of SIP Bounce"
                                                description="08"
                                            />
                                        </View>
                                    </View>
                                    <View
                                        className="w-[35%] h-128 rounded px-4"
                                        style={{
                                            borderColor: "#e4e4e4", // Grey border color

                                            borderRightWidth:
                                                StyleSheet.hairlineWidth, // Hairline right border width
                                        }}
                                    >
                                        <Text className="font-bold ">
                                            Top 5 RM
                                        </Text>
                                        <View className="flex flex-row py-2">
                                            <View className="w-6/12">
                                                <Text className="text-black">
                                                    Name
                                                </Text>
                                            </View>
                                            <View className="w-2/12">
                                                <Text>SIPs</Text>
                                            </View>
                                            <View className="w-4/12">
                                                <Text>Investment</Text>
                                            </View>
                                        </View>
                                        <View className=" h-48 overflow-scroll">
                                            {topClientData.map(
                                                (item, index) => (
                                                    <View
                                                        key={index}
                                                        className="flex flex-row items-center"
                                                    >
                                                        <View className="w-6/12">
                                                            <AvatarCard
                                                                imageUrl={
                                                                    item.imageUrl
                                                                }
                                                                title="Natali Craig"
                                                                description=""
                                                            />
                                                        </View>
                                                        <View className="w-2/12">
                                                            <Text
                                                                selectable
                                                                className="text-[#686868] font-semibold"
                                                            >
                                                                {item.sip}
                                                            </Text>
                                                        </View>
                                                        <View className="w-4/12">
                                                            <Text
                                                                selectable
                                                                className="text-[#686868] font-semibold"
                                                            >
                                                                {RupeeSymbol}{" "}
                                                                {
                                                                    item.investment
                                                                }
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    </View>
                                    <View className="w-[20%] rounded pl-1">
                                        <Text className="font-bold ">
                                            Inactive RM
                                        </Text>
                                        <View className=" h-56 overflow-scroll">
                                            {topClientData.map(
                                                (item, index) => (
                                                    <AvatarCard
                                                        key={index}
                                                        imageUrl="account"
                                                        title="Natali Craig"
                                                        description=""
                                                    />
                                                )
                                            )}
                                        </View>
                                    </View>
                                </View>
                            )} */}
                    {/* </View> */}
                    {/* </View> */}
                </ScrollView>
            )}
        </>
    );
};

export default IFADashboard;
