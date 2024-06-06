import { Platform, Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { ArrowBackIcon, Image } from "native-base";
import stockMarketBasicsChapters from "../../../assets/data/nsme_chapters.json";
import { useEffect, useState } from "react";

const ChapterLearning = ({ name }) => {
    const [chapter, setChapter] = useState<any>(null);

    const getChapter = (name) => {
        for (let i = 0; i < stockMarketBasicsChapters.length; i++) {
            for (
                let j = 0;
                j < stockMarketBasicsChapters[i].chapters.length;
                j++
            ) {
                if (stockMarketBasicsChapters[i].chapters[j].name === name) {
                    return stockMarketBasicsChapters[i].chapters[j];
                }
            }
        }
        return null;
    };

    const handleSearch = () => {
        const foundChapter = getChapter(decodeURIComponent(name));
        setChapter(foundChapter);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <View className="h-full">
            {chapter != null ? (
                <View className="bg-[#f7f7f7]">
                    <View className="bg-[#d3e8cc] p-[35px] md:p-[20px]">
                        <Pressable className="" onPress={() => router.back()}>
                            <ArrowBackIcon size={3} />
                        </Pressable>
                        <View className="flex flex-col items-start mt-[20px]">
                            <View className="flex flex-row items-center">
                                <Text className="font-semibold text-[#6b6b6b] text-[14px] mr-[10px]">
                                    Chapter:
                                </Text>
                                <Text className="font-bold text-[20px]">
                                    {chapter.no}
                                </Text>
                            </View>
                            <View className="flex flex-row items-center mb-[8px] mt-[10px]">
                                <Text
                                    selectable
                                    className="font-bold text-[20px]"
                                >
                                    {chapter.name}
                                </Text>
                            </View>
                            <View>
                                <Text></Text>
                            </View>
                        </View>
                    </View>
                    <View className="mt-[30px]"></View>
                    <View className="px-[5px] md:px-[20px] flex flex-row justify-center ">
                        {Platform.OS === "web" ? (
                            <iframe
                                src={`/../../../assets/data/pdf-view.html?file=${chapter.file}`}
                                style={{
                                    border: "none",
                                    height: "100vh",
                                    width: "70%",
                                }}
                                title="Embedded Web Content"
                            />
                        ) : (
                            <WebView
                                source={
                                    "/../../../assets/data/pdf-view.html?file=${chapter.file}"
                                }
                            />
                        )}
                    </View>
                </View>
            ) : (
                <View>
                    <Text>Chapter not found</Text>
                </View>
            )}
        </View>
    );
};

export default ChapterLearning;
