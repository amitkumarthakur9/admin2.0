import { Link } from "expo-router"
import { Text } from "native-base"
import Icon from 'react-native-vector-icons/FontAwesome';

interface paramsItem {
    id: string,
}

interface ViewButton {
    url: string,
    params: paramsItem
}


export const ViewButton = ({ url, params }: ViewButton) => {
    return <Link
        href={{
            pathname: url,
            params: params
        }} className='rounded-full border-[0.4px] flex flex-row items-center justify-center bg-black w-8/12 h-6'>
        <Icon name="eye" size={12} color="white" />
        <Text selectable className='text-white text-start md:text-center text-xs ml-1'>View</Text>
    </Link>
}