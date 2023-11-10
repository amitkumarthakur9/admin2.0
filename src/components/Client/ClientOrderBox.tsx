import { View, Text, TouchableOpacity } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome';
import { OrderInterface } from "../../interfaces/OrderInterface";
import { Badge, Button, Popover } from "native-base";

const ClientOrderBox = ({ data }: { data: OrderInterface }) => {
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
        // <><Text>{JSON.stringify(data.customer_name)}</Text></>
        <>
            <View className='flex flex-row items-center justify-start w-8/12 lg:w-full'>
                <View className='flex flex-row rounded-full bg-[#e60202] mr-2 h-10 w-10 items-center justify-center'>
                    <Text className='text-white'>{getInitials(data.account.name)}</Text>
                </View>
                <View className='flex flex-col'>
                    <View className='flex flex-row items-center text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all'>
                        <Text className='text-black font-semibold max-w-[240px] lg:max-w-[300px] break-all'>{data.account.name}&nbsp;</Text>
                        {/* <Popover
                            from={(sourceRef, showPopover) => (
                                <TouchableOpacity onPress={showPopover}>
                                    <Icon name="info-circle" size={12} color="black" />
                                </TouchableOpacity>
                            )}>
                            <View className='w-40 h-40'>
                                <Text>This is the contents of the popover</Text>
                            </View>
                        </Popover> */}
                        <Popover trigger={triggerProps => {
                            return <TouchableOpacity {...triggerProps}>
                                <Icon name="info-circle" size={12} color="black" />
                            </TouchableOpacity>;
                        }}>
                            <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                                <Popover.Arrow />
                                <Popover.CloseButton />
                                <Popover.Header>Custome Details</Popover.Header>
                                <Popover.Body>
                                    <View>
                                        <Text>{data.account.name}</Text>
                                        <Text>{data.account.clientId}</Text>
                                    </View>
                                </Popover.Body>
                                {/* <Popover.Footer justifyContent="flex-end">
                                    <Button.Group space={2}>
                                        <Button colorScheme="coolGray" variant="ghost">
                                            Cancel
                                        </Button>
                                        <Button colorScheme="danger">Delete</Button>
                                    </Button.Group>
                                </Popover.Footer> */}
                            </Popover.Content>
                        </Popover>
                    </View>
                    <View className='flex flex-row items-center mt-1 md:mt-0 lg:mt-0'>
                        <Text className='text-[#6C6A6A] text-sm'>{data.account.clientId}</Text>
                        <View className='rounded-full bg-[#6C6A6A] h-2 w-2 mx-1'></View>
                        <View className='flex flex-row items-center'>
                            <Text className='text-[#6C6A6A] text-sm'>Order No. {data.orderReferenceNumber}&nbsp;</Text>
                            <Popover trigger={triggerProps => {
                                return <TouchableOpacity {...triggerProps}>
                                    <Icon name="info-circle" size={12} color="black" />
                                </TouchableOpacity>;
                            }}>
                                <Popover.Content accessibilityLabel="Order Details" w="56">
                                    <Popover.Arrow />
                                    <Popover.CloseButton />
                                    <Popover.Header>Order Details</Popover.Header>
                                    <Popover.Body>
                                        <View>
                                            <Text>Ref Number: {data.orderReferenceNumber}</Text>
                                            <View className="flex flex-row mt-4">
                                                <Text>Order Type: </Text>

                                                <Badge colorScheme="success" alignSelf="center" >
                                                    {data.orderType.name}
                                                </Badge>
                                            </View>

                                        </View>
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>


                        </View>
                    </View>
                </View>
            </View>

            <View className='flex md:flex lg:hidden flex-row items-center justify-center w-4/12 bg-[#D7D7D9] rounded-full'>
                <View className='flex flex-row items-center'>
                    <Text className='p-1 text-black text-end md:text-center text-xs'>{data.orderStatus.name}&nbsp;</Text>
                    <Popover trigger={triggerProps => {
                        return <TouchableOpacity {...triggerProps}>
                            <Icon name="info-circle" size={12} color="black" />
                        </TouchableOpacity>;
                    }}>
                        <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                            <Popover.Arrow />
                            <Popover.CloseButton />
                            <Popover.Header>Delete Customer</Popover.Header>
                            <Popover.Body>
                                This will remove all data relating to Alex. This action cannot be
                                reversed. Deleted data can not be recovered.
                            </Popover.Body>
                            <Popover.Footer justifyContent="flex-end">
                                <Button.Group space={2}>
                                    <Button colorScheme="coolGray" variant="ghost">
                                        Cancel
                                    </Button>
                                    <Button colorScheme="danger">Delete</Button>
                                </Button.Group>
                            </Popover.Footer>
                        </Popover.Content>
                    </Popover>
                </View>
            </View>
        </>
    )
}

export default ClientOrderBox