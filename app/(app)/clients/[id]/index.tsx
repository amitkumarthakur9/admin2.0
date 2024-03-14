import { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Button,
    Center,
    CheckCircleIcon,
    HStack,
    Heading,
    Image,
    Pressable,
    ScrollView,
    Spinner,
    Text,
    WarningIcon,
} from "native-base";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import AntdIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";

import RemoteApi from "../../../../src/services/RemoteApi";
import { BreadcrumbShadow } from "../../../../src/components/Styles/Shadow";
import { RupeeSymbol, maskLetters } from "../../../../src/helper/helper";
import CardWithTabs from "../../../../src/components/Card/CardWithTabs";
import DataGrid from "../../../../src/components/DataGrid/DataGrid";
import HorizontalStackedBarChart from "../../../../src/components/Chart/HorizontalBarChart";
import Accordion from "../../../../src/components/Accordion/Accordion";
import DataTable from "../../../../src/components/DataTable/DataTable";
import Modal from "../../../../src/components/Modal/Modal";
import { TextInput } from "react-native";
import DropdownComponent from "../../../../src/components/Dropdowns/DropDown";
import RadioButton from "../../../../src/components/Radio/Radio";
import DataValue from "../../../../src/components/DataValue/DataValue";

export default function ClientDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailedDataResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const [modalKey, setModalKey] = useState("invest");
    const [cardPage, setCardPage] = useState(1);
    const [selectedFund, setSelectedFund] = useState(null);
    const [allowModalCardChange, setAllowModalCardChange] = useState(true);

    const closeModal = () => {
        setVisible(false);
        setModalKey("");
        setCardPage(1);
        setSelectedFund(null);
    };

    const showModal =
        (key: string, card?: number, selectedFund?: any) => () => {
            setCardPage(card || 1);
            setSelectedFund(selectedFund || null);
            setModalKey(key);
            setVisible(true);
        };

    const changeSelectedFund = (data: any, card: number, from: string) => {
        setSelectedFund(data);
        setCardPage(card);
    };

    const modalValues = {
        invest: (
            <InvestModalCard
                hideDialog={closeModal}
                card={cardPage}
                selectedFund={selectedFund}
                changeSelectedFund={changeSelectedFund}
                allowModalCardChange={allowModalCardChange}
            />
        ),
        redeem: (
            <RedeemModalCard
                hideDialog={closeModal}
                card={cardPage}
                selectedFund={selectedFund}
                changeSelectedFund={changeSelectedFund}
                allowModalCardChange={allowModalCardChange}
            />
        ),
    };

    useEffect(() => {
        setIsLoading(true);
        async function getDetails() {
            const response: ApiResponse<ClientDetailedDataResponse> =
                await RemoteApi.get(`client/${id}`);
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
                                    onPress={() => router.push("/clients")}
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
                                    Clients Details
                                </Text>
                            </View>
                            <View
                                className="flex flex-row justify-between rounded bg-[#eaf3fe] h-auto p-4"
                                style={{ ...BreadcrumbShadow }}
                            >
                                <View className="flex flex-col gap-6 w-full">
                                    <View className="flex flex-row w-full justify-between items-center">
                                        <View className="flex flex-row gap-2 items-center">
                                            <Text
                                                selectable
                                                className="text-lg flex flex-row text-center font-semibold"
                                            >
                                                {data?.name}
                                            </Text>
                                            {data?.isActive ? (
                                                <CheckCircleIcon
                                                    color="emerald.500"
                                                    size="md"
                                                />
                                            ) : (
                                                <WarningIcon
                                                    size="md"
                                                    color="orange.500"
                                                />
                                            )}
                                        </View>
                                        <View>
                                            <Button
                                                width="48"
                                                bgColor={"#013974"}
                                                onPress={showModal("invest")}
                                            >
                                                Invest
                                            </Button>
                                        </View>
                                    </View>
                                    <View className="flex flex-row justify-between items-start w-full">
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="pan"
                                                title="Pan No."
                                                value={
                                                    data?.users[0]?.panNumber
                                                }
                                            />
                                            <DataValue
                                                key="clientCode"
                                                title="Client Code"
                                                value={data?.clientId}
                                            />
                                            <DataValue
                                                key="dob"
                                                title="DOB"
                                                value={moment(
                                                    data.users[0]?.dateOfBirth
                                                ).format("MMM DD, YYYY")}
                                            />
                                            <DataValue
                                                key="doi"
                                                title="DOI"
                                                value="-"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="totalInvestment"
                                                title="Total Investment"
                                                value="-"
                                            />
                                            <DataValue
                                                key="runningSip"
                                                title="Running SIPs"
                                                value={data?.sipOrders?.length}
                                            />
                                            <DataValue
                                                key="lastInvestment"
                                                title="Last Lumpsum"
                                                value={`-`}
                                            />
                                            <DataValue
                                                key="lastInvestmentDate"
                                                title="Last Investment Date"
                                                value="-"
                                            />
                                        </View>
                                        <View className="w-4/12 flex-flex-col gap-4 px-2">
                                            <DataValue
                                                key="autopay"
                                                title="Autopay"
                                                value={
                                                    data?.isActive
                                                        ? "Active"
                                                        : "Not Active"
                                                }
                                            />
                                            <DataValue
                                                key="kycStatus"
                                                title="KYC Status"
                                                value={
                                                    data?.users[0]?.kycStatus
                                                        ?.name
                                                }
                                            />
                                            <DataValue
                                                key="riskProfile"
                                                title="Risk Profile"
                                                value={"-"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-[512px]">
                                <View
                                    className="w-[60%] rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <PortfolioCard
                                        data={data}
                                        showModal={showModal}
                                    />
                                </View>
                                <View
                                    className="w-[39%] rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <AccountDetailsCard data={data} />
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white h-[512px]">
                                <View
                                    className="w-[60%] h-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <MutualFundCard />
                                </View>
                                <View
                                    className="w-[39%] rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <TopAMCCard />
                                </View>
                            </View>
                        </View>
                    </View>
                    <Modal visible={visible} hideDialog={closeModal}>
                        {modalValues[modalKey]}
                    </Modal>
                </ScrollView>
            )}
        </>
    );
}

