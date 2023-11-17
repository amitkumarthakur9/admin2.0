import moment from "moment";
import React from "react";
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import DatePickerModal from "../DateSelector/Date/DatePickerModal";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DatePickerComponent({ handleFilterChange, value, fromName = "From", toName = "To", showCalendar = false }) {
    const [open, setOpen] = useState(false)
    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback(
        ({ startDate, endDate }) => {
            setOpen(false);
            handleFilterChange([moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD')])
        },
        [setOpen]
    );

    return (
        <>
            <TouchableOpacity onPress={() => setOpen(true)} className="flex items-center justify-center flex-col rounded border-[0.2px] border-[#c7c7c7] px-4 py-2">
                <View className="flex flex-row justify-start w-full">
                    {
                        showCalendar && <View className="mr-2">
                            <Icon name="calendar" style={{ fontWeight: "100" }} size={14} color="black" />
                        </View>
                    }
                    <View className="flex flex-col">
                        <Text selectable className={"text-xs " + (value?.length > 0 ? "text-black" : "text-slate-400")}>
                            {
                                value?.length > 0 ? value[0] : fromName
                            }
                        </Text>
                    </View>
                    <View className="flex flex-col mx-2">
                        <Text>-</Text>
                    </View>
                    <View className="flex flex-col">
                        <Text selectable className={"text-xs " + (value?.length > 1 ? "text-black" : "text-slate-400")}>
                            {
                                value?.length > 1 ? value[1] : toName
                            }
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View className="">
                <DatePickerModal
                    headerSeparator=""
                    saveLabel=""
                    locale="en"
                    mode="range"
                    visible={open}
                    onDismiss={onDismiss}
                    startDate={value?.length > 0 ? new Date(value[0]) : undefined}
                    endDate={value?.length > 1 ? new Date(value[1]) : undefined}
                    onConfirm={onConfirm}
                />
            </View>
        </>
    )
}

