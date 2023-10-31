import {
    createNavigatorFactory,
    DefaultNavigatorOptions,
    EventArg,
    ParamListBase,
    StackActionHelpers,
    StackActions,
    StackNavigationState,
    StackRouter,
    StackRouterOptions,
    useNavigationBuilder,
} from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home';
import Detalhes from '../screens/Detalhes';

const Stack = createStackNavigator();

export const HomeScreen = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export const SecondScreen = ({ navigation }) => {
    return (
        <Stack.Navigator
            initialRouteName="SecondScreen"
            screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen
                name="Second Screen"
                component={Detalhes}
                options={{
                    title: 'Second Screen', //Set Header Title
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}