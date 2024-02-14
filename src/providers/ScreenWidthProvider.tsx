// ScreenWidthProvider.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { Dimensions } from "react-native";

interface ScreenWidthContextProps {
    children: ReactNode;
}

const ScreenWidthContext = createContext<number | undefined>(undefined);

export const ScreenWidthProvider: React.FC<ScreenWidthContextProps> = ({
    children,
}) => {
    const [screenWidth, setScreenWidth] = useState(
        Dimensions.get("window").width
    );

    useEffect(() => {
        const updateScreenWidth = () => {
            setScreenWidth(Dimensions.get("window").width);
        };

        const subscription = Dimensions.addEventListener(
            "change",
            updateScreenWidth
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <ScreenWidthContext.Provider value={screenWidth}>
            {children}
        </ScreenWidthContext.Provider>
    );
};

export const useScreenWidth = (): number => {
    const screenWidth = useContext(ScreenWidthContext);
    if (screenWidth === undefined) {
        throw new Error(
            "useScreenWidth must be used within a ScreenWidthProvider"
        );
    }
    return screenWidth;
};
