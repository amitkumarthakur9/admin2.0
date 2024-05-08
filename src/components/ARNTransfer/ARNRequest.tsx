import * as React from "react";
import { useState, useEffect } from "react";
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
    useToast,
} from "native-base";

import RemoteApi from "../../services/RemoteApi";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { Pagination } from "../Pagination/Pagination";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { RupeeSymbol, getInitials } from "../../helper/helper";
import DataTable from "../DataTable/DataTable";
import Tag from "../Tag/Tag";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserRole } from "../../context/useRoleContext";
import TableCard from "../Card/TableCard";
import NoDataAvailable from "../Others/NoDataAvailable";
import DropdownComponent from "../Dropdowns/NewDropDown";
import DynamicMenu from "../Dashboard/DynamicMenu";
import { ToastAlert } from "../../helper/CustomToaster";
import { v4 as uuidv4 } from "uuid";

const ARNRequest = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<AUMDataItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { width } = useWindowDimensions();
    const [receivedData1, setReceivedData1] = useState(null);

    const toast = useToast();
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Clear existing toasts
        toast.closeAll();

        // Show the latest toast
        if (toasts.length > 0) {
            const latestToast = toasts[toasts.length - 1];
            toast.show({
                render: () => (
                    <ToastAlert
                        id={latestToast.id}
                        variant={latestToast.variant}
                        title={latestToast.title}
                        description=""
                        isClosable={false}
                        toast={toast}
                        status={latestToast.status}
                        onClose={() => removeToast(latestToast.id)} // Remove the toast from the 'toasts' array when closed
                    />
                ),
                placement: "top",
            });
        }
    }, [toasts]);

    const removeToast = (id) => {
        setToasts(toasts.filter((toast) => toast.id !== id));
    };

    const handleDataReceived1 = (data) => {
        // Handle the received data here, such as updating state in the parent component
        setReceivedData1(data);
        console.log("Data received from notification:", data);
        const uniqueId = uuidv4();
                // Add the success toast to the toasts array in the component's state
                setToasts([
                    ...toasts,
                    {
                        id: uniqueId,
                        variant: "solid",
                        title: "status changed succesfully",
                        status: "success",
                    },
                ]);
        
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

        const response: AUMResponseInterface = await RemoteApi.post(
            "aum/folio/list",
            data
        );

        // const response: AUMResponseInterface = await RemoteApi.post(
        //     "aum/folio/list",
        //     data
        // );

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
            const response: any = await RemoteApi.get("aum/folio/schema");
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

    const dummyData = [
        {
            id: 1,
            name: "Kshitish",
            folio: "ACVB34356G",
            clientId: "ACVB34356G",
            raisedBy: "Sanjay Singh",
            raisedDate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            folio: "ACVB34356G",
            clientId: "ACVB34356G",
            raisedBy: "Sanjay Singh",
            raisedDate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            folio: "ACVB34356G",
            clientId: "ACVB34356G",
            raisedBy: "Sanjay Singh",
            raisedDate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            folio: "ACVB34356G",
            clientId: "ACVB34356G",
            raisedBy: "Sanjay Singh",
            raisedDate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            folio: "ACVB34356G",
            clientId: "ACVB34356G",
            raisedBy: "Sanjay Singh",
            raisedDate: "Jul 26, 2023, 1:38 PM",
        },
        {
            id: 1,
            name: "Kshitish",
            folio: "ACVB34356G",
            clientId: "ACVB34356G",
            raisedBy: "Sanjay Singh",
            raisedDate: "Jul 26, 2023, 1:38 PM",
        },
    ];

    const mobileData = dummyData.map((item) => ({
        // id: item.id,
        Name: item?.name,
        FolioNumber: item?.folio,
        ClientId: item?.clientId,
        RaisedBy: item.raisedBy,
        RaisedDate: item.raisedDate,
        action: <View className="flex flex-row justify-start text-blue-400  w-11/12 ">
        <Text className="text-base ">Status: </Text>
        <DynamicMenu
            onDataReceived={handleDataReceived1}
            options={[
                {
                    option: "Status 1",
                    value: "4322",
                },
                {
                    option: "Status 2",
                    value: "4321",
                },
                {
                    option: "Status 3",
                    value: "4320",
                },
            ]}
            apiUrl="sip"
        />
        
    </View>
    }));

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
                        {item?.folio ? item?.folio : "-"}
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
                key: "raisedBy",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.raisedBy}
                    </Text>
                ),
            },
            {
                key: "raisedDate",
                content: (
                    <Text selectable className="text-[#686868] font-semibold">
                        {item?.raisedDate}
                    </Text>
                ),
            },
            {
                key: "Actions",
                content: (
                    <View className="flex flex-row justify-start text-[#686868] font-semibold w-11/12 ">
                        <DynamicMenu
                            onDataReceived={handleDataReceived1}
                            options={[
                                {
                                    option: "Status 1",
                                    value: "4322",
                                },
                                {
                                    option: "Status 2",
                                    value: "4321",
                                },
                                {
                                    option: "Status 3",
                                    value: "4320",
                                },
                            ]}
                            apiUrl="sip"
                        />
                    </View>
                ),
            },
        ];

        return itemStructure;
    });

    return (
        <View className="h-screen">

                <View className="bg-white">
                    <View className="">
                        <TableBreadCrumb name={"Requests"} />
                    </View>
                    <View className="border-[0.2px]  border-[#e4e4e4]">
                    {data.length !== 0 &&
                        <DynamicFilters
                            appliedSorting={appliedSorting}
                            setAppliedSorting={setAppliedSorting}
                            sorting={sorting}
                            fileName="Folio"
                            downloadApi={"folio/download-report"}
                            schemaResponse={filtersSchema}
                            setCurrentPageNumber={setCurrentPageNumber}
                            getList={getDataList}
                            appliedFilers={appliedFilers}
                            setAppliedFilers={setAppliedFilers}
                        />
                    }

                        {!isLoading ? (
                             data.length === 0 ? (
                                <NoDataAvailable />
                            ) : (
                            <ScrollView className={"mt-4 z-[-1] "}>
                                {width < 830 ? (
                                    <TableCard data={mobileData} />
                                ) : (
                                    <DataTable
                                        headers={[
                                            "Client Name",
                                            "Folio No.",
                                            "Client Code",
                                            "Request raised by",
                                            "Request raised date",
                                            "Actions",
                                        ]}
                                        cellSize={[2, 1, 1, 1, 2, 2]}
                                        rows={transformedData}
                                    />
                                )}
                            </ScrollView>
                            )
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
                    {data.length !== 0 &&
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        getDataList={getDataList}
                        currentPageNumber={currentPageNumber}
                        totalPages={totalPages}
                        setCurrentPageNumber={setCurrentPageNumber}
                    />
}
                </View>

        </View>
    );
};

export default ARNRequest;
