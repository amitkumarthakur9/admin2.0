import { Dialog, Portal } from "react-native-paper";
import { Dimensions, useWindowDimensions } from "react-native";

const modalWidths = {
    modalKey1: 800,
    externalPortfolio: 300,
    // Add more modal keys and widths as needed
};

const modalHeights = {
    modalKey1: 800,
    externalPortfolio: "auto",
    // Add more modal keys and heights as needed
};

const Modal = ({ visible, hideDialog, children, modalKey }) => {
    const { width: windowWidth } = useWindowDimensions();

    console.log("height screen" + Dimensions.get("screen").height);

    const width =
        windowWidth < 830 ? windowWidth - 10 : modalWidths[modalKey] || 800;
    const height =
        windowWidth < 830
            ? Dimensions.get("screen").height - 25
            : modalHeights[modalKey] || "65%";

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={hideDialog}
                dismissable
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignSelf: "center",
                    width: width,
                    height: height,
                    overflow: "scroll",
                    backgroundColor: "white",
                    padding:32
                }}
            >
                {children}
            </Dialog>
        </Portal>
    );
};

// const dialogStyle: StyleProp<ViewStyle> = {
//     backgroundColor: "gray",
//     borderRadius: 5,
// };
// const buttonStyle: StyleProp<ViewStyle> = {
//     borderColor: "#484848",
//     borderRadius: Platform.OS == "web" ? 8 : 8,
//     borderWidth: Platform.OS == "web" ? 0.1 : 0.4,
//     padding: 0,
// };

// const labelStyle: StyleProp<TextStyle> = {
//     textAlign: "center",
//     color: "#484848",
//     fontWeight: "400",
//     fontSize: 12,
// };

export default Modal;
