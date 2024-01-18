import { useEffect, useRef, useState } from "react";
import { Dimensions, Platform, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native"
import { TouchableRipple } from "react-native-paper";
import FilterForm from "../../helper/AllFilters";
import { Actionsheet, Badge, Box, Button, CheckIcon, Divider, Menu, Modal, Popover, Pressable, Select, Spinner, Tooltip, VStack, ZStack, useToast, } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ToastAlert } from "../../helper/CustomToaster";
import RemoteApi from "../../services/RemoteApi";
import ExtraFilters from "../../helper/ExtraFilters";
import { FilterPopup } from "./FilterPopup";
import { FilterActionSheet } from "./FilterActionSheet";
import { SortingPopup } from "./SortingPopup";
import { SortingSheet } from "./SortingSheet";

export const DynamicFilters = ({ schemaResponse, setAppliedSorting, appliedSorting, sorting = [], setCurrentPageNumber, getList, appliedFilers, setAppliedFilers, downloadApi = "", fileName = "" }) => {
    const filtersSchema = schemaResponse.filters
    const [modalVisible, setModalVisible] = useState(false);
    const searchBoxRef = useRef(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortingOpen, setSortingOpen] = useState(false);
    const [filterValues, setFilterValues] = useState([]);
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const toast = useToast();
    const [elementPosition, setElementPosition] = useState<any>({});
    const outsideClickRef = useRef(null);
    const { height, width } = useWindowDimensions();

    const handleLayout = (event) => {
        // console.log(event);
        // console.log({ ...event.nativeEvent.layout });
        setElementPosition({ ...event.nativeEvent.layout });
    };

    const handleSearchBoxClick = () => {
        // Use the current property of the ref to access the input element
        if (searchBoxRef.current) {
            searchBoxRef.current.focus();
        }
    };

    const clearFilters = () => {
        setFilterOpen(false)
        const updatedFilterValues = filterValues.map((filter) => ({
            ...filter,
            value: "",
            operator: "",
        }));
        setFilterValues(updatedFilterValues);
        setAppliedFilers([])
        setFilterValues([])
        getList([], true)
    }

    useEffect(() => {
        if (filterValues.find((filter) => filter.key === "all")?.value?.length == 0) {
            let removedAllFilters = filterValues.filter(obj => obj.key !== 'all');
            removedAllFilters = removedAllFilters.filter((filter) => {
                return (filter.value != null && filter.value !== '' && filter.operator) ||
                    (Array.isArray(filter.value) && filter.value.length > 0 && filter.operator);
            });

            setAppliedFilers(removedAllFilters)
            setFilterValues(removedAllFilters)
            setModalVisible(!modalVisible)
            setCurrentPageNumber(1)
            getList(removedAllFilters, true)
        }
    }, [filterValues.find((filter) => filter.key === "all")?.value])

    const removeFilter = (key) => {
        const newArray = filterValues.filter(obj => obj.key !== key);
        // console.log('newArray', newArray);

        setFilterValues([...newArray])
    }

    const handleFilterChange = (key, value, operator) => {
        const newFilter = { key, value, operator };
        const existingIndex = filterValues.findIndex((filter) => filter.key === key);
        const filterV = [...filterValues]
        if (existingIndex !== -1) {
            filterV[existingIndex] = newFilter;
        } else {
            filterV.push(newFilter);
        }
        setFilterValues([...filterV]);

    };

    const handleExtraFilterChange = (key, value, operator) => {
        const newFilter = { key, value, operator, };
        const existingIndex = filterValues.findIndex((filter) => filter.key === key);
        const filterV = [...filterValues]
        if (existingIndex !== -1) {
            filterV[existingIndex] = newFilter;
        } else {
            filterV.push(newFilter);
        }
        const updatedFilterValues = filterV.filter((filter) => {
            return (filter.value != null && filter.value !== '' && filter.operator) ||
                (Array.isArray(filter.value) && filter.value.length > 0 && filter.operator);
        });
        setAppliedFilers(updatedFilterValues)
        setFilterValues(updatedFilterValues)
        setCurrentPageNumber(1)
        getList(updatedFilterValues, true)
    };

    const applyFilters = () => {
        setFilterOpen(false)
        const updatedFilterValues = filterValues.filter((filter) => {
            return (filter.value != null && filter.value !== '' && filter.operator) ||
                (Array.isArray(filter.value) && filter.value.length > 0 && filter.operator);
        });
        setAppliedFilers(updatedFilterValues)
        setFilterValues(updatedFilterValues)
        setModalVisible(!modalVisible)
        setCurrentPageNumber(1)
        getList(updatedFilterValues, true)
    }

    const handleSearchInput = (e) => {
        // console.log("text", e);

        handleFilterChange("all", e, "contains")
    }

    const downloadReport = async () => {
        setIsDownloadProcessing(true)
        let data: any = { filters: appliedFilers }

        if (appliedSorting.key != "") {
            data['orderBy'] = appliedSorting
        }

        const response: any = await RemoteApi.downloadFile({ endpoint: downloadApi, fileName: fileName, data: data });
        setIsDownloadProcessing(false)
    }

    const handleSortingChange = (e, name) => {
        // console.log(e);
        setAppliedSorting((prevSelectSorting) => ({
            ...prevSelectSorting,
            [name]: e,
        }));
    }

    const determineDisplayValue = () => {
        let count = 0;

        filtersSchema?.forEach(obj2 => {
            const existsInArr1 = appliedFilers?.some(obj1 => obj1.key === obj2.key && obj1.key !== "all");

            if (existsInArr1) {
                count++;
            }
        });

        if (count > 0) {
            return <Badge
                // height={"5%"}
                // width={"5%"}
                colorScheme="danger" rounded="full" variant="solid" alignSelf="flex-end" _text={{
                    fontSize: 8,
                }}>
                {count}
            </Badge>
        }

        return;
    };

    const handleKeyPress = (event) => {

        if (event.key === 'Enter') {
            applyFilters();
        }

    };

    const searchPlaceholder = (maxPlaceholderLength = 0) => {
        const keysToInclude = filtersSchema?.filter(obj => obj.title !== 'All' && obj.operator[0].subKey === 'contains')
            .map((obj) => obj.title);

        const resultString = keysToInclude?.join('/');

        return resultString?.length > maxPlaceholderLength && maxPlaceholderLength > 0
            ? resultString?.substring(0, maxPlaceholderLength) + '...'
            : resultString;
    }


    return <View className="flex flex-row justify-between items-center mt-5 w-100 flex-wrap">
        <View className='flex flex-row w-full justify-start items-center flex-wrap px-2' style={{}}>
            <Pressable onPress={handleSearchBoxClick} className="flex flex-row justify-start items-center w-full lg:w-[50%] border-[1px] rounded border-slate-200">
                {/* <View className="flex flex-row items-center w-full "> */}
                <View className="w-[6%] flex flex-row items-center justify-center pl-2">

                    <Icon name="search" style={{}} size={14} color="#484848" />

                </View>
                <TextInput
                    ref={searchBoxRef}
                    className='outline-transparent w-[75%] '
                    placeholder={searchPlaceholder(width < 650 ? 40 : 50)}
                    underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholderTextColor={"#484848"}
                    cursorColor={"transparent"}
                    style={{ ...searchInputStyle, overflow: "hidden", }}
                    onChangeText={handleSearchInput}
                    value={filterValues.find((filter) => filter.key === "all")?.value || ""}
                    onKeyPress={handleKeyPress}

                />

                <View className="w-[19%] justify-end items-end pr-2">
                    {
                        filterValues.find((filter) => filter.key === "all")?.value && <Button onPress={applyFilters} width={20} size={"xs"} bgColor={"#000000"}>
                            Search
                        </Button>
                    }
                </View>
                {/* </View> */}


            </Pressable>
            <View className="flex flex-row w-full lg:w-6/12 justify-between mt-2 lg:mt-0 flex-wrap">
                <View className="flex flex-row mb-1 lg:mb-0">
                    <View className="ml-0 lg:ml-1">
                        <Pressable style={{ position: "relative" }} onPress={() => setFilterOpen(!filterOpen)} className={"flex flex-row justify-center items-center border-[1px] rounded px-4 py-3 border-slate-200 " + (filterOpen ? "bg-zinc-100" : "")} accessibilityLabel="More options menu">
                            <Icon name="filter" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />

                            <Text className="mr-1">Filters</Text>
                            {
                                determineDisplayValue()
                            }
                        </Pressable>

                        {
                            width < 830 ?
                                <FilterActionSheet
                                    open={filterOpen}
                                    removeFilter={removeFilter}
                                    clearFilters={clearFilters}
                                    filtersSchema={filtersSchema}
                                    handleFilterChange={handleFilterChange}
                                    applyFilters={applyFilters}
                                    setFilterOpen={setFilterOpen}
                                    filterValues={filterValues}
                                />
                                : (filterOpen && <FilterPopup
                                    open={filterOpen}
                                    removeFilter={removeFilter}
                                    clearFilters={clearFilters}
                                    filtersSchema={filtersSchema}
                                    handleFilterChange={handleFilterChange}
                                    applyFilters={applyFilters}
                                    setFilterOpen={setFilterOpen}
                                    filterValues={filterValues}
                                />)
                        }

                    </View>
                    {
                        width < 830 ?
                            <SortingSheet setSortingOpen={setSortingOpen} setFilterOpen={setFilterOpen} sortingOpen={sortingOpen} appliedSorting={appliedSorting} setAppliedSorting={setAppliedSorting} sorting={sorting} handleSortingChange={handleSortingChange} />

                            :
                            <SortingPopup setSortingOpen={setSortingOpen} setFilterOpen={setFilterOpen} sortingOpen={sortingOpen} appliedSorting={appliedSorting} setAppliedSorting={setAppliedSorting} sorting={sorting} handleSortingChange={handleSortingChange} />

                    }
                    {
                        schemaResponse?.fastFilter && <ExtraFilters filtersSchema={schemaResponse?.fastFilter} onFilterChange={handleExtraFilterChange} filterValues={filterValues} removeFilter={removeFilter} />
                    }
                </View>
                <View className="flex flex-row lg:mt-0">

                    <Pressable onPress={downloadReport} className={"flex flex-row justify-center items-center border-[1px] rounded px-4 h-[42px] border-slate-200"} accessibilityLabel="Download">
                        {
                            isDownloadProcessing ? <Spinner color={"black"} size={14} accessibilityLabel="Loading" /> : <Icon name="download" size={14} color="#484848" />
                        }
                        {<Text className="mx-2">Download</Text>}
                    </Pressable>
                </View>
            </View>
        </View>
    </View>
}

const searchInputStyle: any = { padding: 7, fontSize: 13, borderColor: "transparent", color: "#484848", height: 40, borderWidth: 0, };
if (Platform.OS == "web") {
    searchInputStyle["outlineStyle"] = 'none'
}
