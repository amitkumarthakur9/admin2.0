import { useCallback, useEffect, useState } from "react";
import { Alert, View } from "react-native";
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

export default function ClientARNDetail() {
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
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);

    const closeModal = () => {
        setVisible(false);
        setModalKey("");
        setCardPage(1);
        setSelectedFund(null);
    };
    const [showImport, setShowImport] = useState(false);


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

    const importPortfolio = async () => {
        console.log("importPortfolio");
        // try {
        //     const response: any = await RemoteApi.patch(
        //         "onboard/client/invite",
        //         contactID
        //     );

        //     if (response?.message == "Success") {
        //         showDialog("invite");
        //         getDataList();
        //     } else {
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    };


    const DonutPieChart = ({pieData}) => {

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


    const handleRefreshPortfolio = () => {
        setShowImport(true);
    };

    const handleCloseModal = () => {
        setShowImport(false);
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
<View className="flex flex-row">
<View
                                    className="flex flex-row justify-between rounded g-white h-auto p-4 w-1/2 mr-2"
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
                                                <Pressable
                                                    onPress={importPortfolio}
                                                    className={`flex flex-row justify-center items-center border-[1px] border-[#013974] rounded px-8 h-[38px] `}
                                                >
                                                    <Text className="text-[#013974] font-bold">
                                                        {" "}
                                                        Import Portfolio
                                                    </Text>
                                                </Pressable>
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
                                                    value={data?.clientId}
                                                />

                                                <DataValue
                                                    key="dob"
                                                    title="DOB"
                                                    value={moment(
                                                        data?.users[0]
                                                            ?.dateOfBirth
                                                    ).format("MMM DD, YYYY")}
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
                                                            ?.kycStatus?.name
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
                                <View
                                    className="flex flex-row justify-between rounded g-white h-auto p-4 w-1/2 "
                                    style={{ ...BreadcrumbShadow }}
                                >
                                    
                                        <View className="flex flex-row justify-between items-start w-full">
                                            <View className="w-3/12 flex flex-col">
                                                <View className="w-full flex flex-col justify-between items-start p-2">
                                                    <View className="">
                                                        <Text
                                                            className="text-bold font-medium text-gray-500"
                                                            selectable
                                                        >
                                                            Current holding
                                                        </Text>
                                                    </View>
                                                    <View className="">
                                                        <Text
                                                            selectable
                                                            className="font-medium text-start text-[#114EA8]"
                                                        >
                                                            {RupeeSymbol + "38,98,348"}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View className="w-full flex flex-col justify-between items-start p-2">
                                                    <View className="">
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
                                                            21.11 %
                                                        </Text>
                                                    </View>
                                                </View>
                                                
                                            </View>
                                            <View className="w-3/12 flex-flex-col gap-4 px-2">
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
                                                            className="font-medium text-start text-gray-500"
                                                        >
                                                            {RupeeSymbol + "38,98,348"}
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
                                                            {RupeeSymbol + "2,98,348"}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <View className="w-6/12">
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
                    p="10"
                    className=""
                >
                    <Modal.Content className="bg-white p-8">
                        <Modal.CloseButton />
                        <Modal.Body>
                            <View className="flex flex-row  justify-center">
                                {/* <View className="w-full">
                                    <Text className="text-lg text-bold">
                                        Change password
                                    </Text>
                                    <Text className="text-sm text-semibold text-[#898989]">
                                        In order to keep your account safe you
                                        need to create a strong password.
                                    </Text>
                                </View> */}
                                <Image
                                    className=""
                                    alt="ico"
                                    source={require("../../../../assets/images/Tick.png")}
                                    style={{
                                        // flex: 1,
                                        // justifyContent: 'end',
                                        width: 100, // specify the desired width
                                        height: 100,
                                    }}
                                />

                                {/* <Pressable
                                    onPress={handleCloseModal}
                                    className={
                                        "flex flex-row justify-center items-center border-[1px] rounded px-2 h-[20px] border-slate-200"
                                    }
                                    aria-describedby="addNewClient"
                                >
                                    <Icon
                                        name="close"
                                        size={14}
                                        color="#484848"
                                    />
                                </Pressable> */}
                            </View>

                            <View className="flex flex-row justify-center pt-8">
                                <Text className="text-center">
                                    Refresh Portfolio request has been
                                    successfully sent to Kshitish
                                </Text>
                            </View>
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
    const [selectedTab, setSelectedTab] = useState(1);

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };

    const assetBifurcation = generateAssetBifurcation(data?.holdings);

    const assetBifurcationColors = ["#715CFA", "#69E1AB", "#39C3E2", "#FA8B5C"];

    return (
        <>
        <View className="p-2 w-full">
            <View className="p-2 border-b border-gray-200 mb-4">
                <Text className="font-bold text-lg">External Holdings</Text>
            </View>
            <View className="flex flex-col bg-gray-100 rounded p-2">
                <View className="flex flex-row justify-between items-center p-2">
                    <DataGrid
                        key="current"
                        title="Current Holdings"
                        value={
                            <Text className="text-blue-700">
                                {RupeeSymbol}{" "}
                                {data?.holdings
                                    ?.reduce(
                                        (accumulator, currentValue) =>
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
                        value={<Text className="text-green-700">00.00 %</Text>}
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

            <ARNHoldingDataTable />
        </View>
        </>
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
