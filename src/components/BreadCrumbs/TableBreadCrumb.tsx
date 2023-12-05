import { View, Text, ImageBackground } from "react-native"
import { Link, } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

export const TableBreadCrumb = ({ name, }) => {
    return <View className='flex flex-row justify-between items-center mb-[30px] mt-3 bg-[#eaf3fe] h-28 px-2 '>
        <View className='flex flex-col w-6/12'>
            <Text selectable className='text-2xl font-extrabold mb-3'>{name}</Text>
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
            <ImageBackground className='' source={require('../../../assets/images/ChatBc.png')} resizeMode="center" style={{
                // flex: 1,
                // justifyContent: 'center',
            }}>

            </ImageBackground>
        </View>
    </View>
}