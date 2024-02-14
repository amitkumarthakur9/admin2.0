import { styled } from "nativewind";
import React from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Chip,
    IconButton,
    MD3Colors,
    Searchbar,
} from "react-native-paper";
import DropdownComponent from "../Dropdowns/DropDown";

const StyledText = styled(Text);
const StyledView = styled(View);

export const NewTable = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const onChangeSearch = (query) => {
        // console.log(query);

        setSearchQuery(query);
    };
    const [screenDimensions, setScreenDimensions] = React.useState<{
        width: number;
        height: number;
    }>(Dimensions.get("window"));

    // console.log('initial screenDimensions', screenDimensions);

    React.useEffect(() => {
        const updateScreenDimensions = () => {
            const { width, height } = Dimensions.get("window");
            setScreenDimensions({ width, height });
            // console.log('screenDimensions', { width, height });
        };
        //

        // Subscribe to changes in screen dimensions
        Dimensions.addEventListener("change", updateScreenDimensions);

        // Cleanup the event listener when the component unmounts
        // return () => {
        //   // Dimensions.removeAllListeners('change', updateScreenDimensions);
        // };
    }, []);

    return (
        <ScrollView>
            <Card
                className="bg-white m-5 shadow-none"
                style={{
                    backgroundColor: "white",
                    borderRadius: 5,
                    borderColor: "transparent",
                    shadowColor: "transparent",
                }}
            >
                <View className="m-4 w:full flex lg:flex-row flex justify-between text-white text-sm font-bold rounded-lg">
                    <View className="flex lg:items-center h-100 bg-pink justify-center mb-2">
                        <Text selectable className="text-xl">
                            Datatable
                        </Text>
                    </View>
                    <View className="flex lg:flex-row lg:items-center justify-center">
                        <View
                            style={{
                                marginBottom:
                                    screenDimensions.width <= 600 ? 8 : 0,
                            }}
                        >
                            <DropdownComponent label="Filter" data={[]} />
                        </View>
                        <View
                            className="rounded-md"
                            style={{
                                height: 50,
                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 0.2,
                            }}
                        >
                            {/* <IconButton
                                icon="magnify"
                                iconColor={"black"}
                                size={20}
                                onPress={() => console.log('Pressed')}
                            /> */}
                            <TextInput
                                placeholder={"Search"}
                                underlineColorAndroid="transparent"
                                selectionColor="black"
                                placeholderTextColor={"black"}
                                cursorColor={"transparent"}
                                onFocus={() => setIsFocused(true)}
                                style={{
                                    flex: 1,
                                    height: 40,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    color: "black",
                                    marginLeft: 10,
                                }}
                                // {...rest}
                            />
                        </View>
                    </View>
                </View>
                <View className="">
                    {/* <View className="bg-gray-100 p-4 rounded-lg shadow-lg"> */}

                    <ScrollView horizontal>
                        <View className="flex">
                            {/* <!-- Table Header --> */}
                            <View className="">
                                <View className="shadow border-b border-gray-100 sm:rounded-t-lg">
                                    <View className="pl-11 pr-11 py-4 bg-gray-300 text-gray-700 uppercase tracking-wider font-semibold">
                                        <View className="flex flex-row items-center">
                                            <View className="w-24 flex-row items-center">
                                                <Checkbox status="unchecked" />
                                                {/* <Text>Mark All</Text> */}
                                            </View>
                                            <Text
                                                selectable
                                                style={{
                                                    width:
                                                        screenDimensions.width /
                                                        (Platform.OS == "web"
                                                            ? screenDimensions.width <=
                                                              600
                                                                ? 4
                                                                : 6
                                                            : 4),
                                                }}
                                            >
                                                Name
                                            </Text>
                                            <Text
                                                selectable
                                                style={{
                                                    width:
                                                        screenDimensions.width /
                                                        (Platform.OS == "web"
                                                            ? screenDimensions.width <=
                                                              600
                                                                ? 3.4
                                                                : 8
                                                            : 3.4),
                                                }}
                                            >
                                                Mobile
                                            </Text>
                                            <Text
                                                selectable
                                                style={{
                                                    width:
                                                        screenDimensions.width /
                                                        (Platform.OS == "web"
                                                            ? screenDimensions.width <=
                                                              600
                                                                ? 3
                                                                : 8
                                                            : 3),
                                                }}
                                            >
                                                Email
                                            </Text>
                                            <Text
                                                selectable
                                                style={{
                                                    width:
                                                        screenDimensions.width /
                                                        (Platform.OS == "web"
                                                            ? screenDimensions.width <=
                                                              600
                                                                ? 4
                                                                : 8
                                                            : 4),
                                                }}
                                            >
                                                Pan
                                            </Text>
                                            <Text
                                                selectable
                                                style={{
                                                    width:
                                                        screenDimensions.width /
                                                        (Platform.OS == "web"
                                                            ? screenDimensions.width <=
                                                              600
                                                                ? 4
                                                                : 8
                                                            : 4),
                                                }}
                                            >
                                                Tax Status
                                            </Text>
                                            {/* <Text selectable style={{ width: screenDimensions.width / (Platform.OS == "web" ? (screenDimensions.width <= 600 ? 4 : 8) : 4) }}>Role</Text> */}
                                            <Text
                                                selectable
                                                style={{
                                                    width:
                                                        screenDimensions.width /
                                                        (Platform.OS == "web"
                                                            ? screenDimensions.width <=
                                                              600
                                                                ? 4
                                                                : 8
                                                            : 4),
                                                }}
                                            >
                                                Action
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* <!-- Table Rows --> */}
                            <View className="pr-5 pl-5 bg-white shadow sm:rounded-b-lg ">
                                {[...Array(10)].map((index, value) => {
                                    return (
                                        // <View key={index} className={`hover:bg-sky-700 px-6 py-4 ${index % 2 == 0 ? "bg-gray-100" : ""}`}>
                                        <View
                                            key={index}
                                            className={`hover:bg-slate-100 px-6 py-4`}
                                        >
                                            <View className="flex flex-row">
                                                <View className="w-24">
                                                    <Checkbox status="unchecked" />
                                                </View>
                                                {/* <Text selectable className="w-10">{value + 1}</Text> */}

                                                <View
                                                    className="flex-row items-center"
                                                    style={{
                                                        width:
                                                            screenDimensions.width /
                                                            (Platform.OS ==
                                                            "web"
                                                                ? screenDimensions.width <=
                                                                  600
                                                                    ? 4
                                                                    : 6
                                                                : 4),
                                                    }}
                                                >
                                                    <Avatar.Image
                                                        size={24}
                                                        source={require("../../../assets/images/avatar.png")}
                                                    />
                                                    <Text> John Doe</Text>
                                                </View>
                                                <View className="flex-row items-center">
                                                    <Text
                                                        selectable
                                                        style={{
                                                            width:
                                                                screenDimensions.width /
                                                                (Platform.OS ==
                                                                "web"
                                                                    ? screenDimensions.width <=
                                                                      600
                                                                        ? 3.4
                                                                        : 8
                                                                    : 3.4),
                                                        }}
                                                    >
                                                        +91 911111111
                                                    </Text>
                                                </View>

                                                <View className="flex-row items-center">
                                                    <Text
                                                        selectable
                                                        style={{
                                                            width:
                                                                screenDimensions.width /
                                                                (Platform.OS ==
                                                                "web"
                                                                    ? screenDimensions.width <=
                                                                      600
                                                                        ? 3
                                                                        : 8
                                                                    : 3),
                                                        }}
                                                    >
                                                        john@example.com
                                                    </Text>
                                                </View>

                                                <View className="flex-row items-center">
                                                    <Text
                                                        selectable
                                                        style={{
                                                            width:
                                                                screenDimensions.width /
                                                                (Platform.OS ==
                                                                "web"
                                                                    ? screenDimensions.width <=
                                                                      600
                                                                        ? 4
                                                                        : 8
                                                                    : 4),
                                                        }}
                                                    >
                                                        Admin
                                                    </Text>
                                                </View>
                                                <View className="flex-row items-center">
                                                    <Text
                                                        selectable
                                                        style={{
                                                            width:
                                                                screenDimensions.width /
                                                                (Platform.OS ==
                                                                "web"
                                                                    ? screenDimensions.width <=
                                                                      600
                                                                        ? 4
                                                                        : 8
                                                                    : 4),
                                                        }}
                                                    >
                                                        Admin
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        width:
                                                            screenDimensions.width /
                                                            (Platform.OS ==
                                                            "web"
                                                                ? screenDimensions.width <=
                                                                  600
                                                                    ? 4
                                                                    : 8
                                                                : 4),
                                                    }}
                                                >
                                                    <Button
                                                        style={{ width: 100 }}
                                                        icon="pencil"
                                                        mode="contained"
                                                        onPress={() =>
                                                            console.log(
                                                                "Pressed"
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View className="m-4 w:full flex lg:flex-row flex justify-between text-white text-sm font-bold rounded-lg">
                    <View className="flex lg:items-center h-100 bg-pink justify-center mb-2">
                        <Text selectable className="text-xl">
                            Page 1 of 5
                        </Text>
                    </View>

                    <View
                        className="rounded-md"
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderWidth: 0.2,
                        }}
                    ></View>
                </View>
            </Card>
        </ScrollView>
    );
};
