import {
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
import { ReportInterface } from "../../interfaces/ReportInterface";
import moment from "moment";
import { Popover } from "native-base";
import { Link, router } from "expo-router";
import { getOrderMessage } from "../../helper/StatusInfo";
import { useUserRole } from "../../context/useRoleContext";

export const SIPRows = ({
    data,
    schema,
}: {
    data: SIPReportItems[];
    schema: any;
}) => {
    const getInitials = (name: string) => {
        if (!name) return "";
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

    const { roleId } = useUserRole();

    return (
        <>
            <View
                className={`hidden md:hidden lg:flex flex-row py-4 px-2 justify-between flex-wrap`}
            >
                <View className="flex flex-row w-6/12">
                    {/* <View
                        className={`marker:flex flex-row items-center w-${
                            roleId > 3 ? "3/12" : roleId > 2 ? "4/12" : "5/12"
                        } justify-start`}
                    >
                        <Text selectable className="font-semibold">
                            Customer Name
                        </Text>
                    </View> */}
                    <View className="flex flex-row items-center w-5/12 justify-start"
                    >
                        <Text selectable className="font-semibold">
                            Customer Name
                        </Text>
                    </View>

                    {/* <View
                        className={`flex flex-row items-center w-${
                            roleId > 3 ? "1/12" : roleId > 2 ? "2/12" : "3/12"
                        } justify-start`}
                    >
                        <Text selectable className="font-semibold">
                            Folio No
                        </Text>
                    </View> */}
                    <View
                        className={`flex flex-row items-center w-3/12
                         justify-start`}
                    >
                        <Text selectable className="font-semibold">
                            Folio No
                        </Text>
                    </View>
                    {/* {roleId > 2 && (
                        <View className="flex flex-row w-2/12">
                            <View className="flex flex-row items-center w-full justify-start">
                                <Text selectable className="font-semibold">
                                    Distributor
                                </Text>
                            </View>
                        </View>
                    )}
                    {roleId > 3 && (
                        <View className="flex flex-row w-2/12">
                            <View className="flex flex-row items-center w-full justify-start">
                                <Text selectable className="font-semibold">
                                    Manager
                                </Text>
                            </View>
                        </View>
                    )} */}

                    <View className="flex flex-row items-center w-4/12 justify-start">
                        <Text selectable className="font-semibold">
                            Scheme
                        </Text>
                    </View>
                </View>

                <View className="flex flex-row w-6/12">
                    <View className="flex flex-row items-center w-3/12 justify-center">
                        <Text selectable className="font-semibold">
                            Request Date Time
                        </Text>
                    </View>
                    <View className="flex flex-row items-center w-3/12 justify-center">
                        <Text selectable className="font-semibold">
                            Next SIP Date
                        </Text>
                    </View>

                    <View className="flex flex-row items-center w-2/12 justify-center">
                        <Text selectable className="font-semibold">
                            Amount
                        </Text>
                    </View>

                    <View className="flex flex-row w-2/12 items-center justify-center">
                        <View className="flex flex-row items-center justify-center">
                            <Popover
                                trigger={(triggerProps) => {
                                    return (
                                        <TouchableOpacity {...triggerProps}>
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
                                    <Popover.Header>Definition</Popover.Header>
                                    <Popover.Body>
                                        <View>
                                            <Text className="pb-2">
                                                Initiated: Order Successfully
                                                placed.
                                            </Text>
                                            <Text className="pb-2">
                                                Registered: order Successfully
                                                placed on BSE.
                                            </Text>
                                            <Text className="pb-2">
                                                Cancelled: Order is Cancelled on
                                                BSE.
                                            </Text>
                                            <Text className="pb-2">
                                                Failed: Order is Failed.
                                            </Text>
                                            <Text className="pb-2">
                                                Success: order is successfully
                                                registered on BSE
                                            </Text>
                                        </View>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                            <Text selectable className="font-semibold pl-2">
                                Status&nbsp;
                            </Text>
                        </View>
                    </View>

                    <View className="flex flex-row items-center justify-center w-2/12">
                        <Text selectable className="font-semibold">
                            Action
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
            {data.map((order: SIPReportItems, index: number) => {
                return (
                    <View key={index}>
                        <View
                            className={`flex flex-row p-2 justify-between flex-wrap`}
                        >
                            <View className="flex sm:flex-col md:flex-col lg:flex-row w-full md:w-8/12 lg:w-6/12">
                                {/* <View
                                    className={`flex flex-row md:flex-row lg:flex-row items-center w-full lg:w-${
                                        roleId > 3
                                            ? "3/12"
                                            : roleId > 2
                                            ? "4/12"
                                            : "5/12"
                                    } justify-between`}
                                > */}
                                <View
                                    className={`flex flex-row md:flex-row lg:flex-row items-center w-full lg:w-5/12
                                     justify-between`}
                                >
                                    <View className="flex flex-row items-center justify-start w-10/12 lg:w-full max-w-[300px]">
                                        <Pressable
                                            onPress={() =>
                                                router.push(
                                                    `/clients/${order.client.id}`
                                                )
                                            }
                                            className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center"
                                        >
                                            <Text
                                                selectable
                                                className="text-white"
                                            >
                                                {getInitials(order.client.name)}
                                            </Text>
                                        </Pressable>
                                        <View className="flex flex-col">
                                            <View className="flex flex-row items-center text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all ">
                                                <Pressable
                                                    onPress={() =>
                                                        router.push(
                                                            `/clients/${order.client.id}`
                                                        )
                                                    }
                                                >
                                                    {/* <View
                                                        className={`pl-12 lg:pl-0 hidden lg:flex flex-row justify-start w-${
                                                            roleId > 3
                                                                ? "2/12"
                                                                : roleId > 2
                                                                ? "2/12"
                                                                : "5/12"
                                                        }`}
                                                    > */}
                                                    <View
                                                        className={`pl-12 lg:pl-0 hidden lg:flex flex-row justify-start w-5/12
                                                        `}
                                                    >
                                                        <Text
                                                            selectable
                                                            className="text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all"
                                                        >
                                                            {order.client.name}
                                                            &nbsp;
                                                        </Text>
                                                    </View>
                                                </Pressable>
                                                {/* <Popover
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
                                                            Order Status
                                                        </Popover.Header>
                                                        <Popover.Body>
                                                            <View>
                                                                <Text>
                                                                    Status
                                                                </Text>
                                                            </View>
                                                        </Popover.Body>
                                                    </Popover.Content>
                                                </Popover> */}
                                            </View>
                                            <View className="flex flex-row items-center mt-1 md:mt-0 lg:mt-0">
                                                <Text
                                                    selectable
                                                    className="text-[#6C6A6A] text-sm"
                                                >
                                                    {order.client.clientId}
                                                </Text>
                                                {/* <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View> */}
                                                {/* <View className='flex flex-row items-center'>
                                                <Text selectable className='text-[#6C6A6A] text-sm'>Folio No. {order.folio_no}&nbsp;</Text>
                                                <Popover
                                                    from={(_sourceRef, showPopover) => (
                                                        <TouchableOpacity onPress={showPopover}>
                                                            <Icon name="info-circle" size={12} color="black" />
                                                        </TouchableOpacity>
                                                    )}>
                                                    <View className='w-40 h-40'>
                                                        <Text>This is the contents of the popover</Text>
                                                    </View>
                                                </Popover>


                                            </View> */}
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex md:flex lg:hidden flex-row items-center justify-center w-2/12 bg-[#D7D7D9] rounded-full">
                                        <View className="flex flex-row items-center">
                                            <Text
                                                selectable
                                                className="p-1 text-black text-end md:text-center text-xs"
                                            >
                                                {order.orderStatus.name}&nbsp;
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
                                                        Order Status
                                                    </Popover.Header>
                                                    <Popover.Body>
                                                        <View>
                                                            <Text>Status</Text>
                                                        </View>
                                                    </Popover.Body>
                                                </Popover.Content>
                                            </Popover>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex md:hidden lg:hidden flex-row items-center justify-between pl-12 mt-1 md:mt-0 lg:mt-0">
                                    <View className="flex flex-row">
                                        <Text
                                            selectable
                                            className="text-black font-bold text-start md:text-center"
                                        >
                                            ₹{order.amount}
                                        </Text>
                                        <Text
                                            selectable
                                            className="text-[#6C6A6A] text-xs"
                                        >
                                            ({order.units} units)
                                        </Text>
                                    </View>
                                    <View className="flex flex-col">
                                        <Text
                                            selectable
                                            className="text-black text-xs"
                                        >
                                            {order.startDate}
                                        </Text>
                                    </View>
                                </View>

                                {/* <View
                                    className={`pl-12 lg:pl-0 hidden lg:flex flex-row justify-start w-${
                                        roleId > 3
                                            ? "1/12"
                                            : roleId > 2
                                            ? "2/12"
                                            : "3/12"
                                    }`}
                                > */}
                                <View
                                    className={`pl-12 lg:pl-0 hidden lg:flex flex-row justify-start w-3/12
                                    `}
                                >
                                    <Text>
                                        {order?.folioNumber
                                             ? order?.folioNumber : "NA"}
                                  
                                    </Text>
                                </View>

                                {/* {roleId > 2 && (
                                    <View className="pl-12 lg:px-1 hidden lg:flex flex-row justify-start w-2/12">
                                        <Text className="">
                                            {order?.distributor?.name
                                                ? order?.distributor?.name
                                                : "-"}
                                        </Text>
                                    </View>
                                )} */}

                                {/* {roleId > 3 && (
                                    <View className="pl-12 lg:px-1 hidden lg:flex flex-row justify-start w-2/12">
                                        <Text>
                                            {order?.distributor
                                                ?.managementUsers[0].name
                                                ? order?.distributor
                                                      ?.managementUsers[0].name
                                                : "-"}
                                        </Text>
                                    </View>
                                )} */}

                                <View className="pl-12 lg:pl-0 flex flex-row items-center w-full lg:w-4/12 justify-between md:justify-between lg:justify-start mt-2 md:mt-2 lg:mt-0">
                                    <View
                                        className={
                                            "flex flex-col justify-center items-start lg:items-start w-6/12 lg:w-full"
                                        }
                                    >
                                        <Text
                                            selectable
                                            className="text-black font-semibold max-w-[400px] break-all"
                                            style={{ textAlign: "left" }}
                                        >
                                            {order.mutualfund.name}
                                        </Text>
                                        <View className="flex flex-row justify-start">
                                            <Text
                                                selectable
                                                className="text-black text-xs pr-2"
                                            >
                                                {order.mutualfund.deliveryType
                                                    .name == "NA"
                                                    ? ""
                                                    : order.mutualfund
                                                          .deliveryType.name}
                                            </Text>
                                            <Text
                                                selectable
                                                className="text-black text-xs pr-2"
                                            >
                                                {order.mutualfund.optionType
                                                    .name == "NA"
                                                    ? ""
                                                    : order.mutualfund
                                                          .optionType.name}
                                            </Text>
                                            <Text
                                                selectable
                                                className="text-black text-xs pr-2"
                                            >
                                                {order?.mutualfund?.dividendType
                                                    ?.name == "NA"
                                                    ? ""
                                                    : order?.mutualfund
                                                          ?.dividendType?.name}
                                            </Text>
                                        </View>

                                        <View className="flex flex-row items-start">
                                            <Text
                                                selectable
                                                className="text-black text-xs"
                                            >
                                                {"SIPRegnNo: "}
                                                {order.sipReferenceNumber}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        className={
                                            "flex lg:hidden flex-col w-full justify-center items-end lg:items-start w-6/12 lg:w-full"
                                        }
                                    >
                                        {/* <View className='flex flex-row items-start'>
                                    </View> */}
                                        <View className="flex flex-col items-center">
                                            {/* <Text selectable className='text-black text-xs'>{"Folio no: 9996274/86"}</Text>

                                        <Text selectable className='text-red-500 text-xs'>{"Cancelled At"}</Text>
                                        <Text selectable className='text-black text-xs'>{"29/04/2021  12:00:10 AM"}</Text> */}
                                        </View>
                                    </View>
                                </View>

                                <View className="flex md:hidden lg:hidden flex-row items-center w-full mt-3">
                                    <TouchableRipple className="w-full py-2 rounded-full border-[0.4px]">
                                        <Text
                                            selectable
                                            className="text-black text-center md:text-center text-xs"
                                        >
                                            View Details
                                        </Text>
                                    </TouchableRipple>
                                </View>
                            </View>

                            <View className="hidden md:flex lg:flex flex-row md:flex-col lg:flex-row w-full md:w-4/12 lg:w-6/12 justify-between">
                                <View className="flex flex-row items-center sm:w-full md:w-full lg:w-3/12 md:justify-end lg:justify-center">
                                    <View className="flex flex-col">
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            {order.startDate
                                                ? moment(
                                                      new Date(order.startDate)
                                                  ).format("DD-MM-YYYY")
                                                : ""}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex flex-row items-center sm:w-full md:w-full lg:w-3/12 md:justify-end lg:justify-center">
                                    <View className="flex flex-col">
                                        <Text
                                            selectable
                                            className="text-[#686868] font-semibold"
                                        >
                                            {order.startDate
                                                ? moment(
                                                      new Date(order.startDate)
                                                  ).format("DD-MM-YYYY")
                                                : ""}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex flex-col-reverse md:flex-col-reverse lg:flex-row sm:w-full md:w-full lg:w-4/12  items-center">
                                    <View className="flex flex-row md:flex-col lg:flex-row items-center md:items-end lg:items-center w-full lg:w-1/2  justify-start md:justify-end lg:justify-center">
                                        <View className="flex flex-col md:flex-row lg:flex-col">
                                            <View className="flex flex-row items-center">
                                                <Text
                                                    selectable
                                                    className="text-black font-bold text-start md:text-center"
                                                >
                                                    ₹{order.amount}
                                                </Text>
                                                {/* <View className="ml-1">
                                                    <Popover
                                                        trigger={(
                                                            triggerProps
                                                        ) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    {...triggerProps}
                                                                >
                                                                    <Icon
                                                                        name="info-circle"
                                                                        size={
                                                                            12
                                                                        }
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
                                                                Amount Details
                                                            </Popover.Header>
                                                            <Popover.Body>
                                                                <View>
                                                                    <Text>
                                                                        Amount:
                                                                        ₹
                                                                        {
                                                                            order.amount
                                                                        }
                                                                    </Text>
                                                                    <Text>
                                                                        End
                                                                        Date:{" "}
                                                                        {order.startDate
                                                                            ? moment(
                                                                                  new Date(
                                                                                      order.startDate
                                                                                  )
                                                                              ).format(
                                                                                  "YYYY-MM-DD"
                                                                              )
                                                                            : ""}
                                                                    </Text>
                                                                </View>
                                                            </Popover.Body>
                                                        </Popover.Content>
                                                    </Popover>
                                                </View> */}
                                            </View>
                                            {order.units && (
                                                <Text
                                                    selectable
                                                    className="text-[#6C6A6A] text-xs"
                                                >
                                                    ({order.units} units)
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <View className="hidden md:hidden lg:flex flex-row items-center w-full lg:w-1/2 justify-start md:justify-center lg:justify-center">
                                        <View className="flex flex-col rounded-full w-8/12 items-center justify-center">
                                            <View className="flex flex-row items-center justify-center w-11/12">
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
                                                            {
                                                                order
                                                                    .orderStatus
                                                                    .name
                                                            }
                                                        </Popover.Header>
                                                        <Popover.Body>
                                                            <View>
                                                                <Text>
                                                                    {getOrderMessage(
                                                                        order
                                                                            .orderStatus
                                                                            .name
                                                                    )}
                                                                </Text>
                                                            </View>
                                                        </Popover.Body>
                                                    </Popover.Content>
                                                </Popover>
                                                <Text
                                                    selectable
                                                    className="p-1 text-black text-end md:text-center text-xs"
                                                >
                                                    {order.orderStatus.name}
                                                    &nbsp;
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View className="flex flex-row items-center lg:w-2/12 justify-center md:mt-2 lg:mt-0">
                                    {/* <Link
                                    href={{
                                        pathname: "/sip-reports/[id]",
                                        params: { id: order.id }
                                    }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
                                    <Text selectable className='text-white text-start md:text-center text-xs w-10/12'>View</Text>
                                </Link> */}
                                    <Pressable
                                        onPress={() =>
                                            router.push(
                                                `sip-reports/${order.id}`
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
