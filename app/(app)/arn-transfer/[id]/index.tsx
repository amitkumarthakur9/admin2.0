import { useCallback, useEffect, useState } from "react";
import { Alert, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Box,
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
    Modal,
} from "native-base";
import moment from "moment";
import { useMutation, useQuery } from "react-query";
import Icon from "react-native-vector-icons/FontAwesome";
import AntdIcon from "react-native-vector-icons/AntDesign";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useToast } from "native-base";

import RemoteApi from "../../../../src/services/RemoteApi";
import { BreadcrumbShadow } from "../../../../src/components/Styles/Shadow";
import { RupeeSymbol, maskLetters } from "../../../../src/helper/helper";
import CardWithTabs from "../../../../src/components/Card/CardWithTabs";
import DataGrid from "../../../../src/components/DataGrid/DataGrid";
import HorizontalStackedBarChart from "../../../../src/components/Chart/HorizontalBarChart";
import Accordion from "../../../../src/components/Accordion/Accordion";
import DataTable from "../../../../src/components/DataTable/DataTable";
// import Modal from "../../../../src/components/Modal/Modal";
import { TextInput } from "react-native";
import DropdownComponent from "../../../../src/components/Dropdowns/NewDropDown";
import RadioButton from "../../../../src/components/Radio/Radio";
import DataValue from "../../../../src/components/DataValue/DataValue";
import useDebouncedSearch from "../../../../src/hooks/useDebounceSearch";
import ApiRequest from "../../../../src/services/RemoteApi";
import ARNHoldingDataTable from "../../../../src/components/ARNTransfer/ARNHoldingDataTable";
import CustomButton from "../../../../src/components/Buttons/CustomButton";
import { VictoryPie, VictoryLegend, VictoryTooltip } from "victory";
import { AUMDetailResponseInterface } from "../../../../src/interfaces/AUMDetailResponseInterface";
import { dateTimeFormat } from "../../../../src/helper/DateUtils";

