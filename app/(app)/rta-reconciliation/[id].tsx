import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Center,
    HStack,
    Heading,
    Image,
    ScrollView,
    Spinner,
    Text,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import RemoteApi from "../../../src/services/RemoteApi";
import { RupeeSymbol } from "../../../src/helper/helper";
import {
    TransactionDetail,
    TransactionDetailResponseInterface,
} from "../../../src/interfaces/RTADetailInterface";
import { BreadcrumbShadow } from "../../../src/components/Styles/Shadow";
import DataValue from "../../../src/components/DataValue/DataValue";
import { dateFormat } from "../../../src/helper/DateUtils";

export default function RTAConciliationDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<TransactionDetail>();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        async function getOrderDetails() {
            const response: TransactionDetailResponseInterface =
                await RemoteApi.get(`transaction/${id}`);
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
                                    onPress={() =>
                                        router.push("/rta-reconciliation")
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
                                    Transaction Details
                                </Text>
                            </View>
                            <View
                                className="flex flex-row justify-between rounded bg-white h-auto p-4"
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
                                            Transaction ID: {data.id}
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-row items-start justify-between">
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
                                                {
                                                    data?.account?.user[0]
                                                        ?.panNumber
                                                }
                                            </Text>
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
                                            <View className="flex flex-row items-center gap-2">
                                                <Image
                                                    alt="fundHouse"
                                                    className="mr-2"
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        objectFit: "contain",
                                                    }}
                                                    source={{
                                                        uri: data?.mutualfund
                                                            ?.logoUrl,
                                                    }}
                                                />
                                                <View>
                                                    <Text className="text-normal">
                                                        {data.mutualfund.name}
                                                    </Text>
                                                    <View className="flex flex-row items-center gap-2">
                                                        <Text className="text-xs text-gray-400">
                                                            {
                                                                data?.mutualfund
                                                                    ?.category
                                                            }
                                                            {" - " +
                                                                data?.mutualfund
                                                                    ?.subCategory}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="flex flex-row py-2 justify-between items-start w-full">
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="amount"
                                                title="Amount"
                                                value={
                                                    data?.amount
                                                        ? `${RupeeSymbol}${data?.amount}`
                                                        : null
                                                }
                                            />
                                            <DataValue
                                                key="paymentDate"
                                                title="Payment Date"
                                                value={
                                                    data?.paymentDate
                                                        ? dateFormat(
                                                              data?.paymentDate
                                                          )
                                                        : "-"
                                                }
                                            />
                                            <DataValue
                                                key="rta"
                                                title="RTA"
                                                value={`${data?.mutualfund?.rta.toUpperCase()}`}
                                            />
                                            <DataValue
                                                key="status"
                                                title="Transaction Status"
                                                value={`${data?.transactionStatus?.name}`}
                                            />
                                        </View>
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="allotedInvestment"
                                                title="Alloted Investment"
                                                value={
                                                    data?.allotedAmount
                                                        ? `${RupeeSymbol}${data?.allotedAmount}`
                                                        : null
                                                }
                                            />
                                            <DataValue
                                                key="settlementDate"
                                                title="Settlement Date"
                                                value={dateFormat(
                                                    data?.settlementDate
                                                )}
                                            />
                                            <DataValue
                                                key="bseOrderNumber"
                                                title="BSE Order Number"
                                                value={data?.bseOrderNumber}
                                            />
                                            <DataValue
                                                key="type"
                                                title="Transaction Type"
                                                value={
                                                    data?.transactionType?.name
                                                }
                                            />
                                        </View>
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="optionType"
                                                title="Option Type"
                                                value={
                                                    data?.mutualfund?.optionType
                                                        ?.name
                                                }
                                            />
                                            <DataValue
                                                key="units"
                                                title="Units"
                                                value={data?.units}
                                            />
                                            <DataValue
                                                key="folioNo"
                                                title="Folio Number"
                                                value={data?.folio}
                                            />
                                            <DataValue
                                                key="stampDuty"
                                                title="Stamp Duty"
                                                value={
                                                    data?.stampDuty
                                                        ? `${RupeeSymbol}${data?.stampDuty}`
                                                        : null
                                                }
                                            />
                                        </View>
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="dividendType"
                                                title="Dividend Type"
                                                value={
                                                    data?.mutualfund
                                                        ?.dividendType?.name
                                                }
                                            />
                                            <DataValue
                                                key="nav"
                                                title="NAV"
                                                value={
                                                    data?.nav
                                                        ? RupeeSymbol +
                                                          data?.nav
                                                        : "0"
                                                }
                                            />
                                            <DataValue
                                                key="orderType"
                                                title="Order Type"
                                                value={
                                                    data?.transactionType?.name
                                                }
                                            />
                                            <DataValue
                                                key="stt"
                                                title="STT"
                                                value={data?.stt}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View
                                className="flex flex-row justify-between rounded bg-white h-auto p-4"
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
                                            Payment Details
                                        </Text>
                                    </View>
                                    <View className="w-full flex flex-row items-start justify-between mb-2">
                                        <View className="flex flex-row items-center">
                                            <Text
                                                className="text-bold font-medium text-gray-500 mr-2"
                                                selectable
                                            >
                                                Payment Gateway:
                                            </Text>
                                            <Text
                                                selectable
                                                className="font-medium text-start text-black"
                                            >
                                                Razorpay
                                            </Text>
                                        </View>
                                        <View className="flex flex-row items-center">
                                            <Text
                                                className="text-bold font-medium text-gray-500 mr-2"
                                                selectable
                                            >
                                                Payment Mode:
                                            </Text>
                                            <Text
                                                selectable
                                                className="font-medium text-start text-black"
                                            >
                                                UPI
                                            </Text>
                                        </View>
                                        <View className="flex flex-row items-center">
                                            <Text
                                                className="text-bold font-medium text-gray-500 mr-2"
                                                selectable
                                            >
                                                Payment Reference Number:
                                            </Text>
                                            <Text
                                                selectable
                                                className="font-medium text-start text-black"
                                            >
                                                987HDSCD67
                                            </Text>
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

                                    <View className="flex flex-row py-2 items-center w-full flex-wrap">
                                        <View
                                            className={`flex flex-row items-center w-full justify-start`}
                                        >
                                            <Text
                                                selectable
                                                className="text-lg font-bold text-start"
                                            >
                                                Bank Details
                                            </Text>
                                        </View>
                                        <View
                                            className={
                                                "w-full flex flex-row items-center justify-between"
                                            }
                                        >
                                            <View className="w-1/3 flex flex-row items-center gap-2">
                                                <Image
                                                    alt="fundHouse"
                                                    className="mr-2"
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        objectFit: "contain",
                                                    }}
                                                    source={{
                                                        uri: data?.bank
                                                            ?.logoUrl,
                                                    }}
                                                />
                                                <View>
                                                    <Text className="text-normal">
                                                        {data?.bank?.bankName}
                                                    </Text>
                                                    <View className="flex flex-row items-center gap-2">
                                                        <Text className="text-xs text-gray-400">
                                                            {
                                                                data?.bank
                                                                    ?.accountNumber
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View className="w-1/3 flex flex-col items-center">
                                                <View className="w-full">
                                                    <DataValue
                                                        key="branchName"
                                                        title="Branch Name"
                                                        value={
                                                            data?.bank
                                                                ?.branchName
                                                        }
                                                    />
                                                    <DataValue
                                                        key="ifscCode"
                                                        title="IFSC Code"
                                                        value={
                                                            data?.bank?.ifscCode
                                                        }
                                                    />
                                                </View>
                                            </View>
                                            <View className="w-1/3 flex flex-col items-center">
                                                <View className="w-1/2">
                                                    <DataValue
                                                        key="accountType"
                                                        title="Account Type"
                                                        value={
                                                            data?.bank
                                                                ?.bankAccountType
                                                                ?.name
                                                        }
                                                    />
                                                    <DataValue
                                                        key="autopay"
                                                        title="Autopay"
                                                        value="Enabled"
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}
