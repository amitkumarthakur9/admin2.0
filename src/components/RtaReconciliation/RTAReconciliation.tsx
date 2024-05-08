import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import RemoteApi from "../../services/RemoteApi";
import { RTAReconciliationRows } from "./RTAReconciliationRows";
import { Pagination } from "../Pagination/Pagination";
import {
    Box,
    Button,
    CheckIcon,
    HStack,
    Heading,
    Pressable,
    Select,
    Spinner,
} from "native-base";
import {
    RTAReconcilation,
    RTAResponseResponseInterface,
} from "../../interfaces/RTAResponseInterface";
import DatePickerNew from "../CustomDatePicker/DatePickerNew";
import CalendarPicker from "../CustomDatePicker/CalendarPicker";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { TableBreadCrumb } from "../BreadCrumbs/TableBreadCrumb";
import { Cards } from "./Cards";
import NoDataAvailable from "../Others/NoDataAvailable";

const RTAReconciliation = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [data, setData] = useState<RTAReconcilation[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [appliedFilers, setAppliedFilers] = useState([]);
    const [filtersSchema, setFiltersSchema] = useState([]);
    const [service, setService] = React.useState("");
    const [date, setDate] = React.useState<any>(undefined);
    const [sorting, setSorting] = useState([]);
    const [appliedSorting, setAppliedSorting] = useState({
        key: "",
        direction: "",
    });
    const { height, width } = useWindowDimensions();

    const [params, setParams] = useState(
        useLocalSearchParams<{ holdingId?: string }>()
    );
    // console.log('params', params);

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

        if (params?.holdingId) {
            const checkIfHoldingIdExist = data.filters.find(
                (filter) => filter.key == "holdingId"
            );
            if (!checkIfHoldingIdExist) {
                // console.log('inside---');

                data.filters.push({
                    key: "holdingId",
                    operator: "eq",
                    value: Number(params.holdingId),
                });
            }
        }

        if (appliedSorting.key != "") {
            data.orderBy = appliedSorting;
        }

        const response: RTAResponseResponseInterface = await RemoteApi.post(
            "transaction/list",
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
            const response: any = await RemoteApi.get("transaction/schema");
            setFiltersSchema(response);
            setSorting(response?.sort);
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
                <TableBreadCrumb name={"Transactions"} />
            </View>
            <View className="h-screen">

        
                <>
            <View className="border-[0.2px]  border-[#e4e4e4]">
            {data.length !== 0 &&
                <DynamicFilters
                    appliedSorting={appliedSorting}
                    setAppliedSorting={setAppliedSorting}
                    sorting={sorting}
                    fileName="Transaction"
                    downloadApi={"transaction/download-report"}
                    schemaResponse={filtersSchema}
                    setCurrentPageNumber={setCurrentPageNumber}
                    getList={getDataList}
                    appliedFilers={appliedFilers}
                    setAppliedFilers={setAppliedFilers}
                />
}
                {!isLoading ? (
                     data.length === 0
                        ? (
                            <NoDataAvailable />
                        ) : (
                    <View className={"mt-4 z-[-1] "}>
                        {width < 830 ? (
                            <Cards
                                data={data}
                                schema={null}
                                getDataList={getDataList}
                            />
                        ) : (
                            <RTAReconciliationRows
                                getDataList={getDataList}
                                data={data}
                                schema={filtersSchema}
                            />
                        )}
                    </View>
                        )
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

export default RTAReconciliation;
