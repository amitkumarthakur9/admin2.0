import { useEffect, useMemo, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import {
    Box,
    Button,
    Center,
    CheckCircleIcon,
    Divider,
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
import { useMutation, useQuery } from "react-query";
import Icon from "react-native-vector-icons/FontAwesome";
import AntdIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useToast } from "native-base";
import { Checkbox } from "react-native-paper";
import { TextInput } from "react-native";
import { DateTime } from "luxon";
import { z } from "zod";

import RemoteApi from "../../../../src/services/RemoteApi";
import { BreadcrumbShadow } from "../../../../src/components/Styles/Shadow";
import { RupeeSymbol, maskLetters } from "../../../../src/helper/helper";
import CardWithTabs from "../../../../src/components/Card/CardWithTabs";
import DataGrid from "../../../../src/components/DataGrid/DataGrid";
import HorizontalStackedBarChart from "../../../../src/components/Chart/HorizontalBarChart";
import Accordion from "../../../../src/components/Accordion/Accordion";
import DataTable from "../../../../src/components/DataTable/DataTable";
import Modal from "../../../../src/components/Modal/Modal";
import DropdownComponent from "../../../../src/components/Dropdowns/NewDropDown";
import RadioButton from "../../../../src/components/Radio/Radio";
import DataValue from "../../../../src/components/DataValue/DataValue";
import useDebouncedSearch from "../../../../src/hooks/useDebounceSearch";
import ApiRequest from "../../../../src/services/RemoteApi";
import { dateFormat, dateTimeFormat } from "../../../../src/helper/DateUtils";
import {
    UserRoleProvider,
    useUserRole,
} from "../../../../src/context/useRoleContext";
import CustomRadioButton from "src/components/CustomForm/CustomRadioButton/CustomRadioButton";

const isMutualFundSearchResult = (
    data: MutualFundSearchResult | Holding
): data is MutualFundSearchResult => {
    return (data as MutualFundSearchResult)?.category?.name !== undefined;
};

const holdingDropper = [
    { label: "External", value: "external" },
    { label: "Internal", value: "internal" },
    { label: "All", value: "all" },
];

export default function ClientDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailedDataResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const [modalKey, setModalKey] = useState("invest");
    const [cardPage, setCardPage] = useState(1);
    const [selectedFund, setSelectedFund] = useState<
        MutualFundSearchResult | Holding | null
    >(null);
    const [allowModalCardChange, setAllowModalCardChange] = useState(true);
    const [viewDetails, setViewDetails] = useState(true);
    const { width } = useWindowDimensions();

    const { roleId } = useUserRole();
    const isDistributor = roleId === 2;
    const [firstInvest, setFirstInvest] = useState(false);

    useEffect(() => {
        if (width < 830) {
            setViewDetails(false);
        } else {
            setViewDetails(true);
        }
    }, [width]);

    const closeModal = () => {
        console.log("closemodal");
        setVisible(false);
        setModalKey("");
        setCardPage(1);
        setSelectedFund(null);
        setFirstInvest(false);
    };

    const showModal =
        (key: string, card?: number, selectedFund?: any) => () => {
            setCardPage(card || 1);
            setSelectedFund(selectedFund || null);
            setModalKey(key);
            setVisible(true);
        };

    const changeSelectedFund = (data: any, card: number, from?: string) => {
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
                firstInvest={firstInvest}
            />
        ),
        redeem: (
            <RedeemModalCard
                hideDialog={closeModal}
                card={cardPage}
                //@ts-ignore
                selectedFund={selectedFund}
                changeSelectedFund={changeSelectedFund}
                allowModalCardChange={allowModalCardChange}
            />
        ),
        externalPortfolio: (
            <ExternalPortfolioModalCard
                hideDialog={closeModal}
                card={cardPage}
                selectedFund={selectedFund}
                changeSelectedFund={changeSelectedFund}
                allowModalCardChange={allowModalCardChange}
                clientInfo={{
                    lastDate: data?.externalFundLastUpdatedOn,
                    clientName: data?.name,
                    id: data?.id,
                }}
            />
        ),
        switch: (
            <SwitchModalAction
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
                                        {width < 830 ? (
                                            <View className="w-3/12">
                                                <Pressable
                                                    onPress={() =>
                                                        setViewDetails(
                                                            !viewDetails
                                                        )
                                                    }
                                                >
                                                    <Text className="text-[#114EA8] font-bold text-[14px] text-center">
                                                        {viewDetails
                                                            ? "Hide Details"
                                                            : "View Details"}
                                                    </Text>
                                                </Pressable>
                                            </View>
                                        ) : (
                                            <View className="flex flex-row gap-4">
                                                <Button
                                                    borderColor={
                                                        isDistributor
                                                            ? "#013974"
                                                            : "#ddd"
                                                    }
                                                    bgColor={"#fff"}
                                                    _text={{
                                                        color: isDistributor
                                                            ? "#013974"
                                                            : "#ddd",
                                                    }}
                                                    variant="outline"
                                                    width="48"
                                                    onPress={showModal(
                                                        "externalPortfolio"
                                                    )}
                                                    disabled={!isDistributor}
                                                >
                                                    {data?.externalFundLastUpdatedOn ==
                                                    null
                                                        ? "Import Portfolio"
                                                        : "Refresh Portfolio"}
                                                </Button>
                                                <Button
                                                    width="48"
                                                    bgColor={
                                                        isDistributor &&
                                                        data?.isActive
                                                            ? "#013974"
                                                            : "#ddd"
                                                    }
                                                    onPress={() => {
                                                        setFirstInvest(true); // Track that the Invest button was pressed
                                                        showModal("invest")();
                                                    }}
                                                    disabled={
                                                        !isDistributor ||
                                                        !data?.isActive
                                                    }
                                                >
                                                    Invest
                                                </Button>
                                            </View>
                                        )}
                                    </View>

                                    {viewDetails && (
                                        <View className="flex flex-row justify-between items-start w-full">
                                            <View className="w-4/12 flex-flex-col gap-4 px-2">
                                                <DataValue
                                                    key="pan"
                                                    title="PAN Id"
                                                    value={
                                                        data?.users[0]
                                                            ?.panNumber
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
                                                        data.users[0]
                                                            ?.dateOfBirth
                                                    ).format("MMM DD, YYYY")}
                                                />
                                                <DataValue
                                                    key="doi"
                                                    title="DOI"
                                                    value="NA"
                                                />
                                            </View>
                                            <View className="w-4/12 flex-flex-col gap-4 px-2">
                                                <DataValue
                                                    key="totalInvestment"
                                                    title="Total Investment"
                                                    value="NA"
                                                />
                                                <DataValue
                                                    key="runningSip"
                                                    title="Running SIPs"
                                                    value={
                                                        data?.sipOrders?.length
                                                    }
                                                />
                                                <DataValue
                                                    key="lastInvestment"
                                                    title="Last Lumpsum"
                                                    value={`NA`}
                                                />
                                                <DataValue
                                                    key="lastInvestmentDate"
                                                    title="Last Investment Date"
                                                    value="NA"
                                                />
                                            </View>
                                            <View className="w-4/12 flex-flex-col gap-4 px-2">
                                                <DataValue
                                                    key="autopay"
                                                    title="Autopay"
                                                    // value={
                                                    //     data?.isActive
                                                    //         ? "Active"
                                                    //         : "Not Active"
                                                    // }
                                                    value="NA"
                                                />
                                                <DataValue
                                                    key="kycStatus"
                                                    title="KYC Status"
                                                    value={
                                                        data?.users[0]
                                                            ?.kycStatus?.name
                                                    }
                                                />
                                                <DataValue
                                                    key="riskProfile"
                                                    title="Risk Profile"
                                                    value={"NA"}
                                                />
                                            </View>
                                        </View>
                                    )}
                                    {width < 830 && (
                                        <View className="flex flex-row gap-2 flex-wrap justify-center">
                                            <Button
                                                borderColor={"#013974"}
                                                bgColor={"#fff"}
                                                _text={{
                                                    color: "#013974",
                                                }}
                                                variant="outline"
                                                width="40"
                                                onPress={showModal(
                                                    "externalPortfolio"
                                                )}
                                            >
                                                {data?.externalFundLastUpdatedOn ==
                                                null
                                                    ? "Import Portfolio"
                                                    : "Refresh Portfolio"}
                                            </Button>
                                            <Button
                                                width="40"
                                                bgColor={"#013974"}
                                                onPress={showModal("invest")}
                                            >
                                                Invest
                                            </Button>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className="flex flex-col md:flex-row justify-between rounded bg-white md:h-[512px]">
                                <View
                                    className="md:w-[60%] rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <PortfolioCard
                                        data={data}
                                        showModal={showModal}
                                    />
                                </View>
                                <View
                                    className="md:w-[39%] rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <AccountDetailsCard data={data} />
                                </View>
                            </View>
                            {/* <View className="flex flex-row justify-between rounded bg-white h-[512px]">
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
                            </View> */}
                        </View>
                    </View>
                    <Modal
                        visible={visible}
                        hideDialog={closeModal}
                        modalKey={modalKey}
                    >
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
    const [typeHolding, setTypeHolding] = useState("internal");
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [assetBifurcation, setassetBifurcation] = useState([]);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };
    const { roleId } = useUserRole();
    const isDistributor = roleId === 2;

    useEffect(() => {
        if (typeHolding === "internal") {
            setHoldings(data?.holdings.filter((el) => !el.isExternal));
            setassetBifurcation(
                generateAssetBifurcation(
                    data?.holdings.filter((el) => !el.isExternal)
                )
            );
        } else if (typeHolding === "external") {
            setHoldings(data?.holdings.filter((el) => el.isExternal));
            setassetBifurcation(
                generateAssetBifurcation(
                    data?.holdings.filter((el) => el.isExternal)
                )
            );
        } else {
            setHoldings(data?.holdings);
            setassetBifurcation(generateAssetBifurcation(data?.holdings));
        }
    }, [typeHolding]);

    // const assetBifurcation = generateAssetBifurcation(data?.holdings);

    const assetBifurcationColors = ["#715CFA", "#69E1AB", "#39C3E2", "#FA8B5C"];

    const mobileData = data?.holdings.map((item) => ({
        // scheme: item.id,
        Scheme: item?.mutualfund?.name,
        // ClientId: item?.clientId,
        // PanNumber: item?.panNumber,
        CurrentValue: RupeeSymbol + item.currentValue.toFixed(2),
        InvestedValue: RupeeSymbol + item.investedValue.toFixed(2),
        XIRR: item?.xirr.toFixed(2),
    }));

    const tabContent = [
        {
            key: "holdings",
            name: "Holdings",
            content: (
                <View className="p-2 w-full">
                    <View className="flex flex-row items-center justify-center md:justify-between py-2 gap-2 md:gap-0 flex-wrap">
                        <View>
                            <DropdownComponent
                                label="Holding Type"
                                data={holdingDropper}
                                containerStyle={{
                                    width: "200px",
                                }}
                                noIcon
                                value={typeHolding}
                                setValue={setTypeHolding}
                            />
                        </View>
                        <View>
                            {typeHolding == "external" &&
                                holdings.length > 0 && (
                                    <Button
                                        borderColor={
                                            isDistributor ? "#013974" : "#ddd"
                                        }
                                        bgColor={"#fff"}
                                        _text={{
                                            color: isDistributor
                                                ? "#013974"
                                                : "#ddd",
                                        }}
                                        variant="outline"
                                        style={{ width: 198, height: 39 }}
                                        onPress={() =>
                                            router.push(
                                                `arn-transfer/${data?.id}`
                                            )
                                        }
                                        disabled={!isDistributor}
                                    >
                                        Transfer Portfolio
                                    </Button>
                                )}
                        </View>
                    </View>
                    <View className="h-96 overflow-scroll">
                        <View className="flex flex-col bg-gray-100 rounded p-2">
                            <View className="flex flex-row flex-wrap justify-between items-between md:items-center p-2 gap-2">
                                <DataGrid
                                    key="current"
                                    title="Current Holdings"
                                    value={
                                        <Text className="text-blue-700">
                                            {RupeeSymbol}{" "}
                                            {holdings
                                                ?.reduce(
                                                    (
                                                        accumulator,
                                                        currentValue
                                                    ) =>
                                                        accumulator +
                                                        currentValue.currentValue,
                                                    0
                                                )
                                                .toFixed(2)}
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
                                            {holdings
                                                ?.reduce(
                                                    (
                                                        accumulator,
                                                        currentValue
                                                    ) =>
                                                        accumulator +
                                                        currentValue.investedValue,
                                                    0
                                                )
                                                .toFixed(2)}
                                        </Text>
                                    }
                                    reverse
                                />

                                <DataGrid
                                    key="xirr"
                                    title="XIRR"
                                    value={
                                        <Text className="">
                                            {holdings
                                                ?.reduce(
                                                    (
                                                        accumulator,
                                                        currentValue
                                                    ) =>
                                                        accumulator +
                                                        currentValue.xirr,
                                                    0
                                                )
                                                .toFixed(2)}{" "}
                                            %
                                        </Text>
                                    }
                                    reverse
                                />
                                <DataGrid
                                    key="totalReturns"
                                    title="Total Returns"
                                    value={
                                        <Text className="text-green-700">
                                            {RupeeSymbol}{" "}
                                            {(
                                                holdings?.reduce(
                                                    (
                                                        accumulator,
                                                        currentValue
                                                    ) =>
                                                        accumulator +
                                                        currentValue.currentValue,
                                                    0
                                                ) -
                                                holdings?.reduce(
                                                    (
                                                        accumulator,
                                                        currentValue
                                                    ) =>
                                                        accumulator +
                                                        currentValue.investedValue,
                                                    0
                                                )
                                            ).toFixed(2)}
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

                        {/* <TableCard data={mobileData} /> */}

                        <DataTable
                            key="holdings"
                            headers={["Scheme", "Current", "Invested", "XIRR"]}
                            cellSize={[4, 2, 2, 3]}
                            mobileCellSize={[4, 2, 2, 3]}
                            rows={holdings?.map((holding) => {
                                return [
                                    {
                                        key: "scheme",
                                        data: holding,
                                        content: (
                                            <View className="w-[90%]">
                                                <View className="flex flex-col md:flex-row items-start md:items-center gap-2">
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
                                                            uri: holding
                                                                ?.mutualfund
                                                                ?.logoUrl,
                                                        }}
                                                    />
                                                    <View className="w-11/12 ">
                                                        <Text className="text-xs w-10/12 ">
                                                            {
                                                                holding
                                                                    ?.mutualfund
                                                                    ?.name
                                                            }
                                                        </Text>
                                                        <Text className="text-xs text-gray-400">
                                                            {
                                                                holding
                                                                    ?.mutualfund
                                                                    ?.category
                                                            }{" "}
                                                            |{" "}
                                                            {
                                                                holding
                                                                    ?.mutualfund
                                                                    ?.subCategory
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ),
                                    },
                                    {
                                        key: "current",
                                        content: (
                                            <View className="w-[95%]">
                                                <Text
                                                    selectable
                                                    className="text-xs text-black text-start"
                                                >
                                                    {RupeeSymbol}
                                                    {holding?.currentValue?.toFixed(
                                                        2
                                                    )}
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
                                                    className="text-xs text-gray-500 text-start"
                                                >
                                                    {RupeeSymbol}{" "}
                                                    {holding?.investedValue?.toFixed(
                                                        2
                                                    )}
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
                                                    {holding?.xirr?.toFixed(2)}{" "}
                                                    %
                                                </Text>
                                            </View>
                                        ),
                                    },
                                ];
                            })}
                            hasActions={isDistributor}
                            options={
                                isDistributor
                                    ? [
                                          {
                                              key: "invest",
                                              name: "Invest",
                                              onClick: (data) =>
                                                  showModal("invest", 2, data),
                                          },
                                          {
                                              key: "switch",
                                              name: "Switch",
                                              onClick: (data) =>
                                                  showModal("switch", 2, data),
                                          },
                                          {
                                              key: "redeem",
                                              name: "Redeem",
                                              onClick: (data) =>
                                                  showModal("redeem", 2, data),
                                          },
                                      ]
                                    : []
                            }
                        />
                    </View>
                </View>
            ),
        },
        {
            key: "sips",
            name: "SIPs",
            content: (
                <View className="p-2 flex flex-col w-full h-[460px] overflow-scroll">
                    <View className="w-full px-4 py-4 mb-2 bg-[#eaf3fe] flex flex-row items-center justify-between rounded">
                        <Text className="font-bold">Total SIP Amount</Text>
                        <Text className="font-bold">
                            {RupeeSymbol}{" "}
                            {data?.sipOrders
                                ?.reduce(
                                    (accumulator, currentValue) =>
                                        accumulator + currentValue.amount,
                                    0
                                )
                                .toFixed(2)}
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
                                        <View className="flex flex-col md:flex-row items-start md:items-center gap-2 w-11/12">
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
                                            <View className="w-11/12">
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
                                                {RupeeSymbol}{" "}
                                                {sip?.amount?.toFixed(2)}
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
                <View className="p-2 flex flex-col w-full h-[460px] overflow-scroll">
                    <DataTable
                        key="sips"
                        headers={["Schemes", "Amount", "Date", "Status"]}
                        cellSize={[5, 3, 2, 2]}
                        rows={data?.transactions?.map((transaction) => {
                            return [
                                {
                                    key: "scheme",
                                    content: (
                                        <View className="w-11/12">
                                            <View className="flex flex-col md:flex-row items-start md:items-center gap-2 ">
                                                <Image
                                                    alt="fundHouse"
                                                    className="mr-2"
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        objectFit: "contain",
                                                    }}
                                                    source={{
                                                        uri: transaction
                                                            ?.mutualfund
                                                            ?.logoUrl,
                                                    }}
                                                />
                                                <View className="w-11/12">
                                                    <Text className="text-xs w-10/12">
                                                        {
                                                            transaction
                                                                ?.mutualfund
                                                                ?.name
                                                        }
                                                    </Text>
                                                    <Text className="text-xs text-gray-400 w-11/12">
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
                                        </View>
                                    ),
                                },
                                {
                                    key: "amount",
                                    content: (
                                        <View className="w-11/12">
                                            <Text
                                                selectable
                                                className="text-xs text-black w-11/12"
                                            >
                                                {RupeeSymbol}{" "}
                                                {transaction?.amount?.toFixed(
                                                    2
                                                )}
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "date",
                                    content: (
                                        <View className="w-11/12">
                                            <Text
                                                selectable
                                                className="text-xs text-gray-500 w-11/12"
                                            >
                                                {transaction?.paymentDate
                                                    ? dateTimeFormat(
                                                          transaction?.paymentDate
                                                      )
                                                    : // DateTime.fromISO(
                                                      //       transaction?.paymentDate
                                                      //   ).toFormat(
                                                      //       "dd LLL yyyy, t"
                                                      //   )
                                                      "NA"}
                                            </Text>
                                        </View>
                                    ),
                                },
                                {
                                    key: "status",
                                    content: (
                                        <View className="w-11/12">
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
    firstInvest,
}: {
    hideDialog: () => void;
    card: number;
    selectedFund: MutualFundSearchResult | Holding | null;
    changeSelectedFund: (data: any, card: number, from?: string) => void;
    allowModalCardChange: boolean;
    firstInvest: boolean;
}) => {
    const [folios, setFolios] = useState<FolioSchema[]>([]);
    const [optionType, setOptionType] = useState<number | null>(null);
    const [dividendType, setDividendType] = useState<string | number | null>(
        null
    );

    useEffect(() => {
        setOptionType(
            isMutualFundSearchResult(selectedFund)
                ? selectedFund?.optionType?.find((el) => el?.name === "Growth")
                      ?.id
                : null
        );
        setDividendType(
            isMutualFundSearchResult(selectedFund)
                ? selectedFund?.optionType
                      ?.find((el) => el?.name === "Growth")
                      ?.mutualfundDividendType?.find(
                          (el) => el.dividendType.name === "NA"
                      )?.id
                : null
        );
    }, [card]);

    const IsMFSearch = isMutualFundSearchResult(selectedFund);

    const changeFolios = (folioArray: FolioSchema[]) => {
        setFolios(folioArray);
    };

    const tabContentForInvest = [
        {
            key: "lumpSum",
            name: "Lump Sum",
            content: (
                <LumpSumOrderTab
                    folios={folios}
                    optionType={optionType}
                    dividendType={dividendType}
                    mutualFund={selectedFund}
                    hideDialog={hideDialog}
                />
            ),
        },
        {
            key: "SIP",
            name: "SIP",
            content: (
                <SipOrderTab
                    folios={folios}
                    optionType={optionType}
                    dividendType={dividendType}
                    mutualFund={selectedFund}
                    hideDialog={hideDialog}
                />
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
                    changeFolio={changeFolios}
                    optionType={optionType}
                    dividendType={dividendType}
                    setOptionType={setOptionType}
                    setDividendType={setDividendType}
                    // card={card}
                    firstInvest={firstInvest}
                />
            ),
        },
    };

    return (
        <View className="flex flex-col">
            <View className="h-16 flex flex-row justify-between items-center p-12">
                <View className="flex flex-row items-center gap-x-2">
                    {IsMFSearch && (
                        <Pressable onPress={() => changeSelectedFund(null, 1)}>
                            <IonIcon name="chevron-back-outline" size={24} />
                        </Pressable>
                    )}
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

const LumpSumOrderTab = ({
    folios,
    optionType,
    dividendType,
    mutualFund,
    hideDialog,
}: {
    folios: FolioSchema[];
    optionType: any;
    dividendType: any;
    mutualFund: MutualFundSearchResult | Holding;
    hideDialog: () => void;
}) => {
    const IsMFSearch = isMutualFundSearchResult(mutualFund);
    const [folioID, setFolioID] = useState(null);
    const investValue = IsMFSearch
        ? mutualFund?.mutualfund?.minInvestment
        : mutualFund?.mutualfund?.minInvestment;

    console.log("IsMFSearch");
    console.log(IsMFSearch);
    console.log("IsMFSearch");
    console.log(mutualFund);
    console.log("IsMFSearch");
    console.log(mutualFund.mutualfund.minInvestment);
    console.log("IsMFSearch");
    console.log(mutualFund.mutualfund.minAdditionalInvestment);

    const [investmentAmount, setInvestmentAmount] = useState(
        investValue.toString()
    );

    const { id } = useLocalSearchParams();

    const toast = useToast();

    const postData = async () => {
        return await ApiRequest.post("/order/purchase", {
            accountID: id,
            amount: investmentAmount,
            mutualFundID: IsMFSearch
                ? mutualFund.id
                : mutualFund?.mutualfund?.id, //ID of the mutual fund
            optionTypeID: IsMFSearch
                ? optionType
                : mutualFund?.mutualfund?.optionType?.id,
            mutualfundDividendTypeID: IsMFSearch
                ? mutualFund.optionType
                      ?.find((el) => el.id === optionType)
                      .mutualfundDividendType?.find(
                          (el) => el.id === dividendType
                      )?.dividendType?.id
                : mutualFund?.mutualfund?.dividendType?.id, // Reinvest, Payout, NA
            mutualFundOptionDividendID: IsMFSearch
                ? mutualFund.optionType
                      ?.find((el) => el.id === optionType)
                      .mutualfundDividendType?.find(
                          (el) => el.id === dividendType
                      ).id
                : mutualFund?.mutualfund?.id,
        });
    };

    const textInputSchema = z.object({
        input: z
            .number()
            .min(
                IsMFSearch
                    ? mutualFund.mutualfund.minInvestment
                    : mutualFund.mutualfund.minInvestment,
                `Should be more than minimum investment of ${mutualFund.mutualfund.minInvestment}`
            )
            .max(
                IsMFSearch
                    ? !!mutualFund.maxInvestment
                        ? mutualFund.maxInvestment
                        : 9999999999
                    : !!mutualFund.mutualfund.maxInvestment
                    ? mutualFund.mutualfund.maxInvestment
                    : 9999999999,
                "Cannot be more than maximum investment allowed, maximum is 9999999999"
            )
            .refine(
                (value) =>
                    value % mutualFund.mutualfund.minAdditionalInvestment === 0,
                `Amount should be in multiples of ${mutualFund.mutualfund.minAdditionalInvestment}`
            ),
    });

    const {
        mutate: invest,
        isLoading: mutateLoading,
        isError,
        error,
    } = useMutation(postData, {
        onSuccess: (res: any) => {
            setFolioID(null);
            setInvestmentAmount(investValue.toString());
            if (res && res.code > 299) {
                // error
                toast.show({
                    placement: "top",
                    render: () => <ErrorToaster message={res.message} />,
                });
            } else {
                // success
                hideDialog();
                toast.show({
                    placement: "top",
                    render: () => {
                        return (
                            <Box bg="green.400" p="2" rounded="sm" mb={5}>
                                {res.message}
                            </Box>
                        );
                    },
                });
            }
        },
        onError: () => {
            toast.show({
                placement: "top",
                render: () => (
                    <ErrorToaster message="Error while creating order" />
                ),
            });
        },
    });

    const handleSubmit = () => {
        try {
            textInputSchema.parse({ input: Number(investmentAmount) });
            // If validation passes, execute the mutation
            invest();
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.show({
                    placement: "top",
                    render: () => (
                        <ErrorToaster message={err.errors[0].message} />
                    ),
                });
            }
        }
    };

    const isButtonDisabled =
        (folios.length !== 0 && !folioID) ||
        Number(investmentAmount) <= 0 ||
        mutateLoading;

    return (
        <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
            <View className="w-1/2 flex flex-col items-center gap-y-2">
                {folios.length !== 0 && (
                    <>
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Folio Number
                        </Text>

                        <DropdownComponent
                            label="Folio Number"
                            data={
                                folios.length === 0
                                    ? [{ label: "NA", value: "0" }]
                                    : folios?.map((el) => {
                                          return {
                                              label: el.folioNumber,
                                              value: el.id,
                                          };
                                      })
                            }
                            containerStyle={{ width: "100%" }}
                            noIcon
                            value={folioID}
                            setValue={setFolioID}
                        />
                    </>
                )}
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
                    value={investmentAmount}
                    onChangeText={(text) => {
                        // Only allow numeric values
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setInvestmentAmount(numericValue);
                    }}
                    keyboardType="numeric"
                />
                <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-500">
                    In multiples of {RupeeSymbol}{" "}
                    {mutualFund.mutualfund.minAdditionalInvestment}
                </Text>
            </View>
            <Button
                width="50%"
                bgColor={isButtonDisabled ? "#ccc" : "#013974"}
                opacity={mutateLoading ? "50" : "100"}
                onPress={() => handleSubmit()}
                className="rounded-lg"
                disabled={isButtonDisabled}
            >
                {mutateLoading ? "Investing..." : "Invest"}
            </Button>
        </View>
    );
};

const SipOrderTab = ({
    folios,
    optionType,
    dividendType,
    mutualFund,
    hideDialog,
}: {
    folios: FolioSchema[];
    optionType: any;
    dividendType: any;
    mutualFund: MutualFundSearchResult | Holding;
    hideDialog: () => void;
}) => {
    const IsMFSearch = isMutualFundSearchResult(mutualFund);
    const [folioID, setFolioID] = useState(null);
    const investValue = IsMFSearch
        ? mutualFund?.mutualfund?.minInvestment
        : mutualFund?.mutualfund?.minInvestment;
    const [investmentAmount, setInvestmentAmount] = useState(
        investValue.toString()
    );
    const [sipDate, setSipDate] = useState();
    const toast = useToast();

    const { id } = useLocalSearchParams();

    const postData = async () => {
        return await ApiRequest.post("/order/sip", {
            accountID: id,
            amount: investmentAmount,
            mutualFundID: IsMFSearch
                ? mutualFund.id
                : mutualFund?.mutualfund?.id, //ID of the mutual fund
            optionTypeID: IsMFSearch
                ? optionType
                : mutualFund?.mutualfund?.optionType?.id,
            mutualfundDividendTypeID: IsMFSearch
                ? mutualFund.optionType
                      ?.find((el) => el.id === optionType)
                      .mutualfundDividendType?.find(
                          (el) => el.id === dividendType
                      )?.dividendType?.id
                : mutualFund?.mutualfund?.dividendType?.id, // Reinvest, Payout, NA
            mutualFundOptionDividendID: IsMFSearch
                ? mutualFund.optionType
                      ?.find((el) => el.id === optionType)
                      .mutualfundDividendType?.find(
                          (el) => el.id === dividendType
                      ).id
                : mutualFund?.mutualfund?.id,
            startDate: sipDate,
        });
    };

    const textInputSchema = z.object({
        input: z
            .number()
            .min(
                IsMFSearch
                    ? mutualFund.mutualfund.minInvestment
                    : mutualFund.mutualfund.minInvestment,
                `Should be more than minimum investment ${mutualFund.mutualfund.minInvestment}`
            )
            .max(
                IsMFSearch
                    ? !!mutualFund.maxInvestment
                        ? mutualFund.maxInvestment
                        : 9999999999
                    : !!mutualFund.mutualfund.maxInvestment
                    ? mutualFund.mutualfund.maxInvestment
                    : 9999999999,
                "Cannot be more than maximum investment allowed, maximum is 9999999999 "
            )
            .refine(
                (value) =>
                    value % mutualFund.mutualfund.minAdditionalInvestment === 0,
                `Amount should be in multiples of ${mutualFund.mutualfund.minAdditionalInvestment}`
            ),
    });
    const handleSubmit = () => {
        try {
            textInputSchema.parse({ input: Number(investmentAmount) });
            // If validation passes, execute the mutation
            invest();
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.show({
                    placement: "top",
                    render: () => (
                        <ErrorToaster message={err.errors[0].message} />
                    ),
                });
            }
        }
    };

    const isButtonDisabled =
        (folios.length !== 0 && !folioID) ||
        !sipDate ||
        Number(investmentAmount) <= 0;

    const {
        mutate: invest,
        isLoading: mutateLoading,
        isError,
        error,
    } = useMutation(postData, {
        onSuccess: (res: any) => {
            if (res && res.code > 299) {
                toast.show({
                    placement: "top",
                    render: () => <ErrorToaster message={res.message} />,
                });
            } else {
                hideDialog();
                toast.show({
                    placement: "top",
                    render: () => {
                        return (
                            <Box bg="green.400" p="2" rounded="sm" mb={5}>
                                {res.message}
                            </Box>
                        );
                    },
                });
            }
        },
        onError: () => {
            toast.show({
                placement: "top",
                render: () => (
                    <ErrorToaster message="Error while creating order" />
                ),
            });
        },
    });
    return (
        <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
            <View className="w-1/2 flex flex-col items-center gap-y-2">
                {folios.length !== 0 && (
                    <>
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Folio Number
                        </Text>
                        <DropdownComponent
                            label="Folio Number"
                            data={
                                folios.length === 0
                                    ? [{ label: "NA", value: "0" }]
                                    : folios?.map((el) => {
                                          return {
                                              label: el.folioNumber,
                                              value: el.id,
                                          };
                                      })
                            }
                            containerStyle={{ width: "100%" }}
                            noIcon
                            value={folioID}
                            setValue={setFolioID}
                        />
                    </>
                )}
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
                    value={investmentAmount}
                    onChangeText={(text) => {
                        // Only allow numeric values
                        const numericValue = text.replace(/[^0-9]/g, "");
                        setInvestmentAmount(numericValue);
                    }}
                    keyboardType="numeric"
                />
                <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-500">
                    In multiples of {RupeeSymbol}{" "}
                    {mutualFund.mutualfund.minAdditionalInvestment}
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
                        value={sipDate}
                        setValue={setSipDate}
                    />
                    <Text className="text-xs ml-2">of every month*</Text>
                </View>
            </View>
            <Button
                width="50%"
                bgColor={isButtonDisabled ? "#ccc" : "#013974"}
                opacity={mutateLoading ? "50" : "100"}
                onPress={() => handleSubmit()}
                className="rounded-lg"
                disabled={mutateLoading || isButtonDisabled}
            >
                {mutateLoading ? "Investing..." : "Invest"}
            </Button>
        </View>
    );
};

const InvestModalSearch = ({ changeSelectedFund }) => {
    const {
        query,
        setQuery,
        data: searchResults,
        isLoading,
        isError,
        error,
    } = useDebouncedSearch("search", fetchSearchResults, 500);

    async function fetchSearchResults(searchQuery: string) {
        try {
            const response: ApiResponse<MutualFundSearchResult[]> =
                await RemoteApi.get(`mutualfund/list?q=${query}`);
            return response;
        } catch (error) {
            // Handle errors, e.g., throw an error or return a default value
            throw error;
        }
    }

    return (
        <View className="p-2 px-8">
            <Pressable className="flex flex-row justify-start items-center w-full p-4 bg-[#E8F1FF] rounded-full">
                <TextInput
                    className="outline-none w-[100%]"
                    placeholder="Search for Mutual Funds"
                    underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholderTextColor={"rgb(100, 116, 139)"}
                    cursorColor={"transparent"}
                    style={{ outline: "none" }}
                    value={query}
                    onChangeText={setQuery}
                />
            </Pressable>
            <View className="">
                {isLoading ? (
                    <HStack
                        space={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Spinner color={"black"} accessibilityLabel="Loading" />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                ) : (
                    <DataTable
                        key="searchMutualFund"
                        headers={[]}
                        cellSize={[10, 2]}
                        noDataText={
                            query.length > 3
                                ? "No Data Available"
                                : "Start your investment"
                        }
                        rows={searchResults?.data?.map((fund) => {
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
                                                    uri: fund?.logoUrl,
                                                }}
                                            />
                                            <View>
                                                <Text className="text-xs">
                                                    {/* {fund?.mutualfund?.name} */}
                                                    {fund?.name}
                                                </Text>
                                                <Text className="text-xs text-gray-400">
                                                    {fund?.category?.name} |{" "}
                                                    {fund?.subCategory?.name}
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
                )}
            </View>
        </View>
    );
};

const InvestModalAction = ({
    tabContent,
    selectedFund,
    changeSelectedFund,
    allowModalCardChange,
    changeFolio,
    optionType,
    setOptionType,
    dividendType,
    setDividendType,
    firstInvest,
}: {
    tabContent: {
        key: string;
        name: string;
        content: React.JSX.Element;
    }[];
    selectedFund: MutualFundSearchResult | Holding | null;
    changeSelectedFund: any;
    allowModalCardChange: boolean;
    changeFolio?: (folioArray: FolioSchema[]) => void;
    optionType?: any;
    setOptionType?: any;
    dividendType?: any;
    setDividendType?: any;
    firstInvest: boolean;
}) => {
    const { id } = useLocalSearchParams();
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const IsMFSearch = isMutualFundSearchResult(selectedFund);
    const qValue = IsMFSearch ? "M" : "H";
    const fValue = IsMFSearch ? dividendType : selectedFund?.id;

    const fetchFolios = async () => {
        console.log(firstInvest);
        if (!firstInvest) {
            try {
                const response: ApiResponse<FolioSchema[]> =
                    await RemoteApi.get(
                        `client/${id}/folioSchema?q=${qValue}&f=${fValue}`
                    );
                changeFolio(response?.data);
                return response;
            } catch (error) {
                // Handle errors, e.g., throw an error or return a default value
                throw error;
            }
        }
    };

    const { isLoading } = useQuery({
        queryKey: ["folio", optionType, dividendType],
        queryFn: fetchFolios,
        enabled: IsMFSearch
            ? !!optionType &&
              !!dividendType &&
              selectedFund?.optionType
                  ?.find((el) => el.id === optionType)
                  .mutualfundDividendType.some((e) => e.id == dividendType)
            : true,
    });

    return (
        <View className="flex flex-col">
            <View className="flex md:flex-row items-center justify-between py-4 px-12 gap-4">
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
                            uri: IsMFSearch
                                ? selectedFund?.logoUrl
                                : selectedFund?.mutualfund?.logoUrl,
                        }}
                    />
                    <View>
                        <Text className="text-xs">
                            {IsMFSearch
                                ? selectedFund?.name
                                : selectedFund?.mutualfund?.name}
                        </Text>
                        <Text className="text-xs text-gray-400">
                            {IsMFSearch
                                ? selectedFund?.category?.name
                                : selectedFund?.mutualfund?.category}{" "}
                            |{" "}
                            {IsMFSearch
                                ? selectedFund?.subCategory?.name
                                : selectedFund?.mutualfund?.subCategory}
                        </Text>
                    </View>
                </View>
                {IsMFSearch && (
                    <View className="flex flex-row items-center justify-between gap-x-2">
                        <View className="w-1/2 flex flex-col items-center gap-y-2">
                            <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                                Option Type
                            </Text>
                            <DropdownComponent
                                label="Option Type"
                                data={selectedFund?.optionType?.map((o) => {
                                    return {
                                        value: o.id as any as string,
                                        label: o.name,
                                    };
                                })}
                                containerStyle={{ width: "100%" }}
                                noIcon
                                value={optionType}
                                setValue={setOptionType}
                            />
                        </View>
                        <View className="w-1/2 flex flex-col items-center gap-y-2">
                            <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                                Dividend Type
                            </Text>
                            <DropdownComponent
                                label="Dividend Type"
                                data={selectedFund?.optionType
                                    ?.find((el) => el.id === optionType)
                                    ?.mutualfundDividendType?.map((e) => {
                                        return {
                                            key: e.id,
                                            label: e.dividendType.name,
                                            value: e.id,
                                        };
                                    })}
                                containerStyle={{ width: "100%" }}
                                noIcon
                                value={dividendType}
                                setValue={setDividendType}
                            />
                        </View>
                    </View>
                )}
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
                    {IsMFSearch ? (
                        !!optionType && !!dividendType ? (
                            isLoading ? (
                                <HStack
                                    space={2}
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Spinner
                                        color={"black"}
                                        accessibilityLabel="Loading"
                                    />
                                    <Heading color="black" fontSize="md">
                                        Loading
                                    </Heading>
                                </HStack>
                            ) : (
                                tabContent &&
                                tabContent[selectedTab - 1]?.content
                            )
                        ) : (
                            <HStack
                                space={2}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Heading color="black" fontSize="md">
                                    Please select option type and dividend type
                                </Heading>
                            </HStack>
                        )
                    ) : (
                        tabContent && tabContent[selectedTab - 1]?.content
                    )}
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
}: {
    hideDialog: () => void;
    card: number;
    selectedFund: Holding;
    changeSelectedFund: (data: any, card: number, from?: string) => void;
    allowModalCardChange: boolean;
}) => {
    const [methodSelect, setMethodSelect] = useState("amount");
    const [value, setValue] = useState("0");
    const [selectedFolio, setSelectedFolio] = useState<string | null>(null);
    const [folio, setFolio] = useState<FolioSchema | null>(null);
    const [redeemAll, setRedeemAll] = useState(false);

    const fetchFolios = async () => {
        try {
            const response: ApiResponse<FolioSchema[]> = await RemoteApi.get(
                `client/${id}/folioSchema?q=H&f=${selectedFund?.id}`
            );
            return response;
        } catch (error) {
            // Handle errors, e.g., throw an error or return a default value
            throw error;
        }
    };

    const { data: folios } = useQuery({
        queryKey: ["folio"],
        queryFn: fetchFolios,
        enabled: true,
    });

    const { id } = useLocalSearchParams();

    const postData = async () => {
        return await ApiRequest.post("/order/redeem", {
            accountID: id,
            folioID: selectedFund?.id,
            amount: methodSelect === "amount" ? value : 0,
            units: methodSelect === "units" ? value : 0,
            method: methodSelect,
            mutualFundID: selectedFund?.mutualfund?.id,
            value,
            optionTypeID: selectedFund?.mutualfund?.optionType?.id,
            mutualfundDividendTypeID:
                selectedFund?.mutualfund?.dividendType?.id, // Reinvest, Payout, NA
            mutualFundOptionDividendID: selectedFund?.mutualfund?.id,
        });
    };

    const updateSelectedFolio = (value: string) => {
        setSelectedFolio(value);
        setFolio(folios?.data?.find((el) => el.id === value));
    };
    const toast = useToast();

    useEffect(() => {
        setValue("0");
        setRedeemAll(false);
    }, [methodSelect]);

    const textInputSchema = z.object({
        input: z
            .number()
            .min(0.01, "Value must be greater than zero")
            .refine(
                (value) => {
                    if (methodSelect === "amount") {
                        return value <= (folio?.redeemableAmount ?? 0);
                    }
                    if (methodSelect === "units") {
                        return value <= (folio?.redeemableUnits ?? 0);
                    }
                    return false;
                },
                {
                    message:
                        methodSelect === "amount"
                            ? "Amount cannot exceed redeemable amount"
                            : "Units cannot exceed redeemable units",
                }
            ),
        // .refine((value) => {
        //     if (methodSelect === "amount") {
        //         return value % 1000 === 0; // Ensures amount is a multiple of 1000
        //     }
        //     return true; // No need for this check for units
        // }, "Amount should be in multiples of 1000"),
    });

    const handleSubmit = () => {
        try {
            textInputSchema.parse({ input: Number(value) });
            // If validation passes, execute the mutation
            redeem();
        } catch (err) {
            if (err instanceof z.ZodError) {
                toast.show({
                    placement: "top",
                    render: () => (
                        <ErrorToaster message={err.errors[0].message} />
                    ),
                });
            }
        }
    };

    const {
        mutate: redeem,
        isError,
        error,
    } = useMutation(postData, {
        onSuccess: (res: any) => {
            if (res && res.code > 299) {
                toast.show({
                    placement: "top",
                    render: () => {
                        return (
                            <Box bg="red.400" p="2" rounded="sm" mb={5}>
                                {res.message}
                            </Box>
                        );
                    },
                });
            } else {
                toast.show({
                    placement: "top",
                    render: () => {
                        return (
                            <Box bg="green.400" p="2" rounded="sm" mb={5}>
                                {res.message}
                            </Box>
                        );
                    },
                });
            }
        },
        onError: () => {
            toast.show({
                placement: "top",
                render: () => {
                    return (
                        <Box bg="green.400" p="2" rounded="sm" mb={5}>
                            Some error occurred while creating redeem order
                        </Box>
                    );
                },
            });
        },
    });

    const tabContentForRedeem = [
        {
            key: "redeem",
            name: "",
            content: (
                <View className="w-full flex flex-col justify-items items-center py-2 gap-y-4">
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Folio Number
                        </Text>
                        <DropdownComponent
                            label="Folio Number"
                            data={folios?.data?.map((el) => {
                                return {
                                    label: el.folioNumber,
                                    value: el.id,
                                };
                            })}
                            containerStyle={{ width: "100%" }}
                            noIcon
                            value={selectedFolio}
                            setValue={updateSelectedFolio}
                        />
                    </View>
                    {selectedFolio ? (
                        <View className="w-1/2 flex flex-col items-center justify-between">
                            <View className="w-full flex flex-col items-center gap-y-2">
                                <View className="w-full flex flex-row justify-between items-start">
                                    <DataGrid
                                        key="totalAmount"
                                        title={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                Total Amount
                                            </Text>
                                        }
                                        value={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                {RupeeSymbol}{" "}
                                                {folio?.currentValue.toFixed(2)}
                                            </Text>
                                        }
                                        reverse
                                    />
                                    <DataGrid
                                        key="redeemableAmount"
                                        title={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                Total Redeemable Amount
                                            </Text>
                                        }
                                        value={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                {RupeeSymbol}{" "}
                                                {folio?.redeemableAmount.toFixed(
                                                    2
                                                )}
                                            </Text>
                                        }
                                        reverse
                                    />
                                </View>
                                <View className="w-full flex flex-row justify-between items-start">
                                    <DataGrid
                                        key="totalUnits"
                                        title={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                Total Units
                                            </Text>
                                        }
                                        value={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                {selectedFund?.units.toFixed(2)}
                                            </Text>
                                        }
                                        reverse
                                    />
                                    <DataGrid
                                        key="totalRedeemableUnits"
                                        title={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                Total Redeemable Units
                                            </Text>
                                        }
                                        value={
                                            <Text
                                                selectable
                                                className="text-xs"
                                            >
                                                {folio?.redeemableUnits.toFixed(
                                                    2
                                                )}
                                            </Text>
                                        }
                                        reverse
                                    />
                                </View>
                            </View>
                            <View className="w-full flex flex-col items-center justify-between gap-y-2">
                                <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400">
                                    Redeem through
                                </Text>
                                <CustomRadioButton
                                    options={[
                                        {
                                            label: "Enter Amount",
                                            value: "amount",
                                        },
                                        {
                                            label: "Enter Units",
                                            value: "units",
                                        },
                                    ]}
                                    value={methodSelect}
                                    setValue={setMethodSelect}
                                />
                                <TextInput
                                    className={`outline-none w-full border border-gray-300 p-2 rounded ${
                                        redeemAll &&
                                        "bg-gray-200 cursor-not-allowed"
                                    }`}
                                    editable={!redeemAll}
                                    placeholder={`Enter ${methodSelect}`}
                                    underlineColorAndroid="transparent"
                                    selectionColor="transparent"
                                    placeholderTextColor={"rgb(156, 163, 175)"}
                                    cursorColor={"transparent"}
                                    style={{ outline: "none" }}
                                    value={value}
                                    onChangeText={setValue}
                                />
                            </View>
                            <View className="w-full flex flex-row items-center">
                                <Checkbox
                                    color="#013974"
                                    status={redeemAll ? "checked" : "unchecked"}
                                    onPress={() => {
                                        if (!redeemAll) {
                                            if (methodSelect === "amount") {
                                                setValue(
                                                    folio?.redeemableAmount.toString()
                                                );
                                            } else if (
                                                methodSelect === "units"
                                            ) {
                                                setValue(
                                                    folio.redeemableUnits.toString()
                                                );
                                            }
                                        }
                                        setRedeemAll((prev) => !prev);
                                    }}
                                />
                                <View className="">
                                    <Text selectable className="text-sm">
                                        Redeem all
                                    </Text>
                                </View>
                            </View>
                            <Button
                                width="100%"
                                bgColor={"#013974"}
                                onPress={() => handleSubmit()}
                                className="rounded-lg mt-4"
                            >
                                Redeem
                            </Button>
                        </View>
                    ) : (
                        <Heading color="black" fontSize="md">
                            Please select Folio Number
                        </Heading>
                    )}
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
                <ScrollView className="w-full p-4 h-[350px]">
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
                                                    "NA"
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
                </ScrollView>
            ),
        };
    });

    const renderItem = (item) => (
        <View style={{ padding: 10 }}>
            <Text>{item.content}</Text>
        </View>
    );

    const downloadBankDocument = async () => {
        try {
            const response = RemoteApi.get(
                `bank-account/download-bank-documents?client_id=${data.id}`
            );
        } catch (error) {}
    };

    const verifyBankDocument = async (verify) => {
        const data = {
            accountId: 287,
            isBankVerfied: verify,
        };
        try {
            const response = RemoteApi.post(
                `bank-account/update-bank-account-status`,
                data
            );

            if (response.code == 200) {
            }
        } catch (error) {}
    };

    const tabContent = [
        {
            key: "bankAccounts",
            name: "Bank Accounts",
            content: (
                <View className="w-full p-2 flex flex-col justify-items items-center">
                    {data?.bankAccounts.length === 0 ? (
                        <>
                            <View className="flex flex-col items-center gap-8">
                                <Text className="text-black font-bold">
                                    No Data Available
                                </Text>
                                <Image
                                    source={require("../../../../assets/images/noData.png")}
                                />
                            </View>
                            {/* <View className="flex flex-row justify-between items-cente w-full p-4">
                                <Pressable
                                    onPress={() => downloadBankDocument()}
                                    className="w-8/12"
                                >
                                    <View className="flex flex-row justify-start items-center ">
                                        <Icon name="download" size={14} />
                                        <Text
                                            className="font-bold text-[#013974]"
                                            style={{ marginLeft: 8 }}
                                        >
                                            Download Bank Document
                                        </Text>
                                    </View>
                                </Pressable>
                                <View className="flex flex-row justify-between w-4/12">
                                    <Pressable
                                        onPress={() => verifyBankDocument(true)}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text className="font-bold text-green-500">
                                                Approve
                                            </Text>
                                        </View>
                                    </Pressable>
                                    <Pressable
                                        onPress={() =>
                                            verifyBankDocument(false)
                                        }
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text className="font-bold text-red-500">
                                                Reject
                                            </Text>
                                        </View>
                                    </Pressable>
                                </View>
                            </View> */}
                        </>
                    ) : (
                        <>
                            <Accordion
                                accordionData={accordionData}
                                renderItem={renderItem}
                            />
                        </>
                    )}
                    {}
                </View>
            ),
        },
        {
            key: "contactDetails",
            name: "Contact Details",
            content: (
                <View className="w-full p-2 flex flex-col justify-items items-center">
                    {!data?.users[0]?.email ? (
                        <View className="flex flex-col items-center gap-8">
                            <Text className="text-black font-bold">
                                No Data Available
                            </Text>
                            <Image
                                source={require("../../../../assets/images/noData.png")}
                            />
                        </View>
                    ) : (
                        <>
                            <DataValue
                                key="email"
                                title="Email"
                                value={data?.users[0]?.email}
                            />
                            <DataValue
                                key="address"
                                title="Address"
                                value={"NA"}
                            />
                        </>
                    )}
                </View>
            ),
        },
        {
            key: "nomineeDetails",
            name: "Nominee Details",
            content: (
                <View className="w-full p-2 flex flex-col justify-item items-center">
                    {data?.nominee.length === 0 ? (
                        <View className="flex flex-col items-center gap-8">
                            <Text className="text-black font-bold">
                                No Data Available
                            </Text>
                            <Image
                                source={require("../../../../assets/images/noData.png")}
                            />
                        </View>
                    ) : (
                        data?.nominee?.map((nominee, index) => (
                            <View key={index} className="w-full p-2">
                                <Text className="py-2 font-bold">
                                    Nominee {index + 1}
                                </Text>
                                <View className="w-full flex flex-row justify-between items-center">
                                    <Text selectable className="font-medium">
                                        {nominee?.name}
                                    </Text>
                                    <Text selectable className="font-medium">
                                        {nominee?.relationship?.name}
                                    </Text>
                                </View>
                                <View className="w-full flex flex-row justify-between items-center">
                                    <Text
                                        selectable
                                        className="text-sm text-slate-500"
                                    >
                                        {nominee?.dob
                                            ? dateFormat(nominee?.dob)
                                            : // DateTime.fromISO(
                                              //       nominee?.dob
                                              //   ).toFormat("LLL dd, yyyy")
                                              "NA"}
                                    </Text>
                                    <Text selectable className="font-medium">
                                        {nominee?.nomineePercentage + "%"}
                                    </Text>
                                </View>
                                <Divider
                                    orientation="horizontal"
                                    className="my-4"
                                />
                            </View>
                        ))
                    )}
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
        arr.reduce((total, { currentValue }) => total + currentValue, 1);
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

const ExternalPortfolioModalCard = ({
    hideDialog,
    card,
    selectedFund,
    changeSelectedFund,
    allowModalCardChange,
    clientInfo,
}: {
    hideDialog: () => void;
    card: number;
    selectedFund: MutualFundSearchResult | Holding | null;
    changeSelectedFund: (data: any, card: number, from: string) => void;
    allowModalCardChange: boolean;
    clientInfo: any;
}) => {
    const [apisuccess, setApisuccess] = useState<boolean | null>(null);
    // const [apisuccess, setApisuccess] = useState(false);
    const [importDate, setImportDate] = useState(false);
    console.log(clientInfo);
    console.log(dateTimeFormat(clientInfo.lastDate));
    const checkDate = (date: Date): string => {
        const currentDate = new Date();
        const inputDate = new Date(date);

        // Calculate the difference in milliseconds
        const differenceInMs = currentDate.getTime() - inputDate.getTime();

        // Convert the difference to days
        const differenceInDays = Math.floor(
            differenceInMs / (1000 * 60 * 60 * 24)
        );

        if (differenceInDays < 7) {
            // Calculate remaining days
            const remainingDays = 7 - differenceInDays;
            const remainingDate = new Date(
                currentDate.getTime() + remainingDays * (1000 * 60 * 60 * 24)
            );
            return `Wait for ${remainingDays} days, ${remainingDate.toLocaleString()}`;
        } else {
            //   return 'The date is 7 days old.';
            return "false";
        }
    };

    // Example usage:
    const inputDate = new Date("2024-04-20T12:00:00");

    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response: ArnImport = await RemoteApi.get(
                    `client/${clientInfo.id}/request-import-folio`
                );

                const refreshDate = checkDate(clientInfo.lastDate);

                if (response.message === "Success") {
                    setApisuccess(true);
                    if (refreshDate === "false") {
                        setImportDate(true);
                    }
                } else {
                    setApisuccess(false);
                }
            } catch (error) {
                setApisuccess(false);
            }
        };

        sendRequest();
    }, [clientInfo.id, clientInfo.lastDate]);

    if (apisuccess === null) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <ScrollView>
                {apisuccess ? (
                    <View className="flex flex-col">
                        <View className="flex flex-row justify-end items-center">
                            <Pressable
                                onPress={() => {
                                    console.log("pressed close");
                                    hideDialog();
                                }}
                            >
                                <IonIcon name="close-outline" size={24} />
                            </Pressable>
                        </View>

                        {importDate ? (
                            <View>
                                <View className="flex flex-row  justify-center">
                                    <Image
                                        className=""
                                        alt="ico"
                                        source={require("../../../../assets/images/successTick.svg")}
                                        style={
                                            {
                                                // flex: 1,
                                                // justifyContent: 'end',
                                                // width: 300, // specify the desired width
                                                // height: 300,
                                            }
                                        }
                                    />
                                </View>
                                <View className="flex flex-row justify-center pt-8">
                                    <Text className="text-center font-semibold text-lg">
                                        Portfolio request has been successfully
                                        sent to {clientInfo.clientName}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <>
                                <View className="flex flex-row  justify-center">
                                    <Image
                                        className=""
                                        alt="ico"
                                        source={require("../../../../assets/images/warning.png")}
                                        style={
                                            {
                                                // flex: 1,
                                                // justifyContent: 'end',
                                                // width: 200, // specify the desired width
                                                // height: 200,
                                            }
                                        }
                                    />
                                </View>
                                <View className="flex flex-col justify-center pt-8 gap-4">
                                    <Text className="text-center font-semibold text-lg">
                                        You can resend the request only after 7
                                        days of last request sent
                                    </Text>
                                    <Text className="text-center text-base">
                                        Last request sent:{" "}
                                        {dateTimeFormat(clientInfo.lastDate)}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                ) : (
                    <View>
                        <View className="flex flex-col justify-center items-center p-8 gap-4">
                            <Text className="text-center font-semibold text-lg">
                                Server Error! Request Failed!
                            </Text>
                        </View>
                        <View className="flex flex-row justify-center">
                            <Pressable
                                onPress={() => {
                                    console.log("pressed close");
                                    hideDialog();
                                }}
                            >
                                <Text>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </ScrollView>
        </>
    );
};

const SwitchModalAction = ({
    hideDialog,
    card,
    selectedFund,
    changeSelectedFund,
    allowModalCardChange,
}: {
    hideDialog: () => void;
    card: number;
    selectedFund: MutualFundSearchResult | Holding | null;
    changeSelectedFund: (data: any, card: number, from?: string) => void;
    allowModalCardChange: boolean;
}) => {
    const { id } = useLocalSearchParams();
    const [folios, setFolios] = useState<FolioSchema[]>([]);
    const [optionType, setOptionType] = useState<number | null>(null);
    const [dividendType, setDividendType] = useState<string | number | null>(
        null
    );
    const [selectedFolio, setSelectedFolio] = useState();
    const [showTab, setShowTab] = useState(1);
    const [query, setQuery] = useState("");
    const [targetMutualfund, setTargetMutualfund] =
        useState<MutualFundSearchResult | null>(null);

    const [switchValue, setSwitchValue] = useState("0");

    const [allUnits, setAllUnits] = useState(false);

    useEffect(() => {
        setOptionType(
            isMutualFundSearchResult(targetMutualfund)
                ? targetMutualfund?.optionType?.find(
                      (el) => el?.name === "Growth"
                  )?.id
                : null
        );
        setDividendType(
            isMutualFundSearchResult(targetMutualfund)
                ? targetMutualfund?.optionType
                      ?.find((el) => el?.name === "Growth")
                      ?.mutualfundDividendType?.find(
                          (el) => el.dividendType.name === "NA"
                      )?.id
                : null
        );
    }, [targetMutualfund]);

    const changeFolios = (folioArray: FolioSchema[]) => {
        setFolios(folioArray);
    };

    const IsMFSearch = isMutualFundSearchResult(selectedFund);

    const fetchFolios = async () => {
        try {
            const response: ApiResponse<FolioSchema[]> = await RemoteApi.get(
                `client/${id}/folioSchema?q=H&f=${selectedFund?.id}`
            );
            changeFolios(response?.data);
            return response;
        } catch (error) {
            // Handle errors, e.g., throw an error or return a default value
            throw error;
        }
    };

    const fetchMutualFunds = async () => {
        try {
            const fundhouseId = folios.find((el) => el.id == selectedFolio)
                ?.mutualfundDividendType?.mutualfundOptionType
                ?.mutualfundDeliveryType?.mutualfund?.fundhouseId;

            if (!!fundhouseId) {
                const response: ApiResponse<[]> = await RemoteApi.post(
                    `mutualfund/list`,
                    {
                        page: 1,
                        limit: 20,
                        filters: [
                            {
                                key: "fundhouseId",
                                operator: "eq",
                                value: fundhouseId,
                            },
                            {
                                key: "mutualfundName",
                                operator: "contains",
                                value: query,
                            },
                        ],
                    }
                );
                return response;
            } else {
                return [];
            }
        } catch (error) {
            throw error;
        }
    };

    const { data: mutualFundData, mutate } = useMutation({
        mutationFn: fetchMutualFunds,
        mutationKey: ["mf-data"],
    });

    const postSwitchData = async () => {
        return await ApiRequest.post("/order/switch", {
            sourceFolioId: selectedFolio,
            targetMutualfundDividendTypeId: targetMutualfund?.optionType
                ?.find((el) => el.id === optionType)
                .mutualfundDividendType.find((e) => e.id == dividendType).id,
            transactionMode: "P",
            allUnits,
            accountId: id,
        });
    };

    const toast = useToast();
    const {
        mutate: switchInvest,
        isLoading: mutateLoading,
        isError,
        error,
    } = useMutation(postSwitchData, {
        onSuccess: (res: any) => {
            if (res && res.code > 299) {
                // error
                toast.show({
                    placement: "top",
                    render: () => <ErrorToaster message={res.message} />,
                });
            } else {
                // success
                hideDialog();
                toast.show({
                    placement: "top",
                    render: () => {
                        return (
                            <Box bg="green.400" p="2" rounded="sm" mb={5}>
                                {res.message}
                            </Box>
                        );
                    },
                });
            }
        },
        onError: () => {
            toast.show({
                placement: "top",
                render: () => (
                    <ErrorToaster message="Error while creating switch order" />
                ),
            });
        },
    });

    useEffect(() => {
        mutate();
        // }, [query, selectedFolio]);
    }, [query]);

    const { isLoading } = useQuery({
        queryKey: ["folio", optionType, dividendType],
        queryFn: fetchFolios,
        enabled: true,
    });

    const folio = useMemo(
        () => folios.find((el) => el?.id === selectedFolio),
        [selectedFolio]
    );

    const tabContent = {
        1: (
            <View>
                <View className="flex md:flex-row items-center justify-between py-4 px-12 gap-4">
                    <View className="w-full flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Choose Folio Number to switch from [Folio Number] -
                            [Units] - [Amount]
                        </Text>
                        <DropdownComponent
                            label="Folio Number"
                            data={folios?.map((el) => {
                                return {
                                    label: `${el.folioNumber} - [${el.redeemableUnits}] - [${RupeeSymbol} ${el.redeemableAmount}]`,
                                    value: el.id,
                                };
                            })}
                            containerStyle={{ width: "100%" }}
                            noIcon
                            value={selectedFolio}
                            setValue={setSelectedFolio}
                        />
                        <View className="w-full flex flex-col">
                            <View>
                                <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                                    Units{" "}
                                    {!!selectedFolio &&
                                        `(Units: ${folio.redeemableUnits.toString()} - Amount: ${folio.redeemableAmount.toString()})`}
                                </Text>
                                <TextInput
                                    className={`outline-none w-full border border-gray-300 p-2 rounded ${
                                        allUnits &&
                                        "bg-gray-200 cursor-not-allowed"
                                    }`}
                                    editable={!!selectedFolio && !allUnits}
                                    placeholder={`Enter Units`}
                                    underlineColorAndroid="transparent"
                                    selectionColor="transparent"
                                    placeholderTextColor={"rgb(156, 163, 175)"}
                                    cursorColor={"transparent"}
                                    style={{ outline: "none" }}
                                    value={switchValue}
                                    onChangeText={(text) => {
                                        // Allow numeric values and a single decimal point
                                        let numericValue = text.replace(
                                            /[^0-9.]/g,
                                            ""
                                        );

                                        // Ensure that there's only one decimal point and limit to three digits after the decimal
                                        if (numericValue.includes(".")) {
                                            const [integerPart, decimalPart] =
                                                numericValue.split(".");
                                            numericValue =
                                                integerPart +
                                                "." +
                                                decimalPart.slice(0, 3);
                                        }
                                        setSwitchValue(numericValue);
                                    }}
                                    keyboardType="numeric"
                                />
                                {!!selectedFolio &&
                                    Number(switchValue) >
                                        folio?.redeemableUnits && (
                                        <Text
                                            style={{
                                                color: "red",
                                                fontSize: 12,
                                            }}
                                        >
                                            Entered units exceed available units
                                            ({folio?.redeemableUnits}).
                                        </Text>
                                    )}
                            </View>
                            <View className="w-full flex flex-row">
                                <Checkbox
                                    color="#013974"
                                    disabled={!selectedFolio}
                                    status={allUnits ? "checked" : "unchecked"}
                                    onPress={() => {
                                        if (!allUnits && selectedFolio) {
                                            setSwitchValue(
                                                folio.redeemableUnits.toString()
                                            );
                                        }
                                        setAllUnits((prev) => !prev);
                                    }}
                                />
                                <Text selectable className="mt-2 text-sm">
                                    Redeem all
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="w-full flex flex-col items-center py-4 px-12 gap-4">
                    <Button
                        disabled={
                            !selectedFolio ||
                            Number(switchValue) < 1 ||
                            !Number(switchValue) ||
                            Number(switchValue) > folio?.redeemableUnits // Disable if validation fails
                        }
                        width="100%"
                        bgColor={
                            !selectedFolio ||
                            Number(switchValue) < 1 ||
                            !Number(switchValue) ||
                            Number(switchValue) > folio?.redeemableUnits
                                ? "#ddd"
                                : "#013974"
                        }
                        onPress={() => setShowTab(2)}
                        className={`rounded-lg mt-4 ${
                            !selectedFolio || !switchValue
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                    >
                        Continue
                    </Button>
                </View>
            </View>
        ),
        2: (
            <View className="px-8">
                <View className="p-2">
                    <Pressable className="flex flex-row justify-start items-center w-full p-4 bg-[#E8F1FF] rounded-full">
                        <Text className="p-2">To</Text>
                        <TextInput
                            className="outline-none w-[100%]"
                            placeholder="Search for Mutual Funds to Switch"
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            placeholderTextColor={"rgb(100, 116, 139)"}
                            cursorColor={"transparent"}
                            style={{ outline: "none" }}
                            value={query}
                            onChangeText={setQuery}
                        />
                    </Pressable>
                    <View className="">
                        {isLoading ? (
                            <HStack
                                space={2}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Spinner
                                    color={"black"}
                                    accessibilityLabel="Loading"
                                />
                                <Heading color="black" fontSize="md">
                                    Loading
                                </Heading>
                            </HStack>
                        ) : (
                            <DataTable
                                key="searchMutualFund"
                                headers={[]}
                                cellSize={[8, 4]}
                                noDataText={"Lets switch"}
                                rows={mutualFundData?.data?.map((fund: any) => {
                                    const minAdditionalInvestmentNotFilled =
                                        (folio.redeemableAmount /
                                            folio.redeemableUnits) *
                                            Number(switchValue) <=
                                        fund.minInvestment;
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
                                                            objectFit:
                                                                "contain",
                                                        }}
                                                        source={{
                                                            uri: fund?.logoUrl,
                                                        }}
                                                    />
                                                    <View>
                                                        <Text className="text-xs">
                                                            {/* {fund?.mutualfund?.name} */}
                                                            {fund?.name}
                                                        </Text>
                                                        <Text className="text-xs text-gray-400">
                                                            {
                                                                fund?.category
                                                                    ?.name
                                                            }{" "}
                                                            |{" "}
                                                            {
                                                                fund
                                                                    ?.subCategory
                                                                    ?.name
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            ),
                                        },
                                        {
                                            key: "choose",
                                            content: (
                                                <View className="flex flex-col w-full items-center py-2 rounded-full">
                                                    <Button
                                                        width="100%"
                                                        disabled={
                                                            minAdditionalInvestmentNotFilled
                                                        }
                                                        bgColor={
                                                            minAdditionalInvestmentNotFilled
                                                                ? "#ddd"
                                                                : "#013974"
                                                        }
                                                        onPress={() => {
                                                            setTargetMutualfund(
                                                                fund
                                                            );
                                                            setShowTab(3);
                                                        }}
                                                        className="rounded-full"
                                                    >
                                                        Choose
                                                    </Button>
                                                    {minAdditionalInvestmentNotFilled && (
                                                        <Text className="text-xs py-1">
                                                            Minimum investment:
                                                            {fund.minInvestment}
                                                        </Text>
                                                    )}
                                                </View>
                                            ),
                                        },
                                    ];
                                })}
                            />
                        )}
                    </View>
                </View>
            </View>
        ),
        3: (
            <View className="px-2">
                <View className="flex flex-col justify-between gap-2 px-12">
                    <View className="flex flex-row items-center justify-between">
                        <DataGrid
                            key="switchAmount"
                            value={
                                <Text selectable className="text-xs">
                                    Switch Approx Amount
                                </Text>
                            }
                            title={
                                <Text selectable className="text-xs">
                                    {RupeeSymbol}{" "}
                                    {(folio?.redeemableAmount /
                                        folio?.redeemableUnits) *
                                        Number(switchValue)}
                                </Text>
                            }
                        />
                        <DataGrid
                            key="switchAmount"
                            value={
                                <Text selectable className="text-xs">
                                    Switch Units
                                </Text>
                            }
                            title={
                                <Text selectable className="text-xs">
                                    {Number(switchValue)}
                                </Text>
                            }
                        />
                    </View>
                    <View className="flex flex-row items-center">
                        <Text>To</Text>
                        <Divider className="mx-2" />
                    </View>
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
                                uri: targetMutualfund?.logoUrl,
                            }}
                        />
                        <View>
                            <Text className="text-xs">
                                {targetMutualfund?.name}
                            </Text>
                            <Text className="text-xs text-gray-400">
                                {targetMutualfund?.category?.name} |{" "}
                                {targetMutualfund?.subCategory?.name}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-xs">52 Week Low</Text>
                            <Text className="text-xs text-gray-400">
                                {targetMutualfund?.low52Week}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-xs">52 Week High</Text>
                            <Text className="text-xs text-gray-400">
                                {targetMutualfund?.high52Week}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="flex flex-col justify-between gap-2 px-16 py-4">
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Option Type
                        </Text>
                        <DropdownComponent
                            label="Option Type"
                            data={targetMutualfund?.optionType?.map((o) => {
                                return {
                                    value: o.id as any as string,
                                    label: o.name,
                                };
                            })}
                            containerStyle={{ width: "100%" }}
                            noIcon
                            value={optionType}
                            setValue={setOptionType}
                        />
                    </View>
                    <View className="w-1/2 flex flex-col items-center gap-y-2">
                        <Text className="w-full flex flex-row items-start justify-start text-xs text-gray-400 mb-2">
                            Dividend Type
                        </Text>
                        <DropdownComponent
                            label="Dividend Type"
                            data={targetMutualfund?.optionType
                                ?.find((el) => el.id === optionType)
                                ?.mutualfundDividendType?.map((e) => {
                                    return {
                                        key: e.id,
                                        label: e.dividendType.name,
                                        value: e.id,
                                    };
                                })}
                            containerStyle={{ width: "100%" }}
                            noIcon
                            value={dividendType}
                            setValue={setDividendType}
                        />
                    </View>
                </View>
                <View className="w-full flex flex-col items-center py-4 px-12 gap-4">
                    <Button
                        disabled={mutateLoading}
                        width="100%"
                        bgColor={mutateLoading ? "#ddd" : "#013974"}
                        onPress={() => switchInvest()}
                        className="rounded-lg mt-4"
                    >
                        Switch
                    </Button>
                </View>
            </View>
        ),
    };

    const renderInfo = {
        2: {
            title: "Select Folio to Switch",
            content: (
                <View className="flex flex-col">
                    <View className="flex md:flex-row items-center justify-between py-4 px-12 gap-4">
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
                                    uri: IsMFSearch
                                        ? selectedFund?.logoUrl
                                        : selectedFund?.mutualfund?.logoUrl,
                                }}
                            />
                            <View>
                                <Text className="text-xs">
                                    {IsMFSearch
                                        ? selectedFund?.name
                                        : selectedFund?.mutualfund?.name}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    {IsMFSearch
                                        ? selectedFund?.category?.name
                                        : selectedFund?.mutualfund
                                              ?.category}{" "}
                                    |{" "}
                                    {IsMFSearch
                                        ? selectedFund?.subCategory?.name
                                        : selectedFund?.mutualfund?.subCategory}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-xs">52 Week Low</Text>
                                <Text className="text-xs text-gray-400">
                                    {IsMFSearch
                                        ? ""
                                        : selectedFund.mutualfund.low52Week}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-xs">52 Week High</Text>
                                <Text className="text-xs text-gray-400">
                                    {IsMFSearch
                                        ? ""
                                        : selectedFund.mutualfund.high52Week}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Divider className="my-2" />
                    {tabContent[showTab]}
                </View>
            ),
        },
    };

    return (
        <View className="flex flex-col">
            <View className="h-16 flex flex-row justify-between items-center p-12">
                <View className="flex flex-row items-center gap-x-2">
                    {showTab > 1 && (
                        <Pressable
                            onPress={() => setShowTab((prev) => prev - 1)}
                        >
                            <IonIcon name="chevron-back-outline" size={24} />
                        </Pressable>
                    )}
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

const ErrorToaster = ({ message }) => {
    return (
        <Box bg="red.400" p="2" color="white" rounded="sm" mb={5}>
            <Text className="text-white">{message}</Text>
        </Box>
    );
};