export default function ClientARNDetail() {
    const { id } = useLocalSearchParams();
    const [data, setData] = useState<ClientDetailedDataResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [refreshDate, setRefreshDate] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalKey, setModalKey] = useState("invest");
    const [cardPage, setCardPage] = useState(1);
    const [selectedFund, setSelectedFund] = useState<
        MutualFundSearchResult | Holding | null
    >(null);
    const [allowModalCardChange, setAllowModalCardChange] = useState(true);
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const { width } = useWindowDimensions();
    const [hideDetails, setHideDetails] = useState(true);

    const closeModal = () => {
        setVisible(false);
        setModalKey("");
        setCardPage(1);
        setSelectedFund(null);
    };
    const [showImport, setShowImport] = useState(false);
    const [refreshImport, setRefreshImport] = useState(false);

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

    const DonutPieChart = ({ pieData }) => {
        const colorScale = ["#715CFA", "#B0ED8B", "#FE9090", "#FFE456"];

        return (
            <div style={{ display: "flex" }}>
                <View className="w-8/12">
                    <VictoryPie
                        data={pieData}
                        colorScale={colorScale}
                        innerRadius={100}
                        labels={({ datum }) =>
                            `${datum.x}: ${datum.y.toFixed(1)}${"%"}`
                        }
                        style={{ labels: { fill: "black" } }}
                        width={500}
                        labelComponent={
                            <VictoryTooltip
                                dy={0}
                                centerOffset={{ x: 25 }}
                                flyoutHeight={40}
                                style={{ fontSize: 16 }}
                            />
                        }
                    />
                </View>
                <View className="w-4/12">
                    <VictoryLegend
                        x={0}
                        y={-140}
                        orientation="vertical"
                        gutter={2}
                        data={pieData?.map((item, index) => ({
                            name: `${item.x}: ${item.y.toFixed(1)}${"%"}`,
                            symbol: { fill: colorScale[index] },
                        }))}
                        style={{
                            labels: {
                                fontSize: 56,
                                flex: 1,
                                flexDirection: "col",
                                flexWrap: "wrap",
                            },
                        }}
                    />
                </View>
            </div>
        );
    };

    const handleRefreshPortfolio = (lastDate, name) => {
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
                    currentDate.getTime() +
                        remainingDays * (1000 * 60 * 60 * 24)
                );
                return `Wait for ${remainingDays} days, ${remainingDate.toLocaleString()}`;
            } else {
                //   return 'The date is 7 days old.';
                return "false";
            }
        };

        // Example usage:
        const inputDate = new Date("2024-04-15T12:00:00");

        async function sendRequest() {
            const response: ArnImport = await RemoteApi.get(
                `client/${id}/request-import-folio`
            );

            const refreshDate = await checkDate(lastDate);
            console.log(refreshDate);
            if (response.message == "Success") {
                setIsLoading(false);
                if (refreshDate == "false") {
                    setShowImport(true);
                } else {
                    setRefreshImport(true);
                }
            }
        }

        sendRequest();
    };

    const handleCloseModal = () => {
        setShowImport(false);
        setRefreshImport(false);
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
                                    Client details external funds
                                </Text>
                            </View>
                            <View className="flex flex-col md:flex-row mr-2">
                                <View
                                    className="flex flex-row justify-between rounded g-white h-auto p-4 md:w-1/2 md:mr-2"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    {width < 830 ? (
                                        <>
                                            <View className="flex flex-col gap-6 w-full">
                                                <View className="flex flex-col md:flex-row w-full justify-between items-start md:items-center">
                                                    <View className="flex flex-row gap-2 justify-between items-start md:items-center w-full">
                                                        <View className="flex flex-row items-center w-9/12">
                                                            <View>
                                                                <Text
                                                                    selectable
                                                                    className="text-sm md:text-lg flex flex-row text-start md:text-center font-semibold"
                                                                >
                                                                    {data?.name}
                                                                </Text>
                                                            </View>
                                                            <View className="pl-2">
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
                                                        </View>
                                                        <View className="w-3/12">
                                                            <Pressable
                                                                onPress={() =>
                                                                    setHideDetails(
                                                                        !hideDetails
                                                                    )
                                                                }
                                                            >
                                                                <Text className="text-[#114EA8] font-bold text-[14px] text-center">
                                                                    {hideDetails
                                                                        ? "Hide Details"
                                                                        : "Show Details"}
                                                                </Text>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                    {hideDetails && (
                                                        <View className="flex flex-row justify-between items-start w-full pt-4">
                                                            <View className="w-6/12 flex-flex-col gap-4 px-2">
                                                                <DataValue
                                                                    key="pan"
                                                                    title="Pan No."
                                                                    value={
                                                                        data
                                                                            ?.users[0]
                                                                            ?.panNumber
                                                                    }
                                                                />
                                                                <DataValue
                                                                    key="clientCode"
                                                                    title="Client Code"
                                                                    value={
                                                                        data?.clientId
                                                                    }
                                                                />

                                                                <DataValue
                                                                    key="dob"
                                                                    title="DOB"
                                                                    value={moment(
                                                                        data
                                                                            ?.users[0]
                                                                            ?.dateOfBirth
                                                                    ).format(
                                                                        "MMM DD, YYYY"
                                                                    )}
                                                                />
                                                                <DataValue
                                                                    key="doi"
                                                                    title="DOI"
                                                                    value="-"
                                                                />
                                                            </View>

                                                            <View className="w-6/12 flex-flex-col gap-4 px-2">
                                                                <DataValue
                                                                    key="totalInvestment"
                                                                    title="Total Investment"
                                                                    value={
                                                                        RupeeSymbol +
                                                                        "6,32,83,345"
                                                                    }
                                                                />
                                                                <DataValue
                                                                    key="kycStatus"
                                                                    title="KYC Status"
                                                                    value={
                                                                        data
                                                                            ?.users[0]
                                                                            ?.kycStatus
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
                                                    )}

                                                    <View className="w-full py-4">
                                                        <Pressable
                                                            onPress={() =>
                                                                handleRefreshPortfolio(
                                                                    data?.externalFundLastUpdatedOn,
                                                                    data?.name
                                                                )
                                                            }
                                                            className={`flex flex-row justify-center items-center border-[1px] border-[#013974] rounded px-8 h-[38px] `}
                                                        >
                                                            <Text className="text-[#013974] font-bold">
                                                                {" "}
                                                                {data?.externalFundLastUpdatedOn ==
                                                                null
                                                                    ? "Import Portfolio"
                                                                    : "Refresh Portfolio"}
                                                            </Text>
                                                        </Pressable>
                                                    </View>
                                                </View>
                                            </View>
                                        </>
                                    ) : (
                                        <>
                                            <View className="flex flex-col gap-6 w-full">
                                                <View className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                                                    <View className="flex flex-row gap-2 justify-between items-start md:items-center w-full">
                                                        <View className="flex flex-row items-center justify-start w-6/12">
                                                            <View className="flex flex-row items-center w-8/12 md:w-fit">
                                                                <Text
                                                                    selectable
                                                                    className="text-sm md:text-lg flex flex-row text-start md:text-center font-semibold"
                                                                >
                                                                    {data?.name}
                                                                </Text>
                                                                <View className="pl-2 w-2/12">
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
                                                            </View>
                                                            
                                                        </View>
                                                        <View className="w-5/12">
                                                            <Pressable
                                                                onPress={() =>
                                                                    handleRefreshPortfolio(
                                                                        data?.externalFundLastUpdatedOn,
                                                                        data?.name
                                                                    )
                                                                }
                                                                className={`flex flex-row justify-center items-center border-[1px] border-[#013974] rounded px-8 py-6 h-[38px] 
                                                                    
                                                                `}
                                                            >
                                                                <Text className="text-[#013974] font-bold text-center ">
                                                                    {" "}
                                                                    {data?.externalFundLastUpdatedOn ==
                                                                    null
                                                                        ? "Import Portfolio"
                                                                        : "Refresh Portfolio"}
                                                                </Text>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View className="flex flex-row justify-between items-start w-full">
                                                    <View className="w-6/12 flex-flex-col gap-4 px-2">
                                                        <DataValue
                                                            key="pan"
                                                            title="Pan No."
                                                            value={
                                                                data?.users[0]
                                                                    ?.panNumber
                                                            }
                                                        />
                                                        <DataValue
                                                            key="clientCode"
                                                            title="Client Code"
                                                            value={
                                                                data?.clientId
                                                            }
                                                        />

                                                        <DataValue
                                                            key="dob"
                                                            title="DOB"
                                                            value={moment(
                                                                data?.users[0]
                                                                    ?.dateOfBirth
                                                            ).format(
                                                                "MMM DD, YYYY"
                                                            )}
                                                        />
                                                        <DataValue
                                                            key="doi"
                                                            title="DOI"
                                                            value="-"
                                                        />
                                                    </View>

                                                    <View className="w-6/12 flex-flex-col gap-4 px-2">
                                                        <DataValue
                                                            key="totalInvestment"
                                                            title="Total Investment"
                                                            value={
                                                                RupeeSymbol +
                                                                "6,32,83,345"
                                                            }
                                                        />
                                                        <DataValue
                                                            key="kycStatus"
                                                            title="KYC Status"
                                                            value={
                                                                data?.users[0]
                                                                    ?.kycStatus
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
                                        </>
                                    )}
                                </View>
                                <View
                                    className="flex flex-col md:flex-row justify-between rounded g-white h-auto p-4 md:w-1/2 "
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <View className="flex flex-row justify-between items-start w-full md:w-6/12">
                                        <View className="w-6/12 md:w-1/2 flex flex-col">
                                            <View className="w-full flex flex-col justify-between items-start p-2">
                                                <View className="w-full">
                                                    <Text
                                                        className="text-bold font-medium text-gray-500"
                                                        selectable
                                                    >
                                                        Current Holding
                                                    </Text>
                                                </View>
                                                <View className="">
                                                    <Text
                                                        selectable
                                                        className="font-medium text-start text-blue-900"
                                                    >
                                                        {RupeeSymbol +
                                                            "38,98,348"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="w-full flex flex-col justify-between items-start p-2">
                                                <View className="w-full">
                                                    <Text
                                                        className="text-bold font-medium text-gray-500"
                                                        selectable
                                                    >
                                                        XIRR
                                                    </Text>
                                                </View>
                                                <View className="">
                                                    <Text
                                                        selectable
                                                        className="font-medium text-start text-black"
                                                    >
                                                        31.11 %
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="w-6/12 md:w-1/2 flex-flex-col gap-4 px-2">
                                            <View className="w-full flex flex-col justify-between items-start p-2">
                                                <View className="w-full">
                                                    <Text
                                                        className="text-bold font-medium text-gray-500"
                                                        selectable
                                                    >
                                                        Invested
                                                    </Text>
                                                </View>
                                                <View className="">
                                                    <Text
                                                        selectable
                                                        className="font-medium text-start text-black"
                                                    >
                                                        {RupeeSymbol +
                                                            "38,98,348"}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View className="w-full flex flex-col justify-between items-start p-2">
                                                <View className="">
                                                    <Text
                                                        className="text-bold font-medium text-black"
                                                        selectable
                                                    >
                                                        Total Returns
                                                    </Text>
                                                </View>
                                                <View className="">
                                                    <Text
                                                        selectable
                                                        className="font-medium text-start text-[#539D39]"
                                                    >
                                                        {RupeeSymbol +
                                                            "2,98,348"}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <View className="w-full md:w-6/12">
                                        <DonutPieChart
                                            pieData={[
                                                {
                                                    x: "Debt",
                                                    y: 54.2,
                                                },
                                                {
                                                    x: "Equity",
                                                    y: 45.8,
                                                },
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row justify-between rounded bg-white">
                                <View
                                    className="w-full rounded"
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    <PortfolioCard
                                        data={data}
                                        showModal={showModal}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}

            <View>
                <Modal
                    isOpen={showImport}
                    onClose={handleCloseModal}
                    className="md:p-10"
                >
                    <Modal.Content className="bg-white md:p-8">
                        <Modal.CloseButton />
                        <Modal.Body>
                            <View className="flex flex-row  justify-center">
                                <Image
                                    className=""
                                    alt="ico"
                                    source={require("../../../../assets/images/Tick.png")}
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
                                <Text className="text-center font-semibold md:text-lg">
                                    Portfolio request has been successfully sent
                                    to {data?.name}
                                </Text>
                            </View>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </View>

            <View>
                <Modal
                    isOpen={refreshImport}
                    onClose={handleCloseModal}
                    className="md:p-10"
                >
                    <Modal.Content className="bg-white md:p-8">
                        <Modal.CloseButton />
                        <Modal.Body>
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
                                    <Text className="text-center font-semibold md:text-lg">
                                        You can resend the request only after 7
                                        days of last request sent
                                    </Text>
                                    <Text className="text-center text-base">
                                        Last request sent:{" "}
                                        {dateTimeFormat(
                                            data?.externalFundLastUpdatedOn
                                        )}
                                    </Text>
                                </View>
                            </>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </View>
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
    return (
        <>
            <View className="p-2 w-full">
                <ARNHoldingDataTable />
            </View>
        </>
    );
};
