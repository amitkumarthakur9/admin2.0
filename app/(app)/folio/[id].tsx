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
import DataTable from "../../../src/components/DataTable/DataTable";
import { BreadcrumbShadow } from "../../../src/components/Styles/Shadow";

const DataValue = ({ title, value }) => {
    return (
        <View className="w-full flex flex-row justify-between items-center p-2">
            <View className="w-1/2 flex ">
                <Text className="text-bold font-mediumk text-gray-500" selectable>
                    {title ? title : "-"}
                </Text>
            </View>
            <View className="w-1/2 flex">
                <Text
                    selectable
                    className="font-medium text-start text-blac"
                >
                    {value ? value : "-"}
                </Text>
            </View>
        </View>
    );
};

export default function AUMDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<AUMDetailInterface>();
    const [isLoading, setIsLoading] = useState(true);
    const { height, width } = useWindowDimensions();

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

    const getInitials = (name: string) => {
        const words = name.split(" ");
        if (words.length >= 2) {
            const firstWord = words[0];
            const secondWord = words[1];
            return `${firstWord[0]}${secondWord[0]}`;
        } else if (words.length === 1) {
            return words[0][0];
        } else {
            return "";
        }
    };

    const getColorCode = (status: string) => {
        let color = "#ece09d";
        if (status == "Cancelled" || status == "Failed") {
            color = "#ffd5d5";
        } else if (status == "Success") {
            color = "#afc9a2";
        }

        return color;
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
                                        <Text selectable className="text-lg font-bold text-start">
                                            Folio Number: {data.folioNumber}
                                        </Text>

                                    </View>
                                    <View className="flex flex-row justify-between items-start w-full">
                                        <View className="w-4/12 flex flex-row gap-2">
                                            <DataValue
                                                key="clientName"
                                                title="Client Name"
                                                value={data?.account?.name}
                                            />
                                            <DataValue
                                                key="clientCode"
                                                title="Client Code"
                                                value={data?.account?.clientId}
                                            />
                                            <DataValue
                                                key="pan"
                                                title="PAN"
                                                value={data.account.user.panNumber}
                                            />
                                        </View>
                                    </View>
                                    <View
                                        className="my-2"
                                        style={{
                                            borderColor: "#e4e4e4",
                                            borderBottomWidth: StyleSheet.hairlineWidth,
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
                                                        ?.fundhouse?.logoUrl,
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
                                                        "-"}
                                                </Text>

                                                <View className="flex flex-row items-center flex-wrap">
                                                    <Text
                                                        selectable
                                                        className=" text-blacktext-xs"
                                                    >
                                                        {data?.mutualfund
                                                            ?.mutualfundSubcategory
                                                            ?.mutualfundCategory
                                                            ?.name || "-"}
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
                                                        {data?.mutualfund
                                                            ?.mutualfundSubcategory
                                                            ?.name || "-"}
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
                                                value="Monthly"
                                            />
                                            <DataValue
                                                key="currentValue"
                                                title="Current Value"
                                                value={data.currentValue
                                                    ? RupeeSymbol +
                                                    data.currentValue
                                                    : "-"}
                                            />
                                            <DataValue
                                                key="createdDate"
                                                title="Created Date"
                                                value="23/03/23"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="dividendType"
                                                title="Dividend Type"
                                                value="Reinvest"
                                            />
                                            <DataValue
                                                key="investedValue"
                                                title="Invested Value"
                                                value={data.investedValue
                                                    ? RupeeSymbol +
                                                    data.investedValue
                                                    : "-"}
                                            />
                                            <DataValue
                                                key="xirr"
                                                title="XIRR"
                                                value="25%"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="rta"
                                                title="RTA"
                                                value="CAMS"
                                            />
                                            <DataValue
                                                key="returns"
                                                title="Returns"
                                                value={RupeeSymbol + "2500"}
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
                headers={["Amount", "Units", "Date", "NAV", "Status"]}
                cellSize={[1, 1, 1, 1, 1,]}
                rows={[
                    [
                        {
                            key: "amount",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            {RupeeSymbol + "7388"}
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "units",
                            content: (
                                <View className="flex flex-row items-center gap-2">

                                    <View>
                                        <Text className="text-xs">
                                            {/* {data?.amount ? (RupeeSymbol + data?.amount) : "2"} */}
                                            01
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },

                        {
                            key: "date",
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
                            key: "nav",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            {RupeeSymbol + "7388"}
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "status",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View>
                                        <Text className="text-xs">
                                            Active
                                        </Text>
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