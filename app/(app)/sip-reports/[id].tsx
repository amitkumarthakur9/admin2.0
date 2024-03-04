import {
    Dimensions,
    ImageBackground,
    View,
    StyleSheet,
    useWindowDimensions,
    TouchableOpacity,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
    Button,
    Center,
    CheckCircleIcon,
    HStack,
    Heading,
    Pressable,
    ScrollView,
    Spinner,
    Text,
    WarningIcon,
    Image,
    Popover,
} from "native-base";
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
import { Platform } from "react-native";
import {
    SIPDetailResponseInterface,
    SIPReportDetail,
} from "../../../src/interfaces/SIPDetailInterface";
import Icon from "react-native-vector-icons/FontAwesome";
import AntdIcon from "react-native-vector-icons/AntDesign";
import { BreadcrumbShadow } from "../../../src/components/Styles/Shadow";
import { RupeeSymbol } from "../../../src/helper/helper";
import DataGrid from "../../../src/components/DataGrid/DataGrid";
import HorizontalStackedBarChart from "../../../src/components/Chart/HorizontalBarChart";
import Accordion from "../../../src/components/Accordion/Accordion";
import DataTable from "../../../src/components/DataTable/DataTable";
import DataText from "../../../src/components/DataValue/DataText";
import { dateFormat } from "../../../src/helper/DateUtils";
import { getTransactionMessage } from "../../../src/helper/StatusInfo";

const DataValue = ({ title, value }) => {
    return (
        <View className="w-full flex flex-row justify-between items-center p-2">
            <View className="w-1/2 flex ">
                <Text
                    className="text-bold font-mediumk text-gray-500"
                    selectable
                >
                    {title ? title : "-"}
                </Text>
            </View>
            <View className="w-1/2 flex">
                <Text selectable className="font-medium text-start text-blac">
                    {value ? value : "-"}
                </Text>
            </View>
        </View>
    );
};

