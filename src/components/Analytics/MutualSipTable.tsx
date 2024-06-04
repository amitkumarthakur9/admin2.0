// App.js
import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import MutualSipAccordion from "./MutualSipAccordion";
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

const nestedData = {
  id: 1,
  rmList: [
      {
          rmName: "Harish",
          liveSip: "100",
          liveAmount: "1,00,000",
          cancelledSip: "5",
          cancelledAmount: "50,000",
          failedSip: "2",
          failedAmount: "20,000",
          ifalist: [
              {
                  ifaName: "Ritish",
                  liveSip: "60",
                  liveAmount: "60,000",
                  cancelledSip: "3",
                  cancelledAmount: "30,000",
                  failedSip: "1",
                  failedAmount: "10,000",
                  clientList: [
                      {
                          id: "234456",
                          name: "client 1",
                          scheme: "Axis",
                          amount: "1000",
                          status: "cancelled",
                          transactionDate: "24/01/23",
                          startDate: "24/01/22",
                          cancelledDate: "25/01/23",
                      },
                  ],
                  clientTotal: {
                      liveSip: "60",
                      liveAmount: "60,000",
                      cancelledSip: "3",
                      cancelledAmount: "30,000",
                      failedSip: "1",
                      failedAmount: "10,000",
                  },
              },
              {
                  ifaName: "Raju",
                  liveSip: "40",
                  liveAmount: "40,000",
                  cancelledSip: "2",
                  cancelledAmount: "20,000",
                  failedSip: "1",
                  failedAmount: "10,000",
                  clientList: [
                      {
                          id: "234457",
                          name: "client 2",
                          scheme: "Axis",
                          amount: "1000",
                          status: "cancelled",
                          transactionDate: "24/01/23",
                          startDate: "24/01/22",
                          cancelledDate: "25/01/23",
                      },
                      {
                          id: "234458",
                          name: "client 3",
                          scheme: "Axis",
                          amount: "1000",
                          status: "cancelled",
                          transactionDate: "24/01/23",
                          startDate: "24/01/22",
                          cancelledDate: "25/01/23",
                      },
                  ],
                  clientTotal: {
                      liveSip: "40",
                      liveAmount: "40,000",
                      cancelledSip: "2",
                      cancelledAmount: "20,000",
                      failedSip: "1",
                      failedAmount: "10,000",
                  },
              },
          ],
          ifaTotal: {
              liveSip: "100",
              liveAmount: "1,00,000",
              cancelledSip: "5",
              cancelledAmount: "50,000",
              failedSip: "2",
              failedAmount: "20,000",
          },
      },
      {
          rmName: "Manoj",
          liveSip: "105",
          liveAmount: "1,05,000",
          cancelledSip: "4",
          cancelledAmount: "40,000",
          failedSip: "1",
          failedAmount: "10,000",
          ifalist: [
              {
                  ifaName: "Bajirao",
                  liveSip: "65",
                  liveAmount: "65,000",
                  cancelledSip: "3",
                  cancelledAmount: "30,000",
                  failedSip: "1",
                  failedAmount: "10,000",
                  clientList: [
                      {
                          id: "234459",
                          name: "client 4",
                          scheme: "Axis",
                          amount: "1000",
                          status: "cancelled",
                          transactionDate: "24/01/23",
                          startDate: "24/01/22",
                          cancelledDate: "25/01/23",
                      },
                  ],
                  clientTotal: {
                      liveSip: "65",
                      liveAmount: "65,000",
                      cancelledSip: "3",
                      cancelledAmount: "30,000",
                      failedSip: "1",
                      failedAmount: "10,000",
                  },
              },
              {
                  ifaName: "Mastani",
                  liveSip: "40",
                  liveAmount: "40,000",
                  cancelledSip: "1",
                  cancelledAmount: "10,000",
                  failedSip: "0",
                  failedAmount: "0",
                  clientList: [
                      {
                          id: "234460",
                          name: "client 5",
                          scheme: "Axis",
                          amount: "1000",
                          status: "cancelled",
                          transactionDate: "24/01/23",
                          startDate: "24/01/22",
                          cancelledDate: "25/01/23",
                      },
                  ],
                  clientTotal: {
                      liveSip: "40",
                      liveAmount: "40,000",
                      cancelledSip: "1",
                      cancelledAmount: "10,000",
                      failedSip: "0",
                      failedAmount: "0",
                  },
              },
          ],
          ifaTotal: {
              liveSip: "105",
              liveAmount: "1,05,000",
              cancelledSip: "4",
              cancelledAmount: "40,000",
              failedSip: "1",
              failedAmount: "10,000",
          },
      },
  ],
  rmTotal: {
      liveSip: "205",
      liveAmount: "2,05,000",
      cancelledSip: "9",
      cancelledAmount: "90,000",
      failedSip: "3",
      failedAmount: "30,000",
  },
};






