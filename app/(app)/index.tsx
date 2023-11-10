import { Animated, ButtonProps, Platform, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import { BaseButtonProperties } from 'react-native-gesture-handler';
import DataTableExample from '../../src/components/Others/DataTableExample';

export default function Dashboard() {
    return <View className='py-4 px-4' style={{}}>
        <Text>Dashboard</Text>
    </View>;
}

const buttonStyle: StyleProp<ViewStyle> = { width: 120, borderColor: "black", borderRadius: 2, borderWidth: Platform.OS == "web" ? 0.1 : 0.2, padding: 0, backgroundColor: "white" }

const labelStyle: StyleProp<TextStyle> = { textAlign: "center", color: "black", fontWeight: "400", fontSize: 12 }
