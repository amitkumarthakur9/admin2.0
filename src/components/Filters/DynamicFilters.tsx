import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native"
import { Button, TouchableRipple } from "react-native-paper";
import FilterForm from "../../helper/AllFilters";
import { Badge, Box, Divider, Pressable, Spinner, VStack, useToast } from "native-base";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ToastAlert } from "../../helper/CustomToaster";
import RemoteApi from "../../services/RemoteApi";

export const DynamicFilters = ({ filtersSchema, setCurrentPageNumber, getList, appliedFilers, setAppliedFilers, downloadApi = "", fileName = "" }) => {
    const searchBoxRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const filterModalRef = useRef(null);
    const [filterValues, setFilterValues] = useState([]);
    const [isDownloadProcessing, setIsDownloadProcessing] = useState(false);
    const toast = useToast();
    const handleSearchInputFocus = () => {
        setModalVisible(true)
        setIsFocused(true)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterModalRef.current && !filterModalRef.current.contains(event.target) && !searchBoxRef.current.contains(event.target)) {
                setModalVisible(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

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
        // console.log(e);

        handleFilterChange("all", e?.target?.value, "contains")
    }

    useEffect(() => {
        // console.log('appliedFilers', appliedFilers);
        // console.log('filterValues', filterValues);

    })

    const downloadReport = async () => {
        setIsDownloadProcessing(true)
        const response: any = await RemoteApi.downloadFile(downloadApi, fileName);
        console.log(response);
        setIsDownloadProcessing(false)
    }

    return <View className="flex flex-row justify-between items-center mt-5 w-100">
        <View className='static w-10/12 justify-center' style={{}}>
            <View ref={searchBoxRef} className={'flex flex-row justify-between items-center mx-2 w-12/12 lg:w-6/12 static ' + (modalVisible ? 'border-x-[1px] border-t-[1px] rounded-t-lg ' : 'border-[#e4e4e4] border-[0.3px] rounded')}>
                <TextInput
                    className='w-11/12 outline-transparent'
                    placeholder={'Type Name/Email/Mobile/ClientID/FE User ID/PAN No'}
                    underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholderTextColor={"#484848"}
                    cursorColor={"transparent"}
                    onFocus={handleSearchInputFocus}
                    style={searchInputStyle}
                    onChange={handleSearchInput}
                    value={filterValues.find((filter) => filter.key === "all")?.value || ""}
                />
                <View className='w-1/12 flex flex-row justify-end mr-2'>

                    <VStack>
                        {
                            appliedFilers.length > 0 && <Badge
                                height={5}
                                width={5}
                                colorScheme="danger" rounded="full" mb={-4} mr={-4} zIndex={1} variant="solid" alignSelf="flex-end" _text={{
                                    fontSize: 12,
                                }}>
                                {appliedFilers.length}
                            </Badge>
                        }
                        <Icon name="filter" size={25} color="#000000" />

                    </VStack>
                </View>

            </View>

            {
                modalVisible &&
                <View className={" bg-white absolute z-[9999] top-10 w-fit lg:w-6/12 mx-2 rounded-b-lg " + (modalVisible ? 'border-x-[1px] border-b-[1px]' : 'border-[#e4e4e4] border-[0.3px]')} ref={filterModalRef}>
                    <Divider my="2" _light={{
                        bg: "muted.200"
                    }} _dark={{
                        bg: "muted.50"
                    }} />
                    <View className='p-2'>
                        <View className='mb-4 flex flex-row justify-between'>
                            <Text selectable className='font-semibold'>Advance Filters</Text>
                            <TouchableRipple rippleColor={"#e4e4e4"} onPress={clearFilters}>
                                <Text selectable className='text-xs underline underline-offset-4'>clear</Text>
                            </TouchableRipple>
                        </View>
                        <FilterForm filtersSchema={filtersSchema} onFilterChange={handleFilterChange} filterValues={filterValues} />
                    </View>
                    <View className='bg-[#000000] rounded-b-lg'>
                        <TouchableRipple className='py-3' onPress={applyFilters}>
                            <View className='flex flex-row justify-center items-center'>
                                <Text selectable className='text-center text-sm mr-2 text-white'>Apply Filters</Text>
                                <Icon name="filter" size={15} color="#ffffff" />
                            </View>
                        </TouchableRipple>
                    </View>
                </View>
            }
        </View>
        <View className="flex flex-row w-2/12 justify-end items-center">
            <Pressable marginRight={4} onPress={downloadReport} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                {
                    isDownloadProcessing ? <Spinner color={"white"} size={14} accessibilityLabel="Loading" /> : <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                }
            </Pressable>
        </View>
    </View>
}

const searchInputStyle = { padding: 10, fontSize: 13, borderColor: "transparent", color: "#484848", height: 40, borderWidth: 0, "outlineStyle": 'none' };
