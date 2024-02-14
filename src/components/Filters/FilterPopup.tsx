import { Box } from "native-base";
import { View, Text, useWindowDimensions } from "react-native";
import { TouchableRipple } from "react-native-paper";
import FilterForm from "../../helper/AllFilters";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useRef } from "react";

export const FilterPopup = ({
    open,
    removeFilter,
    clearFilters,
    filtersSchema,
    handleFilterChange,
    applyFilters,
    setFilterOpen,
    filterValues,
}) => {
    const { height, width } = useWindowDimensions();
    const outsideClickRef = useRef(null);

    const position: any = {
        position: "absolute",
    };

    if (width >= 830) {
        position["left"] = -196;
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Check if the click was outside the component
            if (
                outsideClickRef.current &&
                !outsideClickRef.current.contains(event.target)
            ) {
                // console.log('Clicked outside the component!');
                setFilterOpen(false);
                // Your logic for handling the click outside
            }
        };

        // Add event listener for clicks
        window?.document?.addEventListener("click", handleOutsideClick);

        // Cleanup the event listener on component unmount
        return () => {
            window?.document?.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <>
            {open && (
                <View>
                    <Box
                        className=""
                        width={width < 830 ? width : 550}
                        ref={outsideClickRef}
                        style={position}
                    >
                        <View
                            style={{
                                backgroundColor: "white",
                                elevation: 3, // Android shadow
                                shadowColor: "rgba(0, 0, 0, 0.29)",
                                shadowOffset: {
                                    width: 0,
                                    height: 3,
                                },
                                shadowOpacity: 1,
                                shadowRadius: 4.65,
                                borderRadius: 10,
                            }}
                        >
                            <View
                                className="p-2"
                                style={{ backgroundColor: "white" }}
                            >
                                <View className="mb-4 flex flex-row justify-between">
                                    <Text selectable className="font-semibold">
                                        Advance Filters
                                    </Text>
                                    <TouchableRipple
                                        rippleColor={"#e4e4e4"}
                                        onPress={clearFilters}
                                    >
                                        <Text
                                            selectable
                                            className="text-xs underline underline-offset-4"
                                        >
                                            clear
                                        </Text>
                                    </TouchableRipple>
                                </View>
                                <FilterForm
                                    removeFilter={removeFilter}
                                    filtersSchema={filtersSchema}
                                    onFilterChange={handleFilterChange}
                                    filterValues={filterValues}
                                />
                            </View>
                            <View
                                className="bg-[#000000]"
                                style={{ borderRadius: 5 }}
                            >
                                <TouchableRipple
                                    className="py-3"
                                    onPress={applyFilters}
                                >
                                    <View className="flex flex-row justify-center items-center">
                                        <Text
                                            selectable
                                            className="text-center text-sm mr-2 text-white"
                                        >
                                            Apply Filters
                                        </Text>
                                        <Icon
                                            name="filter"
                                            size={15}
                                            color="#ffffff"
                                        />
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </Box>
                </View>
            )}
        </>
    );
};
