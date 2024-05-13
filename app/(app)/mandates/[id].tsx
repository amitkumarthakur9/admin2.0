import {
    Dimensions,
    ImageBackground,
    View,
    StyleSheet,
    Platform,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
    Avatar,
    Button,
    Center,
    HStack,
    Heading,
    Image,
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
import { BreadcrumbShadow } from "../../../src/components/Styles/Shadow";
import {
    MandateDetailInterface,
    MandateDetailInterfaceResponse,
} from "../../../src/interfaces/MandateDetailResponseInterface";
import DataTable from "../../../src/components/DataTable/DataTable";

const DataValue = ({ title, value }) => {
    return (
        <View className="w-full flex flex-row justify-between items-center p-2">
            <View className="w-1/2 flex ">
                <Text
                    className="text-bold font-mediumk text-gray-500"
                    selectable
                >
                    {title ? title : "NA"}
                </Text>
            </View>
            <View className="w-1/2 flex">
                <Text selectable className="font-medium text-start text-blac">
                    {value ? value : "NA"}
                </Text>
            </View>
        </View>
    );
};

export default function MandateDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<MandateDetailInterface>();
    const [isLoading, setIsLoading] = useState(true);
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        setIsLoading(true);
        async function getOrderDetails() {
            const response: MandateDetailInterfaceResponse =
                await RemoteApi.get(`mandate/${id}`);
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
                                    Mandate Details
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
                                            Mandate ID: {data.mandateId}
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
                                                    {
                                                        data?.account?.user[0]
                                                            ?.panNumber
                                                    }
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

                                    <View className="flex flex-row py-2 justify-between items-start w-full">
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="mandateType"
                                                title="Mandate Type"
                                                value="UPI"
                                            />
                                            <DataValue
                                                key="registrationDate"
                                                title="Registered Date"
                                                value={
                                                    data.startDate
                                                        ? moment(
                                                              new Date(
                                                                  data.startDate
                                                              )
                                                          ).format("DD-MM-YYYY")
                                                        : "NA"
                                                }
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="payment Gateway"
                                                title="Payment Gateway"
                                                value="Razorpay"
                                            />
                                            <DataValue
                                                key="createdDate"
                                                title="Created Date"
                                                value={
                                                    data?.createdAt
                                                        ? moment(
                                                              new Date(
                                                                  data?.createdAt
                                                              )
                                                          ).format("DD-MM-YYYY")
                                                        : "NA"
                                                }
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="status"
                                                title="Status"
                                                value={
                                                    data?.mandateStatus?.name
                                                }
                                            />
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
                                        <Text
                                            selectable
                                            className="text-black font-bold"
                                        >
                                            Bank Details
                                        </Text>
                                    </View>
                                    <View className="flex flex-row py-2 items-center w-full flex-wrap">
                                        <View
                                            className={
                                                "flex flex-row items-center justify-start w-4/12"
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
                                                uri: data.mutualfund
                                                    .fundhouse.logoUrl,
                                            }}
                                            /> */}
                                            <View
                                                className={
                                                    "flex flex-row justify-start items-start w-11/12"
                                                }
                                            >
                                                <View className="w-8 h-8 rounded bg-gray-500 mx-2" />
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all text-sm flex-wrap"
                                                >
                                                    {data.bankAccount
                                                        .bankName || "NA"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="w-4/12 flex flex-col gap-2">
                                            <DataValue
                                                key="accountNo"
                                                title="Account No:"
                                                value={
                                                    data.bankAccount
                                                        .accountNumber || "NA"
                                                }
                                            />
                                            <DataValue
                                                key="branchName"
                                                title="Branch Name"
                                                value={
                                                    data.bankAccount
                                                        .branchName || "NA"
                                                }
                                            />
                                        </View>
                                        <View className="w-4/12 flex flex-col gap-2">
                                            <DataValue
                                                key="accountType"
                                                title="Account Type"
                                                value={
                                                    data.bankAccount
                                                        .bankAccountType.name ||
                                                    "NA"
                                                }
                                            />
                                            <DataValue
                                                key="bankIFSC"
                                                title="IFSC Code"
                                                value={
                                                    data.bankAccount.ifscCode ||
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
                                    <SIPList data={data} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const SIPList = ({ data }: { data: MandateDetailInterface }) => {
    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <View className={`flex flex-row items-center w-full justify-start`}>
                <Text selectable className="text-lg font-bold text-start">
                    SIP List
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
                headers={[
                    "Mutual Fund Name",
                    "Option Type",
                    "Dividend Type",
                    "Amount",
                    "Start Date",
                    "Reg. No.",
                    "Status",
                ]}
                cellSize={[1, 1, 1, 1, 1, 1, 1]}
                rows={[
                    [
                        {
                            key: "mutualFundName",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            Axis Mid Cap Fund
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "optionType",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            {/* {data?.amount ? (RupeeSymbol + data?.amount) : "2"} */}
                                            Monthly
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },

                        {
                            key: "dividendType",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            Reinvest
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "amount",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            {RupeeSymbol + "3456"}
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "startDate",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            23/09/2023
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "regno",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">6778765</Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "status",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">Active</Text>
                                    </View>
                                </View>
                            ),
                        },
                    ],
                ]}
            />
        </View>
    );
};
