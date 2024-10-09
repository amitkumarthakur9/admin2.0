import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    Pressable,
    Animated,
    Dimensions,
    ScrollView,
} from "react-native";
import CardWithTabs from "../Card/CardWithTabs";
import ActionItemDetail from "./ActionitemDetail";
import CustomCheckbox from "../Checkbox/NativeCheckbox";
import CustomButton from "../Buttons/CustomButton";

const ActionItems = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const handleTabPress = (tab) => {
        setSelectedTab(tab);
    };
    const [slideAnim] = useState(
        new Animated.Value(Dimensions.get("window").width)
    ); // Start the slide off-screen
    const [selectedActionItem, setSelectedActionItem] = useState(null); // To store selected action item
    const [pendingTask, setPendingTask] = useState([
        {
            id: 1,
            title: "Orders - Payment Reminder",
            date: "15 MAY 2024, 11:00 PM",
            descritopn: "Orders - Payment Reminder",
        },
        {
            id: 2,
            title: "Orders - Payment Reminder",
            date: "15 MAY 2024, 11:00 PM",
            descritopn: "Orders - Payment Reminder",
        },
        {
            id: 3,
            title: "Orders - Payment Reminder",
            date: "15 MAY 2024, 11:00 PM",
            descritopn: "Orders - Payment Reminder",
        },
    ]);
    const [ignoredTask, setIgnoredTask] = useState([
        {
            id: 4,
            title: " Auction Status - Bid Losing",
            date: "15 MAY 2024, 11:00 PM",
            descritopn: "Auction Status - Bid Losing",
        },
    ]);

    const [completedTask, setCompletedTask] = useState([
        {
            id: 5,
            title: "Orders - Payment Reminder",
            date: "15 MAY 2024, 11:00 PM",
            descritopn: "Auction Status - Bid Losing",
        },
    ]);

    // Function to open modal with animation
    const openModal = () => {
        setModalVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300, // Sidebar slides in within 300ms
            useNativeDriver: true,
        }).start();
    };

    // Function to close modal with animation
    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: Dimensions.get("window").width, // Move it off-screen to the right
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible(false)); // Set modal visibility to false after animation
    };

    const handleIgnore = (item) => {
        // Remove the item from pendingTask and add it to ignoredTask
        setPendingTask((prevTasks) =>
            prevTasks.filter((task) => task.id !== item.id)
        );
        setIgnoredTask((prevTasks) => [...prevTasks, item]);
    };

    const handleComplete = (item) => {
        // Remove the item from pendingTask and add it to ignoredTask
        setPendingTask((prevTasks) =>
            prevTasks.filter((task) => task.id !== item.id)
        );
        setCompletedTask((prevTasks) => [...prevTasks, item]);
    };

    // Move selected items to completed
    // Move selected items between tabs based on current active tab
    const handleMoveSelected = () => {
        if (selectedTab === 1) {
            // Move from Pending to Completed or Ignored
            const selectedPendingTasks = pendingTask.filter((task) =>
                selectedItems.includes(task.id)
            );
            setPendingTask((prevTasks) =>
                prevTasks.filter((task) => !selectedItems.includes(task.id))
            );
            setCompletedTask((prevTasks) => [
                ...prevTasks,
                ...selectedPendingTasks,
            ]);
        } else if (selectedTab === 2) {
            // Move from Completed to Pending
            const selectedCompletedTasks = completedTask.filter((task) =>
                selectedItems.includes(task.id)
            );
            setCompletedTask((prevTasks) =>
                prevTasks.filter((task) => !selectedItems.includes(task.id))
            );
            setPendingTask((prevTasks) => [
                ...prevTasks,
                ...selectedCompletedTasks,
            ]);
        } else if (selectedTab === 3) {
            // Move from Ignored to Pending
            const selectedIgnoredTasks = ignoredTask.filter((task) =>
                selectedItems.includes(task.id)
            );
            setIgnoredTask((prevTasks) =>
                prevTasks.filter((task) => !selectedItems.includes(task.id))
            );
            setPendingTask((prevTasks) => [
                ...prevTasks,
                ...selectedIgnoredTasks,
            ]);
        }

        // Clear selection after moving
        setSelectedItems([]);
    };

    // Handle task selection
    const handleSelect = (item) => {
        if (selectedItems.includes(item.id)) {
            setSelectedItems((prevSelected) =>
                prevSelected.filter((id) => id !== item.id)
            );
        } else {
            setSelectedItems((prevSelected) => [...prevSelected, item.id]);
        }
    };

    const areAllItemsSelected = () => {
        let tasksInCurrentTab = [];
        if (selectedTab === 1) {
            tasksInCurrentTab = pendingTask;
        } else if (selectedTab === 2) {
            tasksInCurrentTab = completedTask;
        } else if (selectedTab === 3) {
            tasksInCurrentTab = ignoredTask;
        }
        return tasksInCurrentTab.length === selectedItems.length;
    };

    // Mark all pending items as selected
    const handleMarkAll = () => {
        let tasksInCurrentTab = [];
        if (selectedTab === 1) {
            tasksInCurrentTab = pendingTask;
        } else if (selectedTab === 2) {
            tasksInCurrentTab = completedTask;
        } else if (selectedTab === 3) {
            tasksInCurrentTab = ignoredTask;
        }

        if (areAllItemsSelected()) {
            // Unmark all if everything is selected
            setSelectedItems([]);
        } else {
            // Mark all if not all are selected
            setSelectedItems(tasksInCurrentTab.map((item) => item.id));
        }
    };

    const tabContent = [
        {
            key: "pendingTask",
            name: "Pending Task",
            content: (
                <ScrollView>
                    {pendingTask.map((item) => {
                        const isChecked = selectedItems.includes(item.id);

                        return (
                            <View className="p-4">
                                <View className="mb-4 p-4 bg-blue-50 rounded-lg flex-row justify-between">
                                    <View>
                                        <CustomCheckbox
                                            label={item.title}
                                            isChecked={isChecked}
                                            onChange={() => handleSelect(item)}
                                        />
                                        <Pressable>
                                            <Text className="text-gray-500 mb-2">
                                                {item.title}
                                            </Text>
                                        </Pressable>

                                        <Text className="text-gray-700 mb-2">
                                            {item.descritopn}
                                        </Text>
                                    </View>
                                    <View className="flex-col gap-4">
                                        <Pressable
                                            onPress={() =>
                                                setSelectedActionItem(item)
                                            }
                                            className="mr-4"
                                        >
                                            <Text className="text-blue-600 font-bold">
                                                Open
                                            </Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => handleIgnore(item)}
                                            className="mr-4"
                                        >
                                            <Text className="text-red-600 font-bold">
                                                Ignore
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => handleComplete(item)}
                                        >
                                            <Text className="text-green-600 font-bold">
                                                Completed
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            ),
        },
        {
            key: "completedTask",
            name: "Completed Task",
            content: (
                <ScrollView>
                    {completedTask.map((item) => {
                        const isChecked = selectedItems.includes(item.id);
                        return (
                            <View key={item.id} className="p-4">
                                <View
                                    className={`mb-4 p-4 bg-blue-50 rounded-lg flex-row justify-between`}
                                >
                                    <CustomCheckbox
                                        label={item.title}
                                        isChecked={isChecked}
                                        onChange={() => handleSelect(item)}
                                    />
                                    <View>
                                        <Text className="text-gray-600">
                                            {item.title}
                                        </Text>
                                        <Text className="text-gray-400 text-xs">
                                            {item.date}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            ),
        },
        {
            key: "ignoredTask",
            name: "Ignored Task",
            content: (
                <ScrollView>
                    {ignoredTask.map((item) => {
                        const isChecked = selectedItems.includes(item.id);
                        return (
                            <View key={item.id} className="p-4">
                                <View
                                    className={`mb-4 p-4 bg-blue-50 rounded-lg flex-row justify-between`}
                                >
                                    <CustomCheckbox
                                        label={item.title}
                                        isChecked={isChecked}
                                        onChange={() => handleSelect(item)}
                                    />
                                    <View>
                                        <Text className="text-gray-600">
                                            {item.title}
                                        </Text>
                                        <Text className="text-gray-400 text-xs">
                                            {item.date}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            ),
        },
    ];

    return (
        <View className="justify-center items-center">
            {/* Pressable Text */}
            <Pressable onPress={openModal}>
                <Text className="text-lg font-bold text-blue-500 p-2">
                    10 Suggestions to Improve the Score
                </Text>
            </Pressable>

            {/* Sidebar Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="none"
                onRequestClose={closeModal}
            >
                <View className="flex-1 justify-start items-end">
                    {" "}
                    {/* Position modal on the right */}
                    <Animated.View
                        style={{
                            transform: [{ translateX: slideAnim }],
                            width: Dimensions.get("window").width * 0.35, // Sidebar takes 35% of the screen width
                            height: "95%",
                            marginRight: 20, // 20px padding from right
                            marginTop: 20, // 20px padding from top
                            // marginBottom: 20, // 20px padding from bottom
                            backgroundColor: "white",
                            borderRadius: 20, // Rounded corners
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.5,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                    >
                        {/* Sidebar Content */}

                        {selectedActionItem ? (
                            <ActionItemDetail
                                actionItem={selectedActionItem}
                                onBack={() => setSelectedActionItem(null)}
                                onClose={setModalVisible}
                            />
                        ) : (
                            <>
                                <View className="p-4">
                                    <Text className="text-lg font-bold">
                                        Suggestions
                                    </Text>
                                    <Pressable
                                        onPress={closeModal}
                                        className="absolute top-4 right-4 p-2 rounded-full"
                                    >
                                        <Text className="text-xl font-bold">
                                            ×
                                        </Text>
                                    </Pressable>
                                </View>

                                <CardWithTabs
                                    key="Task"
                                    selectedTab={selectedTab}
                                    handleTabPress={handleTabPress}
                                    tabContent={tabContent}
                                    tabsCount={3}
                                />
                                <View className="p-4 flex-row bg-white justify-between items-center">
                                    <CustomCheckbox
                                        label={
                                            areAllItemsSelected()
                                                ? "Unmark All"
                                                : "Mark All"
                                        }
                                        isChecked={areAllItemsSelected()}
                                        onChange={handleMarkAll}
                                    />
                                    {selectedItems.length > 0 && (
                                        <CustomButton
                                            onPress={handleMoveSelected}
                                            title={
                                                <Text className="text-white font-bold">
                                                    {selectedTab === 1
                                                        ? "Move to Complete"
                                                        : "Move to Pending"}{" "}
                                                    ({selectedItems.length})
                                                </Text>
                                            }
                                            disabled={
                                                selectedItems.length === 0
                                            }
                                        />
                                    )}
                                </View>
                            </>
                        )}
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};

export default ActionItems;
