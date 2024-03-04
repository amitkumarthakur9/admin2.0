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
import { Popover } from "native-base";
import { Link, router } from "expo-router";
import { RupeeSymbol } from "../../helper/helper";
import { MandateDataInterface } from "../../interfaces/MandateResponseInterface";
import { getMandateMessage } from "../../helper/StatusInfo";

export const MandateRows = ({ data, schema }) => {
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
            <View
                className={
                    `flex flex-row py-4 px-2 justify-between ` +
                    (Dimensions.get("screen").width < 770 ? "w-[1728px]" : "")
                }
            >
                <View className="flex flex-row w-[20%]">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            Client Name
                        </Text>
                    </View>
                </View>

                <View className="flex flex-row w-[20%]">
                    <View className="flex flex-row items-center w-full justify-center">
                        <Text selectable className="font-semibold">
                            Amount
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row items-center  w-[20%] justify-center">
                    <Text selectable className="font-semibold">
                        Bank Account
                    </Text>
                </View>
                <View className="flex flex-row w-[20%] items-center justify-center">
                <View className="flex flex-row items-center w-10/2">
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
                                        <Text className="pb-2">Initiated: Mandate order successfully placed</Text>
                                        <Text className="pb-2">Registered: Mandate order Successfully registered on BSE.</Text>
                                        <Text className="pb-2">Approved: Mandate is approved</Text>
                                        <Text className="pb-2">Processing: Exchange has approved mandate, it’s pending from Bank side</Text>
                                        <Text className="pb-2">Failed: Mandate is failed</Text>
                                        <Text className="pb-2">Rejected - Mandate is Rejected</Text>
                                    </View>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover>
                        <Text selectable className="font-semibold ml-2">
                            Mandate Status
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row items-center  w-[20%] justify-center">
                    <Text selectable className="font-semibold">
                        Action
                    </Text>
                </View>
            </View>
            <View
                className="mb-2"
                style={{
                    borderColor: "#e4e4e4",
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />
            {data.map((mandate: MandateDataInterface, index: number) => {
                return (
                    <View key={index}>
                        <View className={`flex flex-row p-2 justify-between `}>
                            <View className="flex flex-row w-full w-[20%] flex-wrap">
                                <View className="flex flex-row items-center w-full justify-between flex-wrap">
                                    <View className="flex flex-row items-center justify-start w-full flex-wrap">
                                        <Pressable
                                            onPress={() =>
                                                router.push(
                                                    `/clients/${mandate.id}`
                                                )
                                            }
                                            className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center flex-wrap"
                                        >
                                            <Text
                                                selectable
                                                className="text-white"
                                            >
                                                {getInitials(
                                                    mandate.account.name
                                                )}
                                            </Text>
                                        </Pressable>
                                        <View className="flex flex-col flex-wrap w-9/12">
                                            <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12">
                                                <Text
                                                    selectable
                                                    className="text-black font-semibold break-all"
                                                >
                                                    {mandate.account.name}&nbsp;
                                                </Text>
                                            </View>
                                            <View className="flex flex-row items-center mt-0">
                                                <Text
                                                    selectable
                                                    className="text-[#6C6A6A] text-sm"
                                                >
                                                    {mandate.account.clientId}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="flex flex-row w-[20%] items-center justify-center flex-wrap">
                                <View className="flex flex-row flex-wrap w-10/12 items-center justify-center">
                                    <Text selectable>
                                        {RupeeSymbol + mandate.amount}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex flex-row items-center w-[20%] justify-center flex-wrap">
                                <View className="flex flex-row flex-wrap w-10/12 items-center justify-center">
                                    <View className="flex flex-col flex-wrap items-start w-11/12">
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            Bank Name:{" "}
                                            {mandate.bankAccount.bankName}
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            Branch Name:{" "}
                                            {mandate.bankAccount.branchName}
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            IFSC Code:{" "}
                                            {mandate.bankAccount.ifscCode}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row  w-[20%] items-center justify-center">
                                <Popover trigger={triggerProps => {
                                    return <TouchableOpacity {...triggerProps}>
                                        <Icon name="info-circle" size={12} color="black" />
                                    </TouchableOpacity>;
                                }}>
                                    <Popover.Content accessibilityLabel="Order Details" w="56">
                                        <Popover.Arrow />
                                        <Popover.CloseButton />
                                        <Popover.Header>{mandate.mandateStatus.name}</Popover.Header>
                                        <Popover.Body>
                                            <View>
                                                <Text>{getMandateMessage(mandate.mandateStatus.name)}</Text>
                                            </View>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover>
                                <Text
                                    selectable
                                    className="p-1 text-black text-end md:text-center text-xs"
                                >
                                    {mandate.mandateStatus.name}&nbsp;
                                </Text>
                            </View>
                            <View className="flex flex-row items-center w-[20%] justify-center">
                                {/* <Link
                                href={{
                                    pathname: "/folio/[id]",
                                    params: { id: mandate.id }
                                }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                <Text selectable className='text-white text-start md:text-center text-xs w-10/12'>View</Text>
                            </Link> */}
                                <Pressable
                                    onPress={() =>
                                        router.push(`mandates/${mandate.id}`)
                                    }
                                    className="rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-6/12 h-6"
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
        </>
    );
};
