import { Box, CheckIcon, Select, Text } from "native-base"
import { useEffect } from "react";
import { Pressable, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';

export const Pagination = ({ currentPageNumber, totalPages, setCurrentPageNumber, getDataList, setItemsPerPage, itemsPerPage }) => {
    const generatePagesToShow = (currentPage: number) => {
        const pagesToShow = [];

        if (currentPage > 1) {
            for (let i = 0; i < (currentPage > 2 ? 2 : currentPage - 1); i++) {
                pagesToShow.push(i + 1);
            }
        }

        if (currentPage > 5) {
            pagesToShow.push("...");
        }

        if (currentPage >= 4) {
            for (let i = 0; i < (currentPage == 4 ? 1 : 2); i++) {
                pagesToShow.push(currentPage == 4 ? (currentPage - (1 - i)) : (currentPage - (2 - i)));
            }
        }

        for (let i = currentPage; i <= currentPage + 2 && i <= totalPages - 2; i++) {
            pagesToShow.push(i);
        }

        if (pagesToShow[pagesToShow.length - 1] < totalPages - 1) {
            pagesToShow.push("...");
        }

        for (let i = Math.max(currentPage, totalPages - 1); i <= totalPages; i++) {
            pagesToShow.push(i);
        }

        return pagesToShow;
    };

    const handleNextPage = () => {
        if (currentPageNumber < totalPages) {
            setCurrentPageNumber(currentPageNumber + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPageNumber > 1) {
            setCurrentPageNumber(currentPageNumber - 1)
        }
    }

    useEffect(() => {
        getDataList()
    }, [currentPageNumber, itemsPerPage])

    return <View className='flex flex-row items-center mt-[20px] mb-[80px] z-[-1] mx-2'>
        <View className="w-2/12">
            <Box maxW="100">
                <Select
                    onValueChange={itemValue => setItemsPerPage(itemValue)}
                    selectedValue={"" + itemsPerPage}
                    minWidth="100"
                    accessibilityLabel="Page"
                    placeholder="Page"
                    _selectedItem={{
                        bg: "teal.600",
                        endIcon: <CheckIcon size="5" />

                    }}
                    dropdownIcon={<Icon name="chevron-down" style={{ fontWeight: "100", marginRight: 4 }} color="black" />}
                >
                    <Select.Item label="10" value={"10"} />
                    <Select.Item label="20" value="20" />
                    <Select.Item label="30" value="30" />
                    <Select.Item label="40" value="40" />
                    <Select.Item label="50" value="50" />
                </Select>
            </Box>
        </View>
        <View className='w-8/12 items-center flex flex-row justify-center'>
            <View>
                <Pressable className='px-3 py-2' onPress={handlePrevPage}>
                    <Icon name="angle-left" size={18} color={currentPageNumber == 1 ? "#dfdcdc" : "black"} />
                </Pressable>
            </View>

            {generatePagesToShow(currentPageNumber).map((page, index) => (
                <View key={index} className='rounded-md mr-2'>
                    <Pressable
                        onPress={() => setCurrentPageNumber(page == "..." ? currentPageNumber : page)}
                        className={"rounded-md px-3 py-2" + (currentPageNumber === page ? " bg-black" : " bg-slate-200")}

                    >
                        <Text selectable className={currentPageNumber === page ? "text-white" : "text-black"}>{page}</Text>
                    </Pressable>
                </View>
            ))}

            <View>
                <Pressable className='px-3 py-2' onPress={handleNextPage} >
                    <Icon name="angle-right" size={18} color={currentPageNumber == totalPages ? "#dfdcdc" : "black"} />
                </Pressable>
            </View>
        </View>
        <View className="w-2/12">

        </View>
    </View>
}