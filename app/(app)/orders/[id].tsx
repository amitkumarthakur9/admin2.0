import { View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';

export default function OrderDetail() {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Link href="/">Order Detail Screen: {id}</Link>

        </View>
    );
}