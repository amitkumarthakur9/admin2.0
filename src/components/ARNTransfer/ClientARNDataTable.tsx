import * as React from "react";
import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    useWindowDimensions,
    Pressable,
} from "react-native";
import { router } from "expo-router";
import {
    CheckCircleIcon,
    HStack,
    Heading,
    Spinner,
    WarningIcon,
    Modal,
    Image,
} from "native-base";
import RemoteApi from "../../services/RemoteApi";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { Pagination } from "../Pagination/Pagination";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import DataTable from "../DataTable/DataTable";
import Tag from "../Tag/Tag";
import Icon from "react-native-vector-icons/FontAwesome";
import TableCard from "../Card/TableCard";
import { useUserRole } from "../../context/useRoleContext";
import NoDataAvailable from "../Others/NoDataAvailable";
import CustomModal from "../Modal/CustomModal";

const ClientARNDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<ClientWiseData[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { width } = useWindowDimensions();
    const [showModal, setShowModal] = useState(false);

    async function getDataList(
        updatedFilterValues = [],
        applyDirectly = false
    ) {
        // setIsLoading(true);
        let data: any = {
            page: currentPageNumber,
            limit: itemsPerPage,
            filters: applyDirectly ? updatedFilterValues : appliedFilers,
        };

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting;
        }

        const response: ClientWiseResponse = await RemoteApi.post(
            "aum/client/list",
            data
        );

        if (response.code == 200) {
            setData(response.data);
            // setItemsPerPage(response.count)
            setTotalItems(response.filterCount);
            setIsLoading(false);
            setTotalPages(
                Math.ceil(
                    (response.filterCount || response.data.length) /
                        itemsPerPage
                )
            );
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("aum/client/schema");
            setFiltersSchema(response?.data);
            setSorting(response?.data?.sort);
        }
        getSchema();
    }, []);

    React.useEffect(() => {
        if (
            (appliedSorting.direction != "" && appliedSorting.key != "") ||
            (appliedSorting.direction == "" && appliedSorting.key == "")
        ) {
            getDataList();
        }
    }, [appliedSorting]);

    const mobileData = data.map((item) => ({
        // id: item.id,
        Name: item?.name,
        ClientId: item?.clientId,
        PanNumber: item?.panNumber,
        CurrentValue: RupeeSymbol + item.currentValue,
        InvestedValue: RupeeSymbol + item.investedValue,
        XIRR: item?.xirr,
    }));

    const dummyData = [
        {
            id: 1,
            name: "Kshitish",
            panNumber: "ACVB34356G",
            clientId: "ACVB34356G",
            externalFund: "Available",
            lastUpdate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            panNumber: "ACVB34356G",
            clientId: "ACVB34356G",
            externalFund: "Available",
            lastUpdate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            panNumber: "ACVB34356G",
            clientId: "ACVB34356G",
            externalFund: "Available",
            lastUpdate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            panNumber: "ACVB34356G",
            clientId: "ACVB34356G",
            externalFund: "Available",
            lastUpdate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            panNumber: "ACVB34356G",
            clientId: "ACVB34356G",
            externalFund: "Available",
            lastUpdate: "Jul 26, 2023, 1:38 PM",
        },
    ];

    const handleRefreshPortfolio = () => {
        setShowModal(true);
    };

    const modalRefreshContent = () => {
        return (
            <>
                <View>Refresh Portfolio</View>
            </>
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const transformedData = dummyData?.map((item) => {
        const itemStructure = [
            {
                key: "clientName",
                content: (
                    <View className="flex flex-row items-center justify-center w-11/12">
                        <View className="flex flex-col rounded-full bg-[#e60202] mr-2 h-10 w-10 mb-1 items-center justify-center flex-wrap">
                            <Text selectable className="text-white">
                                {getInitials(item?.name)}
                            </Text>
                        </View>
                        <View className="flex flex-col flex-wrap w-9/12">
                            <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12 mb-2">
                                <Pressable
                                    onPress={() =>
                                        router.push(`arn-transfer/${item?.id}`)
                                    }
                                >
                                    <Text
                                        selectable
                                        className="flex flex-row text-black font-semibold break-all"
                                    >
                                        {item?.name}&nbsp;{" "}
                                    </Text>
                                </Pressable>

                                {/* <View className="flex flex-row items-center">
                                    {item?.isActive == true ? (
                                        <CheckCircleIcon
                                            color="emerald.500"
                                            size="xs"
                                        />
                                    ) : (
                                        <WarningIcon
                                            size="xs"
                                            color="orange.500"
                                        />
                                    )}
                                </View> */}
                            </View>
                            {/* <View className="flex flex-row items-center mt-0">
                                {item?.kycStatus?.name == "Verified" ? (
                                    <Tag>KYC Done</Tag>
                                ) : (
                                    <Tag>KYC Not Done</Tag>
                                )} */}
                            {/* <Tag>SIP(N/A)</Tag> */}
                            {/* <Tag>Autopay active</Tag> */}
                            {/* </View> */}
                        </View>
                    </View>
                ),
            },
            {
                key: "panNumber",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.panNumber ? item?.panNumber : "-"}
                    </Text>
                ),
            },
            {
                key: "clientCode",
                content: (
                    <Text
                        selectable
                        className="text-[#686868] font-semibold w-11/12"
                    >
                        {item?.clientId ? item?.clientId : "-"}
                    </Text>
                ),
            },
            {
                key: "externalFund",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.externalFund}
                    </Text>
                ),
            },
            {
                key: "lastexternalFund",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.lastUpdate}
                    </Text>
                ),
            },
            {
                key: "Actions",
                content: (
                    <View className="flex flex-row justify-start text-[#686868] font-semibold w-11/12 ">
                        <Pressable
                            className="rounded-full border-2 px-6 py-3"
                            // onPress={() =>
                            //     router.push(`arn-transfer/${item?.id}`)
                            // }
                            onPress={handleRefreshPortfolio}
                        >
                            <Text
                                selectable
                                className="flex flex-row text-black font-semibold break-all text-center"
                            >
                                Refresh Porfolio
                            </Text>
                        </Pressable>
                    </View>
                ),
            },
        ];

        return itemStructure;
    });

    return (
        <>
            <View className="h-screen">
                {data.length === 0 ? (
                    <NoDataAvailable />
                ) : (
                    <View className="bg-white">
                        {/* <View className="">
                <TableBreadCrumb name={"Client Wise"} />
            </View> */}
                        <View className="border-[0.2px]  border-[#e4e4e4]">
                            <DynamicFilters
                                appliedSorting={appliedSorting}
                                setAppliedSorting={setAppliedSorting}
                                sorting={sorting}
                                fileName="Clients"
                                downloadApi={"client/download-report"}
                                schemaResponse={filtersSchema}
                                setCurrentPageNumber={setCurrentPageNumber}
                                getList={getDataList}
                                appliedFilers={appliedFilers}
                                setAppliedFilers={setAppliedFilers}
                            />

                            {!isLoading ? (
                                <ScrollView className={"mt-4 z-[-1] "}>
                                    {width < 830 ? (
                                        <TableCard data={mobileData} />
                                    ) : (
                                        <DataTable
                                            headers={[
                                                "Client Name",
                                                "PAN",
                                                "Client Code",
                                                "External Funds imported",
                                                "Last Updated date for external funds",
                                                "Actions",
                                            ]}
                                            cellSize={[2, 1, 1, 1, 2, 2]}
                                            rows={transformedData}
                                        />
                                    )}
                                </ScrollView>
                            ) : (
                                <HStack
                                    space={"md"}
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
                            )}
                        </View>

                        <Pagination
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            getDataList={getDataList}
                            currentPageNumber={currentPageNumber}
                            totalPages={totalPages}
                            setCurrentPageNumber={setCurrentPageNumber}
                        />
                    </View>
                )}
            </View>

            {/* <CustomModal children={modalRefreshContent} show={showModal} /> */}
            <View>
                <Modal
                    isOpen={showModal}
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
                                    source={require("../../../assets/images/Tick.png")}
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
};

export default ClientARNDataTable;
