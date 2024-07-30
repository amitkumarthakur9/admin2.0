// CalendarPicker.js

import React, { memo, useEffect, useState, useReducer } from "react";
import {
    getAllDatesInMonth,
    getDaysInMonth,
    getMonthName,
    monthNames,
} from "../../helper/DateUtils";
import { Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import {
    Box,
    Popover,
    Button,
    ChevronLeftIcon,
    ChevronRightIcon,
    Pressable,
    View,
    Select,
    CheckIcon,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import DateRangeDropdown from "./DateRangeDropdown";

const CalendarPicker = ({
    handleFilterChange,
    value,
    fromName = "From",
    toName = "To",
    showCalendar = false,
    py = "py-2",
}) => {
    const [selectedYear, setSelectedYear] = useState(
        value?.length > 0
            ? new Date(value[0]).getFullYear()
            : new Date().getFullYear()
    );
    const [selectedMonth, setSelectedMonth] = useState(
        value?.length > 0
            ? new Date(value[0]).getMonth() + 1
            : new Date().getMonth() + 1
    );
    const firstDayOfMonth = new Date(
        selectedYear,
        selectedMonth - 1,
        1
    ).getDay();
    const allDatesInMonth = getAllDatesInMonth(selectedYear, selectedMonth);
    const [selectedDate, setSelectedDate] = useState(
        value?.length > 0 ? moment(value[0]).format("YYYY-MM-D") : null
    );
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSecondDate, setSelectedSecondDate] = useState(
        value?.length > 0 ? moment(value[1]).format("YYYY-MM-D") : null
    );
    const [monthChangeOpened, setMonthChangeOpened] = useState(false);

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleDateRange = (startDate, endDate) => {
        const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
        const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

        setSelectedDate(formattedStartDate);
        setSelectedSecondDate(formattedEndDate);
        handleFilterChange([formattedStartDate, formattedEndDate]);
        setIsOpen(false);
    };

    const handleDateSelect = (date) => {
        console.log(date);

        if (selectedDate && !selectedSecondDate) {
            if (new Date(date) > new Date(selectedDate)) {
                setSelectedSecondDate(date);
                handleFilterChange([
                    moment(selectedDate).format("YYYY-MM-DD"),
                    moment(date).format("YYYY-MM-DD"),
                ]);
                setIsOpen(false);
            } else {
                setSelectedDate(date);
            }
        } else if (selectedDate && selectedSecondDate) {
            setSelectedDate(date);
            setSelectedSecondDate(null);
        } else {
            setSelectedDate(date);
        }
    };

    const getSelectedColor = (date) => {
        let color = "";

        if (selectedDate && selectedDate == date) {
            // console.log(selectedDate);
            color = "bg-black rounded-l";
        } else if (selectedSecondDate && selectedSecondDate == date) {
            color = "bg-black rounded-r";
        }

        if (
            selectedDate &&
            selectedSecondDate &&
            new Date(selectedDate) < new Date(date) &&
            new Date(selectedSecondDate) > new Date(date)
        ) {
            // console.log("here", date, selectedDate, selectedSecondDate);

            color = "bg-gray-300";
        }

        return color;
    };

    const getSelectedFontColor = (date) => {
        let color = "";

        if (selectedDate && selectedDate == date) {
            // console.log(selectedDate);
            color = "text-white";
        } else if (selectedSecondDate && selectedSecondDate == date) {
            color = "text-white";
        }

        if (
            selectedDate &&
            selectedSecondDate &&
            new Date(selectedDate) < new Date(date) &&
            new Date(selectedSecondDate) > new Date(date)
        ) {
            // console.log("here", date, selectedDate, selectedSecondDate);

            color = "text-black";
        }

        return color;
    };

    const renderCalendarGrid = () => {
        const calendarGrid = [];
        let currentRow = [];

        // Render previous month's dates if the month starts from a day other than Sunday
        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonthDate =
                getDaysInMonth(selectedYear, selectedMonth - 1) -
                firstDayOfMonth +
                i +
                1;
            currentRow.push(
                <View
                    className={
                        "w-[15%] " +
                        getSelectedColor(
                            `${selectedYear}-${
                                selectedMonth - 1
                            }-${prevMonthDate}`
                        )
                    }
                    key={`prev-${i}`}
                    // onPress={() => handleDateSelect(`${selectedYear}-${selectedMonth - 1}-${prevMonthDate}`)}
                >
                    <Text className="text-slate-600 p-2 text-center">{""}</Text>
                </View>
            );
        }

        allDatesInMonth.forEach((date, index) => {
            currentRow.push(
                <TouchableOpacity
                    key={date}
                    onPress={() =>
                        handleDateSelect(
                            `${selectedYear}-${selectedMonth}-${date}`
                        )
                    }
                    className={
                        "w-[15%] " +
                        getSelectedColor(
                            `${selectedYear}-${selectedMonth}-${date}`
                        )
                    }
                >
                    <Text
                        className={
                            "p-2 text-center " +
                            getSelectedFontColor(
                                `${selectedYear}-${selectedMonth}-${date}`
                            )
                        }
                    >
                        {date}
                    </Text>
                </TouchableOpacity>
            );

            if ((firstDayOfMonth + index + 1) % 7 === 0) {
                // Start a new row for each Sunday
                calendarGrid.push(
                    <View
                        key={`row-${index}`}
                        className="flex flex-row items-center justify-center"
                    >
                        {currentRow}
                    </View>
                );
                currentRow = [];
            }
        });

        // Render remaining empty cells in the last row
        if (currentRow.length > 0) {
            for (let i = currentRow.length, date = 1; i < 7; i++, date++) {
                const nextMonthDate = date;
                currentRow.push(
                    <View
                        key={`next-${i}`}
                        className={
                            "w-[15%] " +
                            getSelectedColor(
                                `${selectedYear}-${
                                    selectedMonth + 1
                                }-${nextMonthDate}`
                            )
                        }
                        // onPress={() => handleDateSelect(`${selectedYear}-${selectedMonth + 1}-${nextMonthDate}`)}
                    >
                        <Text className="text-slate-600 p-2 text-center">
                            {""}
                        </Text>
                    </View>
                );
            }
            calendarGrid.push(
                <View
                    key={`row-last`}
                    className="flex flex-row items-center justify-center"
                >
                    {currentRow}
                </View>
            );
        }

        return calendarGrid;
    };

    const handleBack = () => {
        if (selectedMonth == 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const handleForward = () => {
        if (selectedMonth == 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    return (
        <View className="w-full">
            <View className="flex flex-row justify-between">
                <View className="w-1/2 pr-1">
                    <Popover
                        onOpen={() => setIsOpen(true)}
                        onClose={() => setIsOpen(false)}
                        isOpen={isOpen}
                        trigger={(triggerProps) => {
                            return (
                                <TouchableOpacity
                                    {...triggerProps}
                                    className={
                                        "flex w-full items-center justify-center flex-col rounded border-[0.2px] border-[#c7c7c7] " +
                                        py
                                    }
                                >
                                    <View className="flex flex-row justify-center w-full">
                                        {showCalendar && (
                                            <View className="mr-2">
                                                <Icon
                                                    name="calendar"
                                                    style={{
                                                        fontWeight: "100",
                                                    }}
                                                    size={14}
                                                    color="black"
                                                />
                                            </View>
                                        )}

                                        <View className="flex flex-col">
                                            <Text
                                                selectable
                                                className={
                                                    "text-xs " +
                                                    (value?.length > 0
                                                        ? "text-black"
                                                        : "text-slate-400")
                                                }
                                            >
                                                {value?.length > 0
                                                    ? value[0]
                                                    : fromName}
                                            </Text>
                                        </View>
                                        <View className="flex flex-col">
                                            <Text> - </Text>
                                        </View>
                                        <View className="flex flex-col">
                                            <Text
                                                selectable
                                                className={
                                                    "text-xs " +
                                                    (value?.length > 1
                                                        ? "text-black"
                                                        : "text-slate-400")
                                                }
                                            >
                                                {value?.length > 1
                                                    ? value[1]
                                                    : toName}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    >
                        <Popover.Content
                            accessibilityLabel=""
                            w="100%"
                            h={"xs"}
                        >
                            {/* <Popover.Arrow /> */}
                            {/* <Popover.CloseButton /> */}
                            {/* <Popover.Header>Delete Customer</Popover.Header> */}
                            <Popover.Body>
                                <View h={"xs"}>
                                    <View className="flex flex-row p-2 justify-between mb-4">
                                        <View>
                                            <Pressable onPress={handleBack}>
                                                <ChevronLeftIcon />
                                            </Pressable>
                                        </View>
                                        <Pressable
                                            onPress={() =>
                                                setMonthChangeOpened(true)
                                            }
                                        >
                                            <Text className="font-bold">
                                                {getMonthName(selectedMonth)}{" "}
                                                {selectedYear}
                                            </Text>
                                        </Pressable>
                                        <View>
                                            <Pressable onPress={handleForward}>
                                                <ChevronRightIcon />
                                            </Pressable>
                                        </View>
                                    </View>
                                    {monthChangeOpened ? (
                                        <View className="flex flex-col items-center">
                                            <View className="flex flex-row justify-center mb-10">
                                                <View className="mr-2">
                                                    <Select
                                                        selectedValue={
                                                            "" + selectedMonth
                                                        }
                                                        minWidth="100"
                                                        accessibilityLabel="Month"
                                                        placeholder="Month"
                                                        _selectedItem={{
                                                            bg: "gray.50",
                                                            endIcon: (
                                                                <CheckIcon size="5" />
                                                            ),
                                                        }}
                                                        mt={1}
                                                        onValueChange={(
                                                            itemValue
                                                        ) =>
                                                            setSelectedMonth(
                                                                Number(
                                                                    itemValue
                                                                )
                                                            )
                                                        }
                                                    >
                                                        {monthNames().map(
                                                            (month, index) => (
                                                                <Select.Item
                                                                    label={
                                                                        month
                                                                    }
                                                                    value={
                                                                        "" +
                                                                        (index +
                                                                            1)
                                                                    }
                                                                    key={index}
                                                                />
                                                            )
                                                        )}
                                                    </Select>
                                                </View>
                                                <View>
                                                    <Select
                                                        minWidth="100"
                                                        accessibilityLabel="Year"
                                                        placeholder="Year"
                                                        _selectedItem={{
                                                            bg: "gray.50",
                                                            endIcon: (
                                                                <CheckIcon size="5" />
                                                            ),
                                                        }}
                                                        mt={1}
                                                        selectedValue={
                                                            "" + selectedYear
                                                        }
                                                        onValueChange={(
                                                            itemValue
                                                        ) =>
                                                            setSelectedYear(
                                                                Number(
                                                                    itemValue
                                                                )
                                                            )
                                                        }
                                                    >
                                                        {Array.from(
                                                            {
                                                                length:
                                                                    2051 - 1970,
                                                            },
                                                            (_, index) =>
                                                                1970 + index
                                                        ).map((year, index) => (
                                                            <Select.Item
                                                                key={index}
                                                                label={
                                                                    "" + year
                                                                }
                                                                value={
                                                                    "" + year
                                                                }
                                                            />
                                                        ))}
                                                    </Select>
                                                </View>
                                            </View>
                                            <View className="flex flex-col">
                                                <Button
                                                    width={"xs"}
                                                    size={"md"}
                                                    bgColor={"#000000"}
                                                    onPress={() =>
                                                        setMonthChangeOpened(
                                                            false
                                                        )
                                                    }
                                                >
                                                    Select Date
                                                </Button>
                                            </View>
                                        </View>
                                    ) : (
                                        <View>
                                            <View className="flex flex-row items-center justify-center mb-2">
                                                {[
                                                    "Sun",
                                                    "Mon",
                                                    "Tue",
                                                    "Wed",
                                                    "Thu",
                                                    "Fri",
                                                    "Sat",
                                                ].map((day) => (
                                                    <Text
                                                        key={day}
                                                        className="w-[15%] text-center font-bold"
                                                    >
                                                        {day}
                                                    </Text>
                                                ))}
                                            </View>
                                            {renderCalendarGrid()}
                                        </View>
                                    )}
                                </View>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover>
                </View>
                <DateRangeDropdown
                    initialStartDate={selectedDate}
                    initialEndDate={selectedSecondDate}
                    handleDateSelect={handleDateRange}
                />
            </View>
        </View>
    );
};

export default memo(CalendarPicker);
