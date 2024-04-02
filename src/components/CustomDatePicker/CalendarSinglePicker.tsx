// CalendarPicker.js

import React, { memo, useEffect, useState } from "react";
import {
    getAllDatesInMonth,
    getDaysInMonth,
    getMonthName,
    monthNames,
} from "../../helper/DateUtils";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
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

const CalendarSinglePicker = ({
    handleFilterChange,
    value,
    fromName = "1990-03-23",
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
    const [monthChangeOpened, setMonthChangeOpened] = useState(false);

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        // Modify the handleFilterChange function to accept a string instead of an array
        handleFilterChange(moment(date).format("YYYY-MM-DD"));
        setIsOpen(false);
    };
    

    const getSelectedColor = (date) => {
        let color = "";

        if (selectedDate && selectedDate == date) {
            color = "bg-black rounded";
        }

        return color;
    };

    const getSelectedFontColor = (date) => {
        let color = "";

        if (selectedDate && selectedDate == date) {
            color = "text-white";
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
                            `${selectedYear}-${selectedMonth - 1}-${prevMonthDate}`
                        )
                    }
                    key={`prev-${i}`}
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
                                `${selectedYear}-${selectedMonth + 1}-${nextMonthDate}`
                            )
                        }
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
            <Popover
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                isOpen={isOpen}
                trigger={(triggerProps) => {
                    return (
                        <TouchableOpacity
                            {...triggerProps}
                            className={
                                "flex w-full items-center justify-center flex-col rounded border-[0.2px] border-[#c7c7c7] px-4 " +
                                py
                            }
                        >
                            <View className="flex flex-row justify-start w-full">
                                {showCalendar && (
                                    <View className="mr-2">
                                        <Icon
                                            name="calendar"
                                            style={{ fontWeight: "100" }}
                                            size={14}
                                            color="black"
                                        />
                                    </View>
                                )}
                                <View className="flex flex-col">
                                    <Text
                                        selectable
                                        className={
                                            "text-base " +
                                            (value
                                                ? "text-black"
                                                : "text-slate-400")
                                        }
                                    >
                                        {value
                                            ? value
                                            : fromName}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            >
                <Popover.Content accessibilityLabel="" w="100%" h={"xs"}>
                    <Popover.Body>
                        <View h={"xs"}>
                        <View className="flex flex-row p-2 justify-between mb-4">
                                <View>
                                    <Pressable onPress={handleBack}>
                                        <ChevronLeftIcon />
                                    </Pressable>
                                </View>
                                <Pressable
                                    onPress={() => setMonthChangeOpened(true)}
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
                                                onValueChange={(itemValue) =>
                                                    setSelectedMonth(
                                                        Number(itemValue)
                                                    )
                                                }
                                            >
                                                {monthNames().map(
                                                    (month, index) => (
                                                        <Select.Item
                                                            label={month}
                                                            value={
                                                                "" + (index + 1)
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
                                                onValueChange={(itemValue) =>
                                                    setSelectedYear(
                                                        Number(itemValue)
                                                    )
                                                }
                                            >
                                                {Array.from(
                                                    { length: 2051 - 1970 },
                                                    (_, index) => 1970 + index
                                                ).map((year, index) => (
                                                    <Select.Item
                                                        key={index}
                                                        label={"" + year}
                                                        value={"" + year}
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
                                                setMonthChangeOpened(false)
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
    );
};

export default memo(CalendarSinglePicker);

