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

export const FolioRows = ({ data, schema }) => {
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
                <View className="flex flex-row w-2/12">
                    <View className="flex flex-row items-center w-full justify-start">
                        <Text selectable className="font-semibold">
                            Client Name
                        </Text>
                    </View>
                </View>

                <View className="flex flex-row w-1/12">
                    <View className="flex flex-row items-center w-full justify-center">
                        <Text selectable className="font-semibold">
                            PAN
                        </Text>
                    </View>
                </View>

                <View className="flex flex-row items-center w-3/12 justify-center">
                    <Text selectable className="font-semibold">
                        Scheme Name
                    </Text>
                </View>
                <View className="flex flex-row w-1/12 items-center justify-center">
                    <View className="flex flex-row items-center w-1/2">
                        <Text selectable className="font-semibold">
                            Folio Number
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12 items-center justify-center">
                    <View className="flex flex-row items-center">
                        <Text selectable className="font-semibold">
                            NAV
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12 items-center justify-center">
                    <View className="flex flex-row items-center">
                        <Text selectable className="font-semibold">
                            Balance Units
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12 items-center justify-center">
                    <View className="flex flex-row items-center">
                        <Text selectable className="font-semibold">
                            Price
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row w-1/12 items-center justify-center">
                    <View className="flex flex-row items-center">
                        <Text selectable className="font-semibold">
                            Current Value
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row items-center w-1/12 justify-center">
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
            {data.map((client: AUMDataItem, index: number) => {
                return (
                    <View key={index}>
                        <View
                            className={
                                `flex flex-row p-2 justify-between ` +
                                (Dimensions.get("screen").width < 770
                                    ? "w-[1728px]"
                                    : "")
                            }
                        >
                            <View className="flex flex-row w-full w-2/12 flex-wrap">
                                <View className="flex flex-row items-center w-full justify-between flex-wrap">
                                    <View className="flex flex-row items-center justify-start w-full flex-wrap">
                                        <Pressable
                                            onPress={() =>
                                                router.push(
                                                    `/clients/${client.id}`
                                                )
                                            }
                                            className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center flex-wrap"
                                        >
                                            <Text
                                                selectable
                                                className="text-white"
                                            >
                                                {getInitials(
                                                    client.account.name
                                                )}
                                            </Text>
                                        </Pressable>
                                        <View className="flex flex-col flex-wrap w-9/12">
                                            <View className="flex flex-row items-center text-black font-semibold flex-wrap w-11/12">
                                                <Pressable
                                                    onPress={() =>
                                                        router.push(
                                                            `/clients/${client.id}`
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        selectable
                                                        className="text-black font-semibold break-all"
                                                    >
                                                        {client.account.name}
                                                        &nbsp;
                                                    </Text>
                                                </Pressable>
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
                                                                <Text
                                                                    selectable
                                                                >
                                                                    Name:{" "}
                                                                    {
                                                                        client
                                                                            .account
                                                                            .name
                                                                    }
                                                                </Text>
                                                                <Text
                                                                    selectable
                                                                >
                                                                    PAN Number:{" "}
                                                                    {
                                                                        client
                                                                            .account
                                                                            .user
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
                                                    {client.account.clientId}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="flex flex-row w-1/12 items-center justify-center flex-wrap">
                                <Text className="w-10/12" selectable>
                                    {client.account.user.panNumber}
                                </Text>
                            </View>

                            <View className="flex flex-row items-center w-3/12 justify-center flex-wrap">
                                <View className="flex flex-row flex-wrap w-10/12 items-center justify-center">
                                    <View className="flex flex-col flex-wrap items-start w-11/12">
                                        <Text
                                            selectable
                                            className="text-[#000000] font-bold"
                                        >
                                            {client?.mutualfund?.name}
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            Category:{" "}
                                            {
                                                client?.mutualfund
                                                    ?.mutualfundSubcategory
                                                    ?.name
                                            }
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            BSE:{" "}
                                            {
                                                client?.mutualfund
                                                    ?.bseDematSchemeCode
                                            }
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            Fund House:{" "}
                                            {
                                                client?.mutualfund?.fundhouse
                                                    ?.name
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex flex-row w-1/12 items-center justify-center">
                                <Text
                                    selectable
                                    className="p-1 text-black text-end md:text-center text-xs"
                                >
                                    {client.folioNumber}&nbsp;
                                </Text>
                            </View>
                            <View className="flex flex-row items-center w-1/12 justify-center">
                                <Text>{client.mutualfund.nav || "-"}</Text>
                            </View>
                            <View className="flex flex-row items-center w-1/12 justify-center">
                                <Text>{client.units}</Text>
                            </View>
                            <View className="flex flex-row items-center w-1/12 justify-center">
                                <Text>
                                    {client.investedValue
                                        ? RupeeSymbol + client.investedValue
                                        : "-"}
                                </Text>
                            </View>
                            <View className="flex flex-row items-center w-1/12  justify-center">
                                <Text>{RupeeSymbol + client.currentValue}</Text>
                            </View>

                            <View className="flex flex-row items-center w-1/12 justify-center">
                                {/* <Link
                                href={{
                                    pathname: "/folio/[id]",
                                    params: { id: client.id }
                                }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                <Text selectable className='text-white text-start md:text-center text-xs w-10/12'>View</Text>
                            </Link> */}
                                <Pressable
                                    onPress={() =>
                                        router.push(`folio/${client.id}`)
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
        </>
    );
};
