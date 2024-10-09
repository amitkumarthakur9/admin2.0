import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
    initializeTable,
    setCurrentPageNumber,
    setTotalItems,
    setItemsPerPage,
    setData,
    setTotalPages,
    setAppliedFilers,
    setFiltersSchema,
    setSorting,
    setAppliedSorting,
    selectTableState,
    fetchData,
    fetchSchema,
} from "../../redux/slices/dataTableSlice";
import DataTable from "../DataTable/DataTable";
import TableCard from "../Card/TableCard";
import { Pagination } from "../Pagination/Pagination";
import { DynamicFilters } from "../Filters/DynamicFilters";
import { AppDispatch } from "../../redux/store";
import { Spinner } from "native-base";

const DataTableComponent = ({
    headers,
    transformData,
    endpoint,
    filtersSchemaEndpoint,
    mobileDataStructure,
    roleId,
    tableId,
    cellSize,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    // Select table state from Redux store
    const tableState = useSelector(
        (state: RootState) => state.dataTable.tables[tableId]
    );
    // Initialize the table state when the component is mounted
    useEffect(() => {
        if (!tableState) {
            dispatch(
                initializeTable({
                    tableId,
                    initialState: {
                        data: [],
                        filtersSchema: [],
                        appliedFilers: [],
                        sorting: [],
                        appliedSorting: { key: "", direction: "" },
                        totalItems: 0,
                        currentPage: 1,
                        itemsPerPage: 10,
                        isLoading: false,
                        error: null,
                    },
                })
            );
        }
    }, [dispatch, tableId, tableState]);

    // Fetch schema and apply filter schema to the state
    useEffect(() => {
        if (tableState && !tableState.filtersSchema.length) {
            dispatch(fetchSchema({ endpoint: filtersSchemaEndpoint, tableId }))
                .then((response: any) => {
                    // Set filter schema using response
                    dispatch(
                        setFiltersSchema({
                            tableId,
                            filtersSchema: response.payload.schema,
                        })
                    );
                    // Set sorting based on the schema (optional: if you get sort data from schema)
                    dispatch(
                        setSorting({
                            tableId,
                            sorting: response.payload.schema.sort,
                        })
                    );
                })
                .catch((error) => {
                    console.error("Error fetching schema:", error);
                });
        }
    }, [filtersSchemaEndpoint, tableId]);

    // Fetch data when tableState is available and required parameters change
    const fetchDataList = (updatedFilters = [], forceReload = false) => {
        const payload: any = {
            endpoint,
            tableId,
            currentPage: tableState?.currentPageNumber || 1,
            filters: updatedFilters.length
                ? updatedFilters
                : tableState?.appliedFilers || [], // Use applied filters here
            itemsPerPage: tableState?.itemsPerPage || 10,
        };

        // Conditionally include `orderBy` only when sorting is applied
        if (
            tableState.appliedSorting.key != "" &&
            tableState?.appliedSorting?.direction != ""
        ) {
            payload.sorting = tableState.appliedSorting;
        }

        console.log("fetchdata sorting:", tableState.appliedSorting);
        console.log("fetchdata payload:", payload);
        dispatch(fetchData(payload));
    };

    const applySorting = (sorting) => {
        if (sorting.key && sorting.direction === "") {
        } else {
            dispatch(setAppliedSorting({ tableId, appliedSorting: sorting }));
        }
    };

    useEffect(() => {
        if (tableState && !tableState.isLoading) {
            fetchDataList();
        }
    }, [
        dispatch,
        endpoint,
        tableId,
        tableState?.currentPageNumber,
        tableState?.appliedFilers,
        // tableState?.sorting,
        tableState?.appliedSorting,
        tableState?.itemsPerPage,
    ]);

    // Transform the data only if tableState and data are available
    const transformedData = tableState?.data
        ? transformData(tableState?.data)
        : [];

    if (!tableState?.filtersSchema || !tableState?.sorting.length) {
        return <Spinner />;
    }

    if (tableState?.isSchemaLoading) {
        return <Spinner />;
    }

    if (tableState?.isDataLoading) {
        return <Spinner />;
    }

    return (
        <View className="h-screen bg-white">
            <DynamicFilters
                appliedSorting={tableState?.appliedSorting}
                setAppliedSorting={applySorting}
                sorting={tableState?.sorting}
                schemaResponse={tableState?.filtersSchema}
                setCurrentPageNumber={(page) =>
                    dispatch(
                        setCurrentPageNumber({
                            tableId,
                            currentPageNumber: page,
                        })
                    )
                }
                appliedFilers={tableState?.appliedFilers}
                setAppliedFilers={(filters) =>
                    dispatch(
                        setAppliedFilers({ tableId, appliedFilers: filters })
                    )
                }
                getList={fetchDataList}
                downloadApi={""} // Optional: pass a download API endpoint if needed
                fileName={"data_export"} // Optional: provide a file name for exported data
                newComponent={null} // Optional: pass a custom component
            />

            <ScrollView className="mt-4 z-[-1]">
                <DataTable
                    headers={headers}
                    rows={transformedData}
                    cellSize={cellSize}
                />
            </ScrollView>

            <Pagination
                currentPageNumber={tableState?.currentPageNumber}
                setCurrentPageNumber={(page) =>
                    dispatch(
                        setCurrentPageNumber({
                            tableId,
                            currentPageNumber: page,
                        })
                    )
                }
                totalItems={tableState?.totalItems}
                itemsPerPage={tableState?.itemsPerPage}
                setItemsPerPage={(items) =>
                    dispatch(setItemsPerPage({ tableId, itemsPerPage: items }))
                }
                // getDataList={fetchDataList}
            />
        </View>
    );
};

export default DataTableComponent;
