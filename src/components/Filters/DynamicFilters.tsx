import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native"
import { TouchableRipple } from "react-native-paper";
import FilterForm from "../../helper/AllFilters";
import { Badge, Button, CheckIcon, Divider, Menu, Modal, Pressable, Select, Spinner, VStack, useToast } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ToastAlert } from "../../helper/CustomToaster";
import RemoteApi from "../../services/RemoteApi";

export const DynamicFilters = ({ filtersSchema, setAppliedSorting, appliedSorting, sorting = [], setCurrentPageNumber, getList, appliedFilers, setAppliedFilers, downloadApi = "", fileName = "" }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const searchBoxRef = useRef(null);
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortingOpen, setSortingOpen] = useState(false);
    const [filterValues, setFilterValues] = useState([]);
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const toast = useToast();

    const handleSearchBoxClick = () => {
        // Use the current property of the ref to access the input element
        if (searchBoxRef.current) {
            searchBoxRef.current.focus();
        }
    };

    const clearFilters = () => {
        const updatedFilterValues = filterValues.map((filter) => ({
            ...filter,
            value: "",
            operator: "",
        }));
        setFilterValues(updatedFilterValues);
        setAppliedFilers([])
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

    const applyFilters = () => {

        const updatedFilterValues = filterValues.filter((filter) => {
            return (filter.value != null && filter.value !== '' && filter.operator) ||
                (Array.isArray(filter.value) && filter.value.length > 0 && filter.operator);
        });

        if (updatedFilterValues.length > 0) {
            setAppliedFilers(updatedFilterValues)
            setFilterValues(updatedFilterValues)
            setModalVisible(!modalVisible)
            setCurrentPageNumber(1)
            getList(updatedFilterValues, true)
        } else {
            toast.show({
                render: ({
                    id
                }) => {
                    return <ToastAlert
                        id={id}
                        variant={"left-accent"}
                        title={"Both operator and value should be selected!!"}
                        description={""}
                        isClosable={true}
                        toast={toast}
                    />;
                }
            })
        }
    }

    const handleSearchInput = (e) => {
        handleFilterChange("all", e?.target?.value, "contains")
    }

    const downloadReport = async () => {
        setIsDownloadProcessing(true)
        const response: any = await RemoteApi.downloadFile({ endpoint: downloadApi, fileName: fileName, data: appliedFilers });
        // console.log(response);
        setIsDownloadProcessing(false)
    }

    const handleSortingChange = (e, name) => {
        // console.log(e);
        setAppliedSorting((prevSelectSorting) => ({
            ...prevSelectSorting,
            [name]: e,
        }));
    }



    return <View className="flex flex-row justify-between items-center mt-5 w-100">
        <View className='flex flex-row w-10/12 justify-start items-center' style={{}}>
            <Pressable onPress={handleSearchBoxClick} className="flex flex-row justify-between items-center mx-2 w-6/12 border-[1px] rounded border-slate-200">
                <View className="flex flex-row items-center">
                    <View className="">
                        <Icon name="search" style={{ marginLeft: 10 }} size={14} color="#484848" />
                    </View>
                    <TextInput
                        ref={searchBoxRef}
                        className='outline-transparent'
                        placeholder={'Search'}
                        underlineColorAndroid="transparent"
                        selectionColor="transparent"
                        placeholderTextColor={"#484848"}
                        cursorColor={"transparent"}
                        style={searchInputStyle}
                        onChange={handleSearchInput}
                        value={filterValues.find((filter) => filter.key === "all")?.value || ""}
                    />
                </View>
                {
                    filterValues.find((filter) => filter.key === "all")?.value && <Button onPress={applyFilters} className="" width={20} mr={"5px"} size={"xs"} bgColor={"#000000"}>
                        Search
                    </Button>
                }

            </Pressable>
            <View className="mr-2">
                <Menu w="xl" onClose={() => setFilterOpen(false)} onOpen={() => setFilterOpen(true)} isOpen={filterOpen} bgColor={"white"} placement="bottom" closeOnSelect={false} trigger={triggerProps => {
                    return <Pressable className="flex flex-row justify-center items-center border-[1px] rounded px-4 py-3 border-slate-200" accessibilityLabel="More options menu" {...triggerProps}>
                        <Icon name="filter" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />


                        <Text className="mr-1">Filters</Text>
                        {
                            appliedFilers.length > 0 && <Badge
                                height={5}
                                width={5}
                                colorScheme="danger" rounded="full" variant="solid" alignSelf="flex-end" _text={{
                                    fontSize: 12,
                                }}>
                                {appliedFilers.length}
                            </Badge>
                        }
                    </Pressable>
                }}>
                    <Menu.Item bgColor={"white"} cancelable={false}>
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

                    </Menu.Item>
                </Menu>
            </View>
            <View>
                <Menu w="md" onClose={() => setSortingOpen(false)} onOpen={() => setSortingOpen(true)} isOpen={sortingOpen} bgColor={"white"} placement="bottom" closeOnSelect={false} trigger={triggerProps => {
                    return <Pressable className="flex flex-row justify-center items-center border-[1px] rounded px-4 py-3 border-slate-200" accessibilityLabel="More options menu" {...triggerProps}>
                        <Icon name="sort" style={{ marginLeft: 10, marginRight: 5 }} size={14} color="#484848" />
                        <Text>Sorting</Text>
                    </Pressable>;
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
                                                sorting.find((sort, index) => sort.key == appliedSorting.key)?.direction?.map((direc, index) => <Select.Item label={direc} value={direc} />)
                                            }

                                        </Select>
                                    }
                                </View>
                            </View>

                        </View>

                    </Menu.Item>
                </Menu>
            </View>
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
            <Pressable onPress={downloadReport} className="flex flex-row justify-center items-center bg-black border-[1px] rounded px-[40px] py-3 border-slate-200 mr-2">
                {
                    isDownloadProcessing ? <Spinner color={"white"} size={14} accessibilityLabel="Loading" /> : <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                }
                {/* <Text>Sorting</Text> */}
            </Pressable>
        </View>
    </View>
}

const searchInputStyle = { padding: 7, fontSize: 13, borderColor: "transparent", color: "#484848", height: 40, borderWidth: 0, "outlineStyle": 'none' };