const PortfolioCard = ({
    data,
    showModal,
}: {
    data: ClientDetailedDataResponse;
    showModal: (key: string, card?: number, selectedFund?: any) => () => void;
}) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const assetBifurcation = generateAssetBifurcation(data?.holdings);

    const assetBifurcationColors = ["#715CFA", "#69E1AB", "#39C3E2", "#FA8B5C"];

    const tabContent = [
        {
            key: "holdings",
            name: "Holdings",
            content: (
                <View className="p-2 w-full">
                    <View className="flex flex-col bg-gray-100 rounded p-2">
                        <View className="flex flex-row justify-between items-center p-2">
                            <DataGrid
                                key="current"
                                title="Current Holdings"
                                value={
                                    <Text className="text-blue-700">
                                        {RupeeSymbol}{" "}
                                        {data?.holdings?.reduce(
                                            (accumulator, currentValue) =>
                                                accumulator +
                                                currentValue.currentValue,
                                            0
                                        )}
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="invested"
                                title="Invested"
                                value={
                                    <Text className="text-blue-700">
                                        {RupeeSymbol}{" "}
                                        {data?.holdings?.reduce(
                                            (accumulator, currentValue) =>
                                                accumulator +
                                                currentValue.investedValue,
                                            0
                                        )}
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="xirr"
                                title="XIRR"
                                value={<Text className="">00.00 %</Text>}
                                reverse
                            />
                            <DataGrid
                                key="totalReturns"
                                title="Total Returns"
                                value={
                                    <Text className="text-green-700">
                                        00.00 %
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                        <View className="p-2">
                            <HorizontalStackedBarChart
                                data={assetBifurcation}
                                colors={assetBifurcationColors}
                            />
                        </View>
                    </View>
                    <DataTable
                        key="holdings"
                        headers={["Scheme", "Current", "Invested", "XIRR"]}
                        cellSize={[5, 3, 2, 2]}
                        rows={data?.holdings?.map((holding) => {
                            return [
                                {
                                    key: "scheme",
                                    data: holding,
                                    content: (
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
                                                    uri: holding?.mutualfund
                                                        ?.logoUrl,
                                                }}
                                            />
                                            <View>
                                                <Text className="text-xs">
                                                    {holding?.mutualfund?.name}
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    {
                                                        holding?.mutualfund
                                                            ?.category
                                                    }{" "}
                                                    |{" "}
                                                    {
                                                        holding?.mutualfund
                                                            ?.subCategory
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "current",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol}{" "}
                                                {holding?.currentValue}
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "invested",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                {RupeeSymbol}{" "}
                                                {holding?.investedValue}
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "xirr",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                {holding?.xirr} %
                                            </Text>
                                        </View>
                                    ),
                                },
                            ];
                        })}
                        hasActions
                        options={[
                            {
                                key: "invest",
                                name: "Invest",
                                onClick: (data) => showModal("invest", 2, data),
                            },
                            {
                                key: "redeem",
                                name: "Redeem",
                                onClick: (data) => showModal("redeem", 2, data),
                            },
                        ]}
                    />
                </View>
            ),
        },
        {
            key: "sips",
            name: "SIPs",
            content: (
                <View className="p-2 flex flex-col w-full">
                    <View className="w-full px-4 py-4 mb-2 bg-[#eaf3fe] flex flex-row items-center justify-between rounded">
                        <Text className="font-bold">Total SIP Amount</Text>
                        <Text className="font-bold">
                            {RupeeSymbol}{" "}
                            {data?.sipOrders?.reduce(
                                (accumulator, currentValue) =>
                                    accumulator + currentValue.amount,
                                0
                            )}
                        </Text>
                    </View>
                    <DataTable
                        key="sips"
                        headers={["Schemes", "SIP Amount", "Next Due"]}
                        cellSize={[6, 3, 3]}
                        rows={data?.sipOrders?.map((sip) => {
                            return [
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
                                                    objectFit: "contain",
                                                }}
                                                source={{
                                                    uri: sip?.mutualfund
                                                        ?.logoUrl,
                                                }}
                                            />
                                            <View>
                                                <Text className="text-xs">
                                                    {sip?.mutualfund?.name}
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    {sip?.mutualfund?.category}{" "}
                                                    |{" "}
                                                    {
                                                        sip?.mutualfund
                                                            ?.subCategory
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "sip",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol} {sip?.amount}
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "nextDue",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                {moment(sip?.endDate).format(
                                                    "MMM DD, YYYY"
                                                )}
                                            </Text>
                                        </View>
                                    ),
                                },
                            ];
                        })}
                    />
                </View>
            ),
        },
        {
            key: "transactions",
            name: "Transactions",
            content: (
                <View className="p-2 flex flex-col w-full">
                    <DataTable
                        key="sips"
                        headers={["Schemes", "Amount", "Date", "Status"]}
                        cellSize={[5, 3, 2, 2]}
                        rows={data?.transactions?.map((transaction) => {
                            return [
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
                                                    objectFit: "contain",
                                                }}
                                                source={{
                                                    uri: transaction?.mutualfund
                                                        ?.logoUrl,
                                                }}
                                            />
                                            <View>
                                                <Text className="text-xs">
                                                    {
                                                        transaction?.mutualfund
                                                            ?.name
                                                    }
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    {
                                                        transaction?.mutualfund
                                                            ?.category
                                                    }{" "}
                                                    |{" "}
                                                    {
                                                        transaction?.mutualfund
                                                            ?.subCategory
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-black"
                                            >
                                                {RupeeSymbol}{" "}
                                                {transaction?.amount}
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
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
                                    key: "status",
                                    content: (
                                        <View>
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500"
                                            >
                                                {transaction?.transactionStatus}
                                            </Text>
                                        </View>
                                    ),
                                },
                            ];
                        })}
                    />
                </View>
            ),
        },
    ];

    return (
        <CardWithTabs
            key="portfolio"
            selectedTab={selectedTab}
            handleTabPress={handleTabPress}
            tabContent={tabContent}
            tabsCount={3}
        />
    );
};

