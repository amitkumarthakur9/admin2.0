import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ImageBackground,
    Dimensions,
    StyleSheet,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Carousel = ({
    items,
    onClose,
    height,
    width,
    autoscroll = false,
    scrollInterval = 5000,
    visibleItems = 1,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef(null);

    // Calculate item width dynamically based on how many items should be visible at a time
    const itemWidth = width / visibleItems;

    const handleNext = () => {
        if (currentIndex < items.length - visibleItems) {
            scrollViewRef.current.scrollTo({
                x: (currentIndex + 1) * itemWidth,
                animated: true,
            });
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            scrollViewRef.current.scrollTo({
                x: (currentIndex - 1) * itemWidth,
                animated: true,
            });
            setCurrentIndex(currentIndex - 1);
        }
    };

   // Auto-scroll logic
   useEffect(() => {
    let autoScrollTimer;
    if (autoscroll) {
        autoScrollTimer = setInterval(() => {
            if (scrollViewRef.current && currentIndex < items.length - visibleItems) {
                handleNext();
            } else if (scrollViewRef.current) {
                // Reset to the first item when reaching the end
                scrollViewRef.current.scrollTo({ x: 0, animated: true });
                setCurrentIndex(0);
            }
        }, scrollInterval);
    }

    return () => {
        if (autoScrollTimer) {
            clearInterval(autoScrollTimer); // Clear interval on component unmount
        }
    };
}, [autoscroll, currentIndex, scrollInterval, visibleItems]);

    return (
        <View className="relative rounded" style={{ height, width }}>
            <ImageBackground
                source={require("../../../assets/carasoul.svg")}
                resizeMode="contain"
                className="absolute mt-[-50px] ml-[-50px]"
            />

            {/* Carousel Content */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled={false} // Disable paging to manually control it
                className="w-full h-full"
                showsHorizontalScrollIndicator={false} // Hide scrollbar
                scrollEnabled={false} // Disable manual scrolling
            ></ScrollView>

            {/* Title and Navigation Row */}
            <View className="absolute left-4 right-4 flex-row justify-between items-center">
                {/* Dynamic Title on the left */}
                <Text className="text-lg font-bold">
                    {items[currentIndex]?.title}
                </Text>

                <View className="flex flex-row">
                    <View className="flex-row items-center justify-center">
                        <Pressable
                            onPress={handlePrev}
                            className=" rounded-full"
                        >
                            <FontAwesome
                                name={"angle-left"}
                                size={24}
                                color={""}
                            />
                        </Pressable>
                        <Text className="mx-4 text-gray-700">{`${
                            currentIndex + 1
                        }/${items.length}`}</Text>
                        <Pressable
                            onPress={handleNext}
                            className="rounded-full"
                        >
                            <FontAwesome
                                name={"angle-right"}
                                size={24}
                                color={""}
                            />
                        </Pressable>
                    </View>

                    {/* Close button on the extreme right */}
                    <Pressable onPress={onClose} className="px-2 rounded-full">
                        {/* <FontAwesome
                                name={"close"}
                                size={24}
                                color={""}
                            /> */}
                        <Text className="p-2 justify-center items-center text-lg">
                            x
                        </Text>
                    </Pressable>
                </View>
            </View>
            {items.map((item, index) => (
                <View
                    key={index}
                    className="flex justify-center items-center p-4"
                    style={{ width: itemWidth, height }}
                >
                    {/* Description Row */}
                    <View className="w-full">
                        <Text className="text-gray-500 text-start">
                            {items[currentIndex]?.description}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1, // Take up the entire screen or container size
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
});

export default Carousel;
