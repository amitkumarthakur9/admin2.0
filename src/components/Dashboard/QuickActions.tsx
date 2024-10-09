import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Pressable,
    Modal,
    Animated,
    PanResponder,
    Platform,
    StyleSheet,
    Dimensions,
    ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import IconCard from "../Card/IconCard";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Web compatibility imports (only for web)
const isWeb = Platform.OS === "web";

const QuickActions = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [topComponents, setTopComponents] = useState([
        <Pressable onPress={() => router.push(`clients`)}>
            <Text
                selectable
                className="flex flex-row text-black font-semibold break-all "
            >
               Add Clients
            </Text>
        </Pressable>,
        <Pressable onPress={() => router.push(`clients`)}>
        <Text
            selectable
            className="flex flex-row text-black font-semibold break-all "
        >
            Brokerage
        </Text>
    </Pressable>,
       <Pressable onPress={() => router.push(`clients`)}>
       <Text
           selectable
           className="flex flex-row text-black font-semibold break-all "
       >
           SIP Returns Calculator
       </Text>
   </Pressable>,
       <Pressable onPress={() => router.push(`clients`)}>
       <Text
           selectable
           className="flex flex-row text-black font-semibold break-all "
       >
          SIP Delay Calculator
       </Text>
   </Pressable>,
        <Pressable onPress={() => router.push(`clients`)}>
        <Text
            selectable
            className="flex flex-row text-black font-semibold break-all "
        >
            Risk Profiling
        </Text>
    </Pressable>,
    ]);
    const [bottomComponents, setBottomComponents] = useState([
       
        "Component F",
        "Component G",
        "Component H",
        "Component I",
        "Component J",
    ]);
    const [draggingItem, setDraggingItem] = useState(null); // Track which item is being dragged
    const [isDraggingWeb, setIsDraggingWeb] = useState(null); // Web dragging state

    const pan = useRef(new Animated.ValueXY()).current; // Track drag position for mobile

    // PanResponder for mobile drag-and-drop
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gestureState) => {
                handleDropMobile(gestureState);
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start(); // Return item to its original position
            },
        })
    ).current;

    // Handle drop for mobile (via PanResponder)
    const handleDropMobile = (gestureState) => {
        const screenHeight = Dimensions.get("window").height;
        const dropThreshold = screenHeight / 2; // Midpoint between top and bottom sections

        if (gestureState.moveY > dropThreshold && draggingItem != null) {
            // Move from top to bottom
            const draggedItem = topComponents[draggingItem];
            setTopComponents(
                topComponents.filter((_, idx) => idx !== draggingItem)
            );
            setBottomComponents([...bottomComponents, draggedItem]);
        } else if (
            gestureState.moveY <= dropThreshold &&
            draggingItem != null &&
            topComponents.length < 5
        ) {
            // Move from bottom to top if less than 5 components
            const draggedItem = bottomComponents[draggingItem];
            setBottomComponents(
                bottomComponents.filter((_, idx) => idx !== draggingItem)
            );
            setTopComponents([...topComponents, draggedItem]);
        }
        setDraggingItem(null); // Reset dragging item
    };

    // Handle web drag start
    const handleDragStartWeb = (event, index, fromTop) => {
        setIsDraggingWeb({ index, fromTop });
        event.dataTransfer.setData("text", index);
    };

    // Handle web drop
    const handleDropWeb = (event, fromTop) => {
        event.preventDefault();
        const draggedIndex = isDraggingWeb.index;
        const isFromTop = isDraggingWeb.fromTop;

        if (
            fromTop &&
            !isFromTop &&
            bottomComponents.length > draggedIndex &&
            topComponents.length < 5
        ) {
            // Move from bottom to top if there is space
            const item = bottomComponents[draggedIndex];
            setBottomComponents(
                bottomComponents.filter((_, idx) => idx !== draggedIndex)
            );
            setTopComponents([...topComponents, item]);
        } else if (
            !fromTop &&
            isFromTop &&
            topComponents.length > draggedIndex
        ) {
            // Move from top to bottom
            const item = topComponents[draggedIndex];
            setTopComponents(
                topComponents.filter((_, idx) => idx !== draggedIndex)
            );
            setBottomComponents([...bottomComponents, item]);
        }
        setIsDraggingWeb(null); // Reset drag state
    };

    // Handle drag over (required to allow drop in web)
    const handleDragOverWeb = (event) => {
        event.preventDefault();
    };

    // Move item from bottom to top (on + button click)
    const moveToTop = (index) => {
        if (topComponents.length < 5) {
            const item = bottomComponents[index];
            setBottomComponents(bottomComponents.filter((_, i) => i !== index));
            setTopComponents([...topComponents, item]);
        }
    };

    // Move item from top to bottom (on - button click)
    const moveToBottom = (index) => {
        const item = topComponents[index];
        setTopComponents(topComponents.filter((_, i) => i !== index));
        setBottomComponents([...bottomComponents, item]);
    };

    // Render a draggable item (compatible with both mobile and web)
    const renderComponentList = (
        components,
        fromTop,
        moveItem,
        buttonLabel,
        disableAdd
    ) => {
        return components.map((item, index) => {
            if (isWeb) {
                // Web drag-and-drop
                return (
                    <div
                        key={index}
                        draggable
                        onDragStart={(event) =>
                            handleDragStartWeb(event, index, fromTop)
                        }
                        onDrop={(event) => handleDropWeb(event, fromTop)}
                        onDragOver={handleDragOverWeb}
                        style={styles.componentBox}
                    >
                        <View style={styles.componentRow}>
                            <Text>{item}</Text>
                            <Pressable
                                onPress={() => moveItem(index)}
                                style={[
                                    fromTop
                                        ? styles.minusButton
                                        : styles.plusButton,
                                    disableAdd && { backgroundColor: "gray" },
                                ]}
                                disabled={disableAdd} // Disable if add limit is reached
                            >
                                <Text style={styles.buttonText}>
                                    {buttonLabel}
                                </Text>
                            </Pressable>
                        </View>
                    </div>
                );
            } else {
                // Mobile drag-and-drop (using PanResponder)
                return (
                    <Pressable
                        key={index}
                        onPressIn={() => setDraggingItem(index)} // Set currently dragging item
                        style={styles.componentBox}
                    >
                        <View style={styles.componentRow}>
                            <Text>{item}</Text>
                            <Pressable
                                onPress={() => moveItem(index)}
                                style={[
                                    fromTop
                                        ? styles.minusButton
                                        : styles.plusButton,
                                    disableAdd && { backgroundColor: "gray" },
                                ]}
                                disabled={disableAdd} // Disable if add limit is reached
                            >
                                <Text style={styles.buttonText}>
                                    {buttonLabel}
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                );
            }
        });
    };

    // Render drop container based on platform
    const renderDropContainer = (isTop) => {
        if (isWeb) {
            return (
                <div
                    style={styles.dropContainer} // This div will handle the drop events for web
                    onDragOver={handleDragOverWeb}
                    onDrop={(event) => handleDropWeb(event, isTop)}
                >
                    <ScrollView
                        style={isTop ? styles.topSection : styles.bottomSection}
                    >
                        <Text style={styles.sectionTitle}>
                            {isTop
                                ? "Top Components (Max 5)"
                                : "Bottom Components"}
                        </Text>
                        {isTop ? (
                            topComponents.length > 0 ? (
                                renderComponentList(
                                    topComponents,
                                    true,
                                    moveToBottom,
                                    "-",
                                    false
                                )
                            ) : (
                                <View style={styles.dropArea}>
                                    <Text>Drop items here</Text>
                                </View>
                            )
                        ) : (
                            renderComponentList(
                                bottomComponents,
                                false,
                                moveToTop,
                                "+",
                                topComponents.length >= 5
                            )
                        )}
                    </ScrollView>
                </div>
            );
        }

        // Mobile rendering
        return (
            <View
                style={styles.dropContainer} // This view will handle the drop events for mobile
            >
                <ScrollView
                    style={isTop ? styles.topSection : styles.bottomSection}
                >
                    <Text style={styles.sectionTitle}>
                        {isTop ? "Top Components (Max 5)" : "Bottom Components"}
                    </Text>
                    {isTop ? (
                        topComponents.length > 0 ? (
                            renderComponentList(
                                topComponents,
                                true,
                                moveToBottom,
                                "-",
                                false
                            )
                        ) : (
                            <View style={styles.dropArea}>
                                <Text>Drop items here</Text>
                            </View>
                        )
                    ) : (
                        renderComponentList(
                            bottomComponents,
                            false,
                            moveToTop,
                            "+",
                            topComponents.length >= 5
                        )
                    )}
                </ScrollView>
            </View>
        );
    };

    // Render the top components as a side-by-side display without buttons
    const renderTopComponentsInline = () => {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-[1080]">
                {/* <View className="flex flex-row w-full justify-between"> */}
                {topComponents.map((component, index) => (
                    <View className="bg-white mr-2 rounded p-2 w-[25%]">
                        <IconCard
                            icon="account-outline"
                            title=""
                            description={component}
                            borderRadius={5}
                        />
                    </View>
                ))}
                {/* </View> */}
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View className="flex flex-row justify-between w-full">
                <View className="">{renderTopComponentsInline()}</View>

                {/* Open Modal Button */}
                <Pressable
                    onPress={() => setModalVisible(true)}
                    className="w-[5%] bg-white justify-center items-center rounded"
                >
                    <MaterialCommunityIcons
                        name={"account-outline"}
                        size={24}
                        color="#0F5FC2"
                    />
                </Pressable>
            </View>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Close Button */}
                        <Pressable
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>

                        {/* Top Section */}
                        {renderDropContainer(true)}

                        {/* Bottom Section */}
                        {renderDropContainer(false)}

                        {/* Dragged Item (for mobile) */}
                        {draggingItem !== null && !isWeb && (
                            <Animated.View
                                style={[
                                    styles.draggingItem,
                                    {
                                        transform: [
                                            { translateX: pan.x },
                                            { translateY: pan.y },
                                        ],
                                    },
                                ]}
                                {...panResponder.panHandlers}
                            >
                                <Text>{topComponents[draggingItem]}</Text>
                            </Animated.View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default QuickActions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inlineContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    inlineComponentBox: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
        marginRight: 10,
    },
    openButton: {
        backgroundColor: "#F194FF",
        padding: 10,
        borderRadius: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get("window").width * 0.3,
        height: Dimensions.get("window").height,
        alignSelf: "center",
    },
    closeButton: {
        backgroundColor: "#2196F3",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    dropContainer: {
        flex: 1, // This allows the entire section to be a drop area
        width: "100%",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginVertical: 10,
    },
    topSection: {
        height: "100%", // Full height within the drop container
        padding: 10,
        backgroundColor: "#f9f9f9",
    },
    bottomSection: {
        height: "100%", // Full height within the drop container
        padding: 10,
        backgroundColor: "#f9f9f9",
    },
    sectionTitle: {
        fontWeight: "bold",
        marginBottom: 10,
    },
    componentBox: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#f2f2f2",
        borderRadius: 5,
    },
    componentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    plusButton: {
        backgroundColor: "green",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    minusButton: {
        backgroundColor: "red",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    draggingItem: {
        position: "absolute",
        backgroundColor: "lightgray",
        padding: 10,
        borderRadius: 5,
    },
    dropArea: {
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#ccc",
        borderStyle: "dashed",
        borderWidth: 2,
        borderRadius: 10,
    },
});
