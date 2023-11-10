import { View, Text, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';
import { OrderInterface } from "../../interfaces/OrderInterface";
import { ClientInterface } from "../../interfaces/ClientInterface";
import { Popover } from "native-base";

const ReportBox = ({ data }: { data: Account }) => {
    const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
            const firstWord = words[0];
            const secondWord = words[1];
            return `${firstWord[0]}${secondWord[0]}`;
        } else if (words.length === 1) {
            return words[0][0];
        } else {
            return '';
        }
    }

    return (
        // <><Text>{JSON.stringify(data.name)}</Text></>
        <>
            <View className='flex flex-row items-center justify-start lg:justify-start w-10/12 lg:w-full'>
                <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                    <Text className='text-white'>{getInitials(data.name)}</Text>
                </View>
                <View className='flex flex-col'>
                    <View className='flex flex-row items-center text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all'>
                        <Text className='text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all'>{data.name}&nbsp;</Text>
                        <Popover trigger={triggerProps => {
                            return <TouchableOpacity {...triggerProps}>
                                <Icon name="info-circle" size={12} color="black" />
                            </TouchableOpacity>;
                        }}>
                            <Popover.Content accessibilityLabel="Order Details" w="56">
                                <Popover.Arrow />
                                <Popover.CloseButton />
                                <Popover.Header>Order Status</Popover.Header>
                                <Popover.Body>
                                    <View>
                                        <Text>Status</Text>
                                    </View>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover>
                    </View>
                    <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0'>
                        <Text className='text-[#6C6A6A] text-sm'>{data.clientId}</Text>
                        <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                        {/* <View className='flex flex-row items-center'>
                            <Text className='text-[#6C6A6A] text-sm'>PAN {data.users[0].panNumber}&nbsp;</Text>
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

            <View className='flex md:flex lg:hidden flex-row items-center justify-center w-2/12 bg-[#D7D7D9] rounded-full'>
                <View className='flex flex-row items-center'>
                    <Text className='p-1 text-black text-end md:text-center text-xs'>{data.users[0].kycStatus.name}&nbsp;</Text>
                    <Popover trigger={triggerProps => {
                        return <TouchableOpacity {...triggerProps}>
                            <Icon name="info-circle" size={12} color="black" />
                        </TouchableOpacity>;
                    }}>
                        <Popover.Content accessibilityLabel="Order Details" w="56">
                            <Popover.Arrow />
                            <Popover.CloseButton />
                            <Popover.Header>Order Status</Popover.Header>
                            <Popover.Body>
                                <View>
                                    <Text>Status</Text>
                                </View>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover>
                </View>
            </View>
        </>
    )
}

export default ReportBox