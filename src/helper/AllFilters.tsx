import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Switch, Button } from "react-native";
import { Select, Input } from "native-base";
// import Icon from 'react-native-vector-icons/MaterialIcons'
import DropdownComponent from "react-native-element-dropdown/lib/typescript/components/Dropdown";
// import DropdownMenu from 'react-native-dropdown-listpicker';
import { Pressable } from "react-native";
// import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon from "react-native-vector-icons/FontAwesome";
import DropdownComp from "../components/MultiSelect/component/DropdownComp";
import CalendarPicker from "../components/CustomDatePicker/CalendarPicker";

const FilterComponent = ({
    filter,
    onFilterChange,
    filterValues,
    removeFilter,
    onErrorChange,
}) => {
    let { title, key, fieldType, valueConfig, operator } = filter;
    let initialFilterValue = filterValues.find((f) => f.key === key);
    const [error, setError] = useState(false);

    useEffect(() => {
        onErrorChange(key, error); // Notify parent of error state
    }, [error]);

    const removeSingleFilter = () => {
        removeFilter(key);
        initialFilterValue = filterValues.find((f) => f.key === key);
        setError(false);
    };

    const handleOperatorChange = (operatorValue) => {
        onFilterChange(key, initialFilterValue?.value, operatorValue);
        initialFilterValue = filterValues.find((f) => f.key === key);
        setError(!operatorValue && initialFilterValue?.value);
        // console.log('initialFilterValue', initialFilterValue);
    };

    const handleFilterChange = (newValue) => {
        console.log("value", newValue);
        console.log("key", key);
        console.log("valueConfig.valueType ", valueConfig.valueType);

        onFilterChange(
            key,
            valueType(newValue),
            valueConfig.valueType == "date"
                ? "between"
                : initialFilterValue?.operator
        );
        initialFilterValue = filterValues.find((f) => f.key === key);
        if (valueConfig.valueType == "date") {
        } else {
            setError(!initialFilterValue?.operator && newValue);
        }

        if (key == "transactionTypeId" || key == "transactionStatusId") {
            initialFilterValue?.value?.length == 0 && setError(false);
        }
        // console.log(initialFilterValue);
    };

    const valueType = (newValue) => {
        // console.log('newValue', newValue);

        switch (valueConfig.valueType) {
            case "string":
                return newValue + "";
            case "number":
                return typeof newValue === "string"
                    ? newValue.length == 0
                        ? newValue
                        : Number(newValue)
                    : newValue;
            case "number[]":
                if (!Array.isArray(newValue)) {
                    newValue = [newValue];
                } else {
                    let newArr = [];
                    newValue.forEach((val) => {
                        newArr.push(Number(val));
                    });
                    newValue = newArr;
                }
                return newValue;
            default:
                return newValue;
        }
    };

    const renderFilterInput = () => {
        const apiCallRequired =
            filter.apiConfig && filter.apiConfig.defaultData ? false : true;
        let data = [];
        if (apiCallRequired) {
            //  data = []
        } else {
            // data = filter.apiConfig.defaultData.map((item) => {
            //   return { id: item.id, label: item.name }
            // })
            data = filter.apiConfig.defaultData;
        }
        switch (fieldType) {
            case "input":
                // console.log("initialFilterValue?.value", (typeof initialFilterValue?.value == "undefined" ? "" : initialFilterValue?.value) || "");

                return (
                    <Input
                        ml="3"
                        value={initialFilterValue?.value?.toString() || ""}
                        keyboardType={
                            valueConfig.valueType == "number"
                                ? "numeric"
                                : "default"
                        }
                        placeholder={title}
                        onChangeText={handleFilterChange}
                    />
                );
            case "select":
                return (
                    <Select
                        ml="3"
                        accessibilityLabel={title}
                        placeholder="Select"
                        selectedValue={initialFilterValue?.value}
                        onValueChange={(newValue) =>
                            handleFilterChange(newValue)
                        }
                        dropdownIcon={
                            <Icon
                                name="chevron-down"
                                style={{ fontWeight: "100", marginRight: 4 }}
                                color="black"
                            />
                        }
                    >
                        {data.map((op) => (
                            <Select.Item
                                key={op[filter.apiConfig.valueField]}
                                label={op[filter.apiConfig.displayFields[0]]}
                                value={op[filter.apiConfig.valueField]}
                            />
                        ))}
                    </Select>
                );
            case "checkbox":
                return (
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Text>{title}</Text>
                        <Switch
                            value={initialFilterValue?.value}
                            onValueChange={(newValue) =>
                                handleFilterChange(newValue)
                            }
                        />
                    </View>
                );
            case "multiSelect":
                data = filter.apiConfig.defaultData.map((item) => {
                    return {
                        value: item[filter.apiConfig.valueField],
                        label: item[filter.apiConfig.displayFields[0]],
                    };
                });
                return (
                    <View style={{}} className="ml-3">
                        <DropdownComp
                            selectedItems={initialFilterValue?.value}
                            showMultipleAsBadge={true}
                            listItemLeftIconComp={<View></View>}
                            selectedItemBadgeCloseIconStyle={{
                                color: "black",
                                fontSize: 10,
                            }}
                            data={data}
                            badgeBackgroundColor={["#ffffff"]}
                            onSelected={handleFilterChange}
                            radius={0}
                            borderless={true}
                            scrollable={true}
                            selectedtextStyle={{
                                fontSize: 14,
                                color: "black",
                                marginLeft: 4,
                            }}
                            ListItemStyle={{ padding: 0 }}
                            DropDownContainerStyle={{
                                padding: 0,
                                backgroundColor: "white",
                            }}
                            ListStyle={{ backgroundColor: "white" }}
                            selectedItemBadgeLabelStyle={{
                                fontSize: 12,
                                color: "black",
                            }}
                            selectedItemBadgeStyle={{ alignItems: "center" }}
                            ListLabelStyle={{
                                fontSize: 10,
                                padding: 0,
                                color: "black",
                            }}
                            markedIconStyle={{ color: "black" }}
                            dropdownIndicator="arrow"
                            placeholder="select"
                            mode="UNDERLAY"
                        />
                    </View>
                );
            case "number":
                return (
                    <Input
                        ml="3"
                        value={initialFilterValue?.value?.toString() || ""}
                        keyboardType="numeric"
                        placeholder={title}
                        onChangeText={handleFilterChange}
                    />
                );
            case "date":
                return (
                    <View
                        className="pl-3 flex flex-row w-full"
                        key={initialFilterValue?.value}
                    >
                        <CalendarPicker
                            value={initialFilterValue?.value}
                            handleFilterChange={handleFilterChange}
                        />
                        {/* <CalendarPicker /> */}
                    </View>
                );
            // Add cases for other field types as needed
            default:
                return <View></View>;
        }
    };

    const renderOperatorSelect = () => {
        return (
            <View className="">
                <Select
                    key={initialFilterValue?.operator}
                    dropdownIcon={
                        <Icon
                            style={{ marginRight: 4 }}
                            name="angle-down"
                            size={18}
                        />
                    }
                    ml="3"
                    accessibilityLabel="Operator"
                    placeholder="Operator"
                    selectedValue={initialFilterValue?.operator}
                    onValueChange={(newValue) => handleOperatorChange(newValue)}
                >
                    {operator.map((op) => (
                        <Select.Item
                            key={op.subKey}
                            label={op.name}
                            value={op.subKey}
                        />
                    ))}
                </Select>
            </View>
        );
    };

    return (
        <View className="flex flex-row items-center mb-2 justify-between">
            <View className="w-3/12">
                <Text selectable className="">
                    {title}
                </Text>
                {error && (
                    <Text style={{ color: "red" }}>Operator is required</Text>
                )}
            </View>
            {fieldType != "date" && (
                <View className="w-4/12">{renderOperatorSelect()}</View>
            )}
            <View className={fieldType != "date" ? "w-4/12" : "w-8/12"}>
                {renderFilterInput()}
            </View>
            <View className={"w-1/12 flex flex-row ml-2"}>
                {fieldType == "multiSelect" ? (
                    initialFilterValue?.value?.length > 0 ? (
                        <Pressable onPress={removeSingleFilter}>
                            <Icon
                                name="trash"
                                style={{ fontWeight: "100" }}
                                color="black"
                            />
                        </Pressable>
                    ) : (
                        ""
                    )
                ) : initialFilterValue?.value ||
                  initialFilterValue?.value == 0 ? (
                    <Pressable onPress={removeSingleFilter}>
                        <Icon
                            name="trash"
                            style={{ fontWeight: "100" }}
                            color="black"
                        />
                    </Pressable>
                ) : (
                    ""
                )}
            </View>
        </View>
    );
};

