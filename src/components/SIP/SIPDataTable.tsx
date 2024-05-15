import * as React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { ActivityIndicator, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router";
import { useState } from "react";
import { OrderInterface } from "../../interfaces/OrderInterface";
import RemoteApi from "../../services/RemoteApi";
import { OrdersResponse } from "../../interfaces/OrdersResposeInterface";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { SIPRows } from "./SIPRows";
import { Pagination } from "../Pagination/Pagination";
import { HStack, Heading, Spinner } from "native-base";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { MobileSIPRows } from "./MobileSIPRows";
import NoDataAvailable from "../Others/NoDataAvailable";
import { useUserRole } from "../..//context/useRoleContext";

const SIPDataTable = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { roleId } = useUserRole();
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<SIPReportItems[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { height, width } = useWindowDimensions();

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

        const response: SIPResponseInterface = await RemoteApi.post(
            "sip/list",
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
            const response: any = await RemoteApi.get("sip/schema");
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

    return (
        <View className="bg-white">
            <View className="">
                <TableBreadCrumb name={"SIP Reports"} />
            </View>
            <View className="h-screen">

        
                <>
            <View className="border-[0.2px]  border-[#e4e4e4]">
            {/* {data.length !== 0 && */}
                <DynamicFilters
                    appliedSorting={appliedSorting}
                    setAppliedSorting={setAppliedSorting}
                    sorting={sorting}
                    fileName="SIP"
                    downloadApi={"sip/download-report"}
                    schemaResponse={filtersSchema}
                    setCurrentPageNumber={setCurrentPageNumber}
                    getList={getDataList}
                    appliedFilers={appliedFilers}
                    setAppliedFilers={setAppliedFilers}
                />
            {/* } */}
                {!isLoading ? (
                    //  data.length === 0
                    //     ? (
                    //         <NoDataAvailable />
                    //     ) : (
                    <ScrollView className="mt-4 z-[-1]">
                        {width < 830 ? (
                            <MobileSIPRows data={data} schema={null} />
                        ) : (
                            <SIPRows data={data} schema={null} />
                        )}
                    </ScrollView>
                    // )
                
                ) : (
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
            </>
   
        </View>
        </View>
    );
};

export default SIPDataTable;