const MutualSipTable = () => {
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
    const [expanded, setExpanded] = useState(false);
    const handleAccordion = () => {

        setExpanded(!expanded);
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

    const transformedData = nestedData.rmList?.map((item) => {
        return 
        {
            rmRow: [
                {
                    key: "rm",
                    content: (
                        <Text selectable className="text-[#686868] font-semibold">
                            {item?.rmName ? item?.rmName : "-"}
                        </Text>
                    ),
                },
                {
                    key: "rm",
                    content: (
                        <Text selectable className="text-[#686868] font-semibold">
                            {item?.liveSip ? item?.liveSip : "-"}
                        </Text>
                    ),
                },
                {
                    key: "investedAmount",
                    content: (
                        <Text selectable className="text-[#686868] font-semibold">
                            {item?.liveAmount
                                ? RupeeSymbol + item?.liveAmount
                                : "-"}
                        </Text>
                    ),
                },
                {
                    key: "rm",
                    content: (
                        <Text selectable className="text-[#686868] font-semibold">
                            {item?.cancelledSip ? item?.cancelledSip : "-"}
                        </Text>
                    ),
                },
                {
                    key: "currentAmount",
                    content: (
                        <Text selectable className="text-[#686868] font-semibold">
                            {item?.cancelledAmount
                                ? RupeeSymbol + item?.cancelledAmount
                                : "-"}
                        </Text>
                    ),
                },
                {
                    key: "rm",
                    content: (
                        <Text selectable className="text-[#686868] font-semibold">
                            {item?.failedSip ? item?.failedSip : "-"}
                        </Text>
                    ),
                },
                {
                    key: "currentAmount",
                    content: (
                        <Text selectable className="text-[#686868] font-semibold">
                            {item?.failedAmount
                                ? RupeeSymbol + item?.failedAmount
                                : "-"}
                        </Text>
                    ),
                },
                {
                    key: "detail",
                    content: (
                        <View className="flex w-10/12 justify-center">
                            <Pressable
                            onPress={() =>
                                handleAccordion
                            }
                        >
                            {!expanded ? (
                            <Icon name="caret-down" size={16} />
                        ) : (
                            <Icon name="caret-up" size={16} />
                        )}
                        </Pressable>
        
                        </View>
        
                    ),
                },
            ];

        }

        
    });

    return (
        <View className="h-screen">
            <View className="bg-white">
                {/* <View className="">
        <TableBreadCrumb name={"Client Wise"} />
    </View> */}
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
                        // data.length === 0 ? (
                        //     <NoDataAvailable />
                        // ) : (
                        // <ScrollView className={"mt-4 z-[-1] "}>
                        <ScrollView className={"mt-4 z-[-1] "}>
                            <DataTable
                                headers={[
                                    "RM Name",
                                    "Live SIP Count",
                                    "Live SIP Amount",
                                   
                                    "Cancelled SIP Count",
                                    "Cancelled SIP Amount",
                                    "Transaction Failed SIP Count",
                                    "Transaction Failed SIP Amount",
                                    "",
                                 
                                ]}
                                cellSize={[2, 1, 2, 1, 2,1,2, 1]}
                                rows={transformedData}
                            />
{expanded &&
                        <DataTable
                        headers={[
                            "RM Name",
                            "Live SIP Count",
                            "Live SIP Amount",
                           
                            "Cancelled SIP Count",
                            "Cancelled SIP Amount",
                            "Transaction Failed SIP Count",
                            "Transaction Failed SIP Amount",
                            "",
                         
                        ]}
                        cellSize={[2, 1, 2, 1, 2,1,2, 1]}
                        rows={transformedData}
                    />
                    }

                        </ScrollView>
                        
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
        </View>
    );
};

export default MutualSipTable;