// Define your filtersSchema and FilterForm components here (similar to the React example)

const FilterForm = ({
    filtersSchema,
    onFilterChange,
    filterValues,
    removeFilter,
    applyFilters,
}) => {
    const [isApplyEnabled, setApplyEnabled] = useState(false);
    const [errorState, setErrorState] = useState({}); // Track errors for each filter

    const handleErrorChange = (key, hasError) => {
        setErrorState((prevState) => ({
            ...prevState,
            [key]: hasError,
        }));
    };

    useEffect(() => {
        // const hasValue = filterValues.some((filter) => filter.value);
        // console.log("hasValue" + hasValue)
        console.log("hasValue" + JSON.stringify(filterValues));
        console.log("hasValue" + JSON.stringify(filterValues[0]?.value));

        const hasValue = filterValues.some((filter) => {
            if (filter.key === "isActive") {
                // Convert isActive value to string and check if it exists
                return (
                    filter.value !== undefined &&
                    filter.value !== null &&
                    filter.value.toString().trim().length > 0
                );
            } else {
                // For all other filters, keep the same logic
                return filter.value;
            }
        });

        const hasError = Object.values(errorState).some((error) => error); // Check if any error exists
        console.log("hasError" + hasError);
        setApplyEnabled(hasValue && !hasError); // Only enable if there are no errors and at least one value is filled
    }, [filterValues, errorState]);

    return (
        <View>
            {filtersSchema?.map((filter, key) => (
                <View key={key}>
                    {filter.key !== "all" && (
                        <FilterComponent
                            key={filter.key}
                            filter={filter}
                            onFilterChange={onFilterChange}
                            filterValues={filterValues}
                            removeFilter={removeFilter}
                            onErrorChange={handleErrorChange}
                        />
                    )}
                </View>
            ))}
            <View className={isApplyEnabled ? `bg-[#114EA8]` : `bg-gray-400`}>
                <Pressable
                    className="py-2"
                    onPress={isApplyEnabled ? applyFilters : null} // Disable the onPress when not enabled
                    disabled={!isApplyEnabled} // Optional, in case you want the actual press to be disabled
                >
                    <View className="flex flex-row justify-center items-center">
                        <Text
                            selectable
                            className="text-center text-sm mr-2 text-white"
                        >
                            Apply Filters
                        </Text>
                        <Icon name="filter" size={15} color="#ffffff" />
                    </View>
                </Pressable>
            </View>
        </View>
    );
};

export default FilterForm;
