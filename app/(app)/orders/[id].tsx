import { View } from 'react-native';
import { Link } from 'expo-router';

export default function OrderDetail() {
    return (
        <View>
            <Link href="/about">About</Link>

            <Link href="/user/bacon">View user</Link>
        </View>
    );
}