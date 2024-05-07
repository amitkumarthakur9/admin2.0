import { Dialog, Portal } from "react-native-paper";

const modalWidths = {
    modalKey1: 800,
    externalPortfolio: 300,
    // Add more modal keys and widths as needed
};

const modalHeight = {
    modalKey1: 800,
    externalPortfolio: "auto",
    // Add more modal keys and widths as needed
};

const Modal = ({ visible, hideDialog, children, modalKey }) => {

    const width = modalWidths[modalKey] || 800; 
    const height = modalHeight[modalKey] || "65%"; 

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
