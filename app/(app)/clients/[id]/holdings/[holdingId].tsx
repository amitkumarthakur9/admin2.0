import { Link, useLocalSearchParams } from "expo-router";
import { Center, HStack, Heading, Spinner } from "native-base";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    ClientDetailItem,
    ClientDetailResponse,
} from "../../../../../src/interfaces/ClientDetailInterface";
import RemoteApi from "../../../../../src/services/RemoteApi";
import moment from "moment";
import {
    AccountShadowPhone,
    BorderShadow,
    BorderShadowPhone,
} from "../../../../../src/components/Styles/Shadow";
import { getInitials } from "../../../../../src/helper/helper";

export default function HoldingDetail() {
    const [isLoading, setIsLoading] = useState(true);

    const { id, holdingId } = useLocalSearchParams();
    console.log({ id, holdingId });
    const [data, setData] = useState<ClientDetailItem>();

    useEffect(() => {
        setIsLoading(true);
        async function getDetails() {
            const response: ClientDetailResponse = await RemoteApi.get(
                `client/${id}`
            );
            if (response) {
                setData(response.data);
                setIsLoading(false);
            }
        }

        if (id) {
            getDetails();
        }
    }, [id]);

    return (
        <>
            {isLoading ? (
                <Center>
                    <HStack
                        space={2}
                        marginTop={20}
                        marginBottom={20}
                        justifyContent="center"
                    >
                        <Spinner
                            color={"black"}
                            accessibilityLabel="Loading order"
                        />
                        <Heading color="black" fontSize="md">
                            Loading
                        </Heading>
                    </HStack>
                </Center>
            ) : (
                <ScrollView
                    className={`bg-white`}
                    showsVerticalScrollIndicator={true}
                >
                    <View className="bg-white">
                        <View className="">
                            <View className="flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 ">
                                <View className="flex flex-col w-6/12">
                                    <Text
                                        selectable
                                        className="text-2xl font-extrabold mb-3"
                                    >
                                        Holdings
                                    </Text>
                                    <View className="flex flex-row items-center">
                                        <Link href={"../"} className="mr-4">
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Dashboard</Text>
                                        </Link>
                                        <View className="mr-4">
                                            <Icon
                                                name="circle"
                                                style={{ fontWeight: "100" }}
                                                size={8}
                                                color="grey"
                                            />
                                        </View>
                                        <Link
                                            href={"/clients"}
                                            className="mr-4"
                                        >
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Clients</Text>
                                        </Link>
                                        <View className="mr-4">
                                            <Icon
                                                name="circle"
                                                style={{ fontWeight: "100" }}
                                                size={8}
                                                color="grey"
                                            />
                                        </View>
                                        <View className="mr-4">
                                            {/* <Icon name="home" size={18} color="black" /> */}
                                            <Text>Holding</Text>
                                        </View>
                                        {/* <View className='mr-4'>
                                        <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                    </View> */}
                                        {/* <Link href={""} className='mr-4'>
                                        <Text>{id}</Text>
                                    </Link> */}
                                    </View>
                                </View>
                                <View className="w-6/12 overflow-hidden h-full flex flex-row justify-center">
                                    <ImageBackground
                                        className=""
                                        source={require("../../../../../assets/images/ChatBc.png")}
                                        resizeMode="center"
                                        style={
                                            {
                                                // flex: 1,
                                                // justifyContent: 'center',
                                            }
                                        }
                                    ></ImageBackground>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View className="flex flex-row justify-between mx-5">
                                <View></View>
                                {/* <View>
                                    <Pressable marginRight={0} onPress={() => console.log("hello world")} paddingX={9} paddingY={2} bg={"#000000"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                                        <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                                    </Pressable>

                                </View> */}
                            </View>
                        </View>
                        <View
                            className="flex flex-row p-2 mx-2 items-center rounded"
                            style={
                                Platform.OS == "web"
                                    ? BorderShadow
                                    : BorderShadowPhone
                            }
                        >
                            <View className="flex flex-row items-center p-2">
                                <View className="flex flex-col ">
                                    <View className="flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center">
                                        <Text
                                            selectable
                                            className="text-white text-center"
                                        >
                                            {getInitials(data.name)}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex flex-col ml-1">
                                    <Text
                                        selectable
                                        className="font-bold text-base"
                                    >
                                        {data.name}
                                    </Text>
                                    <View className="flex flex-row items-center">
                                        <Text selectable className=" text-xs">
                                            {data.clientId}
                                        </Text>
                                        <View className="mx-2">
                                            <Icon
                                                name="circle"
                                                style={{ fontWeight: "100" }}
                                                size={8}
                                                color="grey"
                                            />
                                        </View>
                                        <Text selectable className=" text-xs">
                                            {data.users[0].panNumber}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
}
