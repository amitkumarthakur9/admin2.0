import { Box, CheckIcon, Select, Text } from "native-base";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export const Pagination = ({
    currentPageNumber,
    setCurrentPageNumber,
    getDataList,
    setItemsPerPage,
    itemsPerPage,
    totalItems,
}) => {
    // Calculate totalPages inside the Pagination component
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Standard options for items per page
    const standardOptions = [10, 20, 30, 40, 50];

    // Generate items per page options based on totalItems
    let itemsPerPageOptions = standardOptions.filter(
        (option) => option <= totalItems
    );

    // Include totalItems as an option if it's larger than the largest standard option
    // If totalItems is less than the smallest standard option (10), include totalItems as the only option
    if (itemsPerPageOptions.length === 0 && totalItems > 0) {
        itemsPerPageOptions = [totalItems];
    }

    const generatePagesToShow = (currentPage: number) => {
        const pagesToShow = [];
        const totalPageNumbersToShow = 7; // Adjust this to show more or fewer page numbers
      
        if (totalPages <= totalPageNumbersToShow) {
          // Show all pages if total pages is less than or equal to totalPageNumbersToShow
          for (let i = 1; i <= totalPages; i++) {
            pagesToShow.push(i);
          }
        } else {
          const leftSiblingIndex = Math.max(currentPage - 2, 2);
          const rightSiblingIndex = Math.min(currentPage + 2, totalPages - 1);
      
          const shouldShowLeftEllipsis = leftSiblingIndex > 2;
          const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;
      
          pagesToShow.push(1); // Always show first page
      
          if (shouldShowLeftEllipsis) {
            pagesToShow.push("..."); // Ellipsis after first page
          }
      
          // Pages between ellipses or edges
          for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            pagesToShow.push(i);
          }
      
          if (shouldShowRightEllipsis) {
            pagesToShow.push("..."); // Ellipsis before last page
          }
      
          pagesToShow.push(totalPages); // Always show last page
        }
      
        return pagesToShow;
      };
      

    const handleNextPage = () => {
        if (currentPageNumber < totalPages) {
            setCurrentPageNumber(currentPageNumber + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPageNumber > 1) {
            setCurrentPageNumber(currentPageNumber - 1);
        }
    };

    useEffect(() => {
        getDataList();
    }, [currentPageNumber]);

    useEffect(() => {
        getDataList();
        setCurrentPageNumber(1);
    }, [itemsPerPage]);

    return (
        <View className="flex flex-row items-center justify-between mt-[20px] mb-[80px] z-[-1] mx-2 flex-wrap">
            <View className="flex flex-row w-full gap-2 lg:w-4/12 justify-start">
                <View className="flex flex-row justify-center items-center">
                    <Text selectable className="text-[#686868] font-semibold">
                        Items per page
                    </Text>
                </View>
                <Box maxW="100">
                    <Select
                        onValueChange={(itemValue) =>
                            setItemsPerPage(Number(itemValue))
                        }
                        selectedValue={"" + itemsPerPage}
                        minWidth="100"
                        accessibilityLabel="Page"
                        placeholder="Page"
                        _selectedItem={{
                            bg: "gray.50",
                            endIcon: <CheckIcon size="5" />,
                        }}
                        dropdownIcon={
                            <Icon
                                name="chevron-down"
                                style={{ fontWeight: "100", marginRight: 4 }}
                                color="black"
                            />
                        }
                    >
                        {/* <Select.Item label="10" value={"10"} />
                        <Select.Item label="20" value="20" />
                        <Select.Item label="30" value="30" />
                        <Select.Item label="40" value="40" />
                        <Select.Item label="50" value="50" /> */}
                        {itemsPerPageOptions.map((option) => (
                            <Select.Item
                                key={option}
                                label={`${option}`}
                                value={`${option}`}
                            />
                        ))}
                    </Select>
                </Box>
                <View className="flex flex-row justify-center items-center">
                    <Text>
                        {currentPageNumber} of {totalPages}
                    </Text>
                </View>
            </View>
            <View className="w-full lg:w-8/12 items-center flex flex-row justify-end px-4 mt-4 gap-2 lg:mt-0 flex-wrap">
                <View>
                    <Pressable
                        className="px-3 py-2 border-[0.5px] border-[#bdbdbd] rounded"
                        onPress={handlePrevPage}
                    >
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            Previous
                        </Text>
                    </Pressable>
                </View>

                {generatePagesToShow(currentPageNumber).map((page, index) => (
                    <View key={index} className="rounded-md mt-1">
                        <Pressable
                            onPress={() =>
                                setCurrentPageNumber(
                                    page == "..." ? currentPageNumber : page
                                )
                            }
                            className={
                                "rounded-md px-3 py-2 border-[0.5px] border-[#bdbdbd]" +
                                (currentPageNumber === page
                                    ? " bg-black"
                                    : " bg-white")
                            }
                        >
                            <Text
                                selectable
                                className={
                                    currentPageNumber === page
                                        ? "text-white"
                                        : "text-black"
                                }
                            >
                                {page}
                            </Text>
                        </Pressable>
                    </View>
                ))}

                <View>
                    <Pressable
                        className="px-3 py-2 border-[0.5px] border-[#bdbdbd] rounded"
                        onPress={handleNextPage}
                    >
                        <Text
                            selectable
                            className="text-[#686868] font-semibold"
                        >
                            Next
                        </Text>
                    </Pressable>
                </View>
            </View>
            <View className="w-2/12"></View>
        </View>
    );
};
