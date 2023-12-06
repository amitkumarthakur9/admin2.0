import { useEffect, useRef, useState } from "react";
import { Dimensions, Text, TextInput, View } from "react-native"
import { TouchableRipple } from "react-native-paper";
import FilterForm from "../../helper/AllFilters";
import { Badge, Box, Button, CheckIcon, Divider, Menu, Modal, Popover, Pressable, Select, Spinner, Tooltip, VStack, ZStack, useToast, } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ToastAlert } from "../../helper/CustomToaster";
import RemoteApi from "../../services/RemoteApi";
import ExtraFilters from "../../helper/ExtraFilters";

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

    const handleLayout = (event) => {
        console.log(event);
        console.log({ ...event.nativeEvent.layout });
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
        console.log('newArray', newArray);

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
        handleFilterChange("all", e?.target?.value, "contains")
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
                height={5}
                width={5}
                colorScheme="danger" rounded="full" variant="solid" alignSelf="flex-end" _text={{
                    fontSize: 12,
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

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Check if the click was outside the component
            if (outsideClickRef.current && !outsideClickRef.current.contains(event.target)) {
                console.log('Clicked outside the component!');
                setFilterOpen(false)
                // Your logic for handling the click outside
            }
        };

        // Add event listener for clicks
        document.addEventListener('click', handleOutsideClick);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);


    const getCounts = () => {
        let count = 0;;

        filtersSchema.forEach(obj2 => {
            const existsInArr1 = filterValues.some(obj1 => obj1.key === obj2.key && obj1.key !== "all");

            if (existsInArr1) {
                count++;
            }
        });

        return count
    }


    return <View className="flex flex-row justify-between items-center mt-5 w-100">
        <View className='flex flex-row w-10/12 justify-start items-center' style={{}}>
            <Pressable onPress={handleSearchBoxClick} className="flex flex-row justify-start items-center mx-2 w-6/12 border-[1px] rounded border-slate-200">
                {/* <View className="flex flex-row items-center w-full "> */}
                <View className="w-0.6/12 flex flex-row items-center justify-center">

                    <Icon name="search" style={{}} size={14} color="#484848" />

                </View>
                <TextInput
                    ref={searchBoxRef}
                    className='outline-transparent w-9/12'
                    placeholder={searchPlaceholder(50)}
                    underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholderTextColor={"#484848"}
                    cursorColor={"transparent"}
                    style={searchInputStyle}
                    onChange={handleSearchInput}
                    value={filterValues.find((filter) => filter.key === "all")?.value || ""}
                    onKeyPress={handleKeyPress}

                />

                <View className="w-3/12 justify-end items-end pr-2">
                    {
                        filterValues.find((filter) => filter.key === "all")?.value && <Button onPress={applyFilters} width={20} size={"xs"} bgColor={"#000000"}>
                            Search
                        </Button>
                    }
                </View>
                {/* </View> */}


            </Pressable>
            <View className="mr-2">
                <Pressable style={{ position: "relative" }} onPress={() => setFilterOpen(true)} className={"flex flex-row justify-center items-center border-[1px] rounded px-4 py-3 border-slate-200 " + (filterOpen ? "bg-zinc-100" : "")} accessibilityLabel="More options menu">
                    <Icon name="filter" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />

                    <Text className="mr-1">Filters</Text>
                    {
                        determineDisplayValue()
                    }
                </Pressable>

                {/* <Modal style={position} flex={1} useRNModal={true} shadow={"rgba(0, 0, 0, 0.29) 0px 3px 4.65px"} isOpen={filterOpen} onClose={() => setFilterOpen(false)} _backdrop={{
                    _dark: {
                        bg: "coolGray.800"
                    },
                    bg: "transparent"
                }}> */}
                {filterOpen && <View>
                    <Box className="" width={550} ref={outsideClickRef} style={position}>
                        <View style={{
                            backgroundColor: "white",
                            elevation: 3, // Android shadow
                            shadowColor: 'rgba(0, 0, 0, 0.29)',
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 1,
                            shadowRadius: 4.65,
                            borderRadius: 10
                        }}>
                            <View className='p-2' style={{ backgroundColor: "white", }}>
                                <View className='mb-4 flex flex-row justify-between'>
                                    <Text selectable className='font-semibold'>Advance Filters</Text>
                                    <TouchableRipple rippleColor={"#e4e4e4"} onPress={clearFilters}>
                                        <Text selectable className='text-xs underline underline-offset-4'>clear</Text>
                                    </TouchableRipple>
                                </View>
                                <FilterForm removeFilter={removeFilter} filtersSchema={filtersSchema} onFilterChange={handleFilterChange} filterValues={filterValues} />
                            </View>
                            <View className='bg-[#000000]' style={{ borderRadius: 5 }}>
                                <TouchableRipple className='py-3' onPress={applyFilters}>
                                    <View className='flex flex-row justify-center items-center'>
                                        <Text selectable className='text-center text-sm mr-2 text-white'>Apply Filters</Text>
                                        <Icon name="filter" size={15} color="#ffffff" />
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </Box>
                </View>
                }





                {/* </Modal> */}
            </View>
            <View>
                <Menu w="md" onClose={() => setSortingOpen(false)} onOpen={() => { setSortingOpen(true), setFilterOpen(false) }} isOpen={sortingOpen} bgColor={"white"} placement="bottom" closeOnSelect={false} trigger={triggerProps => {
                    return <Pressable className={"flex flex-row justify-center items-center border-[1px] rounded px-4 py-3 border-slate-200 " + (sortingOpen ? "bg-zinc-100" : "")} accessibilityLabel="More options menu" {...triggerProps}>
                        <Icon name="sort" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />
                        <Text className="mr-1">Sorting</Text>
                        {
                            appliedSorting.key && appliedSorting.direction && <Badge
                                height={5}
                                width={5}
                                colorScheme="danger" rounded="full" variant="solid" alignSelf="flex-end" _text={{
                                    fontSize: 12,
                                }}>
                                {1}
                            </Badge>
                        }
                    </Pressable>
                }}>
                    <Menu.Item bgColor={"white"} cancelable={false}>
                        <View className="flex flex-col">
                            {appliedSorting.key && <View className="flex flex-row-reverse mb-2">
                                <TouchableRipple rippleColor={"#e4e4e4"} onPress={() => setAppliedSorting({ key: "", direction: "" })}>
                                    <Text selectable className='text-xs underline underline-offset-4'>clear</Text>
                                </TouchableRipple>
                            </View>}
                            <View className="flex flex-row">
                                <View className="mr-2">
                                    <Select
                                        dropdownIcon={<Icon style={{ marginRight: 4 }} name="angle-down" size={18} />}
                                        selectedValue={appliedSorting.key}
                                        minWidth="200"
                                        accessibilityLabel="By"
                                        placeholder="By"
                                        _selectedItem={{
                                            bg: "teal.600",
                                            endIcon: <CheckIcon size="5" />
                                        }} mt={1}
                                        onValueChange={itemValue => handleSortingChange(itemValue, 'key')}>
                                        {
                                            sorting.map((sort, index) => <Select.Item label={sort.title} value={sort.key} />)
                                        }
                                    </Select>
                                </View>
                                <View>
                                    {
                                        appliedSorting.key != "" && <Select
                                            dropdownIcon={<Icon style={{ marginRight: 4 }} name="angle-down" size={18} />}
                                            selectedValue={appliedSorting.direction}
                                            minWidth="200"
                                            accessibilityLabel="Direction"
                                            placeholder="Direction"
                                            _selectedItem={{
                                                bg: "teal.600",
                                                endIcon: <CheckIcon size="5" />
                                            }} mt={1} onValueChange={itemValue => handleSortingChange(itemValue, 'direction')}>
                                            {
                                                sorting.find((sort, index) => sort.key == appliedSorting.key)?.direction?.map((direc, index) => <Select.Item label={direc.displayString} value={direc.value} />)
                                            }

                                        </Select>
                                    }
                                </View>
                            </View>

                        </View>

                    </Menu.Item>
                </Menu>
            </View>
            {
                schemaResponse?.fastFilter && <ExtraFilters filtersSchema={schemaResponse?.fastFilter} onFilterChange={handleExtraFilterChange} filterValues={filterValues} removeFilter={removeFilter} />
            }
            {/* <View>
                <Pressable className="flex flex-row items-center" onPress={() => setShowFilterModal(true)}>
                    <Icon name="filter" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />
                    <Text>Filter</Text>
                </Pressable>
                <Modal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} _backdrop={{
                    _dark: {
                        bg: "coolGray.800"
                    },
                    bg: "transaparent"
                }}>
                    <Modal.Content maxWidth="600" maxH="612" bgColor={"white"}>
                        <View className="">
                            <View className='p-2'>
                                <View className='mb-4 flex flex-row justify-between'>
                                    <Text selectable className='font-semibold'>Advance Filters</Text>
                                    <TouchableRipple rippleColor={"#e4e4e4"} onPress={clearFilters}>
                                        <Text selectable className='text-xs underline underline-offset-4'>clear</Text>
                                    </TouchableRipple>
                                </View>
                                <FilterForm filtersSchema={filtersSchema} onFilterChange={handleFilterChange} filterValues={filterValues} />
                            </View>
                            <View className='bg-[#000000] rounded-lg'>
                                <TouchableRipple className='py-3' onPress={applyFilters}>
                                    <View className='flex flex-row justify-center items-center'>
                                        <Text selectable className='text-center text-sm mr-2 text-white'>Apply Filters</Text>
                                        <Icon name="filter" size={15} color="#ffffff" />
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </Modal.Content>
                </Modal>
            </View> */}
        </View>
        <View className="flex flex-row w-2/12 justify-end items-center">
            {/* <Pressable marginRight={4} onPress={downloadReport} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                {
                    isDownloadProcessing ? <Spinner color={"white"} size={14} accessibilityLabel="Loading" /> : <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                }
            </Pressable> */}
            {/* <Pressable onPress={downloadReport} className="flex flex-row justify-center items-center bg-black border-[1px] rounded px-[40px] py-3 border-slate-200 mr-2">
                {
                    isDownloadProcessing ? <Spinner color={"white"} size={14} accessibilityLabel="Loading" /> : <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                }
            </Pressable> */}
            <Pressable onPress={downloadReport} className={"flex flex-row justify-center items-center border-[1px] rounded px-4 py-3 border-slate-200 mr-2"} accessibilityLabel="Download">
                {
                    isDownloadProcessing ? <Spinner color={"black"} style={{ marginLeft: 10, marginRight: 5 }} size={14} accessibilityLabel="Loading" /> : <Icon name="download" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />
                }
                <Text className="mr-1">Download</Text>
            </Pressable>
        </View>

    </View>
}

const searchInputStyle = { padding: 7, fontSize: 13, borderColor: "transparent", color: "#484848", height: 40, borderWidth: 0, "outlineStyle": 'none', };
const position: any = {
    "position": "absolute",
    left: -196
}