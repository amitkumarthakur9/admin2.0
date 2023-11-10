import moment from "moment";
import React from "react";
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { DatePickerModal } from "../DateSelector/Date/DatePickerModal";


export default function DatePickerComponent({ handleFilterChange, value }) {
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
            <TouchableOpacity onPress={() => setOpen(true)} className="flex flex-col rounded border-[0.2px] border-[#c7c7c7] px-4 py-2">
                <View className="flex flex-row justify-start w-full">
                    <View className="flex flex-col">
                        <Text className={"text-xs " + (value?.length > 0 ? "text-black" : "text-slate-400")}>
                            {
                                value?.length > 0 ? value[0] : "From"
                            }
                        </Text>
                    </View>
                    <View className="flex flex-col mx-2">
                        <Text>-</Text>
                    </View>
                    <View className="flex flex-col">
                        <Text className={"text-xs " + (value?.length > 1 ? "text-black" : "text-slate-400")}>
                            {
                                value?.length > 1 ? value[1] : "To"
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

