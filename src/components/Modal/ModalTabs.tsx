import * as React from 'react';
import { Platform, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Button, Dialog, Portal, Text, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const ModalTabs = ({ label }) => {
    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const [tab, setTab] = React.useState<string>("info");

    const handleTabClick = (tab: string) => {
        // console.log(tab);

        setTab(tab)
    }

    return (
        <View>
            <Button icon={"filter"} onPress={showDialog} style={buttonStyle} labelStyle={labelStyle}>{label}</Button>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} dismissable style={dialogStyle}>

                    <Dialog.Content>
                        <View className='flex flex-row justify-between shadow'>
                            <Button className="m-2" onPress={() => handleTabClick('info')} style={{ backgroundColor: tab == 'info' ? "#8395eb8c" : "white", borderRadius: 2, borderWidth: Platform.OS == "web" ? 0.1 : 0.2, padding: 0, }} labelStyle={labelStyle}>{'Info'}</Button>
                            <Button className="m-2" onPress={() => handleTabClick('quick_action')} style={{ backgroundColor: tab == 'quick_action' ? "#8395eb8c" : "white", borderRadius: 2, borderWidth: Platform.OS == "web" ? 0.1 : 0.2, padding: 0, }} labelStyle={labelStyle}>{'Quick Action'}</Button>
                            <Button className="m-2" onPress={() => handleTabClick('reports')} style={{ backgroundColor: tab == 'reports' ? "#8395eb8c" : "white", borderRadius: 2, borderWidth: Platform.OS == "web" ? 0.1 : 0.2, padding: 0, }} labelStyle={labelStyle}>{'Reports'}</Button>
                        </View>
                        {
                            tab == 'info' && <View className='flex flex-row justify-between'>
                                <View className='flex flex-column'>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className='flex flex-column'>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>User ID</Text>
                                        </View>
                                        <View>
                                            <Text selectable className='text-sm'>12121212</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }

                        {
                            tab == 'quick_action' && <View className='flex flex-row justify-between'>
                                <View className='flex flex-column'>
                                    <View className='flex flex-row items-center'>
                                        <Checkbox status='checked' />
                                        <View className='mr-4'>
                                            <Text selectable className='text-sm'>FATCA Done</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row items-center'>
                                        <Checkbox status='unchecked' />
                                        <View className='mr-4'>
                                            <Text selectable className='text-sm'>FATCA Done</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row items-center'>
                                        <Checkbox status='unchecked' />
                                        <View className='mr-4'>
                                            <Text selectable className='text-sm'>FATCA Done</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row items-center'>
                                        <Checkbox status='unchecked' />
                                        <View className='mr-4'>
                                            <Text selectable className='text-sm'>FATCA Done</Text>
                                        </View>
                                    </View>
                                    <View className='flex flex-row items-center'>
                                        <Checkbox status='unchecked' />
                                        <View className='mr-4'>
                                            <Text selectable className='text-sm'>FATCA Done</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }

                        {
                            tab == 'reports' && <View className='flex flex-row justify-between'>
                                <View className='flex flex-column'>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>Report 1</Text>
                                        </View>
                                        <View className='ml-4'>
                                            <Icon name="download" size={18} color="#484848" />
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>Report 2</Text>
                                        </View>
                                        <View className='ml-4'>
                                            <Icon name="download" size={18} color="#484848" />
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>Report 3</Text>
                                        </View>
                                        <View className='ml-4'>
                                            <Icon name="download" size={18} color="#484848" />
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>Report 4</Text>
                                        </View>
                                        <View className='ml-4'>
                                            <Icon name="download" size={18} color="#484848" />
                                        </View>
                                    </View>
                                    <View className='flex flex-row m-2 space-around'>
                                        <View>
                                            <Text selectable className='mr-2'>Report 5</Text>
                                        </View>
                                        <View className='ml-4'>
                                            <Icon name="download" size={18} color="#484848" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        }

                    </Dialog.Content>
                    <Dialog.Actions className='w-100'>
                        <View className='flex flex-row justify-end'>
                            {/* <Button onPress={hideDialog}>Save</Button> */}
                            <Button onPress={hideDialog}>Close</Button>
                        </View>

                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const dialogStyle: StyleProp<ViewStyle> = { backgroundColor: "white", borderRadius: 5, };
const buttonStyle: StyleProp<ViewStyle> = { borderColor: "#484848", borderRadius: Platform.OS == "web" ? 8 : 8, borderWidth: Platform.OS == "web" ? 0.1 : 0.4, padding: 0, }

const labelStyle: StyleProp<TextStyle> = { textAlign: "center", color: "#484848", fontWeight: "400", fontSize: 12 }

export default ModalTabs; 