const InvestModalCard = ({
    hideDialog,
    card,
    selectedFund,
    changeSelectedFund,
    allowModalCardChange,
}) => {
    const tabContentForInvest = [
        {
            key: "lumpsum",
            name: "Lumpsum",
            content: (
                <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Folio Number*
                        </Text>
                        <DropdownComponent
                            label="Folio Number"
                            data={[
                                { label: "1", value: "1" },
                                { label: "2", value: "2" },
                                { label: "3", value: "3" },
                                { label: "4", value: "4" },
                                { label: "5", value: "5" },
                                { label: "6", value: "6" },
                                { label: "7", value: "7" },
                                { label: "8", value: "8" },
                                { label: "9", value: "9" },
                                { label: "10", value: "10" },
                                { label: "11", value: "11" },
                                { label: "12", value: "12" },
                                { label: "13", value: "13" },
                                { label: "14", value: "14" },
                                { label: "15", value: "15" },
                                { label: "16", value: "16" },
                                { label: "17", value: "17" },
                                { label: "18", value: "18" },
                                { label: "19", value: "19" },
                                { label: "20", value: "20" },
                                { label: "21", value: "21" },
                                { label: "22", value: "22" },
                                { label: "23", value: "23" },
                                { label: "24", value: "24" },
                                { label: "25", value: "25" },
                                { label: "26", value: "26" },
                                { label: "27", value: "27" },
                                { label: "28", value: "28" },
                            ]}
                            containerStyle={{ width: "100%" }}
                            noIcon
                        />
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400">
                            Investment Amount*
                        </Text>
                        <TextInput
                            className="outline-none w-full border border-gray-300 p-2 rounded"
                            placeholder="Investment Amount"
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            placeholderTextColor={"rgb(156, 163, 175)"}
                            cursorColor={"transparent"}
                            style={{ outline: "none" }}
                        />
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-500">
                            In multiples of {RupeeSymbol}1000
                        </Text>
                    </View>
                    <Button
                        width="50%"
                        bgColor={"#013974"}
                        onPress={() => console.log("Press Invest")}
                        className="rounded-lg"
                    >
                        Invest
                    </Button>
                </View>
            ),
        },
        {
            key: "SIP",
            name: "SIP",
            content: (
                <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Folio Number*
                        </Text>
                        <DropdownComponent
                            label="Folio Number"
                            data={[
                                { label: "1", value: "1" },
                                { label: "2", value: "2" },
                                { label: "3", value: "3" },
                                { label: "4", value: "4" },
                                { label: "5", value: "5" },
                                { label: "6", value: "6" },
                                { label: "7", value: "7" },
                                { label: "8", value: "8" },
                                { label: "9", value: "9" },
                                { label: "10", value: "10" },
                                { label: "11", value: "11" },
                                { label: "12", value: "12" },
                                { label: "13", value: "13" },
                                { label: "14", value: "14" },
                                { label: "15", value: "15" },
                                { label: "16", value: "16" },
                                { label: "17", value: "17" },
                                { label: "18", value: "18" },
                                { label: "19", value: "19" },
                                { label: "20", value: "20" },
                                { label: "21", value: "21" },
                                { label: "22", value: "22" },
                                { label: "23", value: "23" },
                                { label: "24", value: "24" },
                                { label: "25", value: "25" },
                                { label: "26", value: "26" },
                                { label: "27", value: "27" },
                                { label: "28", value: "28" },
                            ]}
                            containerStyle={{ width: "100%" }}
                            noIcon
                        />
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400">
                            Investment Amount*
                        </Text>
                        <TextInput
                            className="outline-none w-full border border-gray-300 p-2 rounded"
                            placeholder="Investment Amount"
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            placeholderTextColor={"rgb(156, 163, 175)"}
                            cursorColor={"transparent"}
                            style={{ outline: "none" }}
                        />
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-500">
                            In multiples of {RupeeSymbol}1000
                        </Text>
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <View className="w-full flex flex-row items-center justify-start gap-x-2">
                            <Text className="text-xs mr-2">SIP Date</Text>
                            <DropdownComponent
                                label="Date"
                                data={[
                                    { label: "1", value: "1" },
                                    { label: "2", value: "2" },
                                    { label: "3", value: "3" },
                                    { label: "4", value: "4" },
                                    { label: "5", value: "5" },
                                    { label: "6", value: "6" },
                                    { label: "7", value: "7" },
                                    { label: "8", value: "8" },
                                    { label: "9", value: "9" },
                                    { label: "10", value: "10" },
                                    { label: "11", value: "11" },
                                    { label: "12", value: "12" },
                                    { label: "13", value: "13" },
                                    { label: "14", value: "14" },
                                    { label: "15", value: "15" },
                                    { label: "16", value: "16" },
                                    { label: "17", value: "17" },
                                    { label: "18", value: "18" },
                                    { label: "19", value: "19" },
                                    { label: "20", value: "20" },
                                    { label: "21", value: "21" },
                                    { label: "22", value: "22" },
                                    { label: "23", value: "23" },
                                    { label: "24", value: "24" },
                                    { label: "25", value: "25" },
                                    { label: "26", value: "26" },
                                    { label: "27", value: "27" },
                                    { label: "28", value: "28" },
                                ]}
                                noIcon
                            />
                            <Text className="text-xs ml-2">of every month</Text>
                        </View>
                    </View>
                    <Button
                        width="50%"
                        bgColor={"#013974"}
                        onPress={() => console.log("Press Invest")}
                        className="rounded-lg"
                    >
                        Invest
                    </Button>
                </View>
            ),
        },
    ];

    const renderInfo = {
        1: {
            title: "Please Select Mutual Fund",
            content: (
                <InvestModalSearch changeSelectedFund={changeSelectedFund} />
            ),
        },
        2: {
            title: "Investing In",
            content: (
                <InvestModalAction
                    tabContent={tabContentForInvest}
                    selectedFund={selectedFund}
                    changeSelectedFund={changeSelectedFund}
                    allowModalCardChange={allowModalCardChange}
                />
            ),
        },
    };

    return (
        <View className="flex flex-col">
            <View className="h-16 flex flex-row justify-between items-center p-12">
                <View className="flex flex-row items-center gap-x-2">
                    {/* {card > 1 && (
                        <Pressable
                            onPress={changeSelectedFund(null, 1, "back")}
                        >
                            <IonIcon name="chevron-back-outline" size={24} />
                        </Pressable>
                    )} */}
                    <Text className="text-xl font-medium center">
                        {renderInfo[card]?.title}
                    </Text>
                </View>
                <IonIcon name="close-outline" size={24} onPress={hideDialog} />
            </View>
            {renderInfo[card].content}
        </View>
    );
};

