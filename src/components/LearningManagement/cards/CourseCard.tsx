import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "native-base";
import { Link, router } from "expo-router";

const CourseCard = ({ index, author, label, imageUrl, color }) => {
    function darkenColor(color, amount = 20) {
        // Check if the color is in hexadecimal format
        if (color.startsWith("#")) {
            // Convert hex to RGB
            let r = parseInt(color.slice(1, 3), 16);
            let g = parseInt(color.slice(3, 5), 16);
            let b = parseInt(color.slice(5, 7), 16);

            // Darken the color by the specified amount
            r = Math.max(0, r - amount);
            g = Math.max(0, g - amount);
            b = Math.max(0, b - amount);

            // Convert RGB back to hex
            const darkenedColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
                .toString(16)
                .slice(1)}`;

            return darkenedColor;
        } else {
            throw new Error(
                "Invalid color format. Please provide a hex color code."
            );
        }
    }

    return (
        <Pressable
            onPress={() => router.push(`/learning-center/${label}`)}
            className="w-[100%] md:w-[25%] pr-[0px] md:pr-[20px]"
            style={{
                borderColor: "#e4e4e4",
                borderRightWidth: StyleSheet.hairlineWidth,
            }}
        >
            <View className="border-[#dbdbdb] border-[0.1px] rounded-[40px] bg-white mb-[30px]">
                <View className="flex flex-col items-start">
                    <View
                        className="w-[100%] h-[180px] md:h-[180px] flex flex-row justify-start items-end rounded-[40px]"
                        style={{ backgroundColor: color }}
                    >
                        {/* <Image
                        resizeMode="cover"
                        className="w-[100%] h-[220px] md:h-[120px]"
                        source={{ uri: imageUrl }}
                        style={{
                            borderRadius: 5,
                        }}
                    /> */}
                        <View
                            className="w-[40%] md:w-[30%] h-[50px] md:h-[40px] flex flex-row justify-start pl-[14px] items-center rounded-tr-[30px]"
                            style={{ backgroundColor: darkenColor(color) }}
                        >
                            <Text className="text-[#272727] text-[20px] font-bold">
                                {index + 1}
                            </Text>
                        </View>
                    </View>
                    <Pressable className="w-[100%]">
                        <View className="flex flex-col items-start justify-start px-[18px] py-[14px] w-[100%]">
                            <View className="flex flex-row justify-between items-center w-[100%]">
                                <Text
                                    selectable
                                    className="text-[#454545] w-[90%] flex flex-row text-[13px] font-bold"
                                >
                                    {label}
                                </Text>
                                <MaterialCommunityIcons
                                    name="arrow-right"
                                    size={20}
                                    // color="#00AC4F"
                                />
                            </View>
                            {/* <Text selectable className="text-[#6e6e6e] text-sm">
                            {author}
                        </Text> */}
                        </View>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
};

export default CourseCard;
