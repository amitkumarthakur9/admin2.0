import React from "react";
import { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { DatePickerModal } from "../DateSelector/Date/DatePickerModal";

export default function DatePickerSingle() {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [range, setRange] = useState({
        startDate: undefined,
        endDate: undefined,
    });
    const [inputDate, setInputDate] = React.useState(undefined);
    const onDismissSingle = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmSingle = React.useCallback(
        (params) => {
            setOpen(false);
            setDate(params.date);
        },
        [setOpen, setDate]
    );

    return (
        <>
            <View className="flex flex-col border-[0.2px] border-black px-4 py-2 mt-5">
                <View className="flex flex-row items-center mb-2">
                    <Icon name="calendar" size={12} color="black" />
                    <Text selectable className="ml-2">
                        Request Date
                    </Text>
                </View>

                <TouchableOpacity
                    className="flex flex-row  w-full"
                    onPress={() => setOpen(true)}
                >
                    <View className="flex flex-col ">
                        <Text selectable className="text-xs">
                            {date ? date.toDateString() : "Select"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                }}
            >
                <DatePickerModal
                    locale="en"
                    mode="single"
                    visible={open}
                    onDismiss={onDismissSingle}
                    date={date}
                    onConfirm={onConfirmSingle}
                />
            </View>
        </>
    );
}
