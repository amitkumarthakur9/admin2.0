import { ImageBackground, View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Button, Pressable, ScrollView, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function OrderDetail() {
    const { id } = useLocalSearchParams();
    return (
        <ScrollView className={`bg-white`} showsVerticalScrollIndicator={true}>
            <View className='bg-white'>
                <View className=''>
                    <View className='flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 '>
                        <View className='flex flex-col w-6/12'>
                            <Text className='text-2xl font-extrabold mb-3'>Orders</Text>
                            <View className='flex flex-row items-center'>
                                <Link href={"/"} className='mr-4'>
                                    {/* <Icon name="home" size={18} color="black" /> */}
                                    <Text>Dashboard</Text>
                                </Link>
                                <View className='mr-4'>
                                    <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                </View>
                                <Link href={"/orders"} className='mr-4'>
                                    {/* <Icon name="home" size={18} color="black" /> */}
                                    <Text>Orders</Text>
                                </Link>
                                <View className='mr-4'>
                                    <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                                </View>
                                <Link href={""} className='mr-4'>
                                    {/* <Icon name="home" size={18} color="black" /> */}
                                    <Text>{id}</Text>
                                </Link>
                            </View>
                        </View>
                        <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
                            <ImageBackground className='' source={require('../../../assets/images/ChatBc.png')} resizeMode="center" style={{
                                // flex: 1,
                                // justifyContent: 'center',
                            }}>

                            </ImageBackground>
                        </View>
                    </View>

                </View>
                <View>
                    <View className='flex flex-row justify-between mx-5'>
                        <View>

                        </View>
                        <View>
                            <Pressable marginRight={2} onPress={() => console.log("hello world")} paddingX={9} paddingY={3} bg={"#0891b2"} rounded={4} borderColor={"#bfbfbf"} borderWidth={0.3}>
                                <Icon name="download" style={{ fontWeight: "100" }} size={14} color="white" />
                            </Pressable>

                        </View>
                    </View>
                    <View className='flex flex-row m-2'>
                        <View className="w-12/12 lg:w-8/12  p-2">
                            <View className='flex flex-row flex-wrap  border rounded m-1 p-2 w-12/12'>
                                <View className='w-3/12 mb-2'>
                                    <Text className='text-slate-400 text-base mb-2 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-2'>
                                    <Text className='text-slate-400 text-base mb-2 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                            </View>

                        </View>
                        <View className="w-12/12 lg:w-4/12 p-2">
                            <View className='flex flex-row flex-wrap  border rounded m-1 p-2 w-12/12'>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className='flex flex-row m-2'>
                        <View className="w-12/12 lg:w-8/12  p-2">
                            <View className='flex flex-row flex-wrap  border rounded m-1 p-2 w-12/12'>
                                <View className='w-3/12 mb-2'>
                                    <Text className='text-slate-400 text-base mb-2 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-2'>
                                    <Text className='text-slate-400 text-base mb-2 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-3/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                            </View>

                        </View>
                        <View className="w-12/12 lg:w-4/12 p-2">
                            <View className='flex flex-row flex-wrap  border rounded m-1 p-2 w-12/12'>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                                <View className='w-4/12 mb-12'>
                                    <Text className='text-slate-400 text-base mb-1 font-semibold'>Order No</Text>
                                    <Text className='font-bold text-base'>1202</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

        </ScrollView >
    )


}