const InvestModalSearch = ({ changeSelectedFund }) => {
    const funds = [
        {
            id: "42",
            mutualfund: {
                name: "HDFC Liquid Fund",
                type: "Open-ended",
                logoUrl: "https://www.fundexpert.in/cdn/logos-neo/hdfc.png",
                dividendType: {
                    id: 1,
                    name: "NA",
                },
                optionType: {
                    id: 2,
                    name: "Growth",
                },
                deliveryType: {
                    id: 2,
                    name: "Regular",
                },
                category: "Debt",
                subcategory: "Liquid",
            },
        },
        {
            id: "42",
            mutualfund: {
                name: "HDFC Liquid Fund",
                type: "Open-ended",
                logoUrl: "https://www.fundexpert.in/cdn/logos-neo/hdfc.png",
                dividendType: {
                    id: 1,
                    name: "NA",
                },
                optionType: {
                    id: 2,
                    name: "Growth",
                },
                deliveryType: {
                    id: 2,
                    name: "Regular",
                },
                category: "Debt",
                subcategory: "Liquid",
            },
        },
        {
            id: "42",
            mutualfund: {
                name: "HDFC Liquid Fund",
                type: "Open-ended",
                logoUrl: "https://www.fundexpert.in/cdn/logos-neo/hdfc.png",
                dividendType: {
                    id: 1,
                    name: "NA",
                },
                optionType: {
                    id: 2,
                    name: "Growth",
                },
                deliveryType: {
                    id: 2,
                    name: "Regular",
                },
                category: "Debt",
                subcategory: "Liquid",
            },
        },
    ];

    return (
        <View className="p-2 px-8">
            <Pressable
                onPress={() => console.log("first")}
                className="flex flex-row justify-start items-center w-full p-4 bg-[#E8F1FF] rounded-full"
            >
                <TextInput
                    className="outline-none w-[100%]"
                    placeholder="Search for Mutual Funds"
                    underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholderTextColor={"rgb(100, 116, 139)"}
                    cursorColor={"transparent"}
                    style={{ outline: "none" }}
                />
            </Pressable>
            <View className="">
                <DataTable
                    key="searchMutualFund"
                    headers={[]}
                    cellSize={[10, 2]}
                    rows={funds?.map((fund) => {
                        return [
                            {
                                key: "name",
                                content: (
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
                                                uri: fund?.mutualfund?.logoUrl,
                                            }}
                                        />
                                        <View>
                                            <Text className="text-xs">
                                                {fund?.mutualfund?.name}
                                            </Text>
                                            <Text className="text-xs text-gray-400">
                                                {fund?.mutualfund?.category}
                                            </Text>
                                        </View>
                                    </View>
                                ),
                            },
                            {
                                key: "return",
                                content: (
                                    <View className="flex flex-col w-full items-center py-2 rounded-full">
                                        <Button
                                            width="100%"
                                            bgColor={"#013974"}
                                            onPress={() =>
                                                changeSelectedFund(
                                                    fund,
                                                    2,
                                                    "portfolio-invest"
                                                )
                                            }
                                            className="rounded-full"
                                        >
                                            Invest
                                        </Button>
                                    </View>
                                ),
                            },
                        ];
                    })}
                />
            </View>
        </View>
    );
};

