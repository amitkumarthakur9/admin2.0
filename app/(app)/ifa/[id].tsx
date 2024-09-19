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
import {
    IFADetailData,
    IfaDetailResponse,
} from "../../../src/interfaces/IfaResponseInterface";

export default function IFADetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<IFADetailData>();
    const [isLoading, setIsLoading] = useState(true);
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        setIsLoading(true);
        async function getOrderDetails() {
            const response: IfaDetailResponse = await RemoteApi.get(
                `distributor/${id}`
            );
            if (response) {
                setData(response.data);
                setIsLoading(false);
            } else {
                // setData(dummyData);
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
                                    onPress={() =>
                                        router.push(`distributor/list}`)
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
                                    IFA Details
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
                                            IFA Name: {data?.name || "NA"}
                                        </Text>
                                    </View>
                                    <View className="flex flex-row justify-between items-start w-full">
                                        <View className="w-11/12 flex flex-row items-start justify-between">
                                            <View className="flex flex-row items-center">
                                                <Text
                                                    className="text-bold font-medium text-gray-500 mr-2"
                                                    selectable
                                                >
                                                    ARN:
                                                </Text>
                                                <Text
                                                    selectable
                                                    className="font-medium text-start text-black"
                                                >
                                                    {data?.arn || "NA"}
                                                </Text>
                                            </View>
                                            <View className="flex flex-row items-center">
                                                <Text
                                                    className="text-bold font-medium text-gray-500 mr-2"
                                                    selectable
                                                >
                                                    EUIN:
                                                </Text>
                                                <Text
                                                    selectable
                                                    className="font-medium text-start text-black"
                                                >
                                                    {data?.euin || "NA"}
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
                                                    {data?.panNumber || "NA"}
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
                                            <View
                                                className={
                                                    "flex flex-col justify-end items-start"
                                                }
                                            >
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all text-sm flex-wrap"
                                                ></Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex flex-row py-2 justify-between items-start w-full">
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="purchase"
                                                title="Purchase"
                                                value={
                                                    data?.transaction?.purchase
                                                        ? RupeeSymbol +
                                                          data?.transaction
                                                              ?.purchase
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="redemption"
                                                title="Redemption"
                                                value={
                                                    data?.transaction
                                                        ?.redemption
                                                        ? RupeeSymbol +
                                                          data?.transaction
                                                              ?.redemption
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="totalLumpsum"
                                                title="Total Lumpsum"
                                                value={
                                                    data?.order?.lumpsum?.total
                                                        ? RupeeSymbol +
                                                          data?.order?.lumpsum
                                                              ?.total
                                                        : "NA"
                                                }
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="totalSipTransactions"
                                                title="Total Sip Transactions"
                                                value={
                                                    data?.transaction
                                                        ?.totalSipTransactions ||
                                                    "NA"
                                                }
                                            />
                                            <DataValue
                                                key="totalSipTransactionsFailed"
                                                title="Total Sip Transactions Failed"
                                                value={
                                                    data?.transaction
                                                        ?.totalSipTransactionsFailed ||
                                                    "NA"
                                                }
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="monthlySipAmount"
                                                title="Monthly Sip Amount"
                                                value={
                                                    data?.order?.sip
                                                        ?.monthlySipAmount
                                                        ? RupeeSymbol +
                                                          data?.order?.sip
                                                              ?.monthlySipAmount
                                                        : "NA"
                                                }
                                            />
                                            <DataValue
                                                key="sipCount"
                                                title="SIP Count"
                                                value={
                                                    data?.order?.sip
                                                        ?.sipCount || "37"
                                                }
                                            />
                                            <DataValue
                                                key="newSip"
                                                title="New SIP"
                                                value={
                                                    data?.order?.sip?.newSip ||
                                                    "NA"
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
                                    <AUMBreakDown data={dummyData} />
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-128">
                                <View
                                    className="w-full h-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <SIPBreakDown data={dummyData} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

// const AUMBreakDown = ({ data }: { data: IFADetailData }) => {
const AUMBreakDown = (data) => {
    console.log("aumbrekdown" + JSON.stringify(data));

    const transactionData = data?.aum?.breakDown.map((item) => {
        return [
            {
                key: "category",
                content: (
                    <View className="flex flex-row justify-center ">
                        <DataText value={item?.category} />
                    </View>
                ),
            },
            {
                key: "currentValue",
                content: (
                    <View className="flex flex-row justify-center ">
                        <DataText value={RupeeSymbol + item?.currentValue} />
                    </View>
                ),
            },
        ];
    });

    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <View
                className={`flex flex-row items-center w-full justify-between`}
            >
                <Text selectable className="text-lg font-bold text-start">
                    AUM Breakdown
                </Text>
                <Text selectable className="text-lg font-bold text-start">
                    Total AUM: {data?.aum?.total || "2345566"}
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
                headers={["Category", "CurrentValue"]}
                cellSize={[4, 4]}
                rows={transactionData}
            />
        </View>
    );
};

// const SIPBreakDown = ({ data }: { data: IFADetailData }) => {
const SIPBreakDown = (data) => {
    const transactionData = data?.order?.sip?.breakDown.map((item) => {
        return [
            {
                key: "category",
                content: (
                    <View className="flex flex-row justify-center ">
                        <DataText value={item?.category} />
                    </View>
                ),
            },
            {
                key: "currentValue",
                content: (
                    <View className="flex flex-row justify-center ">
                        <DataText value={RupeeSymbol + item?.count} />
                    </View>
                ),
            },
        ];
    });

    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <View className={`flex flex-row items-center w-full justify-start`}>
                <Text selectable className="text-lg font-bold text-start">
                    SIP Breakdown
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
                headers={["Category", "Count"]}
                cellSize={[4, 4]}
                rows={transactionData}
            />
        </View>
    );
};
