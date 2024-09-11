import {
    Dimensions,
    ImageBackground,
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
    Avatar,
    Button,
    Center,
    HStack,
    Heading,
    Image,
    Popover,
    Pressable,
    ScrollView,
    Spinner,
    Text,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import RemoteApi from "../../../src/services/RemoteApi";
import {
    Order,
    OrderDataInterface,
} from "../../../src/interfaces/OrderDataInterface";
import {
    BorderShadow,
    BorderShadowPhone,
    HeaderShadow,
} from "../../../src/components/Styles/Shadow";
import moment from "moment";
import { RupeeSymbol } from "../../../src/helper/helper";
import {
    AUMDetailInterface,
    AUMDetailResponseInterface,
} from "../../../src/interfaces/AUMDetailResponseInterface";
import { useWindowDimensions } from "react-native";
import DataTable from "../../../src/components/DataTable/DataTable";
import { BreadcrumbShadow } from "../../../src/components/Styles/Shadow";
import DataValue from "../../../src/components/DataValue/DataValue";
import DataText from "../../../src/components/DataValue/DataText";
import { dateFormat } from "../../../src/helper/DateUtils";
import { getTransactionMessage } from "../../../src/helper/StatusInfo";
import { useRouter } from "expo-router";

export default function AUMDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<AUMDetailInterface>();
    const [isLoading, setIsLoading] = useState(true);
    const { height, width } = useWindowDimensions();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        async function getOrderDetails() {
            const response: AUMDetailResponseInterface = await RemoteApi.get(
                `folio/${id}`
            );
            if (response) {
                setData(response.data);
                setIsLoading(false);
            }
        }
        if (id) {
            getOrderDetails();
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
                                    onPress={() => router.back()}
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
                                    Folio Details
                                </Text>
                            </View>
                            <View
                                className="flex flex-row justify-between rounded  h-auto p-4"
                                style={{ ...BreadcrumbShadow }}
                            >
                                <View className="flex flex-col gap-2 w-full">
                                    <View
                                        className={`flex flex-row items-center w-full justify-start`}
                                    >
                                        <Text
                                            selectable
                                            className="text-lg font-bold text-start"
                                        >
                                            Folio Number: {data.folioNumber}
                                        </Text>
                                    </View>
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
                                                    {data?.account?.name}
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
                                                    {data?.account?.clientId}
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
                                                    {data?.account?.panNumber}
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
                                            <Image
                                                alt="fundHouse"
                                                className="mr-2"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: "contain",
                                                }}
                                                source={{
                                                    uri: data.mutualfund
                                                        ?.logoUrl,
                                                }}
                                            />
                                            <View
                                                className={
                                                    "flex flex-col justify-end items-start"
                                                }
                                            >
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all text-sm flex-wrap"
                                                >
                                                    {data?.mutualfund?.name ||
                                                        "NA"}
                                                </Text>

                                                <View className="flex flex-row items-center flex-wrap">
                                                    <Text
                                                        selectable
                                                        className=" text-blacktext-xs"
                                                    >
                                                        {data?.mutualfund
                                                            ?.category || ""}
                                                    </Text>
                                                    <View className="flex flex-row mx-2 justify-center items center">
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
                                                        {data?.mutualfund
                                                            ?.subCategory || ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex flex-row py-2 justify-between items-start w-full">
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="optionType"
                                                title="Option Type"
                                                value={
                                                    data?.mutualfund?.optionType
                                                }
                                            />
                                            <DataValue
                                                key="currentValue"
                                                title="Current Value"
                                                value={
                                                    data.currentValue
                                                        ? RupeeSymbol +
                                                          data.currentValue.toFixed(
                                                              2
                                                          )
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="createdDate"
                                                title="Created Date"
                                                // value={dateFormat("")}
                                                value="23/01/2024"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="dividendType"
                                                title="Dividend Type"
                                                value={
                                                    data?.mutualfund
                                                        ?.dividendType
                                                }
                                            />
                                            <DataValue
                                                key="investedValue"
                                                title="Invested Value"
                                                value={
                                                    data.investedValue
                                                        ? RupeeSymbol +
                                                          data.investedValue.toFixed(
                                                              2
                                                          )
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="xirr"
                                                title="XIRR"
                                                value={data?.xirr}
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="rta"
                                                title="RTA"
                                                value={
                                                    data?.mutualfund?.fundhouse
                                                        ?.rta?.name
                                                }
                                            />
                                            <DataValue
                                                key="returns"
                                                title="Returns"
                                                value={
                                                    data?.investedValue &&
                                                    data?.currentValue
                                                        ? (
                                                              data?.currentValue -
                                                              data?.investedValue
                                                          ).toFixed(2)
                                                        : "NA"
                                                }
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
                                    <TransactionsList data={data} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const TransactionsList = ({ data }: { data: AUMDetailInterface }) => {
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
                content: <DataText value={item?.units.toFixed(2)} />,
            },
            {
                key: "paymentDate",
                content: <DataText value={dateFormat(item?.paymentDate)} />,
            },
            {
                key: "nav",
                content: (
                    <DataText
                        value={
                            item?.nav
                                ? RupeeSymbol + item?.nav.toFixed(2)
                                : "NA"
                        }
                    />
                ),
            },
            {
                key: "status",
                content: (
                    <View className="flex flex-row items-center w-12/12 justify-start">
                        <View className="flex flex-col rounded-full w-8/12 items-center justify-center">
                            <View className="flex flex-row items-center justify-center w-11/12">
                                <Popover
                                    trigger={(triggerProps) => {
                                        return (
                                            <TouchableOpacity {...triggerProps}>
                                                <Icon
                                                    name="info-circle"
                                                    size={12}
                                                    color="black"
                                                />
                                            </TouchableOpacity>
                                        );
                                    }}
                                >
                                    <Popover.Content
                                        accessibilityLabel="Order Details"
                                        w="56"
                                    >
                                        <Popover.Arrow />
                                        <Popover.CloseButton />
                                        <Popover.Header>
                                            {item?.transactionStatus?.name}
                                        </Popover.Header>
                                        <Popover.Body>
                                            <View>
                                                <Text>
                                                    {getTransactionMessage(
                                                        item?.transactionStatus
                                                            ?.name
                                                    )}
                                                </Text>
                                            </View>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover>
                                <Text
                                    selectable
                                    className="p-1 text-black text-end md:text-center text-xs"
                                >
                                    {item?.transactionStatus?.name}&nbsp;
                                </Text>
                            </View>
                        </View>
                    </View>
                ),
            },
        ];
    });

    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <View className={`flex flex-row items-center w-full justify-start`}>
                <Text selectable className="text-lg font-bold text-start">
                    Transactions
                </Text>
            </View>
            <View
                className="my-2"
                style={{
                    borderColor: "#e4e4e4",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
            <DataTable
                key="siplist"
                headers={["Amount", "Units", "Payment Date", "NAV", "Status"]}
                cellSize={[1, 1, 1, 1, 1]}
                rows={transactionData}
            />
        </View>
    );
};