const InvestModalAction = ({
    tabContent,
    selectedFund,
    changeSelectedFund,
    allowModalCardChange,
}) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <View className="flex flex-col">
            <View className="flex flex-row items-center justify-between py-4 px-12">
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
                            uri: selectedFund?.mutualfund?.logoUrl,
                        }}
                    />
                    <View>
                        <Text className="text-xs">
                            {selectedFund?.mutualfund?.name}
                        </Text>
                        <Text className="text-xs text-gray-400">
                            {selectedFund?.mutualfund?.category}
                        </Text>
                    </View>
                </View>
                {/* {allowModalCardChange && (
                    <Button
                        width="10%"
                        bgColor="gray.400"
                        onPress={changeSelectedFund(null, 1, "change")}
                        className="rounded-full"
                    >
                        Change
                    </Button>
                )} */}
            </View>
            <View className="flex-1 w-full bg-white rounded h-full overflow-auto">
                <View className="py-4">
                    <View className="w-full flex flex-row mb-2 border-b border-gray-400">
                        {tabContent?.map((tab, index) => {
                            return (
                                <View
                                    key={index}
                                    className={`w-1/${
                                        tabContent && tabContent.length
                                    } border-b-2 ${
                                        selectedTab === index + 1 &&
                                        tabContent &&
                                        tabContent.length > 1
                                            ? "border-black"
                                            : "border-transparent"
                                    }`}
                                >
                                    <Pressable
                                        key={index}
                                        onPress={() =>
                                            handleTabPress(index + 1)
                                        }
                                        className={`w-full flex flex-row justify-center items-center p-2`}
                                    >
                                        <Text
                                            className={`font-bold ${
                                                selectedTab === index + 1
                                                    ? "text-gray-800"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {tab?.name}
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                    {tabContent && tabContent[selectedTab - 1]?.content}
                </View>
            </View>
        </View>
    );
};

const RedeemModalCard = ({
    hideDialog,
    card,
    selectedFund,
    changeSelectedFund,
    allowModalCardChange,
}) => {
    const [methodSelect, setMethodSelect] = useState("Enter Amount");

    const tabContentForRedeem = [
        {
            key: "redeem",
            name: "",
            content: (
                <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
                    <View className="w-2/3 flex flex-col items-center gap-y-2">
                        <View className="w-full flex flex-row justify-evenly items-start">
                            <DataGrid
                                key="totalAmount"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Amount
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        {RupeeSymbol} 50,000.00
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="redeemableAmount"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Redeemable Amount
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        {RupeeSymbol}23,000.50
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                        <View className="w-full flex flex-row justify-evenly items-start">
                            <DataGrid
                                key="totalUnits"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Units
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        46
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="totalRedeemableUnits"
                                title={
                                    <Text selectable className="text-xs">
                                        Total Redeemable Units
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        21
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                        <View className="w-full flex flex-row justify-evenly items-start">
                            <DataGrid
                                key="applicableNavDate"
                                title={
                                    <Text selectable className="text-xs">
                                        Applicable NAV Date
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        Feb 26, 2024
                                    </Text>
                                }
                                reverse
                            />
                            <DataGrid
                                key="expectedCompletionDate"
                                title={
                                    <Text selectable className="text-xs">
                                        Expected Completion Date
                                    </Text>
                                }
                                value={
                                    <Text selectable className="text-xs">
                                        Nov 26, 2030
                                    </Text>
                                }
                                reverse
                            />
                        </View>
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400">
                            Redeem through
                        </Text>
                        <RadioButton
                            name="Redeem Through"
                            value={methodSelect}
                            setValue={setMethodSelect}
                            options={[
                                {
                                    label: "Enter Amount",
                                    value: "Enter Amount",
                                },
                                { label: "Enter Units", value: "Enter Units" },
                            ]}
                        />
                        <TextInput
                            className="outline-none w-full border border-gray-300 p-2 rounded"
                            placeholder={methodSelect}
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            placeholderTextColor={"rgb(156, 163, 175)"}
                            cursorColor={"transparent"}
                            style={{ outline: "none" }}
                        />
                    </View>
                    <Button
                        width="50%"
                        bgColor={"#013974"}
                        onPress={() => console.log("Press Invest")}
                        className="rounded-lg"
                    >
                        Invest
                    </Button>
                </View>
            ),
        },
    ];

    const renderInfo = {
        1: {
            title: "Please Select Mutual Fund",
            content: (
                <InvestModalSearch changeSelectedFund={changeSelectedFund} />
            ),
        },
        2: {
            title: "Redeem in",
            content: (
                <InvestModalAction
                    tabContent={tabContentForRedeem}
                    selectedFund={selectedFund}
                    changeSelectedFund={changeSelectedFund}
                    allowModalCardChange={allowModalCardChange}
                />
            ),
        },
    };

    return (
        <View className="flex flex-col">
            <View className="h-16 flex flex-row justify-between items-center p-12">
                <View className="flex flex-row items-center gap-x-2">
                    {/* {card > 1 && (
                        <IonIcon
                            name="chevron-back-outline"
                            size={24}
                            onPress={deselectFund}
                        />
                    )} */}
                    <Text className="text-xl font-medium center">
                        {renderInfo[card].title}
                    </Text>
                </View>
                <IonIcon name="close-outline" size={24} onPress={hideDialog} />
            </View>
            {renderInfo[card].content}
        </View>
    );
};

const AccountDetailsCard = ({ data }: { data: ClientDetailedDataResponse }) => {
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const accordionData = data?.bankAccounts?.map((bank) => {
        return {
            title: bank?.bankName,
            subcontent: (
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-xs text-gray-400">
                        {maskLetters(bank.accountNumber)}
                    </Text>
                    {bank.isPrimary && (
                        <Text className="text-xs text-purple-700">Primary</Text>
                    )}
                </View>
            ),
            content: (
                <View className="w-full p-4">
                    <DataValue
                        key="branchName"
                        title="Branch Name"
                        value={bank?.branchName}
                    />
                    <DataValue
                        key="ifsc"
                        title="IFSC Code"
                        value={bank?.ifscCode}
                    />
                    <DataValue
                        key="accountType"
                        title="Account Type"
                        value={bank?.accountType}
                    />
                    <DataValue key="autopay" title="Autopay" value="NA" />
                    <View className="p-2">
                        {bank?.mandates?.map((mandate, index) => {
                            return (
                                <View key={index}>
                                    <Text className="text-md font-semibold py-4">
                                        Autopay Details {index + 1}
                                    </Text>
                                    <View className="flex flex-row justify-between">
                                        <DataGrid
                                            key="autopay"
                                            reverse
                                            title="Autopay ID"
                                            value={
                                                mandate?.mandateId ? (
                                                    <View className="flex flex-row items-center gap-2">
                                                        <Text className="text-sm">
                                                            {mandate.mandateId}
                                                        </Text>
                                                        <Icon
                                                            name="copy"
                                                            style={{
                                                                fontWeight:
                                                                    "100",
                                                            }}
                                                            size={12}
                                                            color="grey"
                                                        />
                                                    </View>
                                                ) : (
                                                    "-"
                                                )
                                            }
                                        />
                                        <DataGrid
                                            key="status"
                                            reverse
                                            title="Status"
                                            value={
                                                <Text
                                                    className={`text-${
                                                        mandate?.mandateStatus
                                                            ?.name === "Failed"
                                                            ? "red"
                                                            : "green"
                                                    }-500 text-sm`}
                                                >
                                                    {
                                                        mandate?.mandateStatus
                                                            ?.name
                                                    }
                                                </Text>
                                            }
                                        />
                                    </View>
                                    <View className="flex flex-row justify-between">
                                        <DataGrid
                                            key="requestedOn"
                                            reverse
                                            title="Requested on"
                                            value={
                                                <Text className="text-sm">
                                                    NA
                                                </Text>
                                            }
                                        />
                                        <DataGrid
                                            key="autopayAmount"
                                            reverse
                                            title="Autopay Amount"
                                            value={
                                                <Text className="text-sm">
                                                    {RupeeSymbol}{" "}
                                                    {mandate?.amount}
                                                </Text>
                                            }
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            ),
        };
    });

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
        {
            key: "contactDetails",
            name: "Contact Details",
            content: (
                <View className="w-full p-2 flex flex-col justify-items items-center">
                    <DataValue key="email" title="Email" value={"-"} />
                    <DataValue key="address" title="Address" value={"-"} />
                </View>
            ),
        },
        {
            key: "nomineeDetails",
            name: "Nominee Details",
            content: (
                <View className="w-full p-2 flex flex-col justify-items items-center">
                    <Text>Nominee NA</Text>
                </View>
            ),
        },
    ];
    return (
        <CardWithTabs
            key="account"
            selectedTab={selectedTab}
            handleTabPress={handleTabPress}
            tabContent={tabContent}
        />
    );
};

const MutualFundCard = () => {
    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <DataTable
                key="topMutualFund"
                headers={["Top Mutual Funds"]}
                cellSize={[8, 4]}
                rows={[
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mid Cap Fund Direct
                                            Growth
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            Equity Multi Cap
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "return",
                            content: (
                                <View className="flex flex-col w-full items-end gap-2">
                                    <Text className="text-xs">16.7 %</Text>
                                    <AntdIcon
                                        name="right"
                                        style={{ fontWeight: "100" }}
                                        size={12}
                                        color="grey"
                                    />
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mid Cap Fund Direct
                                            Growth
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            Equity Multi Cap
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "return",
                            content: (
                                <View className="flex flex-col w-full items-end gap-2">
                                    <Text className="text-xs">16.7 %</Text>
                                    <AntdIcon
                                        name="right"
                                        style={{ fontWeight: "100" }}
                                        size={8}
                                        color="grey"
                                    />
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mid Cap Fund Direct
                                            Growth
                                        </Text>
                                        <Text className="text-xs text-gray-400">
                                            Equity Multi Cap
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                        {
                            key: "return",
                            content: (
                                <View className="flex flex-col w-full items-end gap-2">
                                    <Text className="text-xs">16.7 %</Text>
                                    <AntdIcon
                                        name="right"
                                        style={{ fontWeight: "100" }}
                                        size={8}
                                        color="grey"
                                    />
                                </View>
                            ),
                        },
                    ],
                ]}
            />
        </View>
    );
};

const TopAMCCard = () => {
    return (
        <View className="flex-1 bg-white rounded shadow h-full overflow-auto p-2">
            <DataTable
                key="topAMCs"
                headers={["Top AMCs"]}
                cellSize={[12]}
                rows={[
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mutual Fund
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mutual Fund
                                        </Text>
                                    </View>
                                </View>
                            ),
                        },
                    ],
                    [
                        {
                            key: "name",
                            content: (
                                <View className="flex flex-row items-center gap-2">
                                    <View className="w-8 h-8 rounded bg-gray-500" />
                                    <View>
                                        <Text className="text-xs">
                                            Kotak Bank Mutual Fund
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

const generateAssetBifurcation = (holdings: Holding[]) => {
    const getTotalCount = (arr: Holding[]) =>
        arr.reduce((total, { currentValue }) => total + currentValue, 0);
    const calculatePercentage = (count, total) =>
        ((count / total) * 100).toFixed(2);

    const total = getTotalCount(holdings);

    const category = ["Equity", "Hybrid", "Debt"];
    const assetBifurcation = category.map((label) => ({
        label,
        value: 0,
    }));
    assetBifurcation.push({ label: "Others", value: 0 });
    holdings.forEach((holding) => {
        const { mutualfund, currentValue } = holding;
        const index = category.indexOf(mutualfund?.category);
        if (index !== -1) {
            assetBifurcation[index].value += currentValue;
        } else {
            assetBifurcation[assetBifurcation.length - 1].value += currentValue; // Others
        }
    });

    const result = assetBifurcation.map(({ label, value }) => {
        const percentage = calculatePercentage(value, total);
        return { label, value: percentage };
    });

    return result;
};
