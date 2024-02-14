import {
    DrawerNavigationOptions,
    // Import the creation function
    createDrawerNavigator,
    // Import the types
} from "@react-navigation/drawer";
import { EventMapBase, NavigationState } from "@react-navigation/native";

import { withLayoutContext } from "expo-router";

const { Navigator } = createDrawerNavigator();

// This can be used like `<Drawer />`
export const Drawer = withLayoutContext<
    DrawerNavigationOptions,
    typeof Navigator,
    NavigationState,
    EventMapBase
>(Navigator);
