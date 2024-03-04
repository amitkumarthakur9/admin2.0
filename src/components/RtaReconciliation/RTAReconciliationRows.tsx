import {
    Dimensions,
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
import { ClientInterface } from "../../interfaces/ClientInterface";
import {
    Badge,
    Box,
    Button,
    Center,
    CheckIcon,
    Modal,
    Popover,
    Select,
} from "native-base";
import { RTAReconcilation } from "../../interfaces/RTAResponseInterface";
import { DateTime } from "luxon";
import { RupeeSymbol } from "../../helper/helper";
import moment from "moment";
import { router } from "expo-router";
import { useState } from "react";
import RemoteApi from "../../services/RemoteApi";
import { TransactionStatusModal } from "./TransactionStatusUpdateModal";
import { getTransactionMessage } from "../../helper/StatusInfo";

export const RTAReconciliationRows = ({ data, schema, getDataList }) => {
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
            <View className={`flex flex-row py-4 px-2 justify-between `}>
                <View className="flex flex-row w-2/12">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            Client Name
                        </Text>
                    </View>
                </View>

                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            Scheme
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            RTA Agent Code
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            BSE Order No
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-start w-4/5">
                        <Text selectable className="font-semibold">
                            Payment Date
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-start flex-wrap">
                        <Text selectable className="font-semibold">
                            Folio No
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            Amount
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            Created At
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-4/5 justify-start">
                        <Text selectable className="font-semibold">
                            Transaction Type
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center justify-center w-11/12">
                        <View className='flex flex-row justify-center items-center mr-1'>
                            <Popover trigger={triggerProps => {
                                return <TouchableOpacity {...triggerProps}>
                                    <Icon name="info-circle" size={12} color="black" />
                                </TouchableOpacity>;
                            }}>
                                <Popover.Content accessibilityLabel="Order Details" w="56">
                                    <Popover.Arrow />
                                    <Popover.CloseButton />
                                    <Popover.Header>Definition</Popover.Header>
                                    <Popover.Body>
                                        <View>
                                            <Text className="pb-2">Initiated: Order Successfully Placed</Text>
                                            <Text className="pb-2">Placed: Order Success placed on BSE</Text>
                                            <Text className="pb-2">Payment Initiated: Payment Initiated</Text>
                                            <Text className="pb-2">Payment Done: Payment is successfully Done</Text>
                                            <Text className="pb-2">Registered: Order is successfully registered on BSE</Text>
                                            <Text className="pb-2">Approved: Allotment is Done on BSE</Text>
                                            <Text className="pb-2">Allotted: RTA allotment is done</Text>
                                            <Text className="pb-2">Failed: Order is Failed</Text>
                                        </View>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </View>

                        <Text selectable className="font-semibold text-center">
                            Transaction Status
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center justify-start w-4/5">
                        <Text selectable className="font-semibold">
                            Actions
                        </Text>
                    </View>
                </View>
            </View>
            <View
                className="mb-2"
                style={{
                    borderColor: "#e4e4e4",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
            {data.map((rta: RTAReconcilation, index: number) => {
                return (
                    <View key={index}>
                        <View
                            className={`flex flex-row p-2 justify-between `}
                            style={{
                                backgroundColor: id == rta.id ? "#e1e1e1" : "",
                            }}
                        >
                            <View className="flex flex-row w-2/12 flex-wrap">
                                <View className="flex flex-row items-center justify-start flex-wrap w-full">
                                    <Pressable
                                        onPress={() =>
                                            router.push(
                                                `/clients/${rta.account.id}`
                                            )
                                        }
                                        className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center flex-wrap"
                                    >
                                        <Text selectable className="text-white">
                                            {getInitials(rta.account.name)}
                                        </Text>
                                    </Pressable>
                                    <View className="flex flex-col flex-wrap w-9/12">
                                        <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12">
                                            <Text
                                                selectable
                                                className="text-black font-semibold break-all"
                                            >
                                                {rta.account.name}&nbsp;
                                            </Text>
                                            <Popover
                                                trigger={(triggerProps) => {
                                                    return (
                                                        <TouchableOpacity
                                                            {...triggerProps}
                                                        >
                                                            <Icon
                                                                name="info-circle"
                                                                size={12}
                                                                color="black"
                                                            />
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            >
                                                <Popover.Content
                                                    accessibilityLabel="Order Details"
                                                    w="56"
                                                >
                                                    <Popover.Arrow />
                                                    <Popover.CloseButton />
                                                    <Popover.Header>
                                                        Customer Detail
                                                    </Popover.Header>
                                                    <Popover.Body>
                                                        <View>
                                                            <Text>
                                                                Name:{" "}
                                                                {
                                                                    rta.account
                                                                        .name
                                                                }
                                                            </Text>
                                                            <Text>
                                                                PAN Number:{" "}
                                                                {
                                                                    rta.account
                                                                        .user[0]
                                                                        .panNumber
                                                                }
                                                            </Text>
                                                        </View>
                                                    </Popover.Body>
                                                </Popover.Content>
                                            </Popover>
                                        </View>
                                        <View className="flex flex-row items-center mt-0">
                                            <Text
                                                selectable
                                                className="text-[#6C6A6A] text-sm"
                                            >
                                                {rta.account.clientId}
                                            </Text>
                                            {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}
                                        </View>
                                        <View className="flex flex-row items-center mt-0">
                                            <Text
                                                selectable
                                                className="text-[#6C6A6A] text-sm"
                                            >
                                                {rta.account.user[0].panNumber}
                                            </Text>
                                            {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row w-1/12 ">
                                <View className="flex flex-col w-9/12">
                                    <Text
                                        selectable
                                        className="text-[#000000] font-bold whitespace-normal "
                                    >
                                        {rta.mutualfund.name}
                                    </Text>
                                    <Text
                                        selectable
                                        className="text-[#686868] font-semibold"
                                    >
                                        {rta.mutualfund.bseDematSchemeCode}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex flex-row w-1/12">
                                <Text className="w-10/12" selectable>
                                    {rta.mutualfund.fundhouse?.rta?.name || "-"}
                                </Text>
                            </View>
                            <View className="flex flex-row w-1/12">
                                <Text className="w-10/12" selectable>
                                    {rta.orderReferenceNumber || "-"}
                                </Text>
                            </View>
                            <View className="flex flex-row w-1/12">
                                <Text className="w-10/12" selectable>
                                    {rta.paymentDate
                                        ? moment(rta.paymentDate).format(
                                              "DD-MM-YYYY hh:mm:ss A"
                                          )
                                        : "-"}
                                </Text>
                            </View>
                            <View className="flex flex-row w-1/12">
                                <Text className="w-10/12" selectable>
                                    {rta.folioNumber || "-"}
                                </Text>
                            </View>
                            <View className="flex flex-row w-1/12">
                                <View className="flex flex-col">
                                    <Text selectable>
                                        {rta.amount
                                            ? RupeeSymbol + rta.amount
                                            : "-"}
                                    </Text>
                                    {rta.units ? (
                                        <Text
                                            selectable
                                            className="text-[10px]"
                                        >
                                            {rta.units} Units
                                        </Text>
                                    ) : (
                                        ""
                                    )}

                                    {rta.nav ? (
                                        <Text
                                            selectable
                                            className="text-[10px]"
                                        >
                                            {rta.nav} NAV
                                        </Text>
                                    ) : (
                                        ""
                                    )}
                                </View>
                            </View>
                            <View className="flex flex-row w-1/12">
                                <Text className="w-10/12" selectable>
                                    {rta.createdAt
                                        ? moment(
                                              new Date(rta.createdAt)
                                          ).format("DD-MM-YYYY hh:mm:ss A")
                                        : "-"}
                                </Text>
                            </View>

                            <View className="flex flex-row w-1/12">
                                <Text className="w-10/12" selectable>
                                    {rta.transactionType || "-"}
                                </Text>
                            </View>
                            <View className="flex flex-row w-1/12 justify-start items-center">
                                <View className='flex flex-row justify-center items-center mr-1'>
                                    <Popover trigger={triggerProps => {
                                        return <TouchableOpacity {...triggerProps}>
                                            <Icon name="info-circle" size={12} color="black" />
                                        </TouchableOpacity>;
                                    }}>
                                        <Popover.Content accessibilityLabel="Order Details" w="56">
                                            <Popover.Arrow />
                                            <Popover.CloseButton />
                                            <Popover.Header>{rta.transactionStatus}</Popover.Header>
                                            <Popover.Body>
                                                <View>
                                                    <Text>{getTransactionMessage(rta.transactionStatus)}</Text>
                                                </View>
                                            </Popover.Body>
                                        </Popover.Content>
                                    </Popover>
                                </View>
                                <View className="flex flex-col h-6 items-center justify-start  w-[99%]">
                                    <View className="flex flex-row items-start justify-start w-11/12">

                                        {rta.transactionStatus === "Alloted" || rta.transactionStatus === "Failed"
                                            ? <Text
                                                selectable
                                                className="p-1 text-black text-start text-xs"
                                            >
                                                {rta.transactionStatus || "-"}
                                            </Text> :
                                            <View className="flex flex-row items-center text-start ">
                                                <Text
                                                    selectable
                                                    className="p-1 text-black text-start text-xs"
                                                >
                                                    {rta.transactionStatus || "-"}
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
                                                        size={15}
                                                        color="black"
                                                    />
                                                </Pressable>
                                         </View>
                                        }

                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row w-1/12 justify-start">
                                <Pressable
                                    onPress={() =>
                                        router.push(
                                            `rta-reconciliation/${rta.id}`
                                        )
                                    }
                                    className="rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6"
                                >
                                    <Text
                                        selectable
                                        className="text-white text-center text-xs w-10/12"
                                    >
                                        View
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                        {index < data.length - 1 && (
                            <View
                                className="my-2"
                                style={{
                                    borderColor: "#e4e4e4",
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                }}
                            />
                        )}
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
