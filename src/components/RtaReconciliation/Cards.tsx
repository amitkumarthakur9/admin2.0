import {
    Dimensions,
    Image,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { OrderInterface } from "../../interfaces/OrderInterface";
import DynamicComponentRenderer from "../../helper/DynamicComponentRenderer";
import { TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import {
    Badge,
    Box,
    Center,
    CheckIcon,
    HamburgerIcon,
    Menu,
    Modal,
    Popover,
    Select,
    ThreeDotsIcon,
} from "native-base";
import moment from "moment";
import { Link, router } from "expo-router";
import { RupeeSymbol } from "../../helper/helper";
import { RTAReconcilation } from "../../interfaces/RTAResponseInterface";
import { TransactionStatusModal } from "./TransactionStatusUpdateModal";

export const Cards = ({
    data,
    schema,
    getDataList,
}: {
    data: RTAReconcilation[];
    schema: any;
    getDataList: any;
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [id, setId] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");

    const getInitials = (name: string) => {
        const words = name.split(" ");
        if (words.length >= 2) {
            const firstWord = words[0];
            const secondWord = words[1];
            return `${firstWord[0]}${secondWord[0]}`;
        } else if (words.length === 1) {
            return words[0][0];
        } else {
            return "";
        }
    };

    return (
        <>
            {data.map((rta: RTAReconcilation, index: number) => {
                return (
                    <View key={index}>
                        <View
                            className={
                                `flex flex-row p-2 justify-between flex-wrap rounded-xl mx-2 mb-3 ` +
                                (index % 2 ? "bg-[#eaf3fe]" : "bg-[#f0f0f0]")
                            }
                            style={{
                                borderColor:
                                    id == rta.id ? "#367a88" : "#94a3b8",
                                borderWidth: id == rta.id ? 1 : 0.2,
                            }}
                        >
                            <View className="flex flex-col w-full">
                                <View className="flex flex-row w-full justify-between">
                                    <View className="flex flex-row items-center justify-start w-8/12">
                                        <Pressable
                                            onPress={() =>
                                                router.push(
                                                    `/clients/${rta.account.id}`
                                                )
                                            }
                                            className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center"
                                        >
                                            <Text
                                                selectable
                                                className="text-white"
                                            >
                                                {getInitials(rta.account.name)}
                                            </Text>
                                        </Pressable>
                                        <View className="flex flex-col w-full">
                                            <View className="flex flex-row items-center text-black font-semibold break-all w-9/12">
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all"
                                                >
                                                    {rta.account.name}
                                                </Text>
                                            </View>
                                            <View className="flex flex-row items-center mt-1 md:mt-0 lg:mt-0 flex-wrap w-9/12">
                                                <Text
                                                    selectable
                                                    className="text-[#6C6A6A] text-sm"
                                                >
                                                    {rta.account.clientId}
                                                </Text>
                                                <View className="rounded-full bg-[#6C6A6A] h-2 w-2 mx-1"></View>
                                                <View className="flex flex-row items-center">
                                                    <Text
                                                        selectable
                                                        className="text-[#6C6A6A] text-sm"
                                                    >
                                                        {
                                                            rta.account.user[0]
                                                                .panNumber
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex flex-col items-center justify-center w-4/12">
                                        <View className="flex flex-row items-center w-full justify-center">
                                            <Text
                                                selectable
                                                className="p-1 text-black font-bold text-end text-sm"
                                            >
                                                {RupeeSymbol + rta.amount}
                                            </Text>
                                        </View>
                                        <View className="flex flex-row items-center rounded-full w-full justify-center">
                                            <Text
                                                selectable
                                                className="p-1 text-black text-end text-xs"
                                            >
                                                {rta.transactionStatus}
                                            </Text>
                                            <Pressable
                                                onPress={() => {
                                                    setModalVisible(true),
                                                        setId(rta.id),
                                                        setTransactionStatus(
                                                            rta.transactionStatus
                                                        );
                                                }}
                                            >
                                                <Icon
                                                    name="edit"
                                                    size={12}
                                                    color="black"
                                                />
                                            </Pressable>
                                        </View>
                                    </View>

                                    {/* <View className="flex flex-row items-start justify-center pt-2">
                                   
                                </View> */}
                                </View>

                                <View className="flex flex-row items-center justify-between pl-12 mt-1">
                                    <View className="flex flex-row">
                                        <Text
                                            selectable
                                            className="text-black font-bold text-start"
                                        >
                                            {rta.folioNumber || "-"}
                                        </Text>
                                    </View>
                                    <View className="flex flex-row">
                                        <Text
                                            selectable
                                            className="text-black text-xs text-center"
                                        >
                                            {rta.paymentDate &&
                                                moment(
                                                    new Date(rta.paymentDate)
                                                ).format(
                                                    "DD-MM-YYYY hh:mm:ss A"
                                                )}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex flex-row items-center w-full justify-start mt-2">
                                    <Image
                                        className="mr-2"
                                        style={{ width: 40, height: 40 }}
                                        source={{
                                            uri: "https://www.fundexpert.in/cdn/logos-neo/icici.png",
                                        }}
                                    />
                                    <View
                                        className={
                                            "flex flex-col justify-end items-start w-10/12"
                                        }
                                    >
                                        <Text
                                            selectable
                                            className="text-black font-semibold break-all text-sm flex-wrap"
                                        >
                                            {rta.mutualfund.fundhouse.name}
                                        </Text>
                                        <View className="flex flex-row items-center flex-wrap">
                                            <Text
                                                selectable
                                                className="text-black text-xs"
                                            >
                                                BSE:{" "}
                                                {
                                                    rta.mutualfund
                                                        .bseDematSchemeCode
                                                }
                                            </Text>
                                        </View>
                                        {/* <View className='flex flex-row items-center flex-wrap'>
                                        <Text selectable className='text-black text-xs'>AMC: {rta.mutualfund.name}</Text>
                                    </View> */}
                                    </View>
                                </View>

                                <View className="flex flex-row items-start justify-center w-full flex-wrap mt-3">
                                    <View className="flex flex-col items-center w-4/12 justify-cente mb-[10px]">
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px]"
                                        >
                                            RTA Code
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-black font-bold text-[13px]"
                                        >
                                            {rta.mutualfund.rtaCode || "-"}{" "}
                                        </Text>
                                    </View>
                                    <View className="flex flex-col items-center w-4/12 justify-center mb-[10px]">
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px]"
                                        >
                                            Order No{" "}
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-black font-bold text-[13px]"
                                        >
                                            {rta.orderReferenceNumber || "-"}{" "}
                                        </Text>
                                    </View>
                                    <View className="flex flex-col items-center w-4/12 justify-center mb-[10px]">
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px]"
                                        >
                                            Created At
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-black font-bold text-[13px] text-center"
                                        >
                                            {rta.createdAt
                                                ? moment(
                                                      new Date(rta.createdAt)
                                                  ).format(
                                                      "DD-MM-YYYY hh:mm:ss A"
                                                  )
                                                : "-"}{" "}
                                        </Text>
                                    </View>
                                    <View className="flex flex-col items-center w-4/12 justify-center mb-[10px]">
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px]"
                                        >
                                            Type
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-black font-bold text-[13px]"
                                        >
                                            {rta.transactionType || "-"}{" "}
                                        </Text>
                                    </View>
                                    <View className="flex flex-col items-center w-4/12 justify-center mb-[10px]">
                                        <Text
                                            selectable
                                            className="text-slate-600 font-base text-[10px]"
                                        >
                                            Transaction Type
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-black font-bold text-[13px] text-center"
                                        >
                                            {rta.transactionType || "-"}{" "}
                                        </Text>
                                    </View>
                                </View>

                                {/* <View className='flex flex-row items-center w-full mt-3'>
                                <TouchableRipple onPress={() => router.push(`orders/${rta.id}`)} className='w-full py-2 rounded-full border-[0.4px] bg-black'>
                                    <Text selectable className='text-white text-center text-xs'>View Details</Text>
                                </TouchableRipple>
                            </View> */}
                            </View>
                        </View>
                    </View>
                );
            })}

            <TransactionStatusModal
                key={id}
                transactionStatus={transactionStatus}
                id={id}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setId={setId}
                getDataList={getDataList}
            />
        </>
    );
};
