import { router, useLocalSearchParams } from "expo-router";
import { Center, HStack, Heading, Spinner } from "native-base";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    ClientDetailItem,
    ClientDetailResponse,
} from "../../../../../src/interfaces/ClientDetailInterface";
import RemoteApi from "../../../../../src/services/RemoteApi";
import moment from "moment";
import {
    AccountShadowPhone,
    BorderShadow,
    BorderShadowPhone,
    BreadcrumbShadow,
} from "../../../../../src/components/Styles/Shadow";
import { RupeeSymbol, getInitials } from "../../../../../src/helper/helper";
import CardWithTabs from "../../../../../src/components/Card/CardWithTabs";
import DataTable from "../../../../../src/components/DataTable/DataTable";
import DataValue from "../../../../../src/components/DataValue/DataValue";
import DataText from "../../../../../src/components/DataValue/DataText";
import { dateFormat } from "../../../../../src/helper/DateUtils";

export default function HoldingDetail() {
    const [isLoading, setIsLoading] = useState(true);
    const { id, holdingId } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailItem>();

    useEffect(() => {
        setIsLoading(true);
        async function getDetails() {
            const response: ClientDetailResponse = await RemoteApi.get(
                `client/${id}`
            );
            if (response) {
                setData(response.data);
                setIsLoading(false);
            }
        }

        if (id) {
            getDetails();
        }
    }, [id]);

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
                    <View className="bg-white">
                        <View className="flex flex-col p-4 gap-4">
                            <View className="flex flex-row items-center">
                                <Pressable
                                    className="mr-3"
                                    onPress={() =>
                                        console.log("This will go back ")
                                    }
                                >
                                    <Icon
                                        name="angle-left"
                                        size={18}
                                        color={"black"}
                                    />
                                </Pressable>
                                <Text
                                    selectable
                                    className="text-base flex flex-row text-center font-bold"
                                >
                                    Holding Details
                                </Text>
                            </View>
                            <View
                                className="flex flex-row justify-between rounded h-auto p-4"
                                style={{ ...BreadcrumbShadow }}
                            >
                                <View className="flex flex-col gap-2 w-full">
                                    <View className="flex flex-row justify-between items-start w-full">
                                        <View className="w-11/12 flex flex-row items-start justify-between">
                                            <View className="flex flex-row items-center">
                                                <Text
                                                    className="text-bold font-medium text-gray-500 mr-2"
                                                    selectable
                                                >
                                                    Client Name:
                                                </Text>
                                                <Text
                                                    selectable
                                                    className="font-medium text-start text-black"
                                                >
                                                    {data?.name}
                                                </Text>
                                            </View>
                                            <View className="flex flex-row items-center">
                                                <Text
                                                    className="text-bold font-medium text-gray-500 mr-2"
                                                    selectable
                                                >
                                                    Client Code:
                                                </Text>
                                                <Text
                                                    selectable
                                                    className="font-medium text-start text-black"
                                                >
                                                    {data?.clientId}
                                                </Text>
                                            </View>
                                            <View className="flex flex-row items-center">
                                                <Text
                                                    className="text-bold font-medium text-gray-500 mr-2"
                                                    selectable
                                                >
                                                    PAN:
                                                </Text>
                                                <Text
                                                    selectable
                                                    className="font-medium text-start text-black"
                                                >
                                                    {data?.users[0]?.panNumber}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View
                                        className="my-2"
                                        style={{
                                            borderColor: "#e4e4e4",
                                            borderBottomWidth:
                                                StyleSheet.hairlineWidth,
                                        }}
                                    />
                                    <View className="flex flex-row py-2 items-center w-full flex-wrap ">
                                        <View
                                            className={
                                                "flex flex-row items-center justify-start w-8/12"
                                            }
                                        >
                                            {/* <Image
                                                alt="fundHouse"
                                                className="mr-2"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: "contain",
                                                }}
                                                source={{
                                                    uri: 'https://mfapi.kotaksecurities.online/bank/74/logo',
                                                }}
                                            /> */}
                                            <View className="w-8 h-8 rounded bg-gray-500 mx-2" />
                                            <View
                                                className={
                                                    "flex flex-col justify-end items-start"
                                                }
                                            >
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all text-sm flex-wrap"
                                                >
                                                    Axis Mid Cap Fund
                                                </Text>

                                                <View className="flex flex-row items-center flex-wrap">
                                                    <Text
                                                        selectable
                                                        className=" text-blacktext-xs"
                                                    >
                                                        Axis Mid Cap Fund
                                                    </Text>
                                                    <View className="mx-2">
                                                        <Icon
                                                            name="circle"
                                                            style={{
                                                                fontWeight:
                                                                    "100",
                                                            }}
                                                            size={8}
                                                            color="grey"
                                                        />
                                                    </View>
                                                    <Text
                                                        selectable
                                                        className="text-black text-xs"
                                                    >
                                                        Equity
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex flex-row py-2 justify-between items-start w-full">
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="optionType"
                                                title="Option Type:"
                                                value="Monthly"
                                            />
                                            <DataValue
                                                key="createdDate"
                                                title="Created Date:"
                                                value="23/04/23"
                                            />
                                            <DataValue
                                                key="currentValue"
                                                title="Current Value:"
                                                value={RupeeSymbol + "2500000"}
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="dividendType"
                                                title="Dividend Type:"
                                                value="Reinvest"
                                            />
                                            <DataValue
                                                key="xirr"
                                                title="XIRR:"
                                                value="25%"
                                            />
                                            <DataValue
                                                key="investedAmount"
                                                title="Invested Amount:"
                                                value={
                                                    RupeeSymbol + "250,000,000"
                                                }
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="rta"
                                                title="RTA"
                                                value="CAMS"
                                            />
                                            <DataValue
                                                key="return"
                                                title="Return"
                                                value="16%"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-128">
                                <View
                                    className="w-full h-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <PortfolioCard data={data} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const PortfolioCard = ({ data }) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const transactionData = data?.transactions?.map((item) => {
        return [
            {
                key: "amount",
                content: (
                    <View className="flex flex-row justify-center ">
                        <DataText value={RupeeSymbol + item?.amount} />
                    </View>
                ),
            },
            {
                key: "units",
                content: <DataText value={item?.units} />,
            },
            {
                key: "createdDate",
                content: <DataText value={dateFormat(item?.createdAt)} />,
            },
            {
                key: "dividendType",
                content: <DataText value={item?.dividendType} />,
            },
            {
                key: "nav",
                content: <DataText value={item?.nav ? RupeeSymbol + item?.nav : "-"} />,
            },
            {
                key: "status",
                content: <DataText value={item?.transactionStatus?.name} />,
            },
        ];
    });

    const folioData = data?.folio?.map((item) => {
        return [
            {
                key: "folioNo",
                content: <DataText value={item?.folioNumber} />,
            },
            {
                key: "dividendType",
                content: <DataText value={item?.dividendType} />,
            },
            {
                key: "investedAmount",
                content: <DataText value={RupeeSymbol + item?.investedValue} />,
            },

            {
                key: "currentValue",
                content: <DataText value={RupeeSymbol + item?.currentValue} />,
            },
            {
                key: "returns",
                content: <DataText value={item?.returns} />,
            },
        ];
    });

    const tabContent = [
        {
            key: "transactions",
            name: "Transactions",
            content: (
                <View className="p-2 flex flex-col w-full">
                    <DataTable
                        key="transactions"
                        headers={[
                            "Amount",
                            "Units",
                            "Created Date",
                            "Dividend Type",
                            "NAV",
                            "Status",
                        ]}
                        cellSize={[1, 1, 1, 1, 1, 1]}
                        rows={transactionData}
                    />
                </View>
            ),
        },
        {
            key: "folio",
            name: "Folio",
            content: (
                <View className="p-2 flex flex-col w-full">
                    <DataTable
                        key="folio"
                        headers={[
                            "Folio No.",
                            "Dividend Type",
                            "Invested Amount",
                            "Current Value",
                            "Returns",
                        ]}
                        cellSize={[1, 1, 1, 1, 1]}
                        rows={folioData}
                    />
                </View>
            ),
        },
    ];

    return (
        <View className="overflow-auto">
            <CardWithTabs
                key="portfolio"
                selectedTab={selectedTab}
                handleTabPress={handleTabPress}
                tabContent={tabContent}
                tabsCount={2}
            />
        </View>
    );
};
