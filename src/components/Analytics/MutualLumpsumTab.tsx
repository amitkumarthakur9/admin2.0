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
import MutualLumpsumAccordion from "./MutualLumpsumAccordion";

const nestedData = {
  id: 1,
  rmList: [
      {
          rmName: "Swarnava Ghosh",
          lumpAmount: "1,00,000",
          lumpCount: "100",
          ifalist: [
              {
                  ifaName: "PRAMOD R BHARTIYA",
                  lumpCount: "60",
                  lumpAmount: "60,000",
                  
                  clientList: [
                      {
                          id: "149645",
                          name: "Varsha Pramod",
                          scheme: "KOTAK FLEXICAP FUND - GROWTH",
                          amount: "60000",
                       
                          transactionDate: "02/05/2024",
                          startDate: "03/04/2024",
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
                  ifaName: "Avijit Kar",
                  lumpCount: "40",
                  lumpAmount: "40,000",
                  
                  clientList: [
                      {
                          id: "134629",
                          name: "SUKUMAR MAITY",
                          scheme: "ICICI PRUDENTIAL LARGE AND MID CAP FUND - GROWTH",
                          amount: "20000",
                    
                          transactionDate: "24/02/23",
                          startDate: "24/01/23",
                     
                      },
                      {
                          id: "150574",
                          name: "SANJOY RAY",
                          scheme: "SBI INFRASTRUCTURE FUND REGULAR PLAN - GROWTH",
                          amount: "20000",
                     
                          transactionDate: "24/02/23",
                          startDate: "24/01/23",
                    
                      
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
        rmName: "Rohan Soans",
        lumpAmount: "1,00,000",
        lumpCount: "100",
        ifalist: [
            {
                ifaName: "Gajanana Rao ",
                lumpCount: "60",
                lumpAmount: "60,000",
                
                clientList: [
                    {
                        id: "149645",
                        name: "Varsha Bharatiya",
                        scheme: "KOTAK FLEXICAP FUND - GROWTH",
                        amount: "60000",
                     
                        transactionDate: "02/05/2024",
                        startDate: "03/04/2024",
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
                ifaName: "Mohit Jacob",
                lumpCount: "40",
                lumpAmount: "40,000",
                
                clientList: [
                    {
                        id: "134629",
                        name: "SUKUMAR MAITY",
                        scheme: "ICICI PRUDENTIAL LARGE AND MID CAP FUND - GROWTH",
                        amount: "20000",
                  
                        transactionDate: "24/02/23",
                        startDate: "24/01/23",
                   
                    },
                    {
                        id: "150574",
                        name: "SANJOY RAY",
                        scheme: "SBI INFRASTRUCTURE FUND REGULAR PLAN - GROWTH",
                        amount: "20000",
                   
                        transactionDate: "24/02/23",
                        startDate: "24/01/23",
                    
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

  ],
  rmTotal: {
    lumpCount: "200",
    lumpAmount: "2,00,000",
      
  },
};


const MutualLumpsumTab = () => {
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
                 
                        <View className={"mt-4 z-[-1] min-h-[500]"}>
                            <MutualLumpsumAccordion data={nestedData} />
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
        </View>
    );
};

export default MutualLumpsumTab;
