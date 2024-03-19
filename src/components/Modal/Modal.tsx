import { Dialog, Portal } from "react-native-paper";

const Modal = ({ visible, hideDialog, children, }) => {
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
                    width: 800,
                    height: "65%",
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
