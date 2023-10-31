import React from "react";
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { DatePickerModal, DatePickerInput } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePickerSingle from "./DatePickerSingle";
import { Checkbox, Modal, Portal, TextInput, Button } from "react-native-paper";
import { InputMode } from "react-native-paper/lib/typescript/components/TextInput/Adornment/enums";
import CustomCheckBox from "../Checkbox/CustomCheckBox";


export default function DatePickerComponent({ setFilters, filters }) {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [text, setText] = React.useState("");
    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            setRange({ startDate, endDate });
        },
        [setOpen, setRange]
    );

    const [checked, setChecked] = React.useState(false);


    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const minDate = new Date(); // Today
    const maxDate = new Date(2017, 6, 3);
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';


    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            setSelectedStartDate(date)
        } else {
            setSelectedEndDate(date)
        }
    }

    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    return (
        <>
            <TouchableOpacity onPress={() => setOpen(true)} className="flex flex-col  border-[0.2px] border-black px-4 py-2">
                <View className="flex flex-row items-center mb-2">
                    <Icon name="calendar" size={12} color="black" />
                    <Text className="ml-2">Request Date</Text>
                </View>

                <View className="flex flex-row justify-start w-full">
                    <View className="flex flex-col">
                        <Text className="text-xs">
                            {
                                range.startDate ? range.startDate.toDateString() : "From"
                            }
                        </Text>
                    </View>
                    <View className="flex flex-col mx-2">
                        <Text>-</Text>
                    </View>
                    <View className="flex flex-col">
                        <Text className="text-xs">
                            {
                                range.endDate ? range.endDate.toDateString() : "To"
                            }
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View className="">

                <DatePickerModal
                    // dateMode="start"
                    headerSeparator=""
                    // saveLabelDisabled
                    saveLabel=""
                    locale="en"
                    mode="range"
                    visible={open}
                    onDismiss={onDismiss}
                    startDate={range.startDate}
                    endDate={range.endDate}
                    onConfirm={onConfirm}
                />
            </View>

            <DatePickerSingle />

            <View className=" mt-4">
                <TextInput
                    className="bg-white"
                    label="Type"
                    value={text}
                    // keyboardType={KeyboardType}
                    onChangeText={text => setText(text)}
                />
            </View>


            <CustomCheckBox isChecked={checked} setIsChecked={setChecked} />


        </>
    )
}

