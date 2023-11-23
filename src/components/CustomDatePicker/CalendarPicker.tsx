// CalendarPicker.js

import React, { useState } from 'react';
import { getAllDatesInMonth, getDaysInMonth, getMonthName } from '../../helper/DateUtils';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Popover, Button } from 'native-base';

const CalendarPicker = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const allDatesInMonth = getAllDatesInMonth(selectedYear, selectedMonth);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const renderCalendarGrid = () => {
        const calendarGrid = [];
        let currentRow = [];

        // Render previous month's dates if the month starts from a day other than Sunday
        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonthDate = getDaysInMonth(selectedYear, selectedMonth - 1) - firstDayOfMonth + i + 1;
            currentRow.push(
                <TouchableOpacity
                    className='w-20'
                    key={`prev-${i}`}
                    disabled={true}
                    onPress={() => handleDateSelect(prevMonthDate)}
                >
                    <Text className='text-slate-600 p-2'>{prevMonthDate}</Text>
                </TouchableOpacity>
            );
        }

        allDatesInMonth.forEach((date, index) => {
            currentRow.push(
                <TouchableOpacity
                    key={date}
                    onPress={() => handleDateSelect(date)}
                    className='w-20'
                >
                    <Text className='p-2'>
                        {date}
                    </Text>
                </TouchableOpacity>
            );

            if ((firstDayOfMonth + index + 1) % 7 === 0) {
                // Start a new row for each Sunday
                calendarGrid.push(
                    <View key={`row-${index}`} className='flex flex-row items-center justify-center'>
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
                    <TouchableOpacity
                        key={`next-${i}`}
                        className='w-20'
                        disabled={true}
                        onPress={() => handleDateSelect(nextMonthDate)}
                    >
                        <Text className='text-slate-600 p-2'>{nextMonthDate}</Text>
                    </TouchableOpacity>
                );
            }
            calendarGrid.push(
                <View key={`row-last`} className='flex flex-row items-center justify-center'>
                    {currentRow}
                </View>
            );
        }

        return calendarGrid;
    };



    return <View>
        <Box w="100%" alignItems="center">
            <Popover trigger={triggerProps => {
                return <Button {...triggerProps} colorScheme="danger">
                    Delete Customer
                </Button>;
            }}>
                <Popover.Content accessibilityLabel="Delete Customerd" w="600">
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header>Delete Customer</Popover.Header>
                    <Popover.Body>
                        <View>
                            <View className='flex flex-row p-2'>
                                <Text>
                                    {getMonthName(selectedMonth)} {selectedYear}
                                </Text>
                            </View>

                            <View>
                                <View className='flex flex-row items-center justify-center'>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <Text key={day} className='w-20'>
                                            {day}
                                        </Text>
                                    ))}
                                </View>
                                {renderCalendarGrid()}
                            </View>
                        </View>
                    </Popover.Body>
                </Popover.Content>
            </Popover>
        </Box>
    </View>

};



export default CalendarPicker 
