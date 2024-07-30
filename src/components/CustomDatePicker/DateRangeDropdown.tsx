import React, { useEffect, useReducer } from "react";
import { View, Select, CheckIcon } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";

const DateRangeDropdown = ({
    initialStartDate,
    initialEndDate,
    handleDateSelect,
}) => {
    const dateRanges = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 7 days", value: "last7days" },
        { label: "Last 30 days", value: "last30days" },
        { label: "This month", value: "thismonth" },
        { label: "Last month", value: "lastmonth" },
        { label: "Custom Date", value: "custom" },
    ];

    const initialState = {
        selectedRange: "custom",
        selectedRangeLabel: "Custom Date",
        isCustom: true,
    };

    if (initialStartDate && initialEndDate) {
        const today = moment();
        const start = moment(initialStartDate);
        const end = moment(initialEndDate);
        if (start.isSame(today, "day") && end.isSame(today, "day")) {
            initialState.selectedRange = "today";
            initialState.selectedRangeLabel = "Today";
            initialState.isCustom = false;
        } else if (
            start.isSame(today.clone().subtract(1, "days"), "day") &&
            end.isSame(today.clone().subtract(1, "days"), "day")
        ) {
            initialState.selectedRange = "yesterday";
            initialState.selectedRangeLabel = "Yesterday";
            initialState.isCustom = false;
        } else if (
            start.isSame(today.clone().subtract(6, "days"), "day") &&
            end.isSame(today, "day")
        ) {
            initialState.selectedRange = "last7days";
            initialState.selectedRangeLabel = "Last 7 days";
            initialState.isCustom = false;
        } else if (
            start.isSame(today.clone().subtract(29, "days"), "day") &&
            end.isSame(today, "day")
        ) {
            initialState.selectedRange = "last30days";
            initialState.selectedRangeLabel = "Last 30 days";
            initialState.isCustom = false;
        } else if (
            start.isSame(today.clone().startOf("month"), "day") &&
            end.isSame(today.clone().endOf("month"), "day")
        ) {
            initialState.selectedRange = "thismonth";
            initialState.selectedRangeLabel = "This month";
            initialState.isCustom = false;
        } else if (
            start.isSame(
                today.clone().subtract(1, "month").startOf("month"),
                "day"
            ) &&
            end.isSame(today.clone().subtract(1, "month").endOf("month"), "day")
        ) {
            initialState.selectedRange = "lastmonth";
            initialState.selectedRangeLabel = "Last month";
            initialState.isCustom = false;
        }
    }

    function reducer(state, action) {
        switch (action.type) {
            case "SET_RANGE":
                return {
                    ...state,
                    selectedRange: action.payload.range,
                    selectedRangeLabel: action.payload.label,
                    isCustom: action.payload.range === "custom",
                };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        handleRangeSelection(state.selectedRange);
    }, [state.selectedRange]);

    const handleRangeSelection = (range) => {
        const today = moment();
        let startDate, endDate;

        switch (range) {
            case "today":
                startDate = today;
                endDate = today;
                break;
            case "yesterday":
                startDate = today.clone().subtract(1, "days");
                endDate = startDate;
                break;
            case "last7days":
                startDate = today.clone().subtract(6, "days");
                endDate = today;
                break;
            case "last30days":
                startDate = today.clone().subtract(29, "days");
                endDate = today;
                break;
            case "thismonth":
                startDate = today.clone().startOf("month");
                endDate = today.clone().endOf("month");
                break;
            case "lastmonth":
                startDate = today.clone().subtract(1, "month").startOf("month");
                endDate = today.clone().subtract(1, "month").endOf("month");
                break;
            default:
                startDate = null;
                endDate = null;
        }

        if (startDate && endDate) {
            handleDateSelect(startDate, endDate);
        }
    };

    return (
        <View>
            <Select
                selectedValue={state.selectedRange}
                maxWidth="165"
                accessibilityLabel="Select Date Range"
                placeholder={state.selectedRangeLabel}
                _selectedItem={{
                    bg: "gray.200",
                    endIcon: <CheckIcon size="2" />,
                }}
                dropdownIcon={
                    <Icon
                        style={{ marginRight: 4 }}
                        name="angle-down"
                        size={18}
                    />
                }
                onValueChange={(itemValue) => {
                    const selectedRangeObj = dateRanges.find(
                        (r) => r.value === itemValue
                    );
                    dispatch({
                        type: "SET_RANGE",
                        payload: {
                            range: itemValue,
                            label: selectedRangeObj.label,
                        },
                    });
                }}
            >
                {dateRanges.map((range) => (
                    <Select.Item
                        key={range.value}
                        label={range.label}
                        value={range.value}
                    />
                ))}
            </Select>
        </View>
    );
};

export default DateRangeDropdown;
