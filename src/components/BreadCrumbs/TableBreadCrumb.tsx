import { View, Text, ImageBackground, Pressable } from "react-native"
import { Link, Redirect, router, } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from 'native-base';

export const TableBreadCrumb = ({ name, showViewAll = false, url = "", getDataList = null, params = null }: { name: string, showViewAll?: boolean, url?: any, getDataList?: any, params?: any }) => {

    const handleShowAll = () => {
        if (url && getDataList) {
            router.push(url)
            params = {}
            getDataList([], true)
        }
    }

    return <View className='flex flex-row justify-between items-center mt-3 bg-[#eaf3fe] h-28 px-2 '>
        <View className='flex flex-row items-center w-6/12'>
            <Text selectable className={'text-2xl font-extrabold ' + (showViewAll ? "mr-3" : "")}>{name}</Text>
            {/* {
                showViewAll ? <Pressable onPress={handleShowAll}><Text className="text-[10px] underline">View All</Text></Pressable> : ""
            } */}
            {/* <View className='flex flex-row items-center'>
                <Link href={"../"} className='mr-4'>
                    <Text>Dashboard</Text>
                </Link>
                <View className='mr-4'>
                    <Icon name="circle" style={{ fontWeight: "100" }} size={8} color="grey" />
                </View>
            </View> */}
        </View>
        <View className='w-6/12 overflow-hidden h-full flex flex-row justify-center'>
            <Image className='' alt="ico" source={require('../../../assets/images/ChatBc.png')} style={{
                // flex: 1,
                // justifyContent: 'end',
            }} />

        </View>
    </View>
}