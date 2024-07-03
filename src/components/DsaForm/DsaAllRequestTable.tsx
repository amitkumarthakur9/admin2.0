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
import DsaDocumentDownload from "./DsaDocumentDownload";
import RequestModal from "./RequestModal";

const DsaAllRequestTable = () => {
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
    const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('approve');
  const [currentClientId, setCurrentClientId] = useState(null);

  const DsaData = [
    {
        dsaId:"1",
        name:"Harish",
        arnCode:"ARN-34567",
        rnName:"Ravi Rathi",
        doA:"03/09/2024 8:09 PM",
    }
  ]

  const handleOpenModal = (type, clientId) => {
    setModalType(type);
    setCurrentClientId(clientId);
    setModalVisible(true);
  };
    
      const handleCloseModal = () => {
        setModalVisible(false);
      };

    async function getDataList(
        updatedFilterValues = [],
        applyDirectly = false
    ) {
        setIsLoading(true);
        let data: any = {
            page: currentPageNumber,
            limit: itemsPerPage,
            filters: applyDirectly ? updatedFilterValues : appliedFilers,
        };

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting;
        }

        try {
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
            } else {
                setIsLoading(false);

                // alert("Internal Server Error");
            }
        } catch (error) {
            alert(error);
        }
    }

    React.useEffect(() => {
        async function getSchema() {
            const response: any = await RemoteApi.get("aum/client/schema");
            setFiltersSchema(response);
            setSorting(response.sort);
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

    const transformedData = data?.map((item) => {
        const itemStructure = [
            {
                key: "DsaName",
                content: (
                    <View className="flex flex-row items-center justify-start w-full">           
                        <View className="flex flex-col w-11/12">
                            <View className="flex flex-row items-center text-black font-semibold mb-2">
                                <Pressable
                                    onPress={() =>
                                        router.push(`clients/${item?.id}`)
                                    }
                                    className="flex flex-row w-[99%]"
                                >
                                    <Text
                                        selectable
                                        className="flex flex-row text-black font-semibold break-all"
                                    >
                                        {item?.name}&nbsp;{" "}
                                    </Text>
                                </Pressable>
                            </View>
                            <View className="flex flex-row items-center mt-0">
                                {/* {item?.kycStatus?.name == "Verified" ? ( */}
                                <Tag>New</Tag>
                                {/* ) : ( */}
                                <Tag>Resubmitted</Tag>
                                {/* )} */}
                                {/* <Tag>SIP(N/A)</Tag> */}
                                {/* <Tag>Autopay active</Tag> */}
                            </View>
                        </View>
                    </View>
                ),
            },
            {
                key: "arnCode",
                content: (
                    <Text
                        selectable
                        className="text-[#686868] font-semibold w-11/12"
                    >
                        8851GJ91
                    </Text>
                ),
            },
            {
                key: "rmName",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        Shobha Rathi
                    </Text>
                ),
            },
            {
                key: "DateApplication",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        03/09/2020 8:09 PM
                    </Text>
                ),
            },
            {
                key: "DsaDocumentDownload",
                content: (
                    <View className="flex flex-row w-[99%]">
                        <DsaDocumentDownload
                            clientId={"fg"}
                            downloadApi={"downloadApi"}
                            fileName={"Dsa-Document"}
                        />
                    </View>
                ),
            },
            {
                key: "Approve",
                content: (
                    <View className="flex flex-row w-[99%]">
                        <Pressable
                            onPress={() => handleOpenModal('approve', item.id)}
                            className="bg-[#CCF4C2] rounded-full px-5 py-2"
                        >
                            <View >
                                <Text className="color-[#417135]">Approve</Text>
                            </View>
                        </Pressable>
                     </View>
                ),
            },
            {
                key: "Reject",
                content: (
                    <View className="flex flex-row w-[99%]">
                        <Pressable
                            onPress={() => handleOpenModal('reject', item.id)}
                            className="bg-[#FFD2D2] rounded-full px-5 py-2"
                        >
                            <View >
                                <Text className="color-[#713535]">Reject</Text>
                            </View>
                        </Pressable>
                    </View>
                ),
            },
        ];

        return itemStructure;
    });

    return (
        <View className="h-screen">
            <View className="bg-white">
                <View className="border-[0.2px]  border-[#e4e4e4]">
                    {/* {data.length !== 0 && ( */}
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
                        <View className={"mt-4 z-[-1] "}>
                            {width < 830 ? (
                                <TableCard data={mobileData} />
                            ) : (
                                <DataTable
                                    headers={[
                                        "DSA Name",
                                        "ARN Code",
                                        "RM Name",
                                        "Date of Application",
                                        "Download",
                                        "Approve",
                                        "Reject",
                                    ]}
                                    cellSize={[3, 1, 2, 2, 2, 1, 1]}
                                    rows={transformedData}
                                />
                            )}
                        </View>
                    ) : (
                        // )
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
                {/* {data.length !== 0 && ( */}
                <Pagination
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    getDataList={getDataList}
                    currentPageNumber={currentPageNumber}
                    totalPages={totalPages}
                    setCurrentPageNumber={setCurrentPageNumber}
                />
                {/* )} */}
            </View>
            <RequestModal
        visible={modalVisible}
        onClose={handleCloseModal}
        type={modalType}
        clientId={currentClientId}
        onSubmit={handleCloseModal}
      />
        </View>
    );
};

export default DsaAllRequestTable;