export default function SIPReportsDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<SIPReportDetail>();
    const [isLoading, setIsLoading] = useState(true);
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        setIsLoading(true);
        async function getOrderDetails() {
            const response: SIPDetailResponseInterface = await RemoteApi.get(
                `sip/${id}`
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
                                    SIP Details
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
                                            SIP #{data.id}
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
                                                    CVBBGF9
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
                                                        .fundhouse.logoUrl,
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
                                                    {data.mutualfund.name}
                                                </Text>

                                                <View className="flex flex-row items-center flex-wrap">
                                                    <Text
                                                        selectable
                                                        className=" text-blacktext-xs"
                                                    >
                                                        {
                                                            data.mutualfund
                                                                .fundhouse.name
                                                        }
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
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="Amount"
                                                title="Amount"
                                                value={
                                                    RupeeSymbol + data?.amount
                                                }
                                            />
                                            <DataValue
                                                key="Option Type"
                                                title="Option Type"
                                                value="Monthly"
                                            />
                                            <DataValue
                                                key="amountInvestment"
                                                title="Amount Investment"
                                                value={RupeeSymbol + "57,000"}
                                            />
                                        </View>
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="startDate"
                                                title="Start Date"
                                                value={"23/09/1998"}
                                            />
                                            <DataValue
                                                key="Dividend Type"
                                                title="Dividend Type"
                                                value="Reinvest"
                                            />
                                            <DataValue
                                                key="Registeredby"
                                                title="Registered by"
                                                value="Sunil Mehra(Client)"
                                            />
                                        </View>
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="endDate"
                                                title="End Date"
                                                value={"23/09/2098"}
                                            />
                                            <DataValue
                                                key="Registered"
                                                title="Registration No.:"
                                                value={
                                                    data?.sipReferenceNumber ||
                                                    "345675"
                                                }
                                            />
                                            <DataValue
                                                key="registrationDate "
                                                title="Registration Date:"
                                                value={dateFormat(
                                                    data?.createdAt
                                                )}
                                            />
                                        </View>
                                        <View className="w-3/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="DueDate"
                                                title="Due Date"
                                                value={"23/09/2024"}
                                            />
                                            <DataValue
                                                key="kycStatus"
                                                title="Status"
                                                value="Active"
                                            />
                                            {/* <DataValue
                                                key="riskProfile"
                                                title="Risk Profile"
                                                value={"-"}
                                            /> */}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-128">
                                <View
                                    className="w-[60%] h-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <TransactionList data={data} />
                                </View>
                                <View
                                    className="w-[39%] h-128 rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <AccountDetailsCard data={data} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}

const AccountDetailsCard = ({ data }: { data: SIPReportDetail }) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const accordionData = [
        {
            title: "Kotak Bank",
            subcontent: (
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-400">
                        xxxx xxxx 6789
                    </Text>
                    <Text className="text-xs text-purple-700">Primary</Text>
                </View>
            ),
            content: (
                <View className="w-full p-4">
                    <DataValue
                        key="branchName"
                        title="Branch Name"
                        value="Mahatama Gandhi Road, Bengaluru"
                    />
                    <DataValue
                        key="ifsc"
                        title="IFSC Code"
                        value="KMB0003838"
                    />
                    <DataValue
                        key="accountType"
                        title="Account Type"
                        value="Savings"
                    />
                    <DataValue key="autopay" title="Autopay" value="Enabled" />
                    <View className="p-2">
                        <Text className="text-md font-semibold py-4">
                            Autopay Details
                        </Text>
                        <View className="flex flex-row justify-between">
                            <DataGrid
                                key="autopay"
                                reverse
                                title="Autopay ID"
                                value={
                                    <View className="flex flex-row items-center gap-2">
                                        <Text className="text-sm">
                                            73478236874789
                                        </Text>
                                        <Icon
                                            name="copy"
                                            style={{ fontWeight: "100" }}
                                            size={12}
                                            color="grey"
                                        />
                                    </View>
                                }
                            />
                            <DataGrid
                                key="status"
                                reverse
                                title="Status"
                                value={
                                    <Text className="text-green-500 text-sm">
                                        Approved
                                    </Text>
                                }
                            />
                        </View>
                        <View className="flex flex-row justify-between">
                            <DataGrid
                                key="endDate"
                                reverse
                                title="End Date"
                                value={
                                    <Text className="text-sm">
                                        Jan 22, 2024
                                    </Text>
                                }
                            />
                            <DataGrid
                                key="autopayAmount"
                                reverse
                                title="Autopay Amount"
                                value={
                                    <Text className="text-sm">
                                        {RupeeSymbol} 2,00,000
                                    </Text>
                                }
                            />
                        </View>
                        {/* <Button
                            width="48"
                            bgColor={"#013974"}
                            onPress={() => console.log("Press Invest")}
                        >
                            Set Autopay
                        </Button> */}
                    </View>
                </View>
            ),
        },
        {
            title: "HDFC Bank",
            subcontent: (
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-400">
                        xxxx xxxx 6789
                    </Text>
                </View>
            ),
            content: "HDFC Bank Details",
        },
        {
            title: "Canara Bank",
            subcontent: (
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-400">
                        xxxx xxxx 6789
                    </Text>
                </View>
            ),
            content: "Canara Bank Details",
        },
    ];

    const renderItem = (item) => (
        <View style={{ padding: 10 }}>
            <Text>{item.content}</Text>
        </View>
    );
    const tabContent = [
        {
            key: "bankAccounts",
            name: "Bank Accounts",
            content: (
                <View className="w-full p-2 flex flex-col justify-items items-center">
                    <Accordion
                        accordionData={accordionData}
                        renderItem={renderItem}
                    />
                </View>
            ),
        },
    ];
    return (
        <>
            <View className="w-full p-2 flex flex-col justify-items items-center">
                <Text selectable className="text-lg font-bold text-start">
                    Bank Accounts
                </Text>
                <Accordion
                    accordionData={accordionData}
                    renderItem={renderItem}
                />
            </View>
        </>
    );
};

const TransactionList = ({ data }: { data: SIPReportDetail }) => {
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
                content: <DataText value={item?.units || "01"} />,
            },
            {
                key: "createdDate",
                content: <DataText value={dateFormat(item?.createdAt)} />,
            },
            {
                key: "nav",
                content: (
                    <DataText
                        value={
                            item?.nav
                                ? RupeeSymbol + item?.nav
                                : `${RupeeSymbol + "898"}`
                        }
                    />
                ),
            },
            {
                key: "status",
                content: (
                    <View className='flex flex-row items-center w-12/12 justify-start'>
                    <View className='flex flex-col rounded-full w-8/12 items-center justify-center'>
                        <View className='flex flex-row items-center justify-center w-11/12'>
                            <Popover trigger={triggerProps => {
                                return <TouchableOpacity {...triggerProps}>
                                    <Icon name="info-circle" size={12} color="black" />
                                </TouchableOpacity>;
                            }}>
                                <Popover.Content accessibilityLabel="Order Details" w="56">
                                    <Popover.Arrow />
                                    <Popover.CloseButton />
                                    <Popover.Header>{item?.transactionStatus?.name}</Popover.Header>
                                    <Popover.Body>
                                        <View>
                                            <Text>{getTransactionMessage(item?.transactionStatus?.name)}</Text>
                                        </View>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                            <Text selectable className='p-1 text-black text-end md:text-center text-xs'>{item?.transactionStatus?.name}&nbsp;</Text>

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
                    Transaction
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
                key="transactions"
                headers={["Amount", "Units", "Created Date", "NAV", "Status"]}
                cellSize={[1, 1, 2, 1, 1]}
                // rows={[
                //     [
                //         {
                //             key: "amounts",
                //             content: (
                //                 <View className="flex flex-row items-center gap-2">
                //                     <View>
                //                         <Text className="text-xs">
                //                             {data?.amount ? (RupeeSymbol + data?.amount) : "-"}
                //                         </Text>
                //                     </View>
                //                 </View>
                //             ),
                //         },
                //         {
                //             key: "units",
                //             content: (
                //                 <View className="flex flex-row items-center gap-2">

                //                     <View>
                //                         <Text className="text-xs">
                //                             {data?.units ? (RupeeSymbol + data?.units) : "2"}
                //                         </Text>
                //                     </View>
                //                 </View>
                //             ),
                //         },

                //         {
                //             key: "date",
                //             content: (
                //                 <View className="flex flex-row items-center gap-2">
                //                     <View>
                //                         <Text className="text-xs">
                //                             {data?.units ? (RupeeSymbol + data?.units) : "20/11/2024"}
                //                         </Text>
                //                     </View>
                //                 </View>
                //             ),
                //         },
                //         {
                //             key: "nav",
                //             content: (
                //                 <View className="flex flex-row items-center gap-2">
                //                     <View>
                //                         <Text className="text-xs">
                //                             {data?.units ? (RupeeSymbol + data?.units) : "350"}
                //                         </Text>
                //                     </View>
                //                 </View>
                //             ),
                //         },
                //         {
                //             key: "status",
                //             content: (
                //                 <View className="flex flex-row items-center gap-2">
                //                     <View>
                //                         <Text className="text-xs">
                //                             {data?.units ? (RupeeSymbol + data?.units) : "placed"}
                //                         </Text>
                //                     </View>
                //                 </View>
                //             ),
                //         },
                //     ],

                // ]}

                rows={transactionData}
            />
        </View>
    );